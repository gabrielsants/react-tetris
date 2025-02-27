import { Howl } from "howler";

const sounds = {
  move: new Howl({
    src: ['https://assets.codepen.io/21542/sfx-bloop.mp3'],
    volume: 0.3
  }),
  rotate: new Howl({
    src: ['https://assets.codepen.io/21542/sfx-pop.mp3'],
    volume: 0.3
  }),
  drop: new Howl({
    src: ['https://assets.codepen.io/21542/sfx-fall.mp3'],
    volume: 0.3
  }),
  clear: new Howl({
    src: ['https://assets.codepen.io/21542/sfx-powerup.mp3'],
    volume: 0.5
  }),
  gameOver: new Howl({
    src: ['https://assets.codepen.io/21542/sfx-lose.mp3'],
    volume: 0.5
  })
};

export function playSound(sound: keyof typeof sounds) {
  sounds[sound].play();
}