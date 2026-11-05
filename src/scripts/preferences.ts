const lofiButton = document.querySelector<HTMLButtonElement>('#lofi-toggle');
const motionButton = document.querySelector<HTMLButtonElement>('#motion-toggle');
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
  if (event.key === 'bryson-lofi' || event.key === null) {
    lofi = event.newValue !== 'off';
    setLofi();
  }
  if (event.key === 'bryson-motion' || event.key === null) {
    savedMotion = event.newValue;
    setMotion();
  }
});
