import audio from './audio';
import { displayIntroScreen, waitToStart } from './screens';
import Styles from './../styles/style.css';

const checkTouch = () => {
  const el = document.getElementsByTagName('html')[0];
  return (` ${el.className} `).indexOf(' no-touch ') > -1;
};

const init = () => {
  const noTouch = checkTouch();
  if (checkTouch()) {
    audio.preloadAudioElements();
    displayIntroScreen();
    waitToStart();
  } else {
    // this.img = document.createElement("img");
    // this.img.src = '...';
    // const el = document.body;
    // el.appendChild(this.img)
  }
};

init();
