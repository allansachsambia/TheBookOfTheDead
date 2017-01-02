function trackKeys() {
  let keyPressed = Object.create(null);
  function handler(e) {
    let codes = {
      27: 'escape',
      32: 'spacebar',
      37: 'left',
      38: 'up',
      39: 'right',
      40: 'down',
      13: 'return'
    };
    if (codes.hasOwnProperty(e.keyCode)) {
      let down = (e.type === 'keydown');
      let up = (e.type === 'keyup');
      keyPressed[codes[e.keyCode]] = down;
    }
  }
  addEventListener('keydown', handler);
  addEventListener('keyup', handler);
  return keyPressed;
}
export default trackKeys();
