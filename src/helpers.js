export default {

  el(name, className, id) {
    const element = document.createElement(name);
    if (className) { element.className = className; }
    if (id) { element.id = id; }
    return element;
  },

  move(arr, remove, add) {
    const cut = arr.splice(remove, 1);
    arr.splice(add, 0, cut[0]);
    return arr;
  },

  pad(num, size) {
    const s = `000000000${num}`;
    return s.substr(s.length - size);
  },

};
