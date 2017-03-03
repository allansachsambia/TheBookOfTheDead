import Vector from '../vector';
import { settings } from '../globals';

/**
 * Invisible markers that represent a player passing a particular level.
 */
class Flag {

  constructor(pos) {
    this.pos = pos.plus(new Vector(0.1, 0.1));
    this.size = new Vector(2, 2);
    this.wobble = 2 * Math.PI * Math.random();
    this.type = 'flag';
    this.actorType = 'item';
  }

}

export default Flag;
