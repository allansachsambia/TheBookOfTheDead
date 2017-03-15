import Vector from '../vector';
import { settings } from '../globals';

/**
 * Portal to transition between sublevels.
 */
class Door {
  constructor(pos) {
    this.type = 'door';
    this.actorCategory = 'item';
    this.pos = pos.plus(new Vector(0.1, 0.1));
    this.size = new Vector(5.2, 10.3);
    this.innerSize = new Vector(5.2, 10.3);
    this.buffer = new Vector(0, 0);
    this.coords = {
      left: this.pos.x,
      right: this.pos.x + this.size.x,
      top: this.pos.y,
      bottom: this.pos.y + this.size.y,
    };
  }
}

export default Door;
