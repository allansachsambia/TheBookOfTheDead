import Vector from "../vector";
import { settings } from "../globals";

class Soda {
  constructor(pos) {
    this.type = "soda";
    this.actorCategory = "item";
    this.energyRestoration = 1;
    this.pos = pos.plus(new Vector(0.1, 0.1));
    this.size = new Vector(0.5, 1);
    this.innerSize = new Vector(0.5, 1);
    this.buffer = new Vector(0, 0);
    this.wobblePressure = 2 * Math.PI * Math.random();
    this.coords = {
      left: this.pos.x,
      right: this.pos.x + this.size.x,
      top: this.pos.y,
      bottom: this.pos.y + this.size.y
    };
  }

  act(step) {
    this.wobble(step);
  }

  wobble(step) {
    this.wobblePressure += step * settings.wobbleSpeed;
    const wobblePos = Math.sin(this.wobblePressure) * settings.wobbleDist;
    this.pos = this.pos.plus(new Vector(0, wobblePos));
  }
}

export default Soda;
