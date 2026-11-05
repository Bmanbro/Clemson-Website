export {};

// Official uploads linked by Gorillaz's own site:
// https://assets.wmgartistservices.com/gorillaz/YTwidget.php
const playlist = ['04mfKJWDSzI', 'HyHNuVaZJ-k', '1V_xRb0x9aw', 'uAOR6ib95kQ', 'nhPaWIeULKk', 'yYDmaexVHic'];

interface YouTubePlayer {
  playVideo(): void;
  pauseVideo(): void;
  nextVideo(): void;
  setVolume(volume: number): void;
  unMute(): void;
  setLoop(loop: boolean): void;
  destroy(): void;
}
interface PlayerEvent { target: YouTubePlayer; data: number }
interface YouTubeAPI {
  Player: new (iframe: HTMLIFrameElement, options: { events: {
    onReady(event: PlayerEvent): void;
    onStateChange(event: PlayerEvent): void;
    onError(event: PlayerEvent): void;
    onAutoplayBlocked(): void;
  } }) => YouTubePlayer;
}
const youtube = window as Window & { YT?: YouTubeAPI; onYouTubeIframeAPIReady?: () => void };
let apiPromise: Promise<YouTubeAPI> | undefined;

function loadYouTube(): Promise<YouTubeAPI> {
  if (youtube.YT?.Player) return Promise.resolve(youtube.YT);
  if (apiPromise) return apiPromise;
  apiPromise = new Promise<YouTubeAPI>((resolve, reject) => {
    const script = document.createElement('script');
    const previous = youtube.onYouTubeIframeAPIReady;
    const fail = () => {
      window.clearTimeout(timeout);
      script.remove();
      youtube.onYouTubeIframeAPIReady = previous;
      reject(new Error('YouTube did not load'));
    };
    const timeout = window.setTimeout(fail, 15000);
    youtube.onYouTubeIframeAPIReady = () => {
      window.clearTimeout(timeout);
      youtube.onYouTubeIframeAPIReady = previous;
      previous?.();
      if (youtube.YT?.Player) resolve(youtube.YT);
      else fail();
    };
    script.src = 'https://www.youtube.com/iframe_api';
    script.onerror = fail;
    document.head.append(script);
  }).catch(error => { apiPromise = undefined; throw error; });
  return apiPromise;
}

const radio = document.querySelector<HTMLElement>('[data-radio]');
const button = document.querySelector<HTMLButtonElement>('#radio-toggle');
const volume = document.querySelector<HTMLInputElement>('#radio-volume');
const panel = document.querySelector<HTMLElement>('#radio-panel');
const video = document.querySelector<HTMLElement>('[data-radio-video]');
const status = document.querySelector<HTMLElement>('[data-radio-status]');
const next = document.querySelector<HTMLButtonElement>('[data-radio-next]');
const close = document.querySelector<HTMLButtonElement>('[data-radio-close]');

if (radio && button && volume && panel && video && status && next && close) {
  let player: YouTubePlayer | undefined;
  let level = 6;
  let ready = false;
  let loading = false;
  let playing = false;
  let wanted = false;
  let failed = false;
  let generation = 0;
  let readyTimeout = 0;
  try {
    const saved = localStorage.getItem('bryson-radio-volume');
    if (saved !== null && saved.trim() !== '' && Number.isFinite(Number(saved))) {
      level = Math.round(Math.max(0, Math.min(100, Number(saved))));
    }
  } catch {}
  volume.value = String(level);
  radio.hidden = false;

  const render = () => {
    button.setAttribute('aria-pressed', String(playing));
    button.setAttribute('aria-busy', String(loading));
    button.disabled = loading;
    button.textContent = loading ? 'Loading…' : failed ? 'Retry radio' : wanted ? 'Gorillaz Ⅱ' : 'Gorillaz ▷';
    button.title = wanted ? 'Pause Gorillaz radio' : 'Play Gorillaz quietly';
    radio.dataset.playing = String(playing && level > 0);
    next.disabled = !ready;
    volume.setAttribute('aria-valuetext', `${level}%`);
    volume.title = `Volume: ${level}%`;
  };
  const pause = () => {
    wanted = false;
    if (ready) player?.pauseVideo();
    playing = false;
    render();
  };
  const stop = () => {
    generation++;
    window.clearTimeout(readyTimeout);
    player?.destroy(); player = undefined;
    video.replaceChildren();
    ready = loading = playing = wanted = failed = false;
    panel.hidePopover();
    render();
  };
  const showError = (message: string) => {
    window.clearTimeout(readyTimeout);
    loading = playing = wanted = false;
    failed = true;
    status.textContent = message;
    render();
  };

  async function start() {
    stop();
    const current = generation;
    panel!.showPopover();
    loading = wanted = true;
    status!.textContent = 'Loading YouTube…';
    render();
    try {
      const api = await loadYouTube();
      if (current !== generation) return;
      const iframe = document.createElement('iframe');
      const params = new URLSearchParams({
        enablejsapi: '1', origin: location.origin, autoplay: '0', playsinline: '1',
        controls: '1', rel: '0', loop: '1', playlist: playlist.join(','),
      });
      iframe.id = 'gorillaz-player';
      iframe.title = 'Gorillaz official music videos on YouTube';
      iframe.width = '320'; iframe.height = '200';
      iframe.allow = 'autoplay; encrypted-media; picture-in-picture; fullscreen';
      iframe.referrerPolicy = 'strict-origin-when-cross-origin';
      iframe.src = `https://www.youtube-nocookie.com/embed/${playlist[0]}?${params}`;
      video!.replaceChildren(iframe);
      readyTimeout = window.setTimeout(() => {
        if (current === generation) showError('YouTube could not load. Retry radio or open it on YouTube.');
      }, 15000);
      player = new api.Player(iframe, { events: {
        onReady: event => {
          if (current !== generation) return;
          window.clearTimeout(readyTimeout);
          ready = true; loading = false;
          event.target.unMute();
          event.target.setVolume(level);
          event.target.setLoop(true);
          status!.textContent = 'Official videos · YouTube';
          if (wanted && !document.hidden) event.target.playVideo();
          else wanted = false;
          render();
        },
        onStateChange: event => {
          if (current !== generation) return;
          playing = event.data === 1;
          if (playing && (document.hidden || !panel!.matches(':popover-open'))) { pause(); return; }
          if (playing) { wanted = true; failed = false; status!.textContent = 'Official videos · YouTube'; }
          if (event.data === 2) wanted = false;
          if (event.data === 3) status!.textContent = 'Buffering…';
          render();
        },
        onError: () => {
          if (current === generation) showError('This video is unavailable here. Try Next track or open it on YouTube.');
        },
        onAutoplayBlocked: () => {
          if (current !== generation) return;
          wanted = false;
          status!.textContent = 'Press play in the video to start.';
          render();
        },
      } });
    } catch {
      if (current === generation) showError('YouTube could not load. Retry radio or open it on YouTube.');
    }
  }

  render();
  button.addEventListener('click', () => {
    if (loading) return;
    if (!ready || failed) { void start(); return; }
    if (wanted) pause();
    else {
      wanted = true;
      player?.unMute();
      player?.setVolume(level);
      player?.playVideo();
      render();
    }
  });
  next.addEventListener('click', () => {
    failed = false; wanted = true;
    status.textContent = 'Loading next track…';
    player?.nextVideo();
    render();
  });
  close.addEventListener('click', () => { stop(); button.focus({ preventScroll: true }); });
  panel.addEventListener('keydown', event => {
    if (event.key === 'Escape') { event.preventDefault(); stop(); button.focus({ preventScroll: true }); }
  });
  volume.addEventListener('input', () => {
    level = Number(volume.value);
    if (ready) player?.setVolume(level);
    render();
    try { localStorage.setItem('bryson-radio-volume', String(level)); } catch {}
  });
  // Keep the official player visible whenever music is playing.
  document.addEventListener('visibilitychange', () => { if (document.hidden) pause(); });
  window.addEventListener('pagehide', stop);
  const game = document.querySelector('#dead-air');
  if (game) new MutationObserver(() => { if (game.hasAttribute('open')) pause(); }).observe(game, { attributes: true, attributeFilter: ['open'] });
}
