/**
 * Biblioteca de efectos sonoros interactivos con Web Audio API puro.
 * Diseñada para EdTech: acústicamente agradable, sin latencia, 100% sintetizada y offline.
 */

let audioCtx: AudioContext | null = null;
let soundEnabled = true;

function getAudioContext(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  if (!audioCtx) {
    const AudioContextClass =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (AudioContextClass) {
      audioCtx = new AudioContextClass();
    }
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume().catch(() => {});
  }
  return audioCtx;
}

export function setSoundEnabled(enabled: boolean) {
  soundEnabled = enabled;
}

export function isSoundEnabled(): boolean {
  return soundEnabled;
}

/**
 * 1. EFECTO AL ACTIVAR / DESACTIVAR SISTEMA O CAPA ANATÓMICA
 * Simula el deslizamiento translúcido de un acetato con un clic acústico resonante.
 */
export function playLayerToggleSound(layerId = 1, isActivating = true) {
  if (!soundEnabled) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  const now = ctx.currentTime;
  const baseFreqs = [261.63, 293.66, 329.63, 349.23, 392.00, 440.00, 493.88, 523.25];
  const targetFreq = baseFreqs[layerId % baseFreqs.length] || 330;

  // Oscilador melódico de tono
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  const filter = ctx.createBiquadFilter();

  filter.type = 'lowpass';
  filter.frequency.setValueAtTime(isActivating ? 1800 : 900, now);

  osc.type = isActivating ? 'triangle' : 'sine';
  osc.frequency.setValueAtTime(isActivating ? targetFreq : targetFreq * 1.2, now);
  osc.frequency.exponentialRampToValueAtTime(isActivating ? targetFreq * 1.25 : targetFreq * 0.85, now + 0.12);

  gain.gain.setValueAtTime(0.001, now);
  gain.gain.exponentialRampToValueAtTime(0.18, now + 0.02);
  gain.gain.exponentialRampToValueAtTime(0.001, now + 0.18);

  osc.connect(filter);
  filter.connect(gain);
  gain.connect(ctx.destination);

  osc.start(now);
  osc.stop(now + 0.2);

  // Ruido blanco filtrado suave simulando textura de acetato
  try {
    const bufferSize = ctx.sampleRate * 0.08;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (bufferSize * 0.3));
    }

    const noise = ctx.createBufferSource();
    noise.buffer = buffer;

    const noiseFilter = ctx.createBiquadFilter();
    noiseFilter.type = 'bandpass';
    noiseFilter.frequency.setValueAtTime(isActivating ? 2400 : 1600, now);
    noiseFilter.Q.setValueAtTime(3, now);

    const noiseGain = ctx.createGain();
    noiseGain.gain.setValueAtTime(0.06, now);
    noiseGain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);

    noise.connect(noiseFilter);
    noiseFilter.connect(noiseGain);
    noiseGain.connect(ctx.destination);

    noise.start(now);
    noise.stop(now + 0.09);
  } catch {
    // Silently continue if buffer fails on old devices
  }
}

/**
 * 2. EFECTO AL TOCAR UN PIN / HOTSPOT DE UN ÓRGANO (SONAR CRISTALINO)
 * Sonido nítido de gota de agua o diapasón que resalta el órgano seleccionado sin distraer.
 */
export function playPinSelectSound(pitchBoost = 0) {
  if (!soundEnabled) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  const now = ctx.currentTime;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();

  // Frecuencia inicial alta con rápido descenso a tono puro cálido (gota de agua / radar)
  const baseFreq = 880 + pitchBoost;
  osc.type = 'sine';
  osc.frequency.setValueAtTime(baseFreq * 1.5, now);
  osc.frequency.exponentialRampToValueAtTime(baseFreq, now + 0.035);

  gain.gain.setValueAtTime(0.001, now);
  gain.gain.exponentialRampToValueAtTime(0.22, now + 0.015);
  gain.gain.exponentialRampToValueAtTime(0.001, now + 0.28);

  osc.connect(gain);
  gain.connect(ctx.destination);

  osc.start(now);
  osc.stop(now + 0.3);

  // Armónico sutil superior para brillo cristalino
  const oscHarm = ctx.createOscillator();
  const gainHarm = ctx.createGain();
  oscHarm.type = 'triangle';
  oscHarm.frequency.setValueAtTime(baseFreq * 2, now);

  gainHarm.gain.setValueAtTime(0.001, now);
  gainHarm.gain.exponentialRampToValueAtTime(0.06, now + 0.01);
  gainHarm.gain.exponentialRampToValueAtTime(0.001, now + 0.14);

  oscHarm.connect(gainHarm);
  gainHarm.connect(ctx.destination);

  oscHarm.start(now);
  oscHarm.stop(now + 0.15);
}

/**
 * 3. EFECTO AL ACTIVAR / DESACTIVAR ETIQUETAS (TOGGLE ON / OFF)
 */
export function playLabelToggleSound(isOn: boolean) {
  if (!soundEnabled) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  const now = ctx.currentTime;
  const notes = isOn ? [523.25, 783.99] : [783.99, 523.25]; // C5 -> G5 o G5 -> C5

  notes.forEach((freq, idx) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    const st = now + idx * 0.07;

    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, st);

    gain.gain.setValueAtTime(0.001, st);
    gain.gain.exponentialRampToValueAtTime(0.14, st + 0.015);
    gain.gain.exponentialRampToValueAtTime(0.001, st + 0.16);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(st);
    osc.stop(st + 0.18);
  });
}

/**
 * 4. EFECTO DE ACIERTO EN QUIZ (ARPEGIO BRILLANTE MAYOR)
 * Estimulante y festivo para premiar al estudiante.
 */
export function playSuccessSound() {
  if (!soundEnabled) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  const notes = [523.25, 659.25, 783.99, 1046.50]; // Do, Mi, Sol, Do agudo
  const now = ctx.currentTime;

  notes.forEach((freq, idx) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    const st = now + idx * 0.07;

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(freq, st);

    gain.gain.setValueAtTime(0.001, st);
    gain.gain.exponentialRampToValueAtTime(0.24, st + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.001, st + 0.4);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(st);
    osc.stop(st + 0.42);
  });
}

/**
 * 5. EFECTO DIDÁCTICO AMABLE PARA REINTENTO EN QUIZ (JAMÁS PUNITIVO)
 * Acorde cálido de marimba que invita a explorar el atlas antes de responder.
 */
export function playGentleRetrySound() {
  if (!soundEnabled) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  const notes = [349.23, 440.00]; // Fa4, La4 (intervalo dulce de tercera mayor)
  const now = ctx.currentTime;

  notes.forEach((freq, idx) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    const st = now + idx * 0.1;

    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, st);

    gain.gain.setValueAtTime(0.001, st);
    gain.gain.linearRampToValueAtTime(0.16, st + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.001, st + 0.3);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(st);
    osc.stop(st + 0.32);
  });
}

/**
 * 6. EFECTO DE ZOOM (ACERCAR / ALEJAR / RESET)
 */
export function playZoomSound(action: 'in' | 'out' | 'reset' = 'in') {
  if (!soundEnabled) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  const now = ctx.currentTime;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();

  const startF = action === 'in' ? 500 : action === 'out' ? 800 : 650;
  const endF = action === 'in' ? 950 : action === 'out' ? 450 : 650;

  osc.type = 'sine';
  osc.frequency.setValueAtTime(startF, now);
  osc.frequency.exponentialRampToValueAtTime(endF, now + 0.06);

  gain.gain.setValueAtTime(0.001, now);
  gain.gain.exponentialRampToValueAtTime(0.1, now + 0.015);
  gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);

  osc.connect(gain);
  gain.connect(ctx.destination);

  osc.start(now);
  osc.stop(now + 0.09);
}

/**
 * 7. CLIC GENÉRICO LIGERO PARA BOTONES Y MODALES
 */
export function playClickSound() {
  if (!soundEnabled) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  const now = ctx.currentTime;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();

  osc.type = 'sine';
  osc.frequency.setValueAtTime(600, now);
  osc.frequency.exponentialRampToValueAtTime(900, now + 0.03);

  gain.gain.setValueAtTime(0.09, now);
  gain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);

  osc.connect(gain);
  gain.connect(ctx.destination);

  osc.start(now);
  osc.stop(now + 0.045);
}

/**
 * 8. CELEBRACIÓN DE RETO / VICTORIA TOTAL
 */
export function playCelebrationSound() {
  if (!soundEnabled) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  const chords = [
    { freq: [523.25, 659.25, 783.99], time: 0 },
    { freq: [587.33, 739.99, 880.00], time: 0.14 },
    { freq: [659.25, 830.61, 987.77], time: 0.28 },
    { freq: [783.99, 1046.50, 1318.51], time: 0.44 }
  ];

  chords.forEach((chord) => {
    chord.freq.forEach((f) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const st = ctx.currentTime + chord.time;

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(f, st);

      gain.gain.setValueAtTime(0.001, st);
      gain.gain.exponentialRampToValueAtTime(0.14, st + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, st + 0.42);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(st);
      osc.stop(st + 0.44);
    });
  });
}
