import Vector from '../vector';
import audio from '../audio';
import keys from '../keys';

/**
 * Sword that the player can throw at enemies.
 */
class Sword {
  constructor(pos) {
    this.pos = pos;
    this.size = new Vector(2.5, 1);
    this.type = 'sword';
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
    this.pos = this.pos.plus(new Vector(-0.9, 2));
    if (sublevel.player.direction === 'right') {
      this.pos.x = this.pos.x + 6;
    }
    if (sublevel.player.direction === 'left') {
      this.pos.x = this.pos.x;
    }

    const otherActor = sublevel.actorAt(this);
    if (otherActor) {
      sublevel.swordTouchedActor(otherActor, this);
    }
  }

}

export default Sword;
