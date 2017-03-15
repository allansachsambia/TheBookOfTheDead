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
 * Lose Screen
 */

export const clearLoseScreen = () => {
  const loseScreenWrap = document.querySelector('.lose-screen-wrap');
  document.body.removeChild(loseScreenWrap);
};

export const restartOnLose = () => {
  console.log('????haaaaaah?');
  const handler = (e) => {
    const returnKey = 13;
    if (e.keyCode === returnKey) {
      clearLoseScreen();
      window.removeEventListener('keydown', handler);
      displayIntroScreen();
      waitToStart();
    }
  };
  window.addEventListener('keydown', handler);
};

export const displayLoseScreen = () => {
  const body = document.body;
  const loseScreenWrap = helpers.el('div', 'lose-screen-wrap');
  const loseScreen = helpers.el('div', 'lose-screen');
  body.appendChild(loseScreenWrap);
  loseScreenWrap.appendChild(loseScreen);
  audio.play('lost');
  restartOnLose();
};

/*
 * Win Screen
 */

export const clearWinScreen = () => {
  const winScreenWrap = document.querySelector('.win-screen-wrap');
  document.body.removeChild(winScreenWrap);
};

export const restartOnWin = () => {
  function handler(e) {
    const returnKey = 13;
    if (e.keyCode === returnKey) {
      clearWinScreen();
      window.removeEventListener('keydown', handler);
      displayIntroScreen();
      waitToStart();
    }
  }
  window.addEventListener('keydown', handler);
};

export const displayWinScreen = () => {
  const body = document.body;
  const winScreenWrap = helpers.el('div', 'win-screen-wrap');
  const winScreen = helpers.el('div', 'win-screen');
  const pressEnter = helpers.el('div', 'press-enter');
  body.appendChild(winScreenWrap).appendChild(winScreen);
  body.appendChild(winScreenWrap).appendChild(pressEnter);
  restartOnWin();
};
