Original prompt: Make the moving Bryson icon beside the name open an intense, abstract secret minigame. Remove Current_Web and keep the résumé in a simpler location.

## Design and implementation

- Dead Air: a 45-second orbital survival game inside a broken speaker. Steer Bryson through collapsing angular rings; a rechargeable phase move gives a brief escape. Three lives, clean-gap combos, three escalating acts, and a saved best score.
- Palette: existing teal #498e96, pink #cc78a0, plum #785c88, yellow #d5c65d, black outlines and cream #f4f1e9. Arimo controls, Rubik Spray Paint title. XP dialog chrome around one canvas, compact score strip above and tactile controls below.
- The speaker cone and orbit are the focal point; avoid generic space-shooter stars, neon bloom, or extra explanatory decoration. Center the arena, keep instructions concise and left aligned in an inset paper panel.
- Reuse the header portrait and shared DesktopIcon. Keep the minigame out of desktop window management; use a modal dialog to contain keyboard controls and restore focus on close.
- The current résumé already lives at public/documents/resume.pdf. Current_Web contains an older copy and can be removed without changing download URLs.

## Progress

- Implemented the hidden launcher, modal game, seeded ring patterns, phase cooldown, combos, win/loss/restart, optional synthesized sound, persisted best, reduced-motion handling, and deterministic test hooks.
- Removed the tracked Current_Web folder and committed the canonical PDF cleanup. Its old OS-owned contents are retained only under ignored .astro/retired/ because filesystem ownership prevents deletion.
- Build and TypeScript checks pass. The skill Playwright loop passed and its gameplay screenshot was inspected.
- Fixed full screen to target an inner frame: browsers reject requestFullscreen on a dialog element. Keyboard steering now focuses the arena, so Space consistently phases after using toolbar buttons.
- The existing process on port 4321 serves this checkout. Reused it; no extra server/port was started. Astro status inside the sandbox does not see that existing process.

## Verification complete

- `pnpm build`, TypeScript `--noEmit`, and `git diff --check` pass.
- The skill action loop was run with the installed Chromium binary. The temporary client uses keyboard activation for the moving launcher because Playwright's stable-position click wait intermittently times out on the animation. Inspected the resulting canvas screenshots and JSON state.
- Full keyboard-driven 45-second run: win, three lives, 30,050 points, eight-times combo. Verified actual wall collision, losing, restarting, phasing through a wall, phase duration and recharge, pause/resume, saved best, and sound controls. No browser errors.
- Inspected desktop 1440×900, phone 390×844, small phone 320×568, and landscape 844×390 screenshots. Corrected intrinsic canvas clipping in landscape and enlarged the phone arena with a responsive logical viewport.
- Verified live animation timing and real multi-touch input. Fixed phase to trigger on pointerdown so a second finger can phase while the first finger steers.
- Verified full-screen entry/exit, Escape during play, closing while full-screen, and launcher focus restoration after the asynchronous exit.
- Confirmed reduced-motion preferences (system and saved), desktop minimize/restore and keyboard movement, the existing PDF URL, and all résumé windows without JavaScript.
- Local test scripts, screenshots, and state artifacts are in `/tmp/dead-air-qa/`. No outstanding TODOs.

## Audio removal (2026-11-05)

- Request: remove all volume and audio buttons; no audio on the site.
- Removed the footer radio component, YouTube playback script, volume slider, player controls, and equalizer styles.
- Removed the game sound toggle and all Web Audio synthesis and playback code.
- Verified `pnpm build` and `git diff --check`. Inspected desktop (1440×900), mobile (390×844), and short landscape (844×390) browser screenshots. No audio controls, media embeds, or YouTube requests remain. Game start, steering, phase, pause/resume, and close pass without browser errors. Ran the skill game client and inspected its gameplay screenshot and state. No outstanding TODOs.
