# Bryson Newman profile mockups

Two early-2000s design studies built in Astro. The finished site design is pending review.

- `/`: comparison page with desktop and mobile screenshots
- `/mockups/mixtape`: CD-case frame, pink album insert, and resume liner notes
- `/mockups/portal`: speaker header, beveled navigation, and three-column homepage

Both concepts use `src/data/profile.ts`, transcribed and lightly edited from `Bryson-Newman-Resume.pdf`. The public PDF is in `public/documents/`. When updating the resume, update both the shared data and public PDF.

## Development

```sh
pnpm install
pnpm exec astro dev --background
pnpm exec astro dev status
pnpm exec astro dev logs
pnpm exec astro dev stop
pnpm build
```

The default address is http://localhost:4321. Fonts and images are served locally. No client framework or runtime external assets are required.

## Visual assets

The palette comes from the local inspiration images. The CD-player photograph is credited in `public/images/ATTRIBUTION.md` and in both mockup footers. Its background was removed locally with:

```sh
uvx withoutbg public/images/cd-player.jpg -o public/images/cd-player-cutout.png
```

Plastic, chrome, CD reflections, speaker mesh, and paper treatments use CSS. No images were generated. `inspiration/` is intentionally untracked.

## Review captures

`public/previews/` contains 1440 × 1000 desktop views and full-page mobile captures at 390px wide. Refresh them after visual changes. The comparison page displays the desktop captures and links to the mobile versions.
