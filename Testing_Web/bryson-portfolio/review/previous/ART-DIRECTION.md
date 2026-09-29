# The Bootleg Sleeve

## Design read

A personal portfolio for recruiters, collaborators, and curious visitors, using a character-led bootleg record sleeve and handmade punk zine aesthetic. Native HTML/CSS/JavaScript, fully static on Apache.

- Design variance: 9/10. Off-axis lettering, a large illustrated character, paper inserts, asymmetric work features.
- Motion intensity: 2/10. Interaction feedback only; no autoplay, scroll hijacking, or continuous animation. Reduced-motion preference disables smooth scrolling and transitions.
- Visual density: 6/10. Dense illustrated cover; legible résumé content with clear headings and generous line height.
- Palette: dirty cream, off-black, deep red, muted blue, and dusty violet.
- Typography: Anton with a localized ink-wear mask for the name; Space Grotesk for readable copy; Permanent Marker for margin notes.
- The single paper theme is intentional for the requested print aesthetic; system dark mode does not recolor the artwork.

## Content

Personal facts, dates, tools, contact links, and achievements come from ../resume/Bryson-Newman-Resume.pdf. The original PDF is served unchanged from assets/documents/Bryson-Newman-Resume.pdf. Employment order is newest first. Work features are real résumé achievements, not invented standalone projects. The short introduction and how-I-work statements are editorial phrasing based on the résumé.

The person and crow are original fictional illustration, not a likeness of Bryson. Supplied reference images informed mood and composition; they are not shipped as page assets.

## Critique of the first draft and revision

1. The clean display typography felt too polished. Added localized imperfect ink to the main name while keeping body copy intact.
2. Both project features followed an image-over-caption layout. Rebuilt the alert investigation feature as a separate paper case sheet, with title first, marginal annotation, image, and source-backed alert count.
3. Small mobile role and navigation labels were difficult to scan. Raised sizes and gave the small-screen navigation a clear two-column arrangement.
4. The blue sticker missed 4.5:1 contrast slightly. Lightened the muted blue and violet while retaining the palette.
5. The clipboard fallback could lose keyboard focus, and Escape could unexpectedly jump to the top. Fixed both behaviors and extended interaction checks.
6. Reduced the desktop masthead to 80px to give the cover more space.

## Generated artwork

All three illustrations were generated using the built-in image generation tool, then saved in this project as optimized WebP assets. The hero retains its genuine alpha transparency. The full prompts follow.

### assets/images/sleeve-character.webp

Use case: illustration-story
Asset type: original illustrated cutout for the right half of a personal website's bootleg record sleeve opening poster.
Primary request: Create a striking original lanky young adult fictional tech character with an angular expressive long face, heavy brows, messy asymmetrical black hair, tired but mischievous eyes, wearing a huge deep brick red work jacket over a dirty cream shirt, wide muted slate blue cargo trousers and exaggerated black sneakers. Seated crookedly on two battered black speaker cabinets with a little old CRT monitor beside him. One elbow on knee, one hand holding a loose coiled cable. A tiny odd one-eyed crow perched on the monitor. Character body in sharp three-quarter pose facing left, head glancing toward viewer. Distinctive silhouette, foreshortened big shoe. This is an original mascot, not a portrait or any existing fictional character.
Style/medium: rough hand-inked late-1990s underground comic drawing and early-2000s animated music-world character design, loose scratchy energetic brush outlines, expressive asymmetry, strong blacks, limited flat screenprinted color, photocopy grit and fine sparse halftone patches. Mature cool and rebellious, not cute. No smooth vector finish, no 3D, no photorealism.
Composition/framing: portrait 2:3, entire figure and speakers included with small clear margin. Focused readable silhouette that will sit at large scale on the right side of an editorial webpage. No environmental backdrop. Genuinely transparent background outside illustration, preserving drawn holes between limbs and cables.
Color palette: off-black #20201d, dirty cream #eee7d7, deep red #a53135, muted blue #6e8995, dull violet #827096 only.
Text: none. No logos, lettering, watermarks, borders, or existing franchise symbols.

### assets/images/network-lab.webp

Use case: illustration-story. Asset type: wide 3:2 illustration for a security analyst's punk zine personal website, selected work artwork about network defense practice labs. Create an original hand inked underground comic drawing of a chaotic pile of two chunky old server towers, one CRT monitor, a network switch with many patch cables, and a tall speaker-like firewall appliance. Three-quarter perspective, off-kilter architecture and angular exaggerated shapes. Cables snake around the foreground and connect the towers. A small one-eyed black crow sits on the top tower. No human figures. Flat dirty muted blue #778e97 paper background, off-black strong scratchy ink outlines, cream #ece4d3 light surfaces, small deep red #a53135 accents on a few cable plugs. Handmade photocopy texture, halftone, rough brush drawing, early 2000s animated music world mood, original visual identity. Equipment fills most of the landscape image. No readable text, no typography, no numbers, no logos, no gradients, no 3D, no borders. Flat screenprinted ink with imperfect registration.

### assets/images/threat-investigation.webp

Use case: illustration-story. Asset type: wide 3:2 artwork for a security analyst personal website's punk zine achievement about investigating suspicious email and security alerts. Original rough hand-inked underground comic drawing: a very large watchful eye in a jagged magnifying glass floats over a disordered pile of torn envelopes, file folders, and crumpled sheets, with one dark one-eyed crow peeking from behind an envelope. Graphical angular composition, energetic brush outlines, simplified exaggerated forms, heavy blacks, sparse halftone and screenprint grain. Limited palette of dusty violet #8c7997 flat paper background, dirty cream #ece4d3, off-black #24231f, small deep red #a53135 ink marks. Art-directed editorial illustration like an early 2000s bootleg record sleeve, no real existing characters. Landscape 3:2. No text, letters, numerals, logos, watermark, borders, glossy finish, gradients or 3D. Textural and characterful but focused, no tiny excessive details.

