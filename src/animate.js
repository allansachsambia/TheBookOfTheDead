import Sublevel from './sublevel';
import Status from './status';
import Render from './render';
import maps from './maps';
import { displayWinLoseScreen } from './screens';
import audio from './audio';
import { levelInfo } from './globals';

const status = new Status();

const resetStatus = () => {
  status.mapNumber += 1;
  status.condition = null;
  status.time = 10000;
  status.lifeMeter = 10;
};

const totalStatusReset = () => {
  status.lifeMeter = 10;
  status.name = 'Wanda'.toUpperCase();
  status.score = 0;
  status.mapNumber = 0;
  status.levelNumber = 0;
  status.time = 10000;
  status.condition = null;
};
/*
  I need to create a record of the current LEVEL (not sublevel) before it has,
  iterated, this will allow me to test if the player has passed the level or
  the sublevel.
*/

export const animate = (mapNumber = 0) => {
  const sublevel = new Sublevel(maps[mapNumber], mapNumber, status);
  // audio.playMusic(mapNumber);
  const render = new Render(sublevel, status);
  let prevTimeStamp = null;
  const forever = (timeStamp) => {
    let stop = false;
    if (prevTimeStamp) {
      let delta;
      if (document.hasFocus()) {
        delta = Math.min(timeStamp - prevTimeStamp, 100);
      } else {
        delta = 16;
      }
      window.onfocus = () => { delta = 16; };
      window.onload = () => { delta = 16; };
      window.onblur = () => { delta = 16; };
      const step = delta / 1000;
      sublevel.animate(step);
      render.drawAnimatedLayers();
      if (sublevel.status.condition !== null) {
        render.clearGame();
        if (sublevel.status.condition === 'lost') {
          audio.pauseMusic(mapNumber);
          totalStatusReset();
          displayWinLoseScreen('lose');
        } else if (sublevel.status.condition === 'won sublevel') {
          resetStatus();
          animate(mapNumber + 1);
        } else if (sublevel.status.condition === 'won') {
          audio.pauseMusic(mapNumber);
          totalStatusReset();
          displayWinLoseScreen('win');
        }
        stop = true;
      } else {
        stop = false;
      }
    }
    prevTimeStamp = timeStamp;
    if (!stop) { window.requestAnimationFrame(forever); }
  };
  window.requestAnimationFrame(forever);
};
