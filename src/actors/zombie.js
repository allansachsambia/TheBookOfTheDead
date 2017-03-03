import Vector from '../vector';
import Unstick from '../unstick';

/**
 * A zombie enemy.
 */
class Zombie {
  constructor(pos, type) {
    this.pos = pos;
    this.images = { walking: 'images/enemies/zombie/walking-01.png' };
    this.direction = 'right';
    this.zombieCounter = 0;
    this.size = new Vector(2.5, 4.5);
    this.unstick = new Unstick;
    this.lifeMeter = 5;
    this.type = 'zombie';
    this.actorType = 'enemy';
    this.action = { walking: true };
    this.speed = new Vector(3, 0);
    this.timers = { walking: 0 };
    this.coords = {
      left: this.pos.x,
      right: this.pos.x + this.size.x,
      top: this.pos.y,
      bottom: this.pos.y + this.size.y,
    };
    this.spritePos = { x: 0, y: 0 };
    this.spritePositions = {
      walking: [
        { x: 0, y: 0 },
        { x: 0, y: -75 },
        { x: 0, y: -150 },
        { x: 0, y: -225 },
        { x: 0, y: -300 },
      ],
    };
  }

  act(step, sublevel) {
    this.moveX(step, sublevel);
    this.moveY(step, sublevel);
  }

  imageSwap({ bounds, type }) {
    let counter = 0;
    let addZero = false;
    bounds.forEach((image) => {
      counter += 1;
      if (counter.toString().length === 1) {
        addZero = true;
      }
      if ((this.timers[type] >= image.lowerBound) &&
      (this.timers[type] <= image.upperBound)) {
        // -------------------------------------------------------
        // Temp shim for running
        if (type === 'walking') {
          if (counter === 1) { this.spritePos = this.spritePositions.walking[0]; }
          if (counter === 2) { this.spritePos = this.spritePositions.walking[1]; }
          if (counter === 3) { this.spritePos = this.spritePositions.walking[2]; }
          if (counter === 4) { this.spritePos = this.spritePositions.walking[3]; }
          if (counter === 5) { this.spritePos = this.spritePositions.walking[4]; }
        }
      }
    }, this);
  }

  moveX(step, sublevel) {
    const self = this;
    const newPos = this.pos;
    newPos.x = this.pos.x + this.speed.times(step).x;
    const xAxisObstacle = sublevel.obstacleAt(newPos, this.size, 'x');
    const actorsLeftPos = Math.floor(this.pos.x);
    const actorsRightPos = Math.ceil(this.pos.x + this.size.x);
    const actorsTopPos = Math.floor(this.pos.y);
    const actorsBottomPos = Math.ceil(this.pos.y + this.size.y);
    const leftSublevelEnd = actorsLeftPos < 0;
    const rightSublevelEnd = actorsRightPos > sublevel.width;
    const topSublevelEnd = actorsTopPos < 0;
    this.timers.walking += 1;
    this.timers.walking === 40 ?
      this.timers.walking = 0 :
      this.timers.walking = this.timers.walking;
    self.imageSwap({
      type: 'walking',
      bounds: [
        { lowerBound: 0, upperBound: 7 },
        { lowerBound: 8, upperBound: 15 },
        { lowerBound: 16, upperBound: 23 },
        { lowerBound: 24, upperBound: 31 },
        { lowerBound: 32, upperBound: 39 },
      ],
    });
    if ((sublevel.player.pos.y >= this.pos.y) &&  (sublevel.player.pos.y <= this.pos.y + 2))  {
      if ((sublevel.player.pos.x > this.pos.x - 200) || (sublevel.player.pos.x < this.pos.x + 200)) {
        let playersDirection;
        if (sublevel.player.pos.x < this.pos.x) {
          playersDirection = 'left';
        } else if (sublevel.player.pos.x > this.pos.x) {
          playersDirection = 'right';
        }
        let turnAround = false;
        if (playersDirection === 'left' && this.direction === 'right') {
          turnAround = true;
        } else if (playersDirection === 'right' &&  this.direction === 'left') {
          turnAround = true;
        } else {
          turnAround = false;
        }
        if (turnAround) {
          self.speed = this.speed.times(-1);
          this.direction === 'right' ? this.direction = 'left' : this.direction = 'right';
        }
      }
    }
    if (xAxisObstacle) {
      self.speed = this.speed.times(-1);
      this.direction === 'right' ? this.direction = 'left' : this.direction = 'right';
      // this.unstick.x(this, xAxisObstacle, actorsLeftPos);
    }
    this.pos = newPos;
  }

  moveY(step, sublevel) {
    this.speed.y = 20;
    const motion = new Vector(0, this.speed.y * step);
    const newPos = this.pos.plus(motion);
    const obstacle = sublevel.obstacleAt(newPos, this.size, 'y');
    if (!obstacle) { this.pos = newPos; }
  }
}

export default Zombie
