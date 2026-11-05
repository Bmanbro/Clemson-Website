type Mode = 'ready' | 'playing' | 'paused' | 'won' | 'lost';
type Wave = { id: number; radius: number; gap: number; width: number; speed: number; drift: number; resolved: boolean };
type Spark = { x: number; y: number; vx: number; vy: number; life: number; color: string };

const dialog = document.querySelector<HTMLDialogElement>('#dead-air')!;
const launcher = document.querySelector<HTMLButtonElement>('#dead-air-launch')!;
const canvas = dialog.querySelector<HTMLCanvasElement>('canvas')!;
const context = canvas.getContext('2d');

// Keep the portrait decorative if canvas is unavailable.
if (context) initGame(context);

function initGame(ctx: CanvasRenderingContext2D) {
  const element = <T extends HTMLElement = HTMLElement>(name: string) => dialog.querySelector<T>(`[data-game-${name}]`)!;
  const overlay = element('overlay');
  const startButton = element<HTMLButtonElement>('start');
  const pauseButton = element<HTMLButtonElement>('pause');
  const soundButton = element<HTMLButtonElement>('sound');
  const fullscreenButton = element<HTMLButtonElement>('fullscreen');
  const fullscreenFrame = dialog.querySelector<HTMLElement>('.dead-air-frame')!;
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const tau = Math.PI * 2;
  const orbit = 136;
  const duration = 45;
  const phaseCooldown = 2.8;
  const colors = { teal: '#498e96', pink: '#cc78a0', plum: '#785c88', yellow: '#d5c65d', paper: '#f4f1e9', ink: '#111619' };
  const portrait = new Image();
  portrait.src = `${import.meta.env.BASE_URL.replace(/\/$/, '')}/images/bryson-icon.png`;
  portrait.onload = () => { if (dialog.open) render(); };
  let mode: Mode = 'ready';
  let elapsed = 0;
  let angle = -Math.PI / 2;
  let lives = 3;
  let score = 0;
  let best = 0;
  let combo = 0;
  let cooldown = 0;
  let phasing = 0;
  let invincible = 0;
  let waveId = 0;
  let spawnIn = 0.8;
  let previousGap = -Math.PI / 2;
  let seed = 2026;
  let beat = -1;
  let waves: Wave[] = [];
  let sparks: Spark[] = [];
  const keys = new Set<string>();
  const pointers = new Map<number, number>();
  let animation = 0;
  let lastFrame = 0;
  let manualClock = false;
  let sound = false;
  let audio: AudioContext | undefined;
  let master: GainNode | undefined;
  const quietMotion = () => reducedMotion.matches || document.body.dataset.motion === 'paused';
  const wrap = (a: number) => Math.atan2(Math.sin(a), Math.cos(a));
  const random = () => { seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0; return seed / 4294967296; };
  try { best = Math.max(0, Number(localStorage.getItem('bryson-dead-air-best')) || 0); } catch {}

  function tone(frequency: number, length: number, type: OscillatorType = 'triangle', volume = 0.035) {
    if (!sound || !audio || !master || audio.state !== 'running') return;
    const oscillator = audio.createOscillator();
    const gain = audio.createGain();
    oscillator.type = type;
    oscillator.frequency.setValueAtTime(frequency, audio.currentTime);
    oscillator.frequency.exponentialRampToValueAtTime(Math.max(35, frequency * 0.5), audio.currentTime + length);
    gain.gain.setValueAtTime(volume, audio.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, audio.currentTime + length);
    oscillator.connect(gain).connect(master);
    oscillator.start();
    oscillator.stop(audio.currentTime + length);
    oscillator.onended = () => { oscillator.disconnect(); gain.disconnect(); };
  }

  function clearInputs() {
    keys.clear();
    pointers.clear();
    dialog.querySelectorAll<HTMLElement>('[data-game-turn]').forEach(button => delete button.dataset.held);
  }

  function hud() {
    element('lives').textContent = `${lives} / 3`;
    element('score').textContent = String(score).padStart(5, '0');
    element('time').textContent = `${Math.max(0, duration - elapsed).toFixed(1)}s`;
    element('best').textContent = String(best).padStart(5, '0');
    element('act').textContent = mode === 'ready' ? 'B-side / 45 seconds' : `${elapsed < 15 ? 'Needle drop' : elapsed < 30 ? 'Feedback' : 'Dead air'}${combo > 1 ? ` / ×${combo}` : ''}`;
    element('phase-label').textContent = phasing > 0 ? 'Phasing!' : cooldown > 0 ? `Phase ${cooldown.toFixed(1)}s` : 'Phase ready';
    dialog.querySelector<HTMLElement>('.dead-air-charge i')!.style.transform = `scaleX(${1 - cooldown / phaseCooldown})`;
    pauseButton.disabled = !['playing', 'paused'].includes(mode);
    pauseButton.textContent = mode === 'paused' ? 'Resume' : 'Pause';
  }

  function panel() {
    const content = {
      ready: ["You've found the B-side", 'Dead Air', "You're the needle. The world is a broken record. Slip through the gaps. Survive 45 seconds.", 'Drop the needle'],
      paused: ['Take a breath', 'On hold', 'Your run is right where you left it. Find the gold openings. Space gives you a brief phase through the walls.', 'Keep spinning'],
      won: ['You broke the loop', 'Signal alive', `${score.toLocaleString()} points. All 45 seconds survived. The record is yours.`, 'One more spin'],
      lost: ['The record bit back', 'Signal lost', `${elapsed.toFixed(1)} seconds survived. ${score.toLocaleString()} points. Stay in the gold gaps; save your phase for a tight spot.`, 'Try again'],
      playing: ['', '', '', ''],
    }[mode];
    overlay.hidden = mode === 'playing';
    element('caption').textContent = content[0];
    element('heading').textContent = content[1];
    element('description').textContent = content[2];
    startButton.textContent = content[3];
    element('instructions').hidden = mode !== 'ready';
    element('announcement').textContent = mode === 'playing' ? 'Run started. Survive 45 seconds.' : `${content[1]}. ${content[2]}`;
    hud();
    if (mode !== 'playing') startButton.focus({ preventScroll: true });
  }

  function start() {
    mode = 'playing';
    elapsed = 0; angle = -Math.PI / 2; lives = 3; score = 0; combo = 0;
    cooldown = 0; phasing = 0; invincible = 0; waveId = 0; spawnIn = 0.8;
    previousGap = angle; seed = 2026; beat = -1; waves = []; sparks = [];
    clearInputs(); panel(); canvas.focus({ preventScroll: true });
    void audio?.resume().catch(() => {});
    if (master && audio) master.gain.setValueAtTime(sound ? 1 : 0, audio.currentTime);
    tone(220, .2); runLoop();
  }

  function finish(result: 'won' | 'lost') {
    mode = result;
    if (result === 'won') score += lives * 500;
    best = Math.max(best, score);
    try { localStorage.setItem('bryson-dead-air-best', String(best)); } catch {}
    clearInputs(); panel();
    tone(result === 'won' ? 880 : 65, .5, 'sawtooth', .025);
  }

  function pause() {
    if (mode !== 'playing') return;
    mode = 'paused'; clearInputs(); cancelAnimationFrame(animation); panel(); render();
    if (master && audio) master.gain.setValueAtTime(0, audio.currentTime);
  }

  function resume() {
    mode = 'playing'; panel(); canvas.focus({ preventScroll: true });
    if (master && audio) master.gain.setValueAtTime(sound ? 1 : 0, audio.currentTime);
    runLoop();
  }

  function phase() {
    if (mode !== 'playing' || cooldown > 0) return;
    phasing = .5; cooldown = phaseCooldown;
    burst(Math.cos(angle) * orbit, Math.sin(angle) * orbit, colors.teal, 12);
    tone(420, .22, 'sawtooth', .025); hud();
  }

  function burst(x: number, y: number, color: string, count: number) {
    if (quietMotion()) return;
    for (let i = 0; i < count; i++) {
      const direction = i / count * tau;
      sparks.push({ x, y, vx: Math.cos(direction) * 85, vy: Math.sin(direction) * 85, life: .45, color });
    }
  }

  function spawnWave() {
    const act = Math.floor(elapsed / 15);
    previousGap = wrap(previousGap + (random() - .5) * (act === 0 ? 1.7 : 2.5));
    waves.push({ id: waveId++, radius: 390, gap: previousGap, width: 1.42 - act * .16, speed: 88 + act * 24 + elapsed * .6, drift: act === 0 ? 0 : (waveId % 2 ? 1 : -1) * .13, resolved: false });
    spawnIn = 1.55 - act * .23;
  }

  function update(dt: number) {
    if (mode !== 'playing') return;
    elapsed = Math.min(duration, elapsed + dt);
    const left = keys.has('ArrowLeft') || keys.has('KeyA') || [...pointers.values()].includes(-1);
    const right = keys.has('ArrowRight') || keys.has('KeyD') || [...pointers.values()].includes(1);
    angle = wrap(angle + (Number(right) - Number(left)) * 3.6 * dt);
    cooldown = Math.max(0, cooldown - dt);
    phasing = Math.max(0, phasing - dt);
    invincible = Math.max(0, invincible - dt);
    spawnIn -= dt;
    if (spawnIn <= 0 && elapsed < duration - 1.8) spawnWave();
    const nextBeat = Math.floor(elapsed * (elapsed < 15 ? 2.5 : elapsed < 30 ? 3 : 3.5));
    if (nextBeat !== beat) { beat = nextBeat; tone(beat % 4 === 0 ? 95 : 55, .1, 'triangle', .045); }
    for (const wave of waves) {
      const before = wave.radius;
      wave.radius -= wave.speed * dt;
      wave.gap = wrap(wave.gap + wave.drift * dt);
      if (!wave.resolved && before >= orbit && wave.radius < orbit) {
        wave.resolved = true;
        const distance = Math.abs(wrap(angle - wave.gap));
        if (distance < wave.width / 2 - .12) {
          combo = Math.min(8, combo + 1);
          score += 100 * combo;
          if (distance < .2) { score += 150; burst(Math.cos(angle) * orbit, Math.sin(angle) * orbit, colors.yellow, 10); }
          tone(350 + combo * 65, .12);
        } else if (phasing > 0 || invincible > 0) {
          score += 50; combo = 0;
        } else {
          lives--; combo = 0; invincible = 1.2;
          burst(Math.cos(angle) * orbit, Math.sin(angle) * orbit, colors.pink, 16);
          tone(60, .3, 'sawtooth', .04);
          element('announcement').textContent = `${lives} signal ${lives === 1 ? 'life' : 'lives'} left.`;
          if (lives <= 0) { finish('lost'); return; }
        }
      }
    }
    waves = waves.filter(wave => wave.radius > 40);
    sparks.forEach(spark => { spark.x += spark.vx * dt; spark.y += spark.vy * dt; spark.life -= dt; });
    sparks = sparks.filter(spark => spark.life > 0);
    if (elapsed >= duration) finish('won');
    hud();
  }

  function arc(radius: number, start: number, end: number, color: string, width: number) {
    ctx.beginPath(); ctx.arc(0, 0, radius, start, end); ctx.strokeStyle = color; ctx.lineWidth = width; ctx.stroke();
  }

  function drawWave(wave: Wave) {
    const start = wave.gap + wave.width / 2;
    const end = wave.gap + tau - wave.width / 2;
    // Segmented outlines make the collapsing rings feel like torn speaker cones.
    const path = () => {
      ctx.beginPath();
      const segments = 48;
      for (let i = 0; i <= segments; i++) {
        const a = start + (end - start) * i / segments;
        const r = wave.radius + (i % 3 === 0 ? 3 : 0);
        if (i === 0) ctx.moveTo(Math.cos(a) * r, Math.sin(a) * r);
        else ctx.lineTo(Math.cos(a) * r, Math.sin(a) * r);
      }
    };
    ctx.globalAlpha = wave.resolved ? .35 : 1;
    path(); ctx.strokeStyle = '#0c1317'; ctx.lineWidth = 25; ctx.stroke();
    path(); ctx.strokeStyle = wave.id % 2 ? colors.plum : colors.pink; ctx.lineWidth = 17; ctx.stroke();
    path(); ctx.strokeStyle = wave.id % 2 ? '#ac90b8' : '#e2a3c5'; ctx.lineWidth = 2; ctx.stroke();
    [start, end].forEach(a => {
      ctx.save(); ctx.rotate(a); ctx.fillStyle = colors.yellow; ctx.strokeStyle = colors.ink; ctx.lineWidth = 3;
      ctx.fillRect(wave.radius - 14, -5, 28, 10); ctx.strokeRect(wave.radius - 14, -5, 28, 10); ctx.restore();
    });
    if (!wave.resolved) {
      const x = Math.cos(wave.gap) * wave.radius;
      const y = Math.sin(wave.gap) * wave.radius;
      ctx.save(); ctx.translate(x, y); ctx.rotate(Math.PI / 4);
      ctx.fillStyle = colors.yellow; ctx.strokeStyle = '#10171b'; ctx.lineWidth = 3;
      ctx.fillRect(-7, -7, 14, 14); ctx.strokeRect(-7, -7, 14, 14); ctx.restore();
    }
    ctx.globalAlpha = 1;
  }

  function render() {
    const { width, height } = canvas;
    ctx.clearRect(0, 0, width, height);
    ctx.fillStyle = '#28333b'; ctx.fillRect(0, 0, width, height);
    // A perforated metal speaker cabinet, with a quiet grid behind the action.
    ctx.fillStyle = '#18242b';
    for (let y = 8; y < height; y += 16) for (let x = 8; x < width; x += 16) ctx.fillRect(x, y, 2, 2);
    ctx.strokeStyle = '#80928e'; ctx.lineWidth = 2; ctx.strokeRect(12, 12, width - 24, height - 24);
    [[23, 23], [width - 23, 23], [23, height - 23], [width - 23, height - 23]].forEach(([x, y]) => {
      ctx.fillStyle = '#9aaba9'; ctx.beginPath(); ctx.arc(x, y, 4, 0, tau); ctx.fill();
      ctx.strokeStyle = '#111619'; ctx.beginPath(); ctx.moveTo(x - 3, y); ctx.lineTo(x + 3, y); ctx.stroke();
    });
    ctx.save(); ctx.translate(width / 2, height / 2);
    for (let ring = 240; ring >= 48; ring -= 16) arc(ring, 0, tau, ring % 32 === 0 ? '#41535a' : '#1d292f', 10);
    ctx.save();
    if (!quietMotion()) ctx.rotate(elapsed * .06);
    for (let i = 0; i < 32; i++) {
      ctx.rotate(tau / 32);
      ctx.fillStyle = i % 2 ? '#64807d' : '#171f25'; ctx.fillRect(246, -6, 15, 12);
    }
    ctx.restore();
    arc(orbit, 0, tau, '#09181f', 5);
    ctx.setLineDash([4, 10]); arc(orbit, 0, tau, '#a7bfb1', 2); ctx.setLineDash([]);
    if (mode === 'ready') {
      drawWave({ id: 0, radius: 212, gap: -.85, width: 1.6, resolved: false, speed: 0, drift: 0 });
      drawWave({ id: 1, radius: 310, gap: 1.4, width: 1.5, resolved: false, speed: 0, drift: 0 });
    } else waves.forEach(drawWave);
    const pulse = quietMotion() || mode !== 'playing' ? 0 : Math.sin(elapsed * Math.PI * 5) * 2;
    arc(59 + pulse, 0, tau, '#0d161c', 17); arc(51 + pulse, 0, tau, '#62747c', 3);
    ctx.fillStyle = '#19252c'; ctx.beginPath(); ctx.arc(0, 0, 49, 0, tau); ctx.fill();
    ctx.fillStyle = colors.paper; ctx.textAlign = 'center';
    ctx.font = '26px "Rubik Spray Paint", sans-serif'; ctx.fillText(mode === 'ready' ? 'bn' : String(Math.ceil(duration - elapsed)).padStart(2, '0'), 0, 6);
    ctx.font = '10px Arimo, sans-serif'; ctx.fillStyle = colors.yellow; ctx.fillText(combo > 1 ? `×${combo} combo` : 'dead air', 0, 25);
    const x = Math.cos(angle) * orbit;
    const y = Math.sin(angle) * orbit;
    if (!quietMotion() && mode === 'playing') {
      for (let i = 1; i <= 5; i++) {
        const trailing = angle - i * .075;
        ctx.globalAlpha = .45 - i * .07; ctx.fillStyle = phasing > 0 ? colors.teal : colors.yellow;
        ctx.beginPath(); ctx.arc(Math.cos(trailing) * orbit, Math.sin(trailing) * orbit, 12 - i, 0, tau); ctx.fill();
      }
      ctx.globalAlpha = 1;
    }
    ctx.save(); ctx.translate(x, y);
    ctx.fillStyle = phasing > 0 ? '#9ed9d1' : invincible > 0 ? colors.pink : colors.yellow;
    ctx.strokeStyle = '#070e13'; ctx.lineWidth = 3;
    ctx.beginPath(); ctx.arc(0, 0, phasing > 0 ? 24 : 21, 0, tau); ctx.fill(); ctx.stroke();
    ctx.save(); ctx.beginPath(); ctx.arc(0, 0, 16, 0, tau); ctx.clip();
    if (portrait.complete && portrait.naturalWidth) ctx.drawImage(portrait, -17, -17, 34, 34);
    else { ctx.fillStyle = colors.teal; ctx.fillRect(-17, -17, 34, 34); ctx.fillStyle = colors.ink; ctx.font = 'bold 14px Arimo'; ctx.fillText('BN', 0, 5); }
    ctx.restore();
    if (phasing > 0) { ctx.setLineDash([5, 5]); arc(29, 0, tau, '#c1f3df', 3); ctx.setLineDash([]); }
    ctx.restore();
    if (!quietMotion()) sparks.forEach(spark => { ctx.globalAlpha = spark.life / .45; ctx.fillStyle = spark.color; ctx.fillRect(spark.x - 3, spark.y - 3, 6, 6); });
    ctx.globalAlpha = 1;
    ctx.restore();
    if (document.body.dataset.lofi === 'on') {
      ctx.fillStyle = '#00000012'; for (let y = 0; y < height; y += 4) ctx.fillRect(0, y, width, 1);
    }
  }

  function frame(now: number) {
    if (!dialog.open || mode !== 'playing' || manualClock) return;
    // Substeps keep collision timing consistent even when a frame is dropped.
    let remaining = Math.min((now - lastFrame) / 1000, .05);
    lastFrame = now;
    while (remaining > 0) { const dt = Math.min(remaining, 1 / 120); update(dt); remaining -= dt; }
    render();
    if (mode === 'playing') animation = requestAnimationFrame(frame);
  }

  function runLoop() {
    cancelAnimationFrame(animation); lastFrame = performance.now();
    render(); if (!manualClock) animation = requestAnimationFrame(frame);
  }

  function resizeCanvas() {
    if (!dialog.open) return;
    const stage = canvas.parentElement!;
    const aspect = stage.clientWidth / Math.max(1, stage.clientHeight);
    // Keep the whole orbit visible; fill the remaining cabinet at any aspect ratio.
    canvas.width = Math.round(520 * Math.max(1, aspect));
    canvas.height = Math.round(520 / Math.min(1, aspect));
    render();
  }
  new ResizeObserver(resizeCanvas).observe(canvas.parentElement!);

  launcher.hidden = false;
  launcher.addEventListener('click', () => {
    if (dialog.open) return;
    manualClock = false; mode = 'ready'; elapsed = 0; lives = 3; score = 0; combo = 0; cooldown = 0; phasing = 0; invincible = 0; angle = -Math.PI / 2;
    waves = []; sparks = []; clearInputs(); dialog.showModal(); resizeCanvas(); panel(); render();
  });
  startButton.addEventListener('click', () => mode === 'paused' ? resume() : start());
  element('close').addEventListener('click', () => dialog.close());
  dialog.addEventListener('close', async () => {
    cancelAnimationFrame(animation); clearInputs();
    if (mode === 'playing') mode = 'paused';
    if (master && audio) master.gain.setValueAtTime(0, audio.currentTime);
    if (document.fullscreenElement === fullscreenFrame) await document.exitFullscreen().catch(() => {});
    launcher.focus({ preventScroll: true });
  });
  dialog.addEventListener('cancel', event => {
    event.preventDefault();
    if (document.fullscreenElement === fullscreenFrame) {
      pause(); void document.exitFullscreen().catch(() => {}); return;
    }
    if (mode === 'playing') pause(); else if (mode === 'paused') resume(); else dialog.close();
  });
  pauseButton.addEventListener('click', () => mode === 'paused' ? resume() : pause());
  // A second finger may not synthesize a click while the first holds steering.
  element('phase').addEventListener('pointerdown', event => {
    if (event.button !== 0) return;
    event.preventDefault(); phase();
  });
  element('phase').addEventListener('click', phase);
  dialog.querySelectorAll<HTMLButtonElement>('[data-game-turn]').forEach(button => {
    button.addEventListener('pointerdown', event => {
      if (event.button !== 0 || mode !== 'playing') return;
      event.preventDefault(); button.setPointerCapture(event.pointerId);
      pointers.set(event.pointerId, Number(button.dataset.gameTurn)); button.dataset.held = 'true';
    });
    const release = (event: PointerEvent) => { pointers.delete(event.pointerId); delete button.dataset.held; };
    button.addEventListener('pointerup', release); button.addEventListener('pointercancel', release); button.addEventListener('lostpointercapture', release);
    // Keyboard activation of a touch button gives a useful, predictable nudge.
    button.addEventListener('click', event => { if (event.detail === 0 && mode === 'playing') { angle = wrap(angle + Number(button.dataset.gameTurn) * .25); render(); } });
  });
  async function toggleFullscreen() {
    try { if (document.fullscreenElement === fullscreenFrame) await document.exitFullscreen(); else await fullscreenFrame.requestFullscreen(); }
    catch { element('announcement').textContent = 'Full screen is unavailable in this browser.'; }
  }
  fullscreenButton.hidden = !document.fullscreenEnabled;
  fullscreenButton.addEventListener('click', toggleFullscreen);
  document.addEventListener('fullscreenchange', () => {
    fullscreenButton.textContent = document.fullscreenElement === fullscreenFrame ? 'Exit full screen' : 'Full screen';
    if (!document.fullscreenElement && !dialog.open) launcher.focus({ preventScroll: true });
  });
  soundButton.addEventListener('click', async () => {
    try {
      if (!audio) { audio = new AudioContext(); master = audio.createGain(); master.connect(audio.destination); }
      await audio.resume(); sound = !sound;
      master!.gain.setValueAtTime(sound ? 1 : 0, audio.currentTime);
      soundButton.setAttribute('aria-pressed', String(sound)); soundButton.textContent = sound ? 'Sound on' : 'Sound off';
      if (sound) tone(330, .12);
    } catch { element('announcement').textContent = 'Sound is unavailable in this browser.'; }
  });
  dialog.addEventListener('keydown', event => {
    if (['ArrowLeft', 'ArrowRight', 'KeyA', 'KeyD'].includes(event.code) && mode === 'playing') { event.preventDefault(); keys.add(event.code); canvas.focus({ preventScroll: true }); }
    else if (event.code === 'Space' && !(event.target instanceof HTMLButtonElement)) { event.preventDefault(); if (!event.repeat) phase(); }
    else if (event.code === 'KeyP') { event.preventDefault(); if (!event.repeat) { if (mode === 'playing') pause(); else if (mode === 'paused') resume(); } }
    else if (event.code === 'KeyF') { event.preventDefault(); if (!event.repeat) void toggleFullscreen(); }
    else if (event.code === 'KeyR' && ['lost', 'won'].includes(mode)) { event.preventDefault(); start(); }
  });
  dialog.addEventListener('keyup', event => keys.delete(event.code));
  window.addEventListener('blur', () => { clearInputs(); if (dialog.open) pause(); });
  document.addEventListener('visibilitychange', () => { if (document.hidden && dialog.open) pause(); });

  const gameWindow = window as Window & { render_game_to_text?: () => string; advanceTime?: (ms: number) => void };
  gameWindow.render_game_to_text = () => JSON.stringify({
    open: dialog.open, mode, coordinates: `Canvas ${canvas.width}×${canvas.height}; origin top left; center (${canvas.width / 2},${canvas.height / 2}); angles in radians, 0 right, positive clockwise`,
    elapsed: +elapsed.toFixed(3), remaining: +(duration - elapsed).toFixed(3), lives, score, best, combo,
    player: { x: +(canvas.width / 2 + Math.cos(angle) * orbit).toFixed(2), y: +(canvas.height / 2 + Math.sin(angle) * orbit).toFixed(2), angle: +angle.toFixed(4), orbit, turnSpeed: 3.6, phase: +phasing.toFixed(3), cooldown: +cooldown.toFixed(3), invincible: +invincible.toFixed(3) },
    waves: waves.map(w => ({ ...w, radius: +w.radius.toFixed(2), gap: +w.gap.toFixed(4), contactIn: +((w.radius - orbit) / w.speed).toFixed(3) })),
    reducedMotion: quietMotion(), sound,
  });
  // Explicit test stepping takes over the clock so wall time cannot alter a run.
  gameWindow.advanceTime = (ms: number) => {
    if (!Number.isFinite(ms) || ms <= 0) return;
    manualClock = true; cancelAnimationFrame(animation);
    let remaining = Math.min(ms, 60000) / 1000;
    while (remaining > 0 && dialog.open && mode === 'playing') { const dt = Math.min(remaining, 1 / 120); update(dt); remaining -= dt; }
    if (dialog.open) render();
  };
}
