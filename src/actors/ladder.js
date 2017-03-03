import Vector from '../vector';
import { settings } from '../globals';

/**
 * Ladders that the player can climb.
 */
class Ladder {
  constructor(pos) {
    this.pos = pos.plus(new Vector(0.1, 0.1));
    this.size = new Vector(2, 33);
    this.type = 'ladder';
    this.actorType = 'item';
    this.coords = {
      left: this.pos.x,
      right: this.pos.x + this.size.x,
      top: this.pos.y,
      bottom: this.pos.y + this.size.y,
    };
  }

}

export default Ladder
