import _ from 'lodash';

export let jamjar = {

  // Creates elements with a className if specified.
  el(name, className) {
    let element = document.createElement(name);
    if (className) {element.className = className }
    return element;
  },

  // Reorders an array.
  move(arr, remove, add) {
    let cut = arr.splice(remove, 1);
    arr.splice(add, 0, cut[0]);
    return arr;
  },

  // Stylizes an element all at once using object literal syntax.
  css(el, obj) {
    _.forOwn(obj, (val, key) => { el.style[key] = val; });
  },

  // Loads audio and sets it to loop if specified.
  play(name, loop) {
    let el = document.querySelector(`.${name}`);
    el.autoplay = true;
    el.loop = (loop) ? true : false;
    el.load();
    return el;
  },

  // Pauses audio
  pause(name) {
    let el = document.querySelector(`.${name}`);
    el.pause();
  }

}
