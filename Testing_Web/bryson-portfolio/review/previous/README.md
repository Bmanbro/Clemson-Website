# Bryson Newman — personal portfolio

A static portfolio built with plain HTML, CSS, and a small amount of JavaScript. No PHP, build step, package installation, or server configuration is required.

## Deploy to Apache

Upload these files and folders to your Apache `DocumentRoot`, `public_html`, or a subfolder:

- `index.html`
- `styles.css`
- `script.js`
- `assets/` and all its contents

Keep the relative paths and filenames intact. The site works at the domain root or in a subfolder, and no `.htaccess` file is required. Fonts, artwork, and the downloadable résumé are served locally.

## Preview locally

From this folder, run:

```sh
python3 -m http.server 8080
```

Then open <http://localhost:8080>.

## Edit the site

- `index.html`: page content, résumé details, email, and profile links.
- `styles.css`: palette, typography, textures, layout, and responsive styles.
- `script.js`: small optional interactions.
- `assets/documents/Bryson-Newman-Resume.pdf`: downloadable résumé, copied from the supplied `/resume/Bryson-Newman-Resume.pdf`.
- `assets/fonts/`: self-hosted fonts and their licenses.

Résumé facts come from the supplied PDF. The real email and profile URLs are wired into the page. The “how I work” prose is editorial copy derived from the résumé and can be adjusted to match Bryson’s own wording.

`review/` and `ART-DIRECTION.md` are development materials and do not need to be uploaded.
