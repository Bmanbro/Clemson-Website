import { desktopEras as eras } from '../data/themes';

const lofiButton = document.querySelector<HTMLButtonElement>('#lofi-toggle');
const motionButton = document.querySelector<HTMLButtonElement>('#motion-toggle');
const themeButtons = [...document.querySelectorAll<HTMLButtonElement>('[data-theme-choice]')];
const validThemes = new Set(themeButtons.map(button => button.dataset.themeChoice));
const eraPickers = [...document.querySelectorAll<HTMLElement>('.era-picker')];

function setEra(value: string | null | undefined) {
  const found = eras.findIndex(era => era.id === value);
  const index = found < 0 ? 1 : found;
  const era = eras[index];
  document.body.dataset.era = era.id;
  eraPickers.forEach(picker => {
    const input = picker.querySelector<HTMLInputElement>('input')!;
    input.value = String(index);
    input.setAttribute('aria-valuetext', era.spoken);
    picker.querySelector<HTMLOutputElement>('output')!.value = era.label;
  });
}

setEra(document.body.dataset.era);
eraPickers.forEach(picker => {
  picker.hidden = false;
  const input = picker.querySelector<HTMLInputElement>('input')!;
  input.addEventListener('input', () => {
    setEra(eras[Number(input.value)].id);
    try { localStorage.setItem('bryson-era', document.body.dataset.era!); } catch {}
  });
});

function setTheme(value: string | null | undefined) {
  const theme = value && validThemes.has(value) ? value : 'meadow';
  document.body.dataset.theme = theme;
  themeButtons.forEach(button => button.setAttribute('aria-pressed', String(button.dataset.themeChoice === theme)));
}

setTheme(document.body.dataset.theme);
document.querySelectorAll<HTMLElement>('[data-theme-picker]').forEach(picker => { picker.hidden = false; });
themeButtons.forEach(button => button.addEventListener('click', () => {
  setTheme(button.dataset.themeChoice);
  try { localStorage.setItem('bryson-theme', document.body.dataset.theme!); } catch {}
}));

const motionPreference = window.matchMedia('(prefers-reduced-motion: reduce)');
let lofi = document.body.dataset.lofi !== 'off';
let savedMotion: string | null = null;
try { savedMotion = localStorage.getItem('bryson-motion'); } catch {}

function setLofi() {
  document.body.dataset.lofi = lofi ? 'on' : 'off';
  if (!lofiButton) return;
  lofiButton.hidden = false;
  lofiButton.setAttribute('aria-pressed', String(lofi));
  lofiButton.textContent = lofi ? 'Lo-fi on' : 'Lo-fi off';
}

function setMotion() {
  // The OS preference temporarily takes priority without replacing the saved choice.
  const paused = motionPreference.matches || savedMotion === 'paused';
  document.body.dataset.motion = paused ? 'paused' : 'playing';
  document.documentElement.style.scrollBehavior = paused ? 'auto' : '';
  if (!motionButton) return;
  motionButton.hidden = false;
  motionButton.disabled = motionPreference.matches;
  motionButton.setAttribute('aria-pressed', String(!paused));
  motionButton.title = motionPreference.matches
    ? 'Animations are off because your system requests reduced motion'
    : paused ? 'Play animations' : 'Pause animations';
  motionButton.textContent = paused ? 'Motion off ▷' : 'Motion on Ⅱ';
}

setLofi();
setMotion();
lofiButton?.addEventListener('click', () => {
  lofi = !lofi;
  setLofi();
  try { localStorage.setItem('bryson-lofi', lofi ? 'on' : 'off'); } catch {}
});
motionButton?.addEventListener('click', () => {
  if (motionPreference.matches) return;
  savedMotion = savedMotion === 'paused' ? 'playing' : 'paused';
  setMotion();
  try { localStorage.setItem('bryson-motion', savedMotion); } catch {}
});
motionPreference.addEventListener('change', setMotion);
window.addEventListener('storage', event => {
  if (event.key === 'bryson-era' || event.key === null) setEra(event.newValue);
  if (event.key === 'bryson-theme' || event.key === null) setTheme(event.newValue);
  if (event.key === 'bryson-lofi' || event.key === null) {
    lofi = event.newValue !== 'off';
    setLofi();
  }
  if (event.key === 'bryson-motion' || event.key === null) {
    savedMotion = event.newValue;
    setMotion();
  }
});
