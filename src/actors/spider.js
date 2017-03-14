import Vector from '../vector';

/**
 * A spider enemy.
 */
class Spider {
  constructor(pos, type) {
    this.type = 'spider';
    this.actorCategory = 'enemy';
    this.pos = pos;
    this.size = new Vector(1.5, 1.3);
    this.innerSize = new Vector(1.5, 1.3);
    this.buffer = new Vector(0, 0);
    if (type === '#') {
      this.speed = new Vector(0, 5);
    } else if (type === '*') {
      this.speed = new Vector(0, 2);
      this.repeatPos = pos;
    }
    this.coords = {
      left: this.pos.x,
      right: this.pos.x + this.size.x,
      top: this.pos.y,
      bottom: this.pos.y + this.size.y,
    };
  }
  act(step, sublevel) {
    const newPos = this.pos.plus(this.speed.times(step));
    if (!sublevel.obstacleAt(newPos, this.size)) {
      this.pos = newPos;
    } else if (this.repeatPos) {
      this.pos = this.repeatPos;
    } else {
      this.speed = this.speed.times(-1);
    }
  }
}

export default Spider
