# Bryson: art direction

The four supplied reference images were inspected before designing. Their common patterns are thick black ink outlines, graphic flat colors, exaggerated typography, angular composition, character-led focus, and cream/lime contrast. The final site borrows those visual principles without reproducing reference characters, artist likenesses, logos, or artwork. Optimized reference previews are for local study only and are excluded from deployment.

## Design system

- Palette: charcoal `#181a16`, deeper surface `#1e211b`, paper `#ececdf`, secondary text `#b2b7a7`, acid lime `#d6f254`, rules `#42473b`.
- Type: self-hosted Bebas Neue for large poster headlines; Space Grotesk for readable professional content; system monospace for dates and labels. Fonts include their SIL OFL licenses.
- Grid: maximum 1320px canvas; asymmetric desktop hero and work columns; two-column about; timeline; compact education grid; full-width contact close. Each collapses explicitly for phones.
- Shape: square controls and project cards; circles reserved for the record graphic. Portrait gets a paper edge and slight tilt.
- Texture: subtle, small repeating grayscale grain tile, halftone in the hero artwork, original print-textured editorial project covers.
- Motion: one decorative marquee, a slowly rotating record, brief section entrances, and transform-only project hover treatment. Global pause control, reduced-motion override, and static no-JavaScript fallback.
- Design settings: variance 8, motion 5, density 4. Brand remains dark regardless of operating-system color scheme.

## Content provenance

Employment, tools, dates, education, GPA, contact details, and lab activities come from `bryson_data/Newman_Bryson_Resume.pdf`. The original PDF is copied to `resume/Bryson-Newman-Resume.pdf`. Month-level date labels on the site abbreviate the exact dates in that document. Biography and brand copy are authored summaries of those facts. There is no asserted availability status.

The portrait is the supplied `bryson_data/bryson-photo.jpg`, resized and stripped of metadata; grayscale is applied in CSS. Case study titles summarize documented activities, not independently verified standalone repositories. Case study screenshots, repository/demo links, and outcomes remain explicitly pending. No earned certifications were supplied.

## Original generated artwork

Created with the built-in image generation tool, then resized to 1200 × 800 WebP. These are decorative editorial covers, not actual project screenshots.

- `assets/images/record-collage.webp`
- `assets/images/network-labs.webp`

Exact generation prompts are recorded in `image-prompts.json`.
