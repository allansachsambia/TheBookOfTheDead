import { createAudioElements } from './audio';
import { displayIntroScreen, waitToStart } from './screens';

import Styles from './assets/stylesheets/style.css';

/* *****************************************************************************
A) The first thing you run when the application loads is 'init'.
B) The function createAudioElements is imported from the 'audio.js' module and
   it essentially just creates loads your applications audio elements by
   appending them into the dom in an audio wrapper.
C) It then creates an intro screen in the same way, by creating an intro screen
   element and appending it to the DOM.  It sets up the press enter
   button complete with flashing opacity as well as turning on the intro music.
D) It then waits for the user to press the return key and when the user does
   it fires the animate function from 'animate.js'.
****************************************************************************** */

const init = () => {
  createAudioElements();
  displayIntroScreen();
  waitToStart();
};

init();
