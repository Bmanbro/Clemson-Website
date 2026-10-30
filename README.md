# Bryson Newman

A full-screen personal portal with early-2000s styling, built in Astro.

The sidebar opens Profile, Experience, and Cyber defense in separate XP-style windows. Window document panes scroll while the header and sidebars stay stationary. Education and Skills stay in the right column; on narrow or short screens, they appear inside Profile.

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

The server uses port 4321 with strict-port checking. Portal fonts load from Google Fonts; images are served locally. The alternate mixtape mockup keeps its local Anton font.

## Design and behavior

Rubik Spray Paint supplies the graffiti lettering; Arimo supplies the application controls and resume text. These portal fonts load through the Google Fonts stylesheet. CSS displays the interface in lowercase without changing the source resume data. The palette uses dusty teal, muted rose, olive yellow, and slate blue. Raised controls, speaker mesh, CD reflections, scanlines, and checkerboards use CSS. `public/images/graffiti-wall.svg` is original vector artwork.

The portrait in `src/assets/bryson-portrait.png` was cut out locally with `uvx withoutbg`. Astro serves a 192px-wide version; CSS enlarges it with `image-rendering: pixelated`.

Windows support minimize, maximize, close, stacking, and desktop dragging. Focus a title bar and use arrow keys to move it, or Shift with an arrow for larger steps. The left sidebar opens and restores windows; there are no window buttons along the bottom. Each window retains its scroll position. Links such as `/#experience` support direct opening and browser Back. Windows fill the center on small screens. Without JavaScript, the center shows the documents in sequence with anchor navigation.

Profile is an address book, Experience is Windows Explorer, and Cyber defense is a remote-connection-style panel. Career folders are vertical tabs inside Explorer, with working back/forward controls and keyboard navigation (Up, Down, Home, End). Each career keeps its scroll position.

The footer can toggle lo-fi rendering and pause animations. Both preferences are saved locally. Lo-fi mode reduces color depth through an SVG filter and adds a subtle pixel-grid overlay across the page. This is a visual approximation; HTML text remains live and selectable. System reduced-motion preferences disable animations. No audio plays.

The original CD-player photo appears only in the alternate mixtape mockup. Its credit is in that page's footer and `public/images/ATTRIBUTION.md`. No images were generated. `inspiration/` remains untracked.

## Review captures

`public/previews/portal-desktop.png` and `portal-mobile.png` show the selected design at 1440 × 1000 and 390 × 844. The mixtape captures remain in the same folder.
