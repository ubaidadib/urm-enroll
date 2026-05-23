# Instagram Integration — Quick Reference

## Setup (15 minutes)

```bash
# 1. Get token from Graph API Explorer
# https://developers.facebook.com/tools/explorer

# 2. Get account ID
curl "https://graph.instagram.com/v18.0/me?fields=ig_user_id&access_token=TOKEN"

# 3. Set env vars
echo "INSTAGRAM_ACCESS_TOKEN=TOKEN" >> .env.local
echo "INSTAGRAM_BUSINESS_ACCOUNT_ID=ID" >> .env.local

# 4. Test
npm run dev
# Visit home page → Success Stories section

# 5. Deploy
git push origin main
```

## File Locations

| What | Where |
|------|-------|
| Backend API | `/api/instagram.js` |
| Instagram service | `/lib/instagram.js` |
| Frontend service | `/src/lib/instagram-content.ts` |
| React hook | `/src/hooks/useInstagramContent.ts` |
| Component | `/src/app/sections/success-stories-section.tsx` |
| Docs | `/docs/INSTAGRAM_*.md` |

## Common Tasks

### Check if working
```javascript
// DevTools Console
import { getInstagramCacheStatus } from '@/lib/instagram-content';
console.log(getInstagramCacheStatus());
```

### Manual refresh
```javascript
// In component or DevTools
const { refetch } = useInstagramContent();
refetch();
```

### Clear cache
```javascript
import { clearInstagramCache } from '@/lib/instagram-content';
clearInstagramCache();
```

### Check API
```bash
curl "https://yourdomain.com/api/instagram?limit=5"
```

### Debug in console
```
[Instagram] messages show status
[InstagramEmbed] messages show embed issues
Look for prefixes to find Instagram-specific logs
```

## Environment Variables

```bash
# Required for each environment

INSTAGRAM_ACCESS_TOKEN=igqa_... # 60-char long string from Graph API
INSTAGRAM_BUSINESS_ACCOUNT_ID=178414... # numeric ID like 17841400771830582
```

## Caching

| Layer | TTL | Storage |
|-------|-----|---------|
| API | 3 hours | In-memory (Node) |
| Frontend | 15 minutes | localStorage |
| Manual override | immediately | `?nocache=true` |

## Troubleshooting

| Problem | Solution |
|---------|----------|
| 401 Token Error | Regenerate token, check it's not expired |
| 403 Permission Error | Token needs `instagram_business_content_read` scope |
| Stories not loading | Check env vars are set correctly |
| CSP violation | Verify instagram.com in vercel.json & index.html |
| Slow loading | Check Network tab, may be Instagram API |
| Embeds not rendering | Ensure token is valid, try manual refresh |

## API Endpoint

```
GET /api/instagram?limit=12&nocache=false

Response:
{
  "success": true,
  "data": [
    {
      "id": "12345",
      "instagramUrl": "https://www.instagram.com/p/ABC123/",
      "caption": "Student story...",
      "mediaType": "VIDEO",
      "mediaUrl": "https://...",
      "timestamp": "2024-04-12T10:00:00Z"
    },
    ...
  ],
  "count": 12,
  "cache": {
    "cached": true,
    "isStale": false,
    "expiresAt": "2024-04-12T11:00:00Z"
  }
}
```

## Rate Limits

- Instagram Graph API: 200/hour
- Our endpoint: 30/minute per IP
- Recommended: ~4-5 calls/day (auto-refresh every 6 hours)

## Token Expiry

- Short-lived: 1 hour (don't use)
- Long-lived: ~60 days
- **Action**: Regenerate before 60 days, update env var

## Component Usage

```typescript
import { useInstagramContent } from '@/hooks/useInstagramContent';

export function MyComponent() {
  const { 
    data,                    // Story objects array
    error,                   // Error object or null
    isLoading,              // Initial fetch in progress
    isRefreshing,           // Background refresh in progress
    refetch,                // Manual refresh function
    clearCache,             // Clear localStorage cache
    cacheStatus,            // {cached, isStale, itemCount, expiresAt}
    retryAfter,             // Suggested retry delay in seconds
  } = useInstagramContent({
    limit: 12,                                         // stories to fetch
    autoRefreshInterval: 6 * 60 * 60 * 1000,         // 6 hours
    onError: (error) => console.log('Failed:', error), // error callback
  });

  if (isLoading) return <Skeleton />;
  if (error) return <ErrorUI onRetry={refetch} />;
  return <Stories stories={data} />;
}
```

## CSP Policy (for reference)

```
script-src 'self' 'unsafe-inline' ... https://www.instagram.com ...
script-src-elem 'self' 'unsafe-inline' ... https://www.instagram.com ...
frame-src ... https://www.instagram.com ...
```

## Key Files & Their Purpose

### Backend
- `lib/instagram.js` → Fetches from Graph API, manages backend cache
- `api/instagram.js` → Serverless endpoint, security, rate limiting

### Frontend
- `lib/instagram-content.ts` → Frontend cache, fetch wrapper
- `hooks/useInstagramContent.ts` → React hook, state management
- `app/sections/success-stories-section.tsx` → Uses hook, renders UI

## Performance

- First load: 500-800ms (then cached)
- Cached load: 0ms
- Auto-refresh: Background, non-blocking
- Fallback: Instant (static stories)

## Security

- Token in env vars only (never in code)
- Rate limited (30/min per IP)
- CSP compliant
- No unsafe JavaScript patterns

## Status Indicators

- 🟢 Green dot: Fresh live content
- 🔵 Blue spinner: Refreshing
- 🟡 Yellow pulse: Initial loading
- 🔴 Red warning: Error, using fallback
- Cached: Fresh/Stale indicator

## Monitoring

Check every:
- **Day 1**: No errors in console
- **Week 1**: Cache hit rate > 95%
- **Month 1**: Token hasn't expired (regenerate at day 55)
- **Ongoing**: API response time < 1s

## Emergency Procedures

### Disable if broken
```bash
# Set env vars empty in Vercel
INSTAGRAM_ACCESS_TOKEN=
INSTAGRAM_BUSINESS_ACCOUNT_ID=
# Falls back to static stories immediately
```

### Force refresh cache
```javascript
// DevTools
localStorage.removeItem('urm_instagram_content');
// Then click Retry button in UI
```

### Check logs
```bash
vercel logs --prod
# Look for [Instagram] prefix
```

## Related Files

- CSP config: `vercel.json`, `index.html`
- Instagram embed: `src/app/utils/instagram-embed.ts`
- Success stories data: `src/data/success-stories.ts` (fallback)
- Translations: `src/i18n/locales/*/about.ts`

## Docs

Start here:
1. `docs/INSTAGRAM_QUICKSTART.md` ← Start
2. `docs/INSTAGRAM_INTEGRATION.md` ← Deep dive
3. `docs/INSTAGRAM_DEPLOYMENT_CHECKLIST.md` ← Testing
4. `docs/INSTAGRAM_IMPLEMENTATION_SUMMARY.md` ← Overview

## Key Features

✨ **Automatic**: No manual updates needed
🔄 **Reliable**: Graceful fallbacks for errors
⚡ **Fast**: Cached locally after first load
🔒 **Secure**: CSP compliant, token protected
📱 **Responsive**: Works desktop/mobile/tablet
🌍 **Multilingual**: Supports EN/DE/AR with RTL

## Quick Stats

- Time to setup: 15 minutes
- Time to deploy: 5 minutes
- Auto-refresh: Every 6 hours
- Cache TTL: 3 hours backend, 15 min frontend
- API calls: ~4-5 per day
- Data size: 50-150KB per fetch
- Performance: Instant with cache

## Next Steps

1. Read `INSTAGRAM_QUICKSTART.md`
2. Follow 5-step setup
3. Test locally (npm run dev)
4. Deploy (git push main)
5. Monitor (check console for [Instagram] logs)
