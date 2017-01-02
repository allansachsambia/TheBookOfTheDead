import { jamjar } from './jamjar';

// Create audio elements which will later play throughout the game.
export let createAudioElements = () => {
  (() => {
    let sounds = [
      'giggles', 'jump', 'buzzer', 'coin', 'flag', 'pizza', 'kill-shot',
      'lost', 'hurt', 'sword', 'ghost-death',
      'walking-on-grass', 'walking-on-water', 'walking-on-wood',
      'night-time', 'level01', 'intro-music'
    ]
    document.body.appendChild(jamjar.el('div', 'audio-wrap'));
    sounds.forEach((id) => {
      let el = jamjar.el('audio', `${id}`);
      document.querySelector('.audio-wrap').appendChild(el);
      let audioSource = document.createElement('source');
      audioSource.src =  './audio/' + id +  '.mp3';
      audioSource.type = 'audio/mpeg';
      el.appendChild(audioSource);
    });
  })();
}

export let backgroundMusic = (subLevelNumber) => {
  switch (subLevelNumber) {
    case 0: /* First level */
      jamjar.play('level01', 'loop');
      break;
  }
}

export let killBackgroundMusic = (subLevelNumber) => {
  switch (subLevelNumber) {
    case 0: /* First level */
      jamjar.pause('level01', 'loop');
      break;
    case 1: /* First level */
      jamjar.pause('level01', 'loop');
      break;
  }
}
