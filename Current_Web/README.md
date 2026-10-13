# Bryson: resume & portfolio

A static personal website for Bryson Newman, intended for `https://brysonn.people.clemson.edu/`. The site uses semantic HTML, CSS, vanilla JavaScript, and locally hosted fonts and images. It has no runtime dependencies, backend, database, authentication, or build step. Apache serves the files directly; Node is not needed on the server.

## Project files

| Path | Purpose |
| --- | --- |
| [index.html](index.html) | Single source for page content, resume entries, contact details, project information, and metadata |
| [styles.css](styles.css) | Responsive layout, typography, palette, textures, and motion styles |
| [script.js](script.js) | Mobile menu, active navigation, motion controls, entrance effects, and copyright year |
| [assets/images/](assets/images/) | Portrait, Atari project photo, network equipment photograph, and grain texture |
| [assets/fonts/](assets/fonts/) | Self-hosted WOFF2 fonts and required license files |
| [assets/icons/favicon.svg](assets/icons/favicon.svg) | Original typographic site icon |
| [resume/Bryson-Newman-Resume.pdf](resume/Bryson-Newman-Resume.pdf) | Downloadable copy of the supplied resume |

The page remains readable without JavaScript: navigation links, contact links, resume links, and native expandable project cards work directly in HTML. Decorative motion is paused in the unenhanced page. With JavaScript enabled, the motion control saves the visitor's preference locally and honors the system's reduced-motion preference.

## Preview locally

From this project directory, run:

```sh
python3 -m http.server 8080
```

Open `http://localhost:8080/` in a browser. Stop the server with `Ctrl+C`. This preview command is for local development only; Apache provides the web server after upload.

## Edit resume and portfolio content

Open [index.html](index.html) and search for `EDIT THIS`. These comments mark the introduction, biography and skills, experience, project details, education, contact links, and page metadata. Content is written directly in HTML so it remains available when JavaScript is disabled. There is no separate content database or generated content file.

- Update employment titles, organizations, dates, locations, and accomplishment bullets inside the corresponding experience `<article>`.
- Update education, expected graduation, GPA, and skills in their marked sections when those facts change.
- Update the email `mailto:` destination and visible address together. Social links appear in the contact section and footer; The Atari card links to its repository, and the lab card links to the GitHub profile.
- Replace the PDF at `resume/Bryson-Newman-Resume.pdf` to keep existing resume buttons working. If you rename it, update every reference in `index.html`.
- To add a project, duplicate one `<details class="project-card …">` block, give it and its inner details element unique IDs, then replace the title, description, role, tools, image, and expanded content. Put actual repository or demo anchors inside `.project-details`; native `<summary>` provides the keyboard-accessible open/close control.
- Adjust the title and description in `<head>` when the professional positioning changes. Keep section IDs stable unless their navigation links are updated too.

### Source facts and remaining placeholders

The employment history, accomplishment figures, skills, education, team activities, email, and profile URLs were drawn from the supplied [resume source](bryson_data/Newman_Bryson_Resume.pdf). The public PDF is a copy of that document. The portrait comes from the supplied [photo](bryson_data/bryson-photo.jpg). Introductory and biographical prose is editable editorial wording based on those materials.

The lead work card features the [Atari 2600+ Sideloader](https://github.com/Bmanbro/Atari-2600-Sideloader-), using project details and the menu photo from its repository. It identifies the supported Pac-Man Edition console and firmware 2.0.1.6. The supporting card consolidates the documented Clemson Cyber Defense Team network and incident-response lab activities. Its detailed case study, lab screenshots, project-specific links, and outcomes remain to be added and are labeled as pending.

The education section pairs degree details with a decorative Clemson paw, sourced from [Clemson’s logo artwork](https://www.clemson.edu/brand/images/logo/level-one/paw-orange.png). The original transparent image is stored in `assets/images/clemson-paw.png`; a CSS mask displays it in the site’s lime accent. On mobile, the paw sits beside the degree details and replaces the decorative CU tile.

## Replace or add images

Keep web-ready images in `assets/images/` and reference them with relative paths. The hero uses two versions of the supplied portrait:

| File | Dimensions | Approximate size |
| --- | --- | --- |
| `bryson-portrait.webp` | 1000 × 1333 | 99 KB |
| `bryson-portrait-640.webp` | 640 × 853 | 51 KB |

To produce equivalent variants from a replacement photo with ImageMagick installed locally:

```sh
magick path/to/new-portrait.jpg -auto-orient -resize '1000x>' -strip -quality 85 assets/images/bryson-portrait.webp
magick path/to/new-portrait.jpg -auto-orient -resize '640x>' -strip -quality 85 assets/images/bryson-portrait-640.webp
```

If the new image has different proportions, update the hero `<img>` `width` and `height` to the actual larger file's dimensions. Keep the `srcset` width descriptors equal to the files' actual widths; the current `640w` and `1000w` variants let browsers select an appropriate size. The `sizes` attribute describes the responsive layout. Update the alt text to describe the replacement portrait.

The Atari photo, [atari-sideloader.jpg](assets/images/atari-sideloader.jpg), is the original 4032 × 2268 image from the project repository’s `docs/AtariSideloadMenu.jpg`. It is displayed at its full 16:9 aspect ratio to keep the menu visible.

The network lab cover, [network-equipment.jpg](assets/images/network-equipment.jpg), is a real photograph by Sergei Starostin: [Close Up Photo of Ethernet Cables on Network Switch](https://www.pexels.com/photo/close-up-photo-of-ethernet-cables-on-network-switch-6466143/), from Pexels. The source records a capture date of June 18, 2015 and a Canon EOS 5D Mark III camera. It is used under the [Pexels License](https://www.pexels.com/license/), downloaded at 1213 × 750 and displayed in the existing 3:2 card crop. The expanded project details credit the photographer and identify it as stock photography. It is representative equipment imagery, not a photograph of Bryson’s lab.

The former generated covers (`network-labs.webp` and `record-collage.webp`) remain as unused local assets and are excluded from the upload ZIP. Their original generation prompts are retained in `design/image-prompts.json`. Keep accurate image dimensions, lazy loading, asynchronous decoding, and meaningful alt text when replacing project photos.

The user-supplied artwork in [examples/](examples/) informs the art direction only. Its optimized [study previews](design/reference-previews/README.md) are local design references and are not used by the published page. Preserve the original references locally and exclude both reference directories from deployment.

## Typography and visual customization

Edit the CSS custom properties in `:root` near the top of [styles.css](styles.css) to change the dark olive base, lime accent, cream text, spacing, or font stacks. Bebas Neue supplies condensed display typography; Space Grotesk supplies body text. Both have system-font fallbacks and use `font-display: swap`.

Both font families are distributed under SIL Open Font License 1.1. Keep [Bebas-Neue-OFL.txt](assets/fonts/Bebas-Neue-OFL.txt) and [Space-Grotesk-OFL.txt](assets/fonts/Space-Grotesk-OFL.txt) with the font files when uploading or redistributing the site. Additional font source information is in the [font README](assets/fonts/README.md).

## Browser validation

The original site was tested locally in Chromium at 320, 375, 390, 768, 1024, 1440, and 1920 pixel widths. Automated axe checks reported no violations at those widths. Navigation, visible keyboard focus, project disclosures, motion pause/persistence, reduced motion, and the no-JavaScript fallback were exercised. All local asset and resume requests succeeded; no broken fragments, document overflow, or HTTP-page console errors were found. Direct local-file loading was also checked. Nineteen additional observer navigation checks passed while scrolling and resizing wide, short viewports (1920 × 768 and 1440 × 600).

Local test results and screenshots are in `design/qa/`; they are excluded from the upload. These checks validate the local implementation, not the remote Clemson server configuration.

## Upload to Apache

Use SFTP or the server's configured file-transfer method to open the document root assigned to `brysonn.people.clemson.edu`. The remote filesystem path depends on the Clemson account configuration; this project does not assume a particular path.

The ready-to-upload archive is `bryson-static-site.zip`. Extract its contents directly into the configured document root. The archive contains only the following allowlist, preserving directory names and structure:

```text
index.html
styles.css
script.js
assets/
resume/
```

Place `index.html` directly in that configured document root so the home page resolves at `https://brysonn.people.clemson.edu/`. Upload the contents of this project as listed, rather than wrapping them in an additional project directory. All local page resources use relative paths. No rewrite rules, application service, package installation, or deployment build is required.

Exclude `examples/`, `bryson_data/`, `design/`, local test tools, screenshots, development metadata, and private configuration. The original resume and photo are retained in `bryson_data/` for editing provenance; only the selected public PDF and optimized images belong in the deployed folders. Playwright QA tooling resides outside the site under `/tmp` and is not a deployment dependency.

After upload, visit the HTTPS home page and check the resume PDF, email and social links, fonts and images, mobile navigation, and expanded project cards. If updated files appear stale, refresh the browser cache. This README describes the deployment procedure; it does not claim that a remote deployment has occurred.
