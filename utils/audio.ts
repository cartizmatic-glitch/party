class AudioSynth {
  private ctx: AudioContext | null = null;
  private gain: GainNode | null = null;
  private musicInterval: any = null;
  private isMuted: boolean = false;
  private bpm: number = 130; // Faster tempo

  constructor() {
    try {
      // @ts-ignore
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      this.ctx = new AudioCtx();
      this.gain = this.ctx.createGain();
      this.gain.connect(this.ctx.destination);
    } catch (e) {
      console.warn('Web Audio API not supported');
    }
  }

  private ensureContext() {
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  toggleMute(mute: boolean) {
      this.isMuted = mute;
      if (mute) {
          this.stopMusic();
      } else {
          // Restart music if we are in a state where it should be playing is handled by App.tsx
      }
  }

  playTone(freq: number, type: OscillatorType, duration: number, volume: number = 0.1) {
    if (!this.ctx || !this.gain || this.isMuted) return;
    this.ensureContext();

    const osc = this.ctx.createOscillator();
    const tempGain = this.ctx.createGain();
    
    osc.type = type;
    osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
    
    tempGain.gain.setValueAtTime(volume, this.ctx.currentTime);
    tempGain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + duration);

    osc.connect(tempGain);
    tempGain.connect(this.gain);
    
    osc.start();
    osc.stop(this.ctx.currentTime + duration);
  }

  playClick() {
    this.playTone(800, 'sine', 0.1, 0.05);
  }

  playSuccess() {
    this.playTone(600, 'sine', 0.1, 0.1);
    setTimeout(() => this.playTone(800, 'sine', 0.2, 0.1), 100);
  }

  playFailure() {
    this.playTone(300, 'sawtooth', 0.3, 0.1);
    setTimeout(() => this.playTone(200, 'sawtooth', 0.4, 0.1), 150);
  }

  playWin() {
    this.stopMusic();
    [400, 500, 600, 800, 1000].forEach((freq, i) => {
        setTimeout(() => this.playTone(freq, 'square', 0.2, 0.1), i * 120);
    });
  }

  stopMusic() {
      if (this.musicInterval) {
          clearInterval(this.musicInterval);
          this.musicInterval = null;
      }
  }

  playBgMusicStart() {
      if (this.isMuted || this.musicInterval) return;
      this.ensureContext();
      
      let step = 0;
      const intervalTime = (60 / this.bpm) * 1000 / 4; // 16th notes

      // Bassline pattern (Cyberpunk/Arcade style)
      // 0 = rest, others = freq
      const bassPattern = [
          110, 0, 110, 0,  110, 0, 110, 0, 
          130, 0, 130, 0,  98,  0, 98,  0
      ];

      this.musicInterval = setInterval(() => {
          if (!this.ctx) return;
          const t = this.ctx.currentTime;
          
          // 1. Kick Drum (Every beat)
          if (step % 4 === 0) {
              const osc = this.ctx.createOscillator();
              const gain = this.ctx.createGain();
              osc.connect(gain);
              gain.connect(this.gain!);
              
              osc.frequency.setValueAtTime(150, t);
              osc.frequency.exponentialRampToValueAtTime(0.01, t + 0.2);
              
              gain.gain.setValueAtTime(0.5, t);
              gain.gain.exponentialRampToValueAtTime(0.001, t + 0.2);
              
              osc.start(t);
              osc.stop(t + 0.2);
          }

          // 2. Snare / Clap (Every other beat)
          if (step % 8 === 4) {
              const osc = this.ctx.createOscillator();
              const gain = this.ctx.createGain();
              osc.type = 'triangle';
              osc.connect(gain);
              gain.connect(this.gain!);
              
              // Noise-like burst
              osc.frequency.setValueAtTime(800, t);
              osc.frequency.linearRampToValueAtTime(100, t + 0.1);
              
              gain.gain.setValueAtTime(0.2, t);
              gain.gain.exponentialRampToValueAtTime(0.001, t + 0.1);
              
              osc.start(t);
              osc.stop(t + 0.1);
          }

          // 3. Hi-hat (Every 16th note, louder on off-beats)
          if (step % 2 === 0) {
              this.playTone(3000, 'square', 0.03, step % 4 === 2 ? 0.05 : 0.02);
          }

          // 4. Bass Line
          const bassNote = bassPattern[step % 16];
          if (bassNote > 0) {
              const osc = this.ctx.createOscillator();
              const gain = this.ctx.createGain();
              osc.type = 'sawtooth';
              osc.connect(gain);
              gain.connect(this.gain!);
              
              osc.frequency.setValueAtTime(bassNote, t);
              gain.gain.setValueAtTime(0.15, t);
              gain.gain.linearRampToValueAtTime(0, t + 0.1); // Short punchy bass
              
              osc.start(t);
              osc.stop(t + 0.1);
          }

          step++;
      }, intervalTime); 
  }
}

export const sfx = new AudioSynth();
