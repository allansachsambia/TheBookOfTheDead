import audio from './audio';
import { displayIntroScreen, waitToStart } from './screens';

import Styles from './../styles/style.css';

const init = () => {
  audio.preloadAudioElements();
  displayIntroScreen();
  waitToStart();
};

init();
