import Vector from '../vector';
import { settings } from '../globals';

/**
 * Pizza item that restores the players life meter.
 */
class Pizza {

  constructor(pos) {
    this.type = 'pizza';
    this.actorCategory = 'item';
    this.pos = pos.plus(new Vector(0.1, 0.1));
    this.size = new Vector(1, 1);
    this.innerSize = new Vector(1, 1);
    this.buffer = new Vector(0, 0);
    this.wobble = 2 * Math.PI * Math.random();
    this.coords = {
      left: this.pos.x,
      right: this.pos.x + this.size.x,
      top: this.pos.y,
      bottom: this.pos.y + this.size.y,
    };
  }

  act(step) {
    this.wobble += step * settings.wobbleSpeed;
    const wobblePos = Math.sin(this.wobble) * settings.wobbleDist;
    this.pos = this.pos.plus(new Vector(0, wobblePos));
  }

}

export default Pizza;
