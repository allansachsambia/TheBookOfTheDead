import { createAudioElements } from './audio';
import { displayIntroScreen, waitToStart } from './screens';

// Mobile Styles.
import Styles from './assets/stylesheets/style.css';

function init(){
  createAudioElements();
  displayIntroScreen();
  waitToStart();
}

init();
