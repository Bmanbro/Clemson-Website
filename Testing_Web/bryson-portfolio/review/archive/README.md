# Archive verification

Current revision: System Observer, September 28, 2026.

## Results

- 40/40 interaction checks passed.
- Chromium previews at 320, 390, 768, 1024, and 1440 pixels: no horizontal overflow, missing eager images, failed requests, or runtime errors.
- Axe WCAG 2 A/AA and WCAG 2.1 AA checks at desktop/mobile, with dossier closed/open: 0 detected violations.
- Keyboard checks cover redaction focus, opening the dossier, and channel tuning. Other checks include all seven equipment objects, all three work reports, motion preference persistence, clipboard success, PDF response, old résumé link, all six section anchors, deferred mobile artwork, and JavaScript-disabled fallbacks.
- Visual review covers each major section on desktop and mobile and the expanded résumé.

## Mobile Lighthouse

Local HTTP server, simulated mobile conditions, Chromium. These are lab measurements, not production field data.

| Category | Score |
| --- | --- |
| Performance | 95 |
| Accessibility | 100 |
| Best practices | 100 |
| SEO | 100 |

- First contentful paint: 1.2 s
- Largest contentful paint: 2.9 s
- Total blocking time: 20 ms
- Cumulative layout shift: 0

Performance fixes: responsive character derivatives, deferred mobile equipment sprite, pre-rendered paper/ink textures, and navigation observation without forced layout reads. Deployment caching and compression can improve network results further; the preview server does not configure these.

## Files

- `hero-*.png`, `site-*.png`: final responsive views.
- `evidence-*`, `field-notes-*`, `equipment-*`, `case-file-*`, `transmission-*`: section captures.
- `dossier-open-*.png`: expanded résumé layout.
- `no-js-390.png`: native disclosure fallback.
- `layout-report.json`, `interaction-report.json`: assertions and automatic accessibility results.
- `lighthouse-mobile.report.html` and `.json`: complete mobile audit.
- `check.cjs`, `interactions.cjs`: local verification scripts; use the existing tooling under `/tmp/bryson-site-qa`.

These checks support the implementation but do not replace testing with every assistive technology or browser. No deployment or external email transmission was performed.
