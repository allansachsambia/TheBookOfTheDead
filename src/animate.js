import Sublevel from './sublevel';
import Status from './status';
import Render from './render';
import maps from './maps';
import { displayWinLoseScreen } from './screens';
import audio from './audio';
import { levelInfo } from './globals';

const status = new Status();

export const animate = (mapNumber = 0) => {
  const sublevel = new Sublevel(maps[mapNumber], mapNumber, status);

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
          status.totalReset();
          displayWinLoseScreen('lose');
        } else if (sublevel.status.condition === 'won sublevel') {
          status.sublevelReset();
          animate(mapNumber + 1);
        } else if (sublevel.status.condition === 'won level') {
          status.levelReset();
          animate(mapNumber + 1);
        } else if (sublevel.status.condition === 'won') {
          status.totalReset();
          audio.pauseMusic(mapNumber);
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
