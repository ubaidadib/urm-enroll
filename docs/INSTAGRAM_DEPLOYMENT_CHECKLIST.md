# Instagram Integration Deployment & Verification Checklist

## Pre-Deployment Checklist

### Environment Setup
- [ ] Created Meta Developer App at [developers.facebook.com](https://developers.facebook.com)
- [ ] Generated long-lived Instagram Business Account access token
- [ ] Captured Business Account ID (ig_user_id) from Graph API
- [ ] Secrets added to `.env.local` (development)
- [ ] Secrets added to Vercel Dashboard → Environment Variables (production)

### Configuration
- [ ] `INSTAGRAM_ACCESS_TOKEN` is valid and has `instagram_business_content_read` scope
- [ ] `INSTAGRAM_BUSINESS_ACCOUNT_ID` is correct (format: 17841400771830582)
- [ ] vercel.json includes `https://www.instagram.com` in `script-src` and `script-src-elem`
- [ ] vercel.json includes `https://www.instagram.com` in `frame-src`
- [ ] index.html meta CSP includes Instagram domains
- [ ] vite.config.ts does NOT override CSP with conflicting policy

### Code Integration
- [ ] `/lib/instagram.js` created and imports correctly
- [ ] `/api/instagram.js` endpoint created with security wrapper
- [ ] `/src/lib/instagram-content.ts` service created
- [ ] `/src/hooks/useInstagramContent.ts` hook created
- [ ] Success Stories section updated to use `useInstagramContent()` hook
- [ ] instagram-embed.ts has error handler for CSP blocks

### Dependencies
- [ ] `zod` is installed (used for schema validation)
- [ ] `fetch` API available (Node.js 18+)
- [ ] No additional npm packages needed

## Local Development Testing

### Step 1: Start Dev Server
```bash
npm run dev
# Expected: Server starts on http://localhost:5173
# No TypeScript errors
```

### Step 2: Check Environment Variables
```bash
# Verify variables are loaded
node -e "console.log(process.env.INSTAGRAM_ACCESS_TOKEN ? 'token set' : 'MISSING')"
node -e "console.log(process.env.INSTAGRAM_BUSINESS_ACCOUNT_ID ? 'id set' : 'MISSING')"
```

### Step 3: Test API Endpoint Directly
```bash
# Test local API endpoint
curl "http://localhost:5173/api/instagram?limit=5"

# Expected response:
# {
#   "success": true,
#   "data": [{...}, ...],
#   "count": 5,
#   "cache": {...},
#   "refreshedAt": "2024-04-12T..."
# }
```

### Step 4: Verify Frontend Integration

1. Open app in browser: http://localhost:5173
2. Navigate to "Success Stories" section
3. **Wait for initial load** (DevTools → Network tab)
   - Should see `/api/instagram` request
   - Response status: 200
   - Response size: ~50-150KB for 12 items
4. **Check Console** (DevTools → Console)
   - ✅ No CSP violations
   - ✅ No "Loading... failed" errors
   - ✅ Status shows "Fetching latest stories..." then "Live content"
5. **Observe UI Changes**
   - Loading skeleton appears briefly
   - Stories populate from API
   - Carousel navigation works
   - Scroll indicators functional

### Step 5: Verify CSP Compliance

DevTools → Network tab:
1. Click on the HTML request (first one)
2. Go to "Response Headers" tab
3. Find `Content-Security-Policy` header
4. **Verify contains:**
   - ✅ `script-src` includes `https://www.instagram.com`
   - ✅ `script-src-elem` includes `https://www.instagram.com`
   - ✅ `frame-src` includes `https://www.instagram.com`

### Step 6: Test Error Scenarios

**Scenario A: Simulate API Timeout**
```javascript
// DevTools Console
fetch('/api/instagram?timeout=1000')
  .then(r => r.json())
  .catch(e => console.log('Expected timeout error:', e))
```
- Should show "Using cached/fallback content" message
- Retry button should appear
- Style should still render

**Scenario B: Clear Cache & Force Refresh**
```javascript
// DevTools Console
localStorage.removeItem('urm_instagram_content')
// Then click Retry button in UI
```
- Should re-fetch from API
- Spinner should animate
- New data should load

**Scenario C: Test Offline Fallback**
```javascript
// DevTools → Network tab → Throttling
// Select "Offline"
// Reload page
```
- Should show cached content
- Or fallback to static stories
- No errors in console

### Step 7: Verify Instagram Embeds Render

1. Scroll to Success Stories section
2. Verify Instagram embeds load (blockquote widgets)
3. Check DevTools → Network → Filter by "instagram.com"
   - Should see `embed.js` loaded
   - No CSP errors for Instagram resources
4. Instagram widgets should be interactive (like, comment, etc.)

### Step 8: Test All Languages

```javascript
// DevTools Console - Change language
// (Depending on your i18n setup)
// sessionStorage.setItem('language', 'de')
// // Reload page and verify German text + RTL if applicable
```

- [ ] English (en) - LTR layout
- [ ] German (de) - LTR layout
- [ ] Arabic (ar) - RTL layout, arrows reversed

### Step 9: Verify No Duplicate Scripts

DevTools → Console → Search for "instagram-embed-js"
```javascript
// Should exist only once
document.getElementById('instagram-embed-js')
// Response: <script id="instagram-embed-js" ...>
// NOT multiple instances
```

## Production Deployment

### Pre-Deployment

1. **Build Locally**
   ```bash
   npm run build
   # Should complete without errors
   # Check dist/ folder contains all files
   ```

2. **Type Check**
   ```bash
   npm run typecheck
   # Should pass with no errors
   ```

3. **Security Audit**
   ```bash
   npm run security:audit
   # Review results
   ```

### Deploy to Vercel

1. **Option A: Git Push (Recommended)**
   ```bash
   git add .
   git commit -m "feat: add Instagram content auto-sync integration"
   git push origin main
   # Vercel will auto-deploy
   ```

2. **Option B: Vercel CLI**
   ```bash
   vercel --prod
   # Confirms deployment to production
   ```

### Post-Deployment Verification

#### 1. Check Environment Variables on Vercel
- Vercel Dashboard → Project → Settings → Environment Variables
- [ ] `INSTAGRAM_ACCESS_TOKEN` is set (hidden/masked)
- [ ] `INSTAGRAM_BUSINESS_ACCOUNT_ID` is set 
- [ ] Both marked as "Production"

#### 2. Verify Production Deployment
```bash
# Test production API endpoint
curl "https://yourdomain.com/api/instagram?limit=5"

# Should return:
# { "success": true, "data": [...], ... }
```

#### 3. Check Production Headers
```bash
# Verify CSP header is set correctly
curl -I "https://yourdomain.com" | grep -i "content-security-policy"

# Should contain:
# script-src ... https://www.instagram.com ...
# script-src-elem ... https://www.instagram.com ...
# frame-src ... https://www.instagram.com ...
```

#### 4. Test Producer UI
1. Visit https://yourdomain.com
2. Scroll to Success Stories
3. Verify:
   - [ ] Stories load from Instagram
   - [ ] No CSP console errors
   - [ ] Status shows "Live content"
   - [ ] Carousel works
   - [ ] Embeds render
   - [ ] All languages work

#### 5. Monitor for 24 Hours
- [ ] No error spikes in Sentry/Rollbar
- [ ] No increase in 5xx responses
- [ ] Instagram API calls within rate limits
- [ ] Cache working (refresh within 15 min should be instant)

## Runtime Monitoring

### Key Metrics to Track

```javascript
// Add to your monitoring service (Datadog, New Relic, etc.)
const metrics = {
  instagram_api_calls: count,           // Expected: ~4/day
  instagram_api_errors: count,          // Expected: 0
  instagram_api_latency_ms: number,     // Expected: <1000ms
  instagram_cache_hits: count,          // Expected: >95%
  instagram_cache_stales: count,        // Expected: 0 if healthy
  success_stories_render_time_ms: number, // Expected: <500ms with cache
};
```

### Error Logging

All errors are logged to console with prefix `[Instagram]`:
```
[Instagram] Fetch error: timeout
[InstagramEmbed] Script blocked or failed to load
[useInstagramContent] Fetch error: API error 403
```

Search logs for `[Instagram]` to find issues.

## Token Lifecycle Management

### Monthly Tasks

1. **First of Month**: Check token expiry date
   ```bash
   # In Vercel Dashboard, check when token was last rotated
   ```

2. **60-Day Rotation**: Regenerate token before expiry
   ```bash
   # At day 55 of token life:
   # 1. Generate new token via Graph API Explorer
   # 2. Update INSTAGRAM_ACCESS_TOKEN in Vercel env
   # 3. Test production endpoint confirms it works
   # 4. Monitor for 1 hour to confirm stability
   ```

### Automated Alerts

Set up alerts for:
- [ ] API error rate > 1% in 1-hour window
- [ ] Instagram endpoint response time > 5 seconds
- [ ] Token within 7 days of expiry
- [ ] Cache hit rate < 80% (indicates problems)

## Rollback Plan

If deployment causes issues:

```bash
# Option 1: Quick Rollback
vercel rollback                    # Reverts to previous deployment
# or
git revert <commit-hash>
git push origin main

# Option 2: Disable Instagram Feature
# Set both env vars to empty strings in Vercel Dashboard
# App falls back to static stories automatically
```

Expected recovery time: <5 minutes

## Verification Checklist Template

Print and sign off:

```
[ ] LOCAL TESTING
    [ ] Dev server starts
    [ ] API endpoint responds
    [ ] Frontend loads Instagram content
    [ ] No CSP violations
    [ ] Error scenarios handled
    [ ] All languages work
    [ ] Embeds render
    
[ ] PRE-DEPLOYMENT
    [ ] npm run build succeeds
    [ ] npm run typecheck succeeds
    [ ] env vars configured locally
    [ ] Code reviewed
    
[ ] DEPLOYMENT
    [ ] Code pushed to main
    [ ] Vercel deploy completes
    [ ] Build logs show no errors
    
[ ] POST-DEPLOYMENT
    [ ] Env vars set in Vercel
    [ ] Production endpoint responds
    [ ] CSP headers correct
    [ ] UI loads from live API
    [ ] No error spikes
    [ ] Monitored for 24 hours
    
[ ] SIGN-OFF
    Date: ___________
    Tested by: ___________
    Approved by: ___________
```

## Support & Troubleshooting

### Common Issues & Solutions

| Issue | Solution |
|---|---|
| 401 Unauthorized | Token expired, regenerate new token |
| 403 Insufficient Permissions | Token missing `instagram_business_content_read` scope |
| 503 Service Unavailable | Instagram API downtime, check status.meta.com |
| Stale cache persistent | Check `INSTAGRAM_CACHE_TTL` in lib/instagram.js |
| CSP violations remain | Verify both vercel.json AND index.html have Instagram |
| No embeds rendering | Check Instagram Business Account ID is correct |
| Long load times (>3s) | Check network throttling, Instagram API rate limit |

### Emergency Disable

If Instagram integration needs immediate disable:

1. Set env vars to empty in Vercel Dashboard:
   - `INSTAGRAM_ACCESS_TOKEN=`
   - `INSTAGRAM_BUSINESS_ACCOUNT_ID=`

2. Redeploy (or changes auto-apply)

3. App will show static fallback stories within 5 minutes

## Success Indicators

When properly deployed, you should see:

✅ **New Instagram Reels appear automatically** within 6 hours (when new content posted)
✅ **No manual updates needed** to display new stories
✅ **Cached content loads instantly** (after first load)
✅ **Zero CSP violations** in console
✅ **Graceful fallback** if API unavailable
✅ **All languages render** correctly with RTL support
✅ **Mobile responsive** carousel works smoothly
✅ **Status indicators** show cache freshness
✅ **Auto-refresh every 6 hours** with manual retry option

## Next Steps

1. [ ] Follow Setup Instructions in INSTAGRAM_INTEGRATION.md
2. [ ] Complete Local Development Testing section above
3. [ ] Set env vars in Vercel Dashboard
4. [ ] Deploy to production
5. [ ] Verify production following Post-Deployment Verification
6. [ ] Monitor for 24 hours
7. [ ] Document any customizations made
8. [ ] Schedule token rotation at 60-day mark
