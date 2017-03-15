import Vector from '../vector';
import Unstick from '../unstick';
import helpers from '../helpers';

/**
 * A zombie enemy.
 */
class Zombie {
  constructor(pos, type) {
    this.type = 'zombie';
    this.actorCategory = 'enemy';
    this.size = new Vector(8, 5);
    this.innerSize = new Vector(1, 3);
    this.buffer = new Vector(3, 0);
    this.motion = new Vector(0, 0);
    this.obstacle = new Vector(0, 0);
    this.lifeMeter = 1;
    this.pos = pos.plus(new Vector(0, -0.5));
    this.newPos = null;
    this.coords = {
      left: this.pos.x,
      right: this.pos.x + this.size.x,
      top: this.pos.y,
      bottom: this.pos.y + this.size.y,
    };
    this.direction = 'right';
    this.damaged = false;
    this.damageTimer = 0;
    this.speed = new Vector(3, 0);
    this.actionType = null;
    this.spriteNumber = null;
    this.spriteUpperBound = null;
    this.timer = Math.floor(Math.random() * 3) + 1;
    this.variants = 2;
    this.variant = null;
    this.unstick = new Unstick();
  }

  /* ==== ACT ===============================================================
     ======================================================================== */

  act(step, sublevel) {
    this.setVariant();
    this.setAction();
    this.resetCoords();
    this.setTimer();
    this.handleGravity(step);
    this.handleYObstacles(step, sublevel);
    this.handleXObstacles(step, sublevel);
    this.walk(step, sublevel);
    this.setSize();
  }

  /* ==== HELPERS ===========================================================
     ======================================================================== */

  imageSwap(type, upperBound) {
    const typeNotSet = this.actionType !== type;
    const lastSprite = this.spriteNumber >= helpers.pad(upperBound, 3);
    if (this.timer === 0) {
      if (typeNotSet || lastSprite) {
        this.spriteNumber = helpers.pad(1, 3);
      } else {
        this.spriteNumber = helpers.pad(parseInt(this.spriteNumber, 10) + 1, 3);
      }
    }
  }

  setSize() { this.size = new Vector(8, 5); }

  /* ==== SETTINGS AND CONDITIONS ===========================================
     ======================================================================== */

 setVariant() {
   if (!this.variant) {
     this.variant = Math.floor(Math.random() * this.variants) + 1;
   }
 }

  setAction(sublevel) {
    if (!this.actionType) { this.actionType = 'walking'; }
  }

  resetCoords() {
    this.coords = {
      left: this.pos.x,
      right: this.pos.x + this.size.x,
      top: this.pos.y,
      bottom: this.pos.y + this.size.y,
    };
  }

  setTimer() {
    this.timer = (this.timer < 3) ? this.timer += 1 : this.timer = 0;
  }

  handleGravity(step) {
    this.motion = new Vector(0, this.speed.y * step);
  }

  handleYObstacles(step, sublevel) {
    const newPos = this.pos.plus(this.motion);
    const obstacle = sublevel.obstacleAt(newPos, this.size, 'y');
    if (!obstacle) { this.pos = newPos; }
  }

  handleXObstacles(step, sublevel) {
    this.newPos = this.pos.plus(new Vector(this.speed.x * step, 0));
    this.obstacle.x = sublevel.obstacleAt(this.newPos, this.size, 'x');

    if (this.obstacle.x) {
      this.speed = this.speed.times(-1);
      this.direction === 'right' ? this.direction = 'left' : this.direction = 'right';
      // this.unstick.x(this, this.obstacle.x, actorsLeftPos);
    }
    this.pos = this.newPos;
  }

  /* ==== BEHAVIORS =========================================================
     ======================================================================== */

  walk(step, sublevel) {
    this.spriteUpperBound = 10;
    this.speed.y = 20;
    this.imageSwap('walking', this.spriteUpperBound);
    const actorsLeftPos = Math.floor(this.pos.x);
    const actorsRightPos = Math.ceil(this.pos.x + this.size.x);
    const actorsTopPos = Math.floor(this.pos.y);
    const actorsBottomPos = Math.ceil(this.pos.y + this.size.y);
    const leftSublevelEnd = actorsLeftPos < 0;
    const rightSublevelEnd = actorsRightPos > sublevel.width;
    const topSublevelEnd = actorsTopPos < 0;
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
          this.speed = this.speed.times(-1);
          this.direction === 'right' ? this.direction = 'left' : this.direction = 'right';
        }
      }
    }
  }

}

export default Zombie
