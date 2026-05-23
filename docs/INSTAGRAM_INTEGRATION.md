# Instagram Content Integration Guide

## Overview

This guide covers the automatic Instagram content sync system for the Success Stories section. The system fetches the latest posts and reels from the @urmenroll Instagram account and displays them automatically on the website.

## Architecture

### Components

1. **Backend (`/lib/instagram.js`)** 
   - Fetches data from Instagram Graph API
   - Implements in-memory caching with 3-hour TTL
   - Handles errors with stale cache fallback

2. **API Endpoint (`/api/instagram.js`)**
   - Express/Vercel serverless function
   - Rate-limited (30 req/min per IP)
   - Supports cache bypass via `?nocache=true`

3. **Frontend Service (`/src/lib/instagram-content.ts`)**
   - Manages localStorage caching (15-minute frontend TTL)
   - Timeout handling (15 seconds)
   - Stale cache fallback for offline/errors

4. **React Hook (`/src/hooks/useInstagramContent.ts`)**
   - Simple `useInstagramContent()` hook
   - Auto-refresh interval support (default: 6 hours)
   - Loading, error, and refresh states

5. **UI Component (`/src/app/sections/success-stories-section.tsx`)**
   - Displays live Instagram content
   - Shows loading skeleton while fetching
   - Fallbacks to static data if fetch fails
   - Status indicators and manual retry button

## Setup Instructions

### Step 1: Create Instagram Business Account

1. Go to [instagram.com](https://instagram.com)
2. Convert your account to a **Professional Account** (Settings → Account Type)
3. Link it to a **Meta Business Account**

### Step 2: Set Up Meta Developer App

1. Visit [developers.facebook.com](https://developers.facebook.com)
2. Create a new app (App Type: `Consumer`)
3. Choose **Instagram Graph API** as your product
4. Copy the **App ID** and **App Secret**

### Step 3: Generate Access Token

#### Option A: Short-Lived Token (valid 1 hour - for testing)

```bash
curl "https://graph.instagram.com/oauth/authorize?client_id=YOUR_APP_ID&redirect_uri=https://localhost&scope=instagram_business_profile" 
# Follow the OAuth flow, get the code, then exchange for token:

curl "https://graph.instagram.com/v18.0/oauth/access_token" \
  -d "client_id=YOUR_APP_ID" \
  -d "client_secret=YOUR_APP_SECRET" \
  -d "grant_type=authorization_code" \
  -d "redirect_uri=https://localhost" \
  -d "code=YOUR_CODE"
```

#### Option B: Long-Lived Token (valid ~60 days - recommended for production)

```bash
# First, get a short-lived token (see Option A)
# Then exchange for long-lived token:

curl "https://graph.instagram.com/v18.0/access_token" \
  -d "grant_type=ig_refresh_token" \
  -d "access_token=YOUR_SHORT_LIVED_TOKEN" \
  -d "client_secret=YOUR_APP_SECRET"
```

#### Option C: User Access Token (recommended for reliability)

Use the **Graph API Explorer** in the Developer Dashboard:
1. Go to [developers.facebook.com/tools/explorer](https://developers.facebook.com/tools/explorer)
2. Select your app from the dropdown
3. Click "Get Token" → "Get User Access Token"
4. Grant `instagram_business_content_read` permission
5. Copy the token (valid 60 days, renewable)

### Step 4: Get Business Account ID

```bash
curl "https://graph.instagram.com/v18.0/me?fields=ig_user_id&access_token=YOUR_ACCESS_TOKEN"
```

Response:
```json
{
  "ig_user_id": "17841400771830582",
  "id": "123456789"
}
```

Copy the `ig_user_id` value.

### Step 5: Configure Environment Variables

Create a `.env.local` file in the root directory:

```bash
# Instagram Graph API
INSTAGRAM_ACCESS_TOKEN=your_long_lived_access_token_here
INSTAGRAM_BUSINESS_ACCOUNT_ID=17841400771830582
```

For **Vercel deployment**, set these in Vercel Dashboard → Settings → Environment Variables.

### Step 6: Test the Integration

1. Restart the dev server: `npm run dev`
2. Open DevTools Console
3. Visit the Success Stories section
4. Verify:
   - No CSP errors in console
   - Instagram content loads or fallback displays
   - Loading skeleton appears briefly
   - Status indicator shows "Live content"

## Content Mapping

Instagram API returns posts with this structure:
```json
{
  "id": "17841400771830582_12345678",
  "caption": "Student success story...",
  "media_type": "VIDEO" | "IMAGE" | "CAROUSEL_ALBUM",
  "media_url": "https://...",
  "timestamp": "2024-04-12T10:30:00+0000",
  "permalink": "https://www.instagram.com/p/ABC123/"
}
```

Mapped to Success Story format:
```typescript
{
  id: string;
  instagramUrl: string;        // Uses permalink
  caption: string;             // From caption field
  mediaType: string;           // From media_type
  mediaUrl: string;            // Direct media URL
  timestamp: string;           // From timestamp
  quote: { en, de, ar };      // Translated caption
}
```

## Caching Strategy

### Backend Cache
- **Location**: In-memory (Node.js process)
- **TTL**: 3 hours
- **Invalidation**: Manual via cache clear or TTL expiry
- **Fallback**: Returns stale cache if API fails

### Frontend Cache
- **Location**: localStorage (after fetch succeeds)
- **TTL**: 15 minutes
- **Invalidation**: Manual via `clearInstagramCache()` or TTL expiry
- **Fallback**: Returns stale cache for offline scenarios

### Auto-Refresh
- **Interval**: 6 hours (configurable)
- **Trigger**: Automatic useEffect interval
- **Manual**: `refetch()` function in component

## API Rate Limits

### Instagram Graph API Limits
- **Tier 1** (default): 200 calls/hour
- **Tier 2** (approved): 560 calls/day
- Our implementation: ~4-5 calls/day (best practice)

### Express Endpoint Rate Limits
- **Global**: 30 requests/minute per IP
- **Burst**: Safe for production spike events

## Error Handling

### Scenarios Handled

1. **API Timeout (>15 sec)**
   - Falls back to frontend cache
   - Shows "Using cached/fallback content" message
   - Provides manual "Retry" button

2. **Network Failure**
   - Returns stale localStorage cache if available
   - Falls back to static fallback stories
   - Shows error message with retry option

3. **Invalid Credentials**
   - Error logged on server
   - Frontend receives 503 status
   - Displays fallback UI

4. **Rate Limit Exceeded**
   - Returns cached data from previous hour
   - Error response includes `retryAfter` seconds

5. **Invalid Response Format**
   - Caught by Zod schema validation
   - Returns 400 error
   - Falls back to static stories

## Monitoring & Debugging

### Development Mode

In development, the Success Stories section shows:
- Loading status (fetching/refreshing)
- Cache status (fresh/stale)
- Item count and refresh timestamp
- Manual "Retry" button for errors
- Cache file info in DevTools

### Production Monitoring

Add to your monitoring dashboard:
```typescript
// Check cache status programmatically
const status = getInstagramCacheStatus();
console.log('Cache Status:', {
  cached: status.cached,
  isStale: status.isStale,
  itemCount: status.itemCount,
  expiresAt: status.expiresAt,
});
```

### Common Issues

**Problem**: "Instagram API error 400: Missing access token"
- **Solution**: Check `INSTAGRAM_ACCESS_TOKEN` env var is set and valid

**Problem**: "Instagram API error 403: Insufficient permissions"
- **Solution**: Regenerate token with `instagram_business_content_read` scope

**Problem**: "Using stale cache due to API error" persists
- **Solution**: Check Instagram Business Account ID is correct
- **Verify**: `INSTAGRAM_BUSINESS_ACCOUNT_ID` matches API `ig_user_id`

**Problem**: New Instagram posts don't appear for hours
- **Solution**: Wait for cache TTL (3 hour backend, 15 min frontend)
- **Quick**: Manual refresh via "Retry" button or `refetch()` hook

**Problem**: CSP errors still show in console
- **Solution**: Verify both `vercel.json` and `index.html` have Instagram domains
- **Check**: DevTools → Network → HTML request → Response Headers

## Customization

### Change Auto-Refresh Interval

Edit `/src/app/sections/success-stories-section.tsx`:
```typescript
const { data } = useInstagramContent({ 
  autoRefreshInterval: 1 * 60 * 60 * 1000, // 1 hour instead of 6
});
```

### Change Cache TTL

Edit `/lib/instagram.js`:
```javascript
const INSTAGRAM_CACHE_TTL = 1 * 60 * 60 * 1000; // 1 hour instead of 3
```

### Display Different Media Types

Update Success Story card rendering to handle:
- `IMAGE`: Direct image display
- `VIDEO`: Video player (Instagram embed handles this)
- `CAROUSEL_ALBUM`: Multiple images/videos

### Filter by Media Type

```typescript
const videosOnly = instagramContent.filter(
  item => item.mediaType === 'VIDEO'
);
```

## Testing

### Unit Test Example

```typescript
import { getInstagramMedia, clearInstagramCache } from '@/lib/instagram-content';

test('fetches Instagram content successfully', async () => {
  const content = await getInstagramMedia();
  expect(content).toHaveLength(12);
  expect(content[0]).toHaveProperty('instagramUrl');
});

test('returns cached content on second fetch', async () => {
  const first = await getInstagramMedia();
  const second = await getInstagramMedia();
  expect(first).toEqual(second);
});
```

### Manual Testing Checklist

- [ ] Dev server starts without errors
- [ ] Instagram content loads in Success Stories section
- [ ] Loading skeleton appears momentarily
- [ ] Status indicator shows "Live content" (green dot)
- [ ] Carousel navigation works with Instagram embeds
- [ ] RTL direction works for Arabic
- [ ] Scroll indicators update correctly
- [ ] All three languages (EN/DE/AR) render correctly
- [ ] No CSP violations in DevTools Console
- [ ] No duplicate script injection warnings
- [ ] Manual "Retry" button works and refetches
- [ ] Embeds render correctly if Instagram has new Reels
- [ ] Fallback stories show if API is unavailable
- [ ] Hard refresh (Cmd+Shift+R) doesn't break anything
- [ ] Mobile responsiveness works

## Troubleshooting Token Expiry

Instagram's longest-lived tokens expire after ~60 days. To maintain continuous operation:

### Weekly Check (Recommended)
```bash
# Add to monitoring dashboard
curl "https://graph.instagram.com/v18.0/me?access_token=YOUR_TOKEN"
# If 401 Unauthorized → Token expired, regenerate
```

### Automatic Refresh (Future Enhancement)
```javascript
// Could implement token auto-refresh before expiry
if (daysUntilExpiry < 7) {
  // Refresh token automatically
  // Store new token in Vercel env.production_override
}
```

## Performance Considerations

- **First Load**: Instagram fetch adds ~500-800ms (cached after)
- **Subsequent Loads**: 0ms (from cache)
- **Auto-Refresh**: Background (non-blocking)
- **Network**: Bandwidth ~50-150KB for 12 items
- **Storage**: localStorage uses ~100-200KB

## Security Considerations

1. **Token Storage**: NEVER commit tokens to git
2. **Env Variables**: Use Vercel Dashboard, not `.env` files
3. **Rate Limiting**: 30 req/min per IP on `/api/instagram`
4. **CORS**: Endpoint uses Vercel's built-in CORS headers
5. **CSP**: Instagram domains properly configured
6. **Cache**: No sensitive data cached (public posts only)

## References

- [Instagram Graph API Docs](https://developers.facebook.com/docs/instagram/reference)
- [oEmbed Documentation](https://developers.facebook.com/docs/instagram/oembed/)
- [Access Token Types](https://developers.facebook.com/docs/facebook-login/access-tokens)
- [Graph API Rate Limiting](https://developers.facebook.com/docs/graph-api/overview/rate-limiting)
