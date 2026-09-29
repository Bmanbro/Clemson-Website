# Bryson Newman / System Observer

An interactive personal archive built with plain HTML, CSS, and JavaScript. Six distinct scenes: Index, Evidence, Field Notes, Equipment, Case File, and Transmission. No framework, build step, remote fonts, analytics, or third-party runtime requests.

## Preview

From this directory:

```sh
python3 -m http.server 4174
```

Open http://localhost:4174. A preview server may already be running there.

## Deploy to Apache

Upload `index.html`, `styles.css`, `script.js`, and the entire `assets/` directory to the document root or a subfolder. Relative asset paths work in either location. No `.htaccess` or server-side code is required.

`review/`, `ART-DIRECTION.md`, and this README are development materials and do not need to be deployed.

## Edit

- `index.html`: content, email, links, the seven equipment descriptions, and résumé details.
- `styles.css`: print palette, six section compositions, typography, textures, responsive layouts, and reduced-motion rules.
- `script.js`: cursor response, changing captions, navigation state, motion preference, redactions, email copying, channel tuning, lazy equipment artwork, and old anchor aliases.
- `assets/images/equipment-spread.webp`: original seven-object illustration, generated for this archive. The mobile layout uses a smaller derivative as a sprite sheet, loaded near the equipment section.
- `assets/documents/Bryson-Newman-Resume.pdf`: existing source résumé, served unchanged.
- `assets/fonts/`: self-hosted fonts and their licenses.

The three evidence artifacts describe sourced work and team experience, not invented standalone projects. Confidential operational details are absent; illustrations and the testing diagram are editorial reconstructions. The dossier explicitly notes that the supplied résumé contains no certifications. Linux and digital forensics are framed as practice/study, rather than claimed professional proficiency.

## Interactions and accessibility

Reports, object inspections, and the classified file use native disclosure elements and work with keyboard, touch, or no JavaScript. The contact section uses normal mail and profile links; the tuner chooses an email subject and opens the user's mail app. It does not submit messages or claim encryption.

Decorative movement respects system reduced motion and the visible motion switch. The switch remembers its setting for the browser session. No audio plays. The standard cursor remains intact. Redactions reveal on hover, focus, or activation; their text remains available without JavaScript.

Previous links `#resume`, `#work`, `#approach`, `#contact`, and `#top` map to their corresponding new sections when JavaScript is enabled.

## Design and verification

`ART-DIRECTION.md` records the design choices and reference. `review/content-source-notes.md` records source facts. `review/equipment-art-prompt.md` contains the complete new artwork prompt and provenance.

Current screenshots, responsive checks, interaction checks, and the mobile Lighthouse audit live in `review/archive/`. The prior site source is saved under `review/previous/`; screenshots in the parent `review/` folder describe that prior site.
