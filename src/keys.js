const trackKeys = () => {
  const keyPressed = Object.create(null);
  const handler = (e) => {
    const codes = {
      27: 'escape',
      32: 'spacebar',
      37: 'left',
      38: 'up',
      39: 'right',
      40: 'down',
      13: 'return',
    };
    if (Object.prototype.hasOwnProperty.call(codes, e.keyCode)) {
      const down = (e.type === 'keydown');
      keyPressed[codes[e.keyCode]] = down;
    }
  };
  window.addEventListener('keydown', handler);
  window.addEventListener('keyup', handler);
  return keyPressed;
};

export default trackKeys();
