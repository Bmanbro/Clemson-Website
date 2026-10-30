# Bryson Newman

A full-screen personal portal with early-2000s styling, built in Astro.

The sidebar opens Profile, Experience, and Cyber defense in separate XP-style windows. Window document panes scroll while the header and sidebars stay stationary. Education and Skills stay in the right column; on narrow or short screens, they appear inside Profile.

The portal is served at `/`, relative to Astro's configured base path.

Resume content lives in `src/data/profile.ts`. Update it and `public/documents/resume.pdf` when the resume changes. The source PDF is `resume.pdf` at the repository root.

## Development

```sh
pnpm install
pnpm exec astro dev --background
pnpm exec astro dev status
pnpm exec astro dev logs
pnpm exec astro dev stop
pnpm build
```

The server uses port 4321 with strict-port checking. Fonts and images are served locally.

## Design and behavior

Rubik Spray Paint supplies the graffiti lettering; Arimo supplies the application controls and resume text. Fontsource packages bundle the Latin font files with the site, with no external font requests. CSS displays the interface in lowercase without changing the source resume data. The palette uses dusty teal, muted rose, olive yellow, and slate blue. Raised controls, speaker mesh, CD reflections, scanlines, and checkerboards use CSS. `public/images/graffiti-wall.svg` is original vector artwork.

The portrait in `src/assets/bryson-portrait.png` was cut out locally with `uvx withoutbg`. Astro serves a 192px-wide version; CSS enlarges it with `image-rendering: pixelated`.

Windows support minimize, maximize, close, stacking, and desktop dragging. Focus a title bar and use arrow keys to move it, or Shift with an arrow for larger steps. The left sidebar opens and restores windows; there are no window buttons along the bottom. Each window retains its scroll position. Links such as `/#experience` support direct opening and browser Back. Windows fill the center on small screens. Without JavaScript, the center shows the documents in sequence with anchor navigation.

Profile is an address book, Experience is Windows Explorer, and Cyber defense is a remote-connection-style panel. Career folders are vertical tabs inside Explorer, with working back/forward controls and keyboard navigation (Up, Down, Home, End). Each career keeps its scroll position.

The footer can toggle lo-fi rendering and pause animations. Both preferences are saved locally. Lo-fi mode reduces color depth through an SVG filter and adds a subtle pixel-grid overlay across the page. This is a visual approximation; HTML text remains live and selectable. System reduced-motion preferences disable animations. No audio plays.

No images were generated. The original inspiration images and unused source assets are not included in the repository.
