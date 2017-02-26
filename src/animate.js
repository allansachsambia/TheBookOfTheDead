import Sublevel from './sublevel';
import Status from './status';
import Render from './render/render';
import { maps } from './maps/maps';
import { displayWinScreen, displayLoseScreen } from './screens';
import { backgroundMusic, killBackgroundMusic } from './audio';

const status = new Status();

const resetStatus = () => {
  status.sublevelNumber += 1;
  status.condition = null;
  status.time = 10000;
  status.lifeMeter = 10;
};

const totalStatusReset = () => {
  status.lifeMeter = 10;
  status.name = 'Wanda'.toUpperCase();
  status.score = 0;
  status.sublevelNumber = 0;
  status.levelNumber = 0;
  status.time = 10000;
  status.condition = null;
};

export const animate = (sublevelNumber = 0) => {
  const sublevel = new Sublevel(maps[sublevelNumber], sublevelNumber, status);
  backgroundMusic(sublevelNumber);
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
      if (sublevel.isFinished()) {
        render.clearGame();
        if (sublevel.status.condition === 'lost') {
          killBackgroundMusic(sublevelNumber);
          totalStatusReset();
          displayLoseScreen();
        } else if (sublevelNumber < maps.length - 1) {
          resetStatus();
          animate(sublevelNumber + 1);
        } else if (sublevel.status.condition === 'won') {
          killBackgroundMusic(sublevelNumber);
          totalStatusReset();
          displayWinScreen();
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
