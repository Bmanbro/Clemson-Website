## Development

When starting the dev server, use background mode:

```
astro dev --background
```

Manage the background server with `astro dev stop`, `astro dev status`, and `astro dev logs`.

Use one dev server on port 4321. Keep strict-port checking enabled; fix or restart the existing instance instead of starting another port.

Run `pnpm build` after code changes. For visual or interaction changes, also check desktop, mobile, and short landscape layouts in the browser.

## Commits

- Commit as you go in focused, reviewable steps using Conventional Commits, such as `feat: add career folders`, `fix: restore minimized windows`, or `docs: update development instructions`.
- Never commit `inspiration/`. Stage files explicitly so reference images and unrelated user files stay out of commits.

## Documentation

Full documentation: https://docs.astro.build

Consult these guides before working on related tasks:

- [Adding pages, dynamic routes, or middleware](https://docs.astro.build/en/guides/routing/)
- [Working with Astro components](https://docs.astro.build/en/basics/astro-components/)
- [Using React, Vue, Svelte, or other framework components](https://docs.astro.build/en/guides/framework-components/)
- [Adding or managing content](https://docs.astro.build/en/guides/content-collections/)
- [Adding styles or using Tailwind](https://docs.astro.build/en/guides/styling/)
- [Supporting multiple languages](https://docs.astro.build/en/guides/internationalization/)

## Style guidelines

### Visual design

- Preserve the selected portal's early-2000s desktop aesthetic: XP-style applications, graffiti, checkerboards, speaker textures, beveled controls, and pixel-art icons. Skeuomorphic details are welcome; avoid replacing them with a modern dashboard or card layout.
- Use the existing palette variables: blue-green teal (`--teal: #498e96`), dusty bubblegum pink (`--pink: #cc78a0`), smoky plum (`--purple: #785c88`), and mustard yellow (`--yellow: #d5c65d`). Pair them with black outlines, off-white paper, steel gray, and XP blue. Keep colors lively but slightly weathered rather than neon.
- The illustration references combine Gorillaz, Jet Set Radio, and Invader Zim: hip-hop and skate culture, cel shading, thick uneven ink outlines, angular graffiti, oversized cartoon shapes, cutout collages, and sticker-like overlaps. Use teal, pink, and yellow for the punchier accents; plum, charcoal, and gray-green provide the darker cartoon atmosphere.
- The website references resemble early-2000s Hot Topic and Barbie portals: dense framed columns, compact navigation, saturated panel headers, layered banners, chrome or plastic trim, beveled buttons, and hard borders. Combine that playful clutter with recognizable XP application layouts, cream document surfaces, blue title bars, and small raster-style icons. Keep the content organized inside the frames.
- Use Google-hosted Arimo for interface and resume text and Rubik Spray Paint for graffiti lettering. Apply lowercase with CSS `text-transform`; preserve normal capitalization in source content.
- Keep the portal full-screen. The header and sidebars stay stationary; document panes inside windows scroll. Adapt windows to fill the center on narrow or short screens.
- Use the left sidebar to open and restore Profile, Experience, and Cyber defense. Do not add duplicate top navigation or bottom window buttons. Education and Skills belong in the right sidebar, with a mobile fallback inside Profile.
- Give each window a recognizable application layout: Profile is an address book, Experience is Windows Explorer, and Cyber defense is a remote-connection-style panel. Show one career at a time using Explorer's side tabs.
- Preserve working window controls, stacking, desktop dragging, keyboard movement, career-tab navigation, and the no-JavaScript fallback. Decorative application chrome should not look like a working control unless it does something.
- Keep keyboard focus visible and content readable. Animation is welcome, but respect reduced motion and the saved motion setting. Keep the lo-fi effect toggleable; use low-resolution imagery, reduced color depth, and the pixel-grid treatment without breaking interaction.
- Prefer CSS, SVG, existing assets, or sourced images over generated imagery. Preserve image credits. Use `uvx withoutbg` when removing image backgrounds.
- Treat the mixtape as an alternate mockup with its own visual style; do not apply portal styling to it automatically.

### Code and content

- Follow the surrounding Astro, TypeScript, and CSS conventions. Keep components focused, reuse the shared window and icon components, and extend existing CSS rules before adding competing overrides.
- Keep resume data in `src/data/profile.ts` and update the PDF in `public/documents/` when the resume changes. Avoid duplicating resume facts in application components.
- Use Astro's configured base for internal links and public assets, including CSS backgrounds. Use `import.meta.env.BASE_URL` where URLs are constructed in code.
- Use semantic HTML and descriptive labels and alt text. Keep decorative elements hidden from assistive technology.

### Writing

- Write clear, concise copy in a friendly, direct voice. Use concrete language and avoid filler, exaggerated claims, and unnecessary jargon.
- Keep resume facts accurate and consistent across the site and PDF. Retain the site's playful early-2000s personality without sacrificing clarity.
- Keep captions and bylines sparse. Prefer useful contact links and accurate resume details over repeated welcome messages, slogans, or invented computer status messages.
