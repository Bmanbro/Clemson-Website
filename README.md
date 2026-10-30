# Bryson Newman

A full-screen personal portal with early-2000s styling, built in Astro.

The sidebar switches between Profile, Experience, Cyber defense, Education, and Skills. Only the center panel scrolls; the header, sidebar, and desktop credentials column stay stationary. On narrow or short screens, the credentials column gives way to the center tabs.

- `/`: the selected portal design
- `/mockups/portal`: the same portal
- `/mockups/`: archived design comparison
- `/mockups/mixtape`: the alternate design

Resume content lives in `src/data/profile.ts`. Update it and `public/documents/Bryson-Newman-Resume.pdf` when the resume changes.

## Development

```sh
pnpm install
pnpm exec astro dev --background
pnpm exec astro dev status
pnpm exec astro dev logs
pnpm exec astro dev stop
pnpm build
```

Astro reports the active address when starting. All fonts and images are served locally.

## Design and behavior

Permanent Marker supplies the graffiti lettering, Barlow Condensed the controls and headings, and Barlow the resume text. Raised sidebar buttons, speaker mesh, CD reflections, scanlines, and checkerboards use CSS. `public/images/graffiti-wall.svg` is original vector artwork.

The portrait in `src/assets/bryson-portrait.png` was cut out locally with `uvx withoutbg`. Astro serves a 192px-wide version; CSS enlarges it with `image-rendering: pixelated`.

Sidebar tabs support Up, Down, Home, and End. Tab URLs support direct links and browser Back. Each tab retains its center scroll position. Without JavaScript, the center shows the complete resume with anchor navigation.

The footer can pause animations, and that preference is saved locally. System reduced-motion preferences disable animations. No audio plays.

The original CD-player photo appears only in the alternate mixtape mockup. Its credit is in that page's footer and `public/images/ATTRIBUTION.md`. No images were generated. `inspiration/` remains untracked.

## Review captures

`public/previews/portal-desktop.png` and `portal-mobile.png` show the selected design at 1440 × 1000 and 390 × 844. The mixtape captures remain in the same folder.
