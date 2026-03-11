const ALERT_AUDIO_PATH = '/sounds/fire_alert.mp3';
const MUTE_STORAGE_KEY = 'fire-alert-muted';
const SOUND_COOLDOWN_MS = 8000;

let lastPlayedAt = 0;
let lastPlayedEventKey = null;

export const isAlertMuted = () => {
  try {
    return localStorage.getItem(MUTE_STORAGE_KEY) === 'true';
  } catch {
    return false;
  }
};

export const setAlertMuted = (muted) => {
  try {
    localStorage.setItem(MUTE_STORAGE_KEY, muted ? 'true' : 'false');
  } catch {
    // Ignore storage failures in private browsing modes.
  }
};

const playFallbackBeep = async () => {
  const AudioCtx = window.AudioContext || window.webkitAudioContext;
  if (!AudioCtx) {
    return false;
  }

  const ctx = new AudioCtx();
  const now = ctx.currentTime;

  const toneA = ctx.createOscillator();
  const gainA = ctx.createGain();
  toneA.type = 'sine';
  toneA.frequency.setValueAtTime(900, now);
  gainA.gain.setValueAtTime(0.0001, now);
  gainA.gain.exponentialRampToValueAtTime(0.15, now + 0.01);
  gainA.gain.exponentialRampToValueAtTime(0.0001, now + 0.25);
  toneA.connect(gainA).connect(ctx.destination);
  toneA.start(now);
  toneA.stop(now + 0.25);

  const toneB = ctx.createOscillator();
  const gainB = ctx.createGain();
  toneB.type = 'sine';
  toneB.frequency.setValueAtTime(1200, now + 0.28);
  gainB.gain.setValueAtTime(0.0001, now + 0.28);
  gainB.gain.exponentialRampToValueAtTime(0.15, now + 0.30);
  gainB.gain.exponentialRampToValueAtTime(0.0001, now + 0.55);
  toneB.connect(gainB).connect(ctx.destination);
  toneB.start(now + 0.28);
  toneB.stop(now + 0.55);

  setTimeout(() => {
    ctx.close().catch(() => {});
  }, 900);

  return true;
};

export const playFireAlertSound = async (eventKey = 'fire-event') => {
  if (isAlertMuted()) {
    return false;
  }

  const now = Date.now();
  if (lastPlayedEventKey === eventKey && now - lastPlayedAt < SOUND_COOLDOWN_MS) {
    return false;
  }

  lastPlayedAt = now;
  lastPlayedEventKey = eventKey;

  try {
    const audio = new Audio(ALERT_AUDIO_PATH);
    audio.preload = 'auto';
    audio.volume = 1;
    await audio.play();
    return true;
  } catch {
    return playFallbackBeep();
  }
};
