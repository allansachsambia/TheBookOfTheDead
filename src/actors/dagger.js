import Vector from '../vector';
import audio from '../audio';
import keys from '../keys';

/**
 * Dagger that the player can throw at enemies.
 */
class Dagger {
  constructor(pos) {
    this.pos = pos;
    this.size = new Vector(3, 1);
    this.type = 'dagger';
    this.direction = null;
    this.speed = new Vector(0.7, 0);
    this.throwDirection = null;
    this.coords = {
      left: this.pos.x,
      right: this.pos.x + this.size.x,
      top: this.pos.y,
      bottom: this.pos.y + this.size.y,
    };
  }

  act(step, sublevel) {
    if (this.throwDirection === null) {
      if (sublevel.player.direction === 'right') {
        this.throwDirection = 'right';
      } else {
        this.throwDirection = 'left';
      }
    }
    const otherActor = sublevel.actorAt(this);
    if (otherActor) {
      sublevel.daggerTouchedActor(otherActor, this);
    }
    if (this.throwDirection === 'right') {
      this.direction = 'right';
      const newPos = this.pos.plus(new Vector(0.9, 0));
      this.pos = newPos;
    } else {
      this.direction = 'left';
      const newPos = this.pos.plus(new Vector(-0.9, 0));
      this.pos = newPos;
    }
  }

}

export default Dagger;
