import { animate } from './animate';
import audio from './audio';
import helpers from './helpers';

/*
 * Intro Screen
 */

export const displayIntroScreen = () => {
  const introScreenWrap = helpers.el('div', 'intro-screen-wrap');
  const introScreen = helpers.el('div', 'intro-screen');
  const pressEnter = helpers.el('div', 'press-enter');
  document.body.appendChild(introScreenWrap).appendChild(introScreen);
  document.body.appendChild(introScreenWrap).appendChild(pressEnter);
  setInterval(() => {
    switch (pressEnter.style.opacity) {
      case '0':
        pressEnter.style.opacity = '1';
        break;
      default:
        pressEnter.style.opacity = '0';
    }
  }, 600);
  // audio.playIntroMusic();
};

export const clearIntroScreen = () => {
  const introScreenWrap = document.querySelector('.intro-screen-wrap');
  document.body.removeChild(introScreenWrap);
  audio.pauseIntroMusic();
};

export const waitToStart = () => {
  const handler = (e) => {
    const returnKey = 13;
    if (e.keyCode === returnKey) {
      clearIntroScreen();
      animate();
      window.removeEventListener('keydown', handler);
    }
  };
  window.addEventListener('keydown', handler);
};

/*
 * Display Win Lose Screen
 */

export const displayWinLoseScreen = (status) => {
  const body = document.body;
  const screenWrap = helpers.el('div', `${status}-screen-wrap`);
  const screen = helpers.el('div', `${status}-screen`);
  body.appendChild(screenWrap).appendChild(screen);
  audio.play(status);
  clearAndRestart(status);
};

/*
 * Clear and Restart
 */

export const clearAndRestart = (status) => {
  const handler = (e) => {
    const returnKey = 13;
    if (e.keyCode === returnKey) {
      document.body.removeChild(document.querySelector(`.${status}-screen-wrap`));
      window.removeEventListener('keydown', handler);
      displayIntroScreen();
      waitToStart();
    }
  };
  window.addEventListener('keydown', handler);
};
