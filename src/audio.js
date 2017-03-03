import _ from 'lodash';
import helpers from './helpers';
import keys from './keys';

/**
 * Contains almost all logic pertaining to any and all audio in the app.
 */
const audio = {

  sounds: {
    music: ['night-time', 'level01', 'intro-music'],
    effects: {
      lost: ['lost'],
      touch: ['hurt', 'flag', 'pizza', 'kill-shot'],
      items: ['sword'],
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
    // this.play('intro-music', 'loop');
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
        // this.play('level01', 'loop');
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
        // this.pause('level01', 'loop');
        break;
      case 1: /* First level */
        // this.pause('level01', 'loop');
        break;
      default:
    }
  },

  /**
   * A store that keeps track of the current walking sound effect so that if
   * the player walks over another obstacle with a walking effect the app can
   * pause the sound effect of the previous obstacle they are no longer
   * walking on.
   */
  walkingSoundsStore: [],

  /**
   * A function that checks if the player is walking on an obstacle and pressing
   * the right or left arrow keys.  It then checks if what the player is walking
   * on should summon a walking sound effect.  It does this by referencing the
   * whitelist of walking sound effects in this.sounds.effects.walkingOn.  Then,
   * it checks if there is anything present in the walkingSoundsStore at all,
   * which means the player is currently walking through obstacles with sound
   * effects or moving from one obstacle with sound effects to another.  Then
   * it checks if the current obstacle type the user is walking on is currently
   * not in the store.  If it isn't, this means you are transitioning from one
   * obstacle type with a walking sound directly to the next and, as such, the
   * element with the previous walking sound is instructed to turn of and the
   * walkingSoundsStore is reset to an empty array via the
   * resetAndPauseWalkingSound helper function.  Then the code checks to see if
   * the walkingSoundsStore is empty via it's length and if it is this means it
   * has either just been wiped out and the previous obstacles sound has been
   * dealt with or it's the first instance of the player touching an obstacle
   * with a sound.  Either way, it fires the pushAndPlayWalkingSound helper
   * function that pushes the sound to the walkingSoundsStore, then grabs the
   * audio element in question and checks that it is not playing (by checking if
   * it is paused) and if it is not already playing it sets a volume and time
   * to play the audio.  And finally, if the user leases the left or right key
   * or there is no obstacle that requires sound it fires the
   * resetAndPauseWalkingSound helper function which wipes out the
   * walkingSoundsStore and pauses the current sound that is playing.
   */
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
