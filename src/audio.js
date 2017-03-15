import _ from 'lodash';
import helpers from './helpers';
import keys from './keys';

/**
 * Contains almost all logic pertaining to audio in the app.
 */
const audio = {

  sounds: {
    music: ['night-time', 'level01', 'intro-music'],
    effects: {
      lost: ['lost'],
      touch: ['hurt', 'flag', 'pizza', 'soda', 'kill-shot'],
      items: ['dagger', 'sword'],
      walkingOn: ['grass', 'water', 'wood'],
    },
  },

  /**
   * An audio preloader that creates and appends nested audio elements as
   * children of an audio wrapper element which is itself appended to the DOM.
   */
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

  /**
   * A helper that plays audio elements appended to the DOM, with an option for
   * looping.
   */
  play(name, loop) {
    const el = document.querySelector(`.${name}`);
    el.autoplay = true;
    el.loop = loop;
    el.load();
    return el;
  },

  /**
   * A helper that pauses audio elements appended to the DOM.
   */
  pause(name) {
    const el = document.querySelector(`.${name}`);
    el.pause();
  },

  /**
   * Specifically plays the intro music.
   */
  playIntroMusic() {
    this.play('intro-music', 'loop');
  },

  /**
   * Specifically pauses the intro music.
   */
  pauseIntroMusic() {
    this.pause('intro-music', 'loop');
  },

  /**
   * Switchboard for playing background music.
   */
  playMusic(mapNumber) {
    switch (mapNumber) {
      case 0: /* First level */
        this.play('level01', 'loop');
        break;
      default:
    }
  },

  /**
   * Switchboard for pausing background music.
   */
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
