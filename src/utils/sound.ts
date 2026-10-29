/**
 * Synthesizes a pleasant crystal notification chime using Web Audio API
 * No external mp3 files required
 */
export function playOrderNotificationSound() {
  try {
    const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof window.AudioContext }).webkitAudioContext;
    if (!AudioContextClass) return;
    const ctx = new AudioContextClass();

    if (ctx.state === 'suspended') {
      ctx.resume();
    }

    const now = ctx.currentTime;

    const playTone = (freq: number, startTime: number, duration: number, volume = 0.2) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, startTime);

      gain.gain.setValueAtTime(0.0001, startTime);
      gain.gain.linearRampToValueAtTime(volume, startTime + 0.03);
      gain.gain.exponentialRampToValueAtTime(0.0001, startTime + duration);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(startTime);
      osc.stop(startTime + duration);
    };

    // Arpeggio chime: D5 (587.33Hz) -> F#5 (739.99Hz) -> A5 (880Hz)
    playTone(587.33, now, 0.22, 0.15);
    playTone(739.99, now + 0.12, 0.25, 0.18);
    playTone(880.00, now + 0.24, 0.45, 0.2);
  } catch {
    // Ignore audio autoplay restrictions safely
  }
}
