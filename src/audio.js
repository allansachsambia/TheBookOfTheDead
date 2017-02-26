import { jamjar } from './jamjar';

export const createAudioElements = () => {
  (() => {
    const sounds = [
      'giggles', 'jump', 'buzzer', 'coin', 'flag', 'pizza', 'kill-shot',
      'lost', 'hurt', 'sword', 'ghost-death',
      'walking-on-grass', 'walking-on-water', 'walking-on-wood',
      'night-time', 'level01', 'intro-music',
    ];
    document.body.appendChild(jamjar.el('div', 'audio-wrap'));
    sounds.forEach((id) => {
      const el = jamjar.el('audio', `${id}`);
      document.querySelector('.audio-wrap').appendChild(el);
      const audioSource = document.createElement('source');
      audioSource.src = `./audio/${id}.mp3`;
      audioSource.type = 'audio/mpeg';
      el.appendChild(audioSource);
    });
  })();
};

export const backgroundMusic = (subLevelNumber) => {
  switch (subLevelNumber) {
    case 0: /* First level */
      jamjar.play('level01', 'loop');
      break;
    default:
  }
};

export const killBackgroundMusic = (subLevelNumber) => {
  switch (subLevelNumber) {
    case 0: /* First level */
      jamjar.pause('level01', 'loop');
      break;
    case 1: /* First level */
      jamjar.pause('level01', 'loop');
      break;
    default:
  }
};
