# Pre-deployment Checklist

- All TypeScript errors resolved (`npm run build`)
- ESLint passes with no errors (`npm run lint`)
- All images optimized (WebP format, proper sizes)
- All external links open in new tab with `rel="noopener noreferrer"` where appropriate
- Favicon and touch icons added
- 404 page created
- `robots.txt` configured (allow all or tailored per policy)
- `sitemap.xml` generated (or dynamic sitemap endpoint enabled)
- Privacy policy page added (GDPR compliance)
- Terms of service page added
- Cookie consent banner implemented if required by region
- All environment variables documented in `.env.example`
- Analytics tracking verified in a staging/test environment
- Forms tested and working (end-to-end if backend available)
- Mobile responsiveness verified across common breakpoints
- Cross-browser testing complete (Chrome, Firefox, Safari, Edge)
- Lighthouse audit scores meet targets (Performance > 90, Accessibility > 95, SEO > 95)
- Git repository clean (no sensitive or secret data committed)
# Pre-Deployment Checklist

## Security and Dependencies
- [ ] Review npm audit results and decide whether to run `npm audit fix --force` for Vite.
- [ ] Confirm no secrets or credentials are committed.
- [ ] Verify .env files are excluded from version control.

## Build and Quality
- [ ] Run `npm run build` and confirm it succeeds.
- [ ] Review build output sizes and confirm assets are within budget.
- [ ] Re-run TypeScript checks and ensure no errors are reported.

## Content and UX
- [ ] Confirm all links point to valid destinations.
- [ ] Validate form behavior and error messaging.
- [ ] Verify SEO meta tags are correct for production.

## Deployment
- [ ] Confirm hosting configuration and base URL.
- [ ] Verify any analytics or tracking configuration.
