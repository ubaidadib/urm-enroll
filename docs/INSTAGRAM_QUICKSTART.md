# Instagram Content Auto-Sync System — Quick Start

This document provides a 15-minute checklist to get Instagram content on your website.

## What This System Does

✅ Fetches latest Instagram posts/reels from @urmenroll automatically  
✅ Displays them in Success Stories section without manual updates  
✅ Auto-refreshes every 6 hours (configurable)  
✅ Falls back gracefully if Instagram API unavailable  
✅ Shows loading states and error handling UI  
✅ Fully CSP-compliant, no security issues  

## Quick-Start (15 minutes)

### 1. Get Instagram Access Token (5 min)

**Option A: Easiest (Recommended)**
1. Go to [developers.facebook.com/tools/explorer](https://developers.facebook.com/tools/explorer)
2. Select your app from the dropdown
3. Click "Get Token" → "Get User Access Token"  
4. Grant permission: `instagram_business_content_read`
5. Copy the resulting token (~100 character string starting with `IGQA...`)

**Option B: Via CLI**
```bash
# Follow full setup in docs/INSTAGRAM_INTEGRATION.md "Setup Instructions"
```

### 2. Get Your Instagram Business Account ID (2 min)

```bash
# Replace YOUR_TOKEN with token from Step 1
curl "https://graph.instagram.com/v18.0/me?fields=ig_user_id&access_token=YOUR_TOKEN"

# Response:
# {"ig_user_id": "17841400771830582", "id": "123456789"}
# Copy the ig_user_id value
```

### 3. Set Environment Variables (3 min)

**For Development:**
Create a `.env.local` file in project root:
```
INSTAGRAM_ACCESS_TOKEN=your_token_here
INSTAGRAM_BUSINESS_ACCOUNT_ID=17841400771830582
```

**For Production (Vercel):**
1. Go to Vercel Dashboard → Your Project → Settings → Environment Variables
2. Add two variables:
   - Name: `INSTAGRAM_ACCESS_TOKEN` → Value: `your_token_here`
   - Name: `INSTAGRAM_BUSINESS_ACCOUNT_ID` → Value: `17841400771830582`
3. Select "Production" for both

### 4. Test Locally (3 min)

```bash
# Restart dev server
npm run dev

# Open browser and go to home page
# Scroll to "Success Stories" section
# Verify:
# - Loading skeleton appears
# - Stories populate from Instagram
# - No console errors
# - CSP compliant (no red CSP violation errors)
```

Troubleshoot:
- If you see "Using cached/fallback content" with error → token may be invalid
- Check DevTools Network tab → `/api/instagram` request → Response for error details

### 5. Deploy to Production (2 min)

```bash
git add .
git commit -m "feat: Instagram content auto-sync"
git push origin main
# Vercel auto-deploys

# Once deployed, verify:
# https://yourdomain.com → scroll to Success Stories
# Should show live Instagram content
```

## How It Works (High Level)

```
┌─────────────────────────────────────────────────────────────┐
│ Success Stories Section (React Component)                   │
├─────────────────────────────────────────────────────────────┤
│ ├─ useInstagramContent() Hook                               │
│ │  ├─ Auto-fetches from /api/instagram                      │
│ │  ├─ Shows loading skeleton while fetching                 │
│ │  ├─ Falls back to static stories if error                 │
│ │  └─ Auto-refreshes every 6 hours                          │
│ │                                                             │
│ └─ Displays live data or fallback gracefully                │
└─────────────────────────────────────────────────────────────┘
         ↓
┌─────────────────────────────────────────────────────────────┐
│ /api/instagram Endpoint (Vercel Serverless Function)        │
├─────────────────────────────────────────────────────────────┤
│ ├─ Calls lib/instagram.js                                   │
│ ├─ Fetches from Instagram Graph API v18.0                   │
│ ├─ Caches result for 3 hours (backend)                      │
│ ├─ Returns normalized media objects                         │
│ └─ Rate-limited: 30 req/min per IP                          │
└─────────────────────────────────────────────────────────────┘
         ↓
┌─────────────────────────────────────────────────────────────┐
│ Instagram Graph API                                          │
├─────────────────────────────────────────────────────────────┤
│ └─ Returns: posts, reels, captions, URLs, timestamps        │
└─────────────────────────────────────────────────────────────┘
```

## Files Added/Modified

| File | Purpose |
|------|---------|
| `/lib/instagram.js` | Backend Instagram API integration |
| `/api/instagram.js` | Frontend API endpoint |
| `/src/lib/instagram-content.ts` | Frontend caching service |
| `/src/hooks/useInstagramContent.ts` | React hook for Instagram data |
| `/src/app/sections/success-stories-section.tsx` | Updated to use dynamic content |
| `/docs/INSTAGRAM_INTEGRATION.md` | Complete setup guide |
| `/docs/INSTAGRAM_DEPLOYMENT_CHECKLIST.md` | Deployment & testing checklist |

**Modified:**
- `vercel.json` - Added Instagram CSP directives
- `index.html` - Added Instagram CSP directives  
- `src/app/utils/instagram-embed.ts` - Enhanced error handling

## Key Features

### 1. Fully Automatic
```typescript
// No manual updates needed!
// Component automatically:
const { data } = useInstagramContent({
  autoRefreshInterval: 6 * 60 * 60 * 1000, // Refresh every 6 hours
});
// If your Instagram account posts new Reels, they appear automatically
```

### 2. Graceful Error Handling
- Network error? → Shows cached data
- API down? → Shows fallback static stories
- CSP blocked? → Shows friendly error with retry button
- Timeout? → Uses stale cache

### 3. Performance Optimized
- First load: ~500-800ms (cached after)
- Subsequent loads: ~0ms (from localStorage)
- Auto-refresh: Background (non-blocking)
- Data size: ~50-150KB for 12 stories

### 4. Security Hardened
- CSP compliant (no unsafe-eval)
- Rate-limited to prevent abuse
- Token stored securely in env vars
- No sensitive data in cache

### 5. Developer Friendly
- Clear error messages in console
- Status indicators in UI
- Manual refresh button for testing
- Cache debugging info in dev mode

## Configuration Options

### Change Auto-Refresh Interval

Edit `/src/app/sections/success-stories-section.tsx`:
```typescript
const { data } = useInstagramContent({
  limit: 12,
  autoRefreshInterval: 1 * 60 * 60 * 1000, // 1 hour instead of 6
});
```

### Change Cache TTL

Edit `/lib/instagram.js`:
```javascript
const INSTAGRAM_CACHE_TTL = 1 * 60 * 60 * 1000; // 1 hour backend cache
```

Edit `/src/lib/instagram-content.ts`:
```typescript
const FRONTEND_CACHE_TTL = 30 * 60 * 1000; // 30 min frontend cache
```

### Show Only Videos

```typescript
const videos = instagramContent?.filter(
  item => item.mediaType === 'VIDEO'
);
```

## Troubleshooting

### Stories Not Loading from Instagram?

**Check 1: Is Token Valid?**
```bash
# In terminal, replace YOUR_TOKEN:
curl "https://graph.instagram.com/v18.0/me?access_token=YOUR_TOKEN"

# If you see error_code → token is invalid
# Solution: Generate new token from Step 1
```

**Check 2: CSP Violation?**
1. DevTools → Console → Look for CSP error
2. If you see "violates CSP directive script-src" → CSP not properly configured
3. Solution: Verify both `vercel.json` and `index.html` contain Instagram domains

**Check 3: Network Request Failing?**
1. DevTools → Network tab → Filter by `instagram`
2. Look for `/api/instagram` request
3. If failed (red) → Check API endpoint logs: `vercel logs`
4. If timeout → Check network, Instagram API may be down

**Check 4: Showing Fallback but No Error?**
1. Likely token is invalid or wrong account ID
2. Check env vars: `INSTAGRAM_ACCESS_TOKEN` and `INSTAGRAM_BUSINESS_ACCOUNT_ID`
3. Regenerate token and try again

### Token Expired After a Week?

Instagram tokens expire:
- **Short-lived tokens**: 1 hour
- **Long-lived tokens**: ~60 days
- **Solution**: Use Graph API Explorer token (60 days) or implement token refresh

## What Appears Where?

**Desktop:**
- Success Stories section has carousel with desktop arrows
- Instagram embeds render as full widgets with like/comment buttons
- Loading skeleton appears while fetching
- Status indicators show cache freshness

**Mobile:**
- Responsive carousel with native swipe support
- Scroll indicators and snapping
- Loading skeleton on first load
- Error message and retry button if API fails

**Languages:**
- English (en): LTR layout
- German (de): LTR layout  
- Arabic (ar): RTL layout with reversed arrows

## Monitoring

### Check System Health

```javascript
// DevTools Console
import { getInstagramCacheStatus } from '@/lib/instagram-content';
console.log(getInstagramCacheStatus());

// Returns:
// {
//   cached: true,
//   isStale: false,
//   expiresAt: "2024-04-12T10:30:00Z",
//   itemCount: 12
// }
```

### Check API Endpoint

```bash
# Test production endpoint
curl https://yourdomain.com/api/instagram?limit=5

# Should return JSON with success=true and data array
```

## Next Steps

1. **Immediate**: Complete Quick-Start steps 1-5 above
2. **Today**: Test on production and monitor for errors
3. **Weekly**: Check token will not expire soon
4. **Monthly**: Review cache hit rates and API calls
5. **Every 60 days**: Regenerate access token before expiry

## Advanced: Custom Data Mapping

If you want to customize how Instagram data is displayed:

```typescript
// In success-stories-section.tsx
const normalizedStories = instagramContent?.map(item => ({
  id: item.id,
  title: item.caption?.split('\n')[0], // First line as title
  description: item.caption,
  url: item.instagramUrl,
  imageUrl: item.mediaUrl,
  // ... add more fields as needed
}));
```

## Support

For detailed documentation:
- **Setup Guide**: [docs/INSTAGRAM_INTEGRATION.md](./INSTAGRAM_INTEGRATION.md)
- **Deployment**: [docs/INSTAGRAM_DEPLOYMENT_CHECKLIST.md](./INSTAGRAM_DEPLOYMENT_CHECKLIST.md)
- **API Reference**: [docs/API.md](./API.md) (if available)

For issues:
1. Check console for error messages (prefix with `[Instagram]`)
2. Review DevTools Network tab for failed requests
3. Check Vercel logs: `vercel logs`
4. Verify tokens are valid and not expired

## Summary

✅ **Setup**: 15 minutes  
✅ **Deployment**: 5 minutes  
✅ **Automatic Sync**: Always active, no manual work  
✅ **Error Handling**: Graceful fallbacks  
✅ **Performance**: Instant after first load  
✅ **Security**: CSP compliant, token secure  

You're done! New Instagram posts/reels will appear on your website automatically.
