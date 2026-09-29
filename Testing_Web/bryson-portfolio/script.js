(() => {
  'use strict';

  const root = document.documentElement;
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)');
  const motionButton = document.querySelector('#motion-toggle');
  const hero = document.querySelector('#index');
  const posterStage = hero?.querySelector('.poster-stage');
  const character = hero?.querySelector('.character-rig');
  const cursorMark = hero?.querySelector('.cursor-mark');
  const statusLabels = [...document.querySelectorAll('[data-status]')];
  const initialStatus = statusLabels.map((label) => label.textContent);
  const captions = [
    'CURIOSITY: STILL ACTIVE',
    'CONCLUSIONS PENDING',
    'FOLLOWING A LOOSE CABLE',
    'NO SIGNAL IS TRULY SILENT'
  ];
  let storedPause = false;
  let motionPaused = reducedMotion.matches;
  let statusInterval;
  let statusIndex = -1;
  let pointerFrame;
  let signalTimeout;

  try {
    storedPause = sessionStorage.getItem('archive-motion-paused') === 'true';
  } catch {
    // Storage may be unavailable in a private or restricted browser session.
  }

  function resetPointer() {
    cancelAnimationFrame(pointerFrame);
    if (character) {
      character.style.setProperty('--mx', '0px');
      character.style.setProperty('--my', '0px');
    }
    if (cursorMark) cursorMark.classList.remove('is-tracking');
  }

  function scheduleStatus() {
    clearInterval(statusInterval);
    if (motionPaused || document.hidden || !statusLabels.length) return;
    statusInterval = window.setInterval(() => {
      statusIndex = (statusIndex + 1) % captions.length;
      statusLabels.forEach((label) => { label.textContent = captions[statusIndex]; });
    }, 7000);
  }

  function updateMotion() {
    motionPaused = reducedMotion.matches || storedPause;
    root.dataset.motion = motionPaused ? 'off' : 'on';
    if (motionButton) {
      motionButton.hidden = false;
      motionButton.setAttribute('aria-pressed', String(motionPaused));
      motionButton.textContent = motionPaused ? 'MOTION OFF' : 'MOTION ON';
      motionButton.disabled = reducedMotion.matches;
      motionButton.title = reducedMotion.matches
        ? 'Motion is off because your device requests reduced motion.'
        : 'Pause or resume decorative motion.';
    }
    if (motionPaused) {
      resetPointer();
      clearTimeout(signalTimeout);
      document.body.classList.remove('signal-shift');
      statusLabels.forEach((label, index) => { label.textContent = initialStatus[index]; });
    }
    scheduleStatus();
  }

  motionButton?.addEventListener('click', () => {
    storedPause = !storedPause;
    try {
      sessionStorage.setItem('archive-motion-paused', String(storedPause));
    } catch {
      // The in-memory preference still works for this visit.
    }
    updateMotion();
  });

  function watchMedia(query, callback) {
    if (query.addEventListener) query.addEventListener('change', callback);
    else if (query.addListener) query.addListener(callback);
  }

  watchMedia(reducedMotion, updateMotion);
  watchMedia(finePointer, resetPointer);
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) resetPointer();
    scheduleStatus();
  });
  updateMotion();

  hero?.addEventListener('pointermove', (event) => {
    if (motionPaused || !finePointer.matches || event.pointerType === 'touch') return;
    const bounds = hero.getBoundingClientRect();
    if (!bounds.width || !bounds.height) return;
    const x = Math.max(0, Math.min(bounds.width, event.clientX - bounds.left));
    const y = Math.max(0, Math.min(bounds.height, event.clientY - bounds.top));
    const markBounds = posterStage?.getBoundingClientRect() || bounds;
    const markX = event.clientX - markBounds.left;
    const markY = event.clientY - markBounds.top;
    const insideStage = markX >= 0 && markX <= markBounds.width
      && markY >= 0 && markY <= markBounds.height;
    cancelAnimationFrame(pointerFrame);
    pointerFrame = requestAnimationFrame(() => {
      if (character) {
        character.style.setProperty('--mx', `${((x / bounds.width - 0.5) * 14).toFixed(2)}px`);
        character.style.setProperty('--my', `${((y / bounds.height - 0.5) * 14).toFixed(2)}px`);
      }
      if (cursorMark) {
        cursorMark.style.transform = `translate3d(${markX}px, ${markY}px, 0)`;
        cursorMark.classList.toggle('is-tracking', insideStage);
      }
    });
  }, { passive: true });
  hero?.addEventListener('pointerleave', resetPointer);

  const annotations = document.querySelectorAll('.annotation');
  if ('IntersectionObserver' in window) {
    const annotationObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      });
    }, { threshold: 0.15 });
    annotations.forEach((annotation) => annotationObserver.observe(annotation));
  } else {
    annotations.forEach((annotation) => annotation.classList.add('is-visible'));
  }

  const navLinks = [...document.querySelectorAll('.archive-nav a[href^="#"]')];
  const archiveSections = [...document.querySelectorAll('section[id]')].filter((section) =>
    navLinks.some((link) => link.getAttribute('href') === `#${section.id}`)
  );

  function highlightSection(id) {
    navLinks.forEach((link) => {
      if (link.getAttribute('href') === `#${id}`) link.setAttribute('aria-current', 'location');
      else link.removeAttribute('aria-current');
    });
  }

  if (archiveSections.length) highlightSection(archiveSections[0].id);
  if ('IntersectionObserver' in window && archiveSections.length) {
    const activeSections = new Set();
    const navigationObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) activeSections.add(entry.target);
        else activeSections.delete(entry.target);
      });
      // DOM order identifies the upper visible section without forcing a layout.
      const current = archiveSections.find((section) => activeSections.has(section));
      if (current) highlightSection(current.id);
    }, { rootMargin: '-110px 0px -40px 0px', threshold: 0 });
    archiveSections.forEach((section) => navigationObserver.observe(section));
  }

  document.querySelectorAll('[data-redaction]').forEach((button) => {
    button.dataset.ready = 'true';
    button.setAttribute('aria-expanded', String(button.classList.contains('is-revealed')));
    button.addEventListener('click', () => {
      const revealed = button.classList.toggle('is-revealed');
      button.setAttribute('aria-expanded', String(revealed));
    });
  });

  document.querySelectorAll('[data-archive-link]').forEach((link) => {
    link.addEventListener('click', () => {
      if (motionPaused) return;
      clearTimeout(signalTimeout);
      document.body.classList.add('signal-shift');
      signalTimeout = window.setTimeout(() => document.body.classList.remove('signal-shift'), 240);
    });
  });

  const copyButton = document.querySelector('[data-copy-email]');
  const copyStatus = document.querySelector('.copy-status');

  function copyWithSelection(email) {
    const focused = document.activeElement;
    const selection = window.getSelection();
    const selectedRanges = [];
    if (selection) {
      for (let index = 0; index < selection.rangeCount; index += 1) {
        selectedRanges.push(selection.getRangeAt(index).cloneRange());
      }
    }
    const field = document.createElement('textarea');
    field.value = email;
    field.setAttribute('aria-label', 'Email address to copy');
    field.style.cssText = 'position:fixed;left:-10000px;top:0;font-size:16px';
    document.body.append(field);
    field.select();
    let copied = false;
    try {
      copied = document.execCommand('copy');
    } catch {
      copied = false;
    } finally {
      field.remove();
      if (selection) {
        selection.removeAllRanges();
        selectedRanges.forEach((range) => selection.addRange(range));
      }
      if (focused instanceof HTMLElement) focused.focus({ preventScroll: true });
    }
    return copied;
  }

  if (copyButton && copyStatus && copyButton.dataset.copyEmail) {
    copyButton.hidden = false;
    copyButton.addEventListener('click', async () => {
      const email = copyButton.dataset.copyEmail;
      const restoreButtonFocus = document.activeElement === copyButton;
      copyButton.disabled = true;
      let copied = false;
      if (navigator.clipboard && window.isSecureContext) {
        try {
          await navigator.clipboard.writeText(email);
          copied = true;
        } catch {
          // Permission denial can still permit the browser's selection fallback.
        }
      }
      if (!copied) copied = copyWithSelection(email);
      copyButton.disabled = false;
      if (restoreButtonFocus) copyButton.focus({ preventScroll: true });
      copyStatus.textContent = copied
        ? 'Coordinates copied. Your mail app knows the rest.'
        : 'Select and copy the email address, or use its link to open your mail app.';
      copyButton.textContent = copied ? 'COPIED' : 'COPY';
    });
  }

  const dial = document.querySelector('#transmission-dial');
  const frequencyOutput = document.querySelector('#frequency-output');
  const channelMessage = document.querySelector('#channel-message');
  const transmitLink = document.querySelector('#transmit-link');
  const channels = {
    1: { name: 'Work', message: 'Interesting problems. Open channel.', subject: 'Work inquiry' },
    2: { name: 'Research', message: 'Questions welcome. Evidence encouraged.', subject: 'Research question' },
    3: { name: 'Just saying hello', message: 'No clearance required.', subject: 'Hello, Bryson' }
  };
  const baseMailto = transmitLink?.getAttribute('href')?.split('?')[0];

  function tuneChannel() {
    if (!dial) return;
    const channel = channels[dial.value] || channels[1];
    dial.setAttribute('aria-valuetext', channel.name);
    if (frequencyOutput) frequencyOutput.textContent = channel.name;
    if (channelMessage) channelMessage.textContent = channel.message;
    if (transmitLink && baseMailto?.startsWith('mailto:')) {
      transmitLink.setAttribute('href', `${baseMailto}?subject=${encodeURIComponent(channel.subject)}`);
    }
  }

  if (dial) {
    dial.disabled = false;
    dial.addEventListener('input', tuneChannel);
  }
  tuneChannel();

  const hashAliases = {
    '#work': '#evidence',
    '#resume': '#case-file',
    '#approach': '#field-notes',
    '#contact': '#transmission',
    '#top': '#index'
  };

  function resolveArchiveHash() {
    const original = window.location.hash;
    const destination = hashAliases[original];
    if (!destination) return;
    const section = document.getElementById(destination.slice(1));
    if (!section) return;
    if (original === '#resume') {
      const dossier = document.querySelector('#dossier');
      if (dossier instanceof HTMLDetailsElement) dossier.open = true;
    }
    try {
      history.replaceState(null, '', `${window.location.pathname}${window.location.search}${destination}`);
    } catch {
      // Scrolling still works if history is restricted by the preview environment.
    }
    section.scrollIntoView({ behavior: 'instant', block: 'start' });
    highlightSection(section.id);
  }

  window.addEventListener('hashchange', resolveArchiveHash);
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', resolveArchiveHash, { once: true });
  } else {
    resolveArchiveHash();
  }

  // The mobile object artwork is a background sprite. Load it near the bench,
  // while the desktop image retains its native lazy loading.
  const equipment = document.querySelector('#equipment');
  if (equipment) {
    const revealEquipment = () => equipment.style.setProperty(
      '--equipment-image', "url('assets/images/equipment-spread-960.webp')"
    );
    if ('IntersectionObserver' in window) {
      const equipmentObserver = new IntersectionObserver((entries, observer) => {
        if (!entries.some((entry) => entry.isIntersecting)) return;
        revealEquipment();
        observer.disconnect();
      }, { rootMargin: '600px' });
      equipmentObserver.observe(equipment);
    } else revealEquipment();
  }

  document.querySelectorAll('[data-year]').forEach((year) => {
    year.textContent = String(new Date().getFullYear());
  });
})();
