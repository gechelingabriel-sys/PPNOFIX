// Premium Audio Engine for Airport Experience
// Handles SFX, ambient sounds, and flight audio with proper fallbacks

class AudioEngine {
  private audioContext: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private sfxGain: GainNode | null = null;
  private ambientGain: GainNode | null = null;
  private musicGain: GainNode | null = null;
  private isInitialized = false;
  private sfxEnabled = true;
  private ambientEnabled = true;
  private flightAudioBuffer: AudioBuffer | null = null;
  private currentFlightSource: AudioBufferSourceNode | null = null;

  private sfxBuffers: Map<string, AudioBuffer> = new Map();

  async init(): Promise<boolean> {
    if (this.isInitialized) return true;

    try {
      this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      
      // Create gain nodes
      this.masterGain = this.audioContext.createGain();
      this.masterGain.gain.value = 0.8;
      this.masterGain.connect(this.audioContext.destination);

      // Create limiter (compressor)
      const limiter = this.audioContext.createDynamicsCompressor();
      limiter.threshold.value = -3;
      limiter.knee.value = 0;
      limiter.ratio.value = 20;
      limiter.attack.value = 0.001;
      limiter.release.value = 0.1;
      limiter.connect(this.masterGain);

      this.sfxGain = this.audioContext.createGain();
      this.sfxGain.gain.value = 1;
      this.sfxGain.connect(limiter);

      this.ambientGain = this.audioContext.createGain();
      this.ambientGain.gain.value = 0.3;
      this.ambientGain.connect(limiter);

      this.musicGain = this.audioContext.createGain();
      this.musicGain.gain.value = 0.5;
      this.musicGain.connect(limiter);

      this.isInitialized = true;

      // Preload common SFX
      await this.preloadSFX();

      return true;
    } catch (error) {
      console.warn('Audio initialization failed:', error);
      return false;
    }
  }

  private async preloadSFX(): Promise<void> {
    // Generate synthetic SFX for better performance
    const sfxTypes = ['beep', 'chime', 'click', 'error', 'success', 'door', 'stamp', 'dial', 'unlock'];
    
    for (const type of sfxTypes) {
      const buffer = await this.generateSFX(type);
      if (buffer) this.sfxBuffers.set(type, buffer);
    }
  }

  private async generateSFX(type: string): Promise<AudioBuffer | null> {
    if (!this.audioContext) return null;

    const sampleRate = this.audioContext.sampleRate;
    const duration = type === 'door' ? 1.5 : type === 'chime' ? 0.8 : 0.15;
    const buffer = this.audioContext.createBuffer(1, sampleRate * duration, sampleRate);
    const data = buffer.getChannelData(0);

    switch (type) {
      case 'beep':
        for (let i = 0; i < data.length; i++) {
          const t = i / sampleRate;
          const envelope = Math.exp(-t * 20);
          data[i] = Math.sin(2 * Math.PI * 880 * t) * envelope * 0.3;
        }
        break;

      case 'chime':
        for (let i = 0; i < data.length; i++) {
          const t = i / sampleRate;
          const envelope = Math.exp(-t * 3);
          data[i] = (
            Math.sin(2 * Math.PI * 523 * t) * 0.3 +
            Math.sin(2 * Math.PI * 659 * t) * 0.2 +
            Math.sin(2 * Math.PI * 784 * t) * 0.15
          ) * envelope;
        }
        break;

      case 'click':
        for (let i = 0; i < data.length; i++) {
          const t = i / sampleRate;
          const envelope = Math.exp(-t * 80);
          data[i] = (Math.random() * 2 - 1) * envelope * 0.4;
        }
        break;

      case 'dial':
        for (let i = 0; i < data.length; i++) {
          const t = i / sampleRate;
          const envelope = Math.exp(-t * 60);
          data[i] = (
            Math.sin(2 * Math.PI * 1200 * t) * 0.2 +
            (Math.random() * 2 - 1) * 0.3
          ) * envelope;
        }
        break;

      case 'unlock':
        for (let i = 0; i < data.length; i++) {
          const t = i / sampleRate;
          const envelope = Math.exp(-t * 15);
          data[i] = (
            Math.sin(2 * Math.PI * 440 * t) * 0.3 +
            Math.sin(2 * Math.PI * 554 * t) * 0.2 +
            (Math.random() * 2 - 1) * 0.2
          ) * envelope;
        }
        break;

      case 'error':
        for (let i = 0; i < data.length; i++) {
          const t = i / sampleRate;
          const envelope = Math.exp(-t * 25);
          data[i] = Math.sin(2 * Math.PI * 200 * t) * envelope * 0.4;
        }
        break;

      case 'success':
        for (let i = 0; i < data.length; i++) {
          const t = i / sampleRate;
          const freq = 440 + (t * 400);
          const envelope = Math.exp(-t * 8);
          data[i] = Math.sin(2 * Math.PI * freq * t) * envelope * 0.3;
        }
        break;

      case 'door':
        for (let i = 0; i < data.length; i++) {
          const t = i / sampleRate;
          const envelope = Math.sin(Math.PI * t / duration);
          data[i] = (
            Math.sin(2 * Math.PI * 80 * t) * 0.3 +
            (Math.random() * 2 - 1) * 0.1
          ) * envelope;
        }
        break;

      case 'stamp':
        for (let i = 0; i < data.length; i++) {
          const t = i / sampleRate;
          const envelope = Math.exp(-t * 40);
          data[i] = (
            (Math.random() * 2 - 1) * 0.5 +
            Math.sin(2 * Math.PI * 150 * t) * 0.3
          ) * envelope;
        }
        break;
    }

    return buffer;
  }

  playSFX(type: string): void {
    if (!this.isInitialized || !this.sfxEnabled || !this.audioContext || !this.sfxGain) return;

    const buffer = this.sfxBuffers.get(type);
    if (!buffer) return;

    const source = this.audioContext.createBufferSource();
    source.buffer = buffer;
    source.connect(this.sfxGain);
    source.start();
  }

  async preloadFlightAudio(url: string): Promise<void> {
    if (!this.audioContext) return;

    try {
      const response = await fetch(url);
      const arrayBuffer = await response.arrayBuffer();
      this.flightAudioBuffer = await this.audioContext.decodeAudioData(arrayBuffer);
    } catch (error) {
      console.warn('Failed to preload flight audio:', error);
    }
  }

  playFlightAudio(): void {
    if (!this.audioContext || !this.musicGain || !this.flightAudioBuffer) return;

    this.stopFlightAudio();

    this.currentFlightSource = this.audioContext.createBufferSource();
    this.currentFlightSource.buffer = this.flightAudioBuffer;
    this.currentFlightSource.connect(this.musicGain);
    this.currentFlightSource.start();
  }

  stopFlightAudio(fadeOut = true): void {
    if (!this.currentFlightSource || !this.musicGain || !this.audioContext) return;

    if (fadeOut) {
      this.musicGain.gain.linearRampToValueAtTime(0, this.audioContext.currentTime + 1);
      setTimeout(() => {
        this.currentFlightSource?.stop();
        this.currentFlightSource = null;
        if (this.musicGain) this.musicGain.gain.value = 0.5;
      }, 1000);
    } else {
      this.currentFlightSource.stop();
      this.currentFlightSource = null;
    }
  }

  toggleSFX(): boolean {
    this.sfxEnabled = !this.sfxEnabled;
    return this.sfxEnabled;
  }

  toggleAmbient(): boolean {
    this.ambientEnabled = !this.ambientEnabled;
    if (this.ambientGain) {
      this.ambientGain.gain.value = this.ambientEnabled ? 0.3 : 0;
    }
    return this.ambientEnabled;
  }

  get isSFXEnabled(): boolean {
    return this.sfxEnabled;
  }

  get isAmbientEnabled(): boolean {
    return this.ambientEnabled;
  }

  vibrate(pattern: number | number[] = 50): void {
    if ('vibrate' in navigator) {
      navigator.vibrate(pattern);
    }
  }
}

export const audioEngine = new AudioEngine();
