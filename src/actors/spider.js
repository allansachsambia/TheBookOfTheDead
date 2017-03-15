import Vector from '../vector';
import helpers from '../helpers';

/**
 * A spider enemy.
 */
class Spider {
  constructor(pos, type) {
    this.type = 'spider';
    this.actorCategory = 'enemy';
    this.pos = pos;
    this.size = new Vector(3, 2.6);
    this.innerSize = new Vector(3, 2.6);
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
    this.timer = Math.floor(Math.random() * 3) + 1;
    this.actionType = null;
    this.spriteNumber = null;
    this.spriteUpperBound = null;
  }

  /* ==== ACT ===============================================================
     ======================================================================== */

  act(step, sublevel) {
    this.setAction(sublevel)
    this.resetCoords();
    this.setTimer();
    this.move(step, sublevel);
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

  /* ==== SETTINGS ==========================================================
     ======================================================================== */

  setAction(sublevel) {
    if (!this.actionType) { this.actionType = 'moving'; }
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

  /* ==== BEHAVIORS =========================================================
     ======================================================================== */

  move(step, sublevel) {
    this.spriteUpperBound = 4;
    this.imageSwap('moving', this.spriteUpperBound);
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
