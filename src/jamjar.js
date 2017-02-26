import _ from 'lodash';

export let jamjar = {

  // Creates elements.
  el(name, className, id) {
    const element = document.createElement(name);
    if (className) { element.className = className; }
    if (id) { element.id = id; }
    return element;
  },

  // Reorders an array.
  move(arr, remove, add) {
    const cut = arr.splice(remove, 1);
    arr.splice(add, 0, cut[0]);
    return arr;
  },

  // Stylizes an element all at once using object literal syntax.
  css(el, obj) {
    _.forOwn(obj, (val, key) => { el.style[key] = val; });
  },

  // Loads audio and sets it to loop if specified.
  play(name, loop) {
    const el = document.querySelector(`.${name}`);
    el.autoplay = true;
    el.loop = loop;
    el.load();
    return el;
  },

  // Pauses audio
  pause(name) {
    const el = document.querySelector(`.${name}`);
    el.pause();
  },

};
