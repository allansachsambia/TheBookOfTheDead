/**
 * trackKeys:
 * This function returns an object literal that shows whether the user has
 * pressed or released specific keyboard keys.  The following describes how
 * this works:
 *
 * 1. Create an object with absolutely no properties named keyPressed.
 * 2. When the user presses or releases a key, fire the 'handler' function.
 * 3. Create an object named 'codes' with keycodes mapped to text defining the
 *    keycodes.
 * 4. Check the codes object to see if any of the keys on it are one in the
 *    same with the key the user pressed ot released.
 * 5. If the key being pressed set a constant named 'down' to true, otherwise
 *    if it's being released this will default to false.
 * 6. Attach the definition of the keycode being pressed, along with the true
 *    or false value to a new object attached to the keypressed object.
 */
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
