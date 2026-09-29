> These reports and screenshots describe the prior site. Current archive verification is in [archive/README.md](archive/README.md).

# Validation

Checked in Chromium on 2026-09-28 against a local static HTTP server.

## Browser and accessibility checks

At viewport widths 320, 390, 768, 1024, and 1440 pixels:

- No horizontal page overflow, missing images, or missing anchor targets.
- Zero automated axe WCAG 2 A/AA and WCAG 2.1 AA violations.
- Zero browser runtime or failed-resource errors.

Verified keyboard skip link, opening/closing the sleeve note, Escape focus behavior, both work disclosures, email-copy success and failure, HTTP clipboard fallback focus, the downloadable original PDF, and native disclosures with JavaScript disabled. The open sleeve note also passes the accessibility audit.

Desktop and mobile screenshots were visually reviewed. The review prompted revisions to the display lettering, work composition, mobile label sizes, sticker contrast, focus behavior, and responsive image delivery. See ../ART-DIRECTION.md for that critique.

## Final mobile Lighthouse

- Performance: 98
- Accessibility: 100
- Best practices: 100
- SEO: 100
- First contentful paint: 1.2 seconds
- Largest contentful paint: 2.4 seconds
- Total blocking time: 0 milliseconds
- Cumulative layout shift: 0

The final run follows responsive-image and accessibility fixes. Reports are lighthouse-mobile.report.html and lighthouse-mobile.report.json. These are local lab measurements, not measurements of the eventual Apache deployment.

The detailed interaction results are in qa-report.json. Automated checks supplement the visual review; they do not establish complete accessibility conformance.
