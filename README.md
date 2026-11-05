# Bryson Newman

A personal resume site built with Astro, styled as an early-2000s desktop.

The résumé PDF lives at [`public/documents/resume.pdf`](public/documents/resume.pdf). Keep that copy in sync with `src/data/profile.ts`.

Click the moving portrait beside the header name to find **Dead Air**, a 45-second orbital survival game. Use Left/Right or A/D to steer, Space to phase, P or Escape to pause, and F for full screen. Touch controls are below the arena. Sound is optional; the best score stays in your browser.

The footer's **Lo-fi** button toggles the pixel grid and reduced colors. **Motion** pauses decorative animations and transitions. Both choices are saved locally; the system's reduced-motion preference takes priority without overwriting your choice.

**Gorillaz** opens a small YouTube player with a repeating playlist of official videos, initially at 6% volume. Play/pause and volume stay in the footer; Next track and Stop/close are in the player. Volume is saved, but playback always requires a click. The YouTube API and player load only when opened. Music pauses when the tab is hidden or Dead Air opens, and closing the player stops it. YouTube availability depends on the viewer's region, browser and network; the player includes a direct YouTube link when embedding is unavailable.

```sh
pnpm install
pnpm exec astro dev --background
```

Open http://localhost:4321. Stop the server with `pnpm exec astro dev stop`.

Build the static site into `dist/`:

```sh
pnpm build
```

See [AGENTS.md](AGENTS.md) for development and style guidelines.

Set `site` in `astro.config.mjs` to the production URL to enable canonical and Open Graph URLs. Include any deployment base path in Astro’s `base` setting.
