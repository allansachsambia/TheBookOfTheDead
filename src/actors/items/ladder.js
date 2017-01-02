import Vector from '../../vector';
import { settings } from '../../globals';

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
      bottom: this.pos.y + this.size.y
    }
  }

  act(step) { /* Leave this blank. */ }

}

export default Ladder
