import { Howl } from 'howler';

interface SoundConfig {
  src: string[];
  volume: number;
  preload: boolean;
}

class AudioManager {
  private sounds: Record<string, Howl> = {};
  private music: Howl | null = null;
  private volume: number = 0.5;
  private soundEnabled: boolean = true;
  private musicEnabled: boolean = true;

  constructor() {
    this.initializeSounds();
  }

  private initializeSounds() {
    this.sounds = {
      move: new Howl({
        src: ['https://assets.codepen.io/21542/sfx-bloop.mp3'],
        volume: this.volume,
        preload: true,
      }),
      rotate: new Howl({
        src: ['https://assets.codepen.io/21542/sfx-pop.mp3'],
        volume: this.volume,
        preload: true,
      }),
      drop: new Howl({
        src: ['https://assets.codepen.io/21542/sfx-fall.mp3'],
        volume: this.volume,
        preload: true,
      }),
      line: new Howl({
        src: ['https://assets.codepen.io/21542/sfx-powerup.mp3'],
        volume: this.volume,
        preload: true,
      }),
      gameOver: new Howl({
        src: ['https://assets.codepen.io/21542/sfx-lose.mp3'],
        volume: this.volume,
        preload: true,
      }),
      reset: new Howl({
        src: ['https://assets.codepen.io/21542/sfx-bloop.mp3'],
        volume: this.volume,
        preload: true,
      }),
    };

    this.music = new Howl({
      src: ['https://assets.codepen.io/21542/sfx-background.mp3'],
      volume: this.volume * 0.3,
      loop: true,
      preload: true,
    });
  }

  setVolume(volume: number) {
    this.volume = Math.max(0, Math.min(1, volume));
    
    Object.values(this.sounds).forEach(sound => {
      sound.volume(this.volume);
    });
    
    if (this.music) {
      this.music.volume(this.volume * 0.3);
    }
  }

  getVolume(): number {
    return this.volume;
  }

  toggleSound(): boolean {
    this.soundEnabled = !this.soundEnabled;
    return this.soundEnabled;
  }

  toggleMusic(): boolean {
    this.musicEnabled = !this.musicEnabled;
    
    if (this.music) {
      if (this.musicEnabled) {
        this.music.play();
      } else {
        this.music.stop();
      }
    }
    
    return this.musicEnabled;
  }

  playSound(soundName: string) {
    if (!this.soundEnabled || !this.sounds[soundName]) return;
    
    try {
      this.sounds[soundName].play();
    } catch (error) {
      console.warn('Failed to play sound:', soundName, error);
    }
  }

  playMusic() {
    if (!this.musicEnabled || !this.music) return;
    
    try {
      this.music.play();
    } catch (error) {
      console.warn('Failed to play music:', error);
    }
  }

  stopMusic() {
    if (this.music) {
      this.music.stop();
    }
  }

  vibrate(pattern?: number | number[]) {
    if ('vibrate' in navigator) {
      try {
        navigator.vibrate(pattern || 100);
      } catch (error) {
        console.warn('Failed to vibrate:', error);
      }
    }
  }

  destroy() {
    Object.values(this.sounds).forEach(sound => {
      sound.unload();
    });
    
    if (this.music) {
      this.music.unload();
    }
  }
}

const audioManager = new AudioManager();

export const playSound = (sound: string) => audioManager.playSound(sound);
export const playMusic = () => audioManager.playMusic();
export const stopMusic = () => audioManager.stopMusic();
export const setVolume = (volume: number) => audioManager.setVolume(volume);
export const getVolume = () => audioManager.getVolume();
export const toggleSound = () => audioManager.toggleSound();
export const toggleMusic = () => audioManager.toggleMusic();
export const vibrate = (pattern?: number | number[]) => audioManager.vibrate(pattern);