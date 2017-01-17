import { animate } from './animate';
import { jamjar } from './jamjar';

/*
 * Intro Screen
 */

export const displayIntroScreen = () => {
  const body = document.body;
  const introScreenWrap = jamjar.el('div', 'intro-screen-wrap');
  const introScreen = jamjar.el('div', 'intro-screen');
  const pressEnter = jamjar.el('div', 'press-enter');
  body.appendChild(introScreenWrap).appendChild(introScreen);
  body.appendChild(introScreenWrap).appendChild(pressEnter);
  setInterval(() => {
    switch (pressEnter.style.opacity) {
      case '':
        pressEnter.style.opacity = '0';
        break;
      case '0':
        pressEnter.style.opacity = '1';
        break;
      case '1':
        pressEnter.style.opacity = '0';
        break;
      default:
    }
  }, 600);
  jamjar.play('intro-music', 'loop');
}

export let clearIntroScreen = () => {
  let introScreenWrap = document.querySelector('.intro-screen-wrap');
  document.body.removeChild(introScreenWrap);
  jamjar.pause('intro-music');
}

export let waitToStart = () => {
  function handler (e) {
    let returnKey = 13;
    if (e.keyCode === returnKey) {
      clearIntroScreen();
      animate();
      removeEventListener("keydown", handler);
    }
  }
  addEventListener('keydown', handler);
}

/*
 * Lose Screen
 */

export let displayLoseScreen = () => {
  let body = document.body;
  let loseScreenWrap = jamjar.el('div', 'lose-screen-wrap');
  let loseScreen = jamjar.el('div', 'lose-screen');
  body.appendChild(loseScreenWrap);
  loseScreenWrap.appendChild(loseScreen);
  jamjar.play('lost');
  restartOnLose()
}

export let clearLoseScreen = () => {
  let loseScreenWrap = document.querySelector('.lose-screen-wrap');
  document.body.removeChild(loseScreenWrap);
}

export let restartOnLose = () => {
  function handler (e) {
    let returnKey = 13;
    if (e.keyCode === returnKey) {
      clearLoseScreen();
      removeEventListener("keydown", handler);
      displayIntroScreen();
      waitToStart();
    }
  }
  addEventListener('keydown', handler);
}

/*
 * Win Screen
 */

export let displayWinScreen = () => {
  let body = document.body;
  let winScreenWrap = jamjar.el('div', 'win-screen-wrap');
  let winScreen = jamjar.el('div', 'win-screen');
  let pressEnter = jamjar.el('div', 'press-enter');
  body.appendChild(winScreenWrap).appendChild(winScreen);
  body.appendChild(winScreenWrap).appendChild(pressEnter);
  restartOnWin();
}

export let restartOnWin = () => {
  function handler (e) {
    let returnKey = 13;
    if (e.keyCode === returnKey) {
      clearWinScreen();
      removeEventListener("keydown", handler);
      displayIntroScreen();
      waitToStart();
    }
  }
  addEventListener('keydown', handler);
}

export let clearWinScreen = () => {
  let winScreenWrap = document.querySelector('.win-screen-wrap');
  document.body.removeChild(winScreenWrap);
}
