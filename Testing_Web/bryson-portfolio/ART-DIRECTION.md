# System Observer / personal archive

## Design read

An experimental personal archive for curious visitors and future collaborators. The publication combines underground comic props, a photocopied zine, early digital labels, and the rhythm of a broadcast. The fictional observer is the site's recurring inhabitant.

- DESIGN_VARIANCE: 10. Six separate compositions, asymmetrical physical artifacts, small rotations, different reading rhythms.
- MOTION_INTENSITY: 5. Small pointer response, a rotating ink symbol, changing captions, short document reveals, and navigation feedback. No scroll hijacking, audio, or full-screen flashes.
- VISUAL_DENSITY: 6. A dense opening poster and illustrated objects, with readable expanded records.
- Stack: existing static HTML/CSS/JavaScript, retained for Apache portability and a small runtime.

## Audit and overhaul

The prior site used cream, charcoal, brick red, faded blue, and violet; Anton, Space Grotesk, and Permanent Marker; a strong seated character; a conventional résumé/work/approach/contact structure; and two main hero links. Its artwork and factual résumé content were useful, but the section hierarchy read as a traditional résumé with illustration.

The overhaul retains the original character, local fonts, résumé PDF, contact URLs, and verified professional facts. It replaces the visual composition, navigation, content order, work presentation, and interactions. The prior source is preserved in `review/previous/`. Old anchors remain available through script aliases.

## Structural reference

https://wodniack.dev/ was reviewed for the combination of oversized identity, a work index, personal artifacts, and playful movement. No text, branding, artwork, code, exact layout, or interaction was copied. The resulting site has its own physical-document and broadcast language.

## Six scenes

1. Index: a full-width, distressed name above a central seated character, a watchful blue halftone field, a cryptic sticker, and a single archive entry.
2. Evidence: a charcoal desk. An incident report, a green-on-dark lab terminal with an inserted print, and a blue newspaper clipping each have different structures. Each includes a role, tools, problem, work/result, visual artifact, handwritten annotation, and an expandable record.
3. Field Notes: independent paper scraps, terminal output, a sticker, and handwritten margins. The words supplied in the brief recur as observations.
4. Equipment: a continuous illustrated tabletop with seven inspectable objects. On narrow screens, the same artwork is arranged as separate object crops, with inline disclosures.
5. Case File: a tabbed manila folder opens into readable education, experience timeline, certifications status, technical capabilities, and project cross-references.
6. Transmission: a brick-red broadcast poster with a speaker grille, keyboard-operable channel slider, direct email, and social links.

## Palette and type

Paper #e8e2d3, dirty white #f2eddf, charcoal #242521, brick red #a33731, faded blue #899da4, olive #b5b49a, occasional electric green #c3d980. Anton supplies large condensed display lettering; Space Grotesk keeps body content readable; Courier supplies typewriter/interface labels; Permanent Marker supplies annotations.

The supplied brief explicitly requests varied page languages, multiple print colors, huge type, status captions, section labels, hand-drawn arrows, and a scroll cue. These intentional choices override the design skill's generic limits on those features. The theme follows fixed print colors rather than system dark mode, as appropriate for the requested hand-printed publication.

All non-object controls have square corners. Texture is one fixed, pointer-transparent layer; ink wear is localized to the name. Both existing SVG textures are pre-rendered into small bitmap assets to remove runtime filter work. The diagram in the testing clipping is semantic editorial content, not a claimed screenshot of an actual product.

## Content integrity

Facts come from the original résumé at `assets/documents/Bryson-Newman-Resume.pdf`; source audit is in `review/content-source-notes.md`. Counts of 9,000+ alerts and 25,000+ accounts are sourced and retain their team context. No fictional certifications, project repositories, contact details, dates, or success metrics were added. Study subjects are identified as study/practice where the résumé does not establish professional proficiency.

All illustrations depict invented technical props and a fictional alter ego, not an actual portrait or an existing character. No incident screenshot or confidential customer data is exposed.

## Artwork

The original character, network equipment, and threat-investigation illustrations remain from the prior design. Their original generation prompts are preserved in `review/previous/ART-DIRECTION.md`.

A new seven-object equipment spread was generated with the built-in imagegen tool and saved to `assets/images/equipment-spread.webp` (1500 × 1000, alpha preserved). Full prompt, source path, and object placement are in `review/equipment-art-prompt.md`.

## Interaction contracts

Native details/summary elements expose reports, equipment notes, and résumé records without JavaScript. Email and social links are ordinary browser links. A disabled-by-default contact slider is enabled only when its subject-changing behavior is ready. Clipboard success and failure are announced through a live status region.

Decorative movement uses transform/opacity and honors system reduced motion plus a session-scoped manual pause. Navigation observation uses fixed pixel margins and document order, avoiding synchronous layout reads. The normal pointer is preserved; the small reacting ink mark is additional decoration. No forced scroll behavior, focus traps, fabricated submission success, or background audio.

## QA

Current evidence is saved under `review/archive/`: desktop/mobile screenshots, layout report, interaction report, and Lighthouse output. The earlier site's reports remain in the parent `review/` directory and are not evidence for this revision.
