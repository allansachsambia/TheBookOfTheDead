import _ from 'lodash';
import helpers from './helpers';
import keys from './keys';

const audio = {

  sounds: {
    music: ['night-time', 'level01', 'intro-music'],
    effects: {
      lost: ['win', 'lose'],
      touch: ['hurt', 'pizza', 'soda', 'kill-shot'],
      items: ['dagger', 'sword'],
      walkingOn: ['grass', 'grassyhill', 'water', 'wood'],
    },
  },

  preloadAudioElements() {
    document.body.appendChild(helpers.el('div', 'audio-wrap'));
    const createAudioElements = (arr) => {
      arr.forEach((id) => {
        const el = helpers.el('audio', `${id}`);
        document.querySelector('.audio-wrap').appendChild(el);
        const audioSource = document.createElement('source');
        audioSource.src = `./audio/${id}.mp3`;
        audioSource.type = 'audio/mpeg';
        el.appendChild(audioSource);
      });
    };
    const music = this.sounds.music;
    const effects = _.flatten(_.values(this.sounds.effects));
    createAudioElements(music);
    createAudioElements(effects);
  },

  play(name, loop) {
    const el = document.querySelector(`.${name}`);
    el.autoplay = true;
    el.loop = loop;
    el.load();
    return el;
  },

  pause(name) {
    const el = document.querySelector(`.${name}`);
    el.pause();
  },

  playIntroMusic() {
    this.play('intro-music', 'loop');
  },

  pauseIntroMusic() {
    this.pause('intro-music', 'loop');
  },

  playMusic(mapNumber) {
    switch (mapNumber) {
      case 0: /* First level */
        this.play('level01', 'loop');
        break;
      default:
    }
  },

  pauseMusic(mapNumber) {
    switch (mapNumber) {
      case 0: /* First level */
        this.pause('level01', 'loop');
        break;
      case 1: /* First level */
        this.pause('level01', 'loop');
        break;
      default:
    }
  },

  walkingSoundsStore: [],

  handleWalkingOnSounds(obstacle) {
    const pushAndPlayWalkingSound = ({ type }) => {
      this.walkingSoundsStore.push(type);
      const audioEl = document.querySelector(`.${type}`);
      if (audioEl.paused) {
        audioEl.volume = 0.4;
        audioEl.currentTime = 0;
        audioEl.loop = true;
        audioEl.play();
      }
    };
    const resetAndPauseWalkingSound = (sound) => {
      this.pause(sound, 'loop');
      this.walkingSoundsStore = [];
    };
    if (obstacle && (keys.right || keys.left)) {
      if (this.sounds.effects.walkingOn.indexOf(obstacle.type) > -1) {
        if (this.walkingSoundsStore.length > 0) {
          if (this.walkingSoundsStore.indexOf(obstacle.type) === -1) {
            resetAndPauseWalkingSound(this.walkingSoundsStore[0]);
          }
        }
        if (this.walkingSoundsStore.length === 0) {
          pushAndPlayWalkingSound(obstacle);
        }
      }
    } else {
      this.sounds.effects.walkingOn.forEach((sound) => {
        resetAndPauseWalkingSound(sound);
      });
    }
  },
};

export default audio;
