import Vector from '../vector';
import { settings } from '../globals';

/**
 * Invisible markers that represent a player passing a particular level.
 */
class Flag {

  constructor(pos) {
    this.type = 'flag';
    this.actorCategory = 'item';
    this.pos = pos.plus(new Vector(0.1, 0.1));
    this.size = new Vector(2, 2);
    this.innerSize = new Vector(2, 2);
    this.buffer = new Vector(0, 0);
    this.coords = {
      left: this.pos.x,
      right: this.pos.x + this.size.x,
      top: this.pos.y,
      bottom: this.pos.y + this.size.y,
    };
  }

}

export default Flag;