# Bryson Newman

A personal resume site built with Astro, styled as an early-2000s desktop.

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
