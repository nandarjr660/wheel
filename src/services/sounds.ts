/**
 * Sound Effects — Web Audio API
 * Zero dependencies, works offline, generates sounds programmatically.
 */

let ctx: AudioContext | null = null;

function getCtx(): AudioContext {
  if (!ctx) ctx = new AudioContext();
  if (ctx.state === 'suspended') ctx.resume();
  return ctx;
}

/** Mechanical wheel click — short sharp pawl sound */
function tick(volume: number = 1) {
  const c = getCtx();
  const now = c.currentTime;

  // Main click
  const osc1 = c.createOscillator();
  const gain1 = c.createGain();
  osc1.connect(gain1);
  gain1.connect(c.destination);
  osc1.type = 'triangle';
  osc1.frequency.setValueAtTime(1800, now);
  osc1.frequency.exponentialRampToValueAtTime(400, now + 0.02);
  gain1.gain.setValueAtTime(0.12 * volume, now);
  gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.04);
  osc1.start(now);
  osc1.stop(now + 0.04);

  // Click body
  const osc2 = c.createOscillator();
  const gain2 = c.createGain();
  osc2.connect(gain2);
  gain2.connect(c.destination);
  osc2.type = 'square';
  osc2.frequency.setValueAtTime(2400, now);
  osc2.frequency.exponentialRampToValueAtTime(800, now + 0.015);
  gain2.gain.setValueAtTime(0.04 * volume, now);
  gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.025);
  osc2.start(now);
  osc2.stop(now + 0.025);
}

let lastTickRotation = 0;
const TICK_THRESHOLD = 0.15; // radians between ticks

/** Initialize tick tracking — call before spin starts */
export function initTickTracking(startRotation: number) {
  lastTickRotation = startRotation;
}

/** Check and trigger tick based on wheel rotation — call from onUpdate */
export function checkTick(currentRotation: number) {
  const delta = Math.abs(currentRotation - lastTickRotation);
  if (delta >= TICK_THRESHOLD) {
    // Volume scales down slightly as wheel slows (based on delta magnitude)
    const speed = Math.min(delta / 0.3, 1);
    const volume = 0.5 + speed * 0.5;
    tick(volume);
    lastTickRotation = currentRotation;
  }
}

/** Winner fanfare — bright ascending arpeggio */
export function fanfare() {
  const c = getCtx();
  const now = c.currentTime;

  // Bright triangle arpeggio: C5 E5 G5 C6
  const notes = [523.25, 659.25, 783.99, 1046.50];
  notes.forEach((freq, i) => {
    const osc = c.createOscillator();
    const gain = c.createGain();
    osc.connect(gain);
    gain.connect(c.destination);

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(freq, now);
    gain.gain.setValueAtTime(0, now + i * 0.1);
    gain.gain.linearRampToValueAtTime(0.10, now + i * 0.1 + 0.04);
    gain.gain.linearRampToValueAtTime(0, now + i * 0.1 + 0.35);

    osc.start(now + i * 0.1);
    osc.stop(now + i * 0.1 + 0.35);
  });
}

/** Confetti pop — bright sparkle burst */
export function confettiPop() {
  const c = getCtx();
  const now = c.currentTime;

  for (let i = 0; i < 6; i++) {
    const osc = c.createOscillator();
    const gain = c.createGain();
    osc.connect(gain);
    gain.connect(c.destination);

    const baseFreq = 1000 + Math.random() * 1500;
    osc.type = 'sine';
    osc.frequency.setValueAtTime(baseFreq, now);
    osc.frequency.exponentialRampToValueAtTime(baseFreq * 0.4, now + 0.1);
    gain.gain.setValueAtTime(0.05, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.1);

    osc.start(now + i * 0.025);
    osc.stop(now + i * 0.025 + 0.1);
  }
}

/** UI click sound — soft tap */
export function clickSound() {
  const c = getCtx();
  const osc = c.createOscillator();
  const gain = c.createGain();
  osc.connect(gain);
  gain.connect(c.destination);

  osc.type = 'sine';
  osc.frequency.setValueAtTime(800, c.currentTime);
  osc.frequency.exponentialRampToValueAtTime(400, c.currentTime + 0.05);
  gain.gain.setValueAtTime(0.06, c.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, c.currentTime + 0.06);

  osc.start(c.currentTime);
  osc.stop(c.currentTime + 0.06);
}
