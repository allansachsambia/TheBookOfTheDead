import Vector from '../../vector';

class Sword {
  constructor(pos) {
    let self = this;
    this.pos = pos;
    this.size = new Vector(3, 1);
    this.type = 'sword';
    this.direction = null;
    this.speed = new Vector(0.7, 0);
    this.throwDirection = null;
    this.coords = {
      left: this.pos.x,
      right: this.pos.x + this.size.x,
      top: this.pos.y,
      bottom: this.pos.y + this.size.y
    };
  }

  act(step, level) {
    if (this.throwDirection === null) {
      if (level.player.direction === 'right') {
        this.throwDirection = 'right';
      } else {
        this.throwDirection = 'left';
      }
    }
    let otherActor = level.actorAt(this);
    if (otherActor) { level.swordTouchedActor(otherActor, this); }
    if (this.throwDirection === 'right') {
      this.direction = 'right';
      let newPos = this.pos.plus(new Vector(0.9, 0))
      this.pos = newPos;
    } else {
      this.direction = 'left';
      let newPos = this.pos.plus(new Vector(-0.9, 0))
      this.pos = newPos;
    }
  }
}

export default Sword
