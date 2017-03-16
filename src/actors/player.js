import Vector from '../vector';
import Dagger from './dagger';
import Sword from './sword';
import keys from '../keys';
import { settings, scale, actorChars, obstacleChars } from '../globals';
import helpers from '../helpers';
import audio from '../audio';

/**
 * The main player.
 */
class Player {

  constructor(pos) {
    this.type = 'player';
    this.actorCategory = 'ally';
    this.size = new Vector(0, 0);
    this.innerSize = new Vector(1, 3);
    this.buffer = new Vector(3, 2);
    this.motion = new Vector(0, 0);
    this.obstacle = new Vector(0, 0);
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
    this.speed = new Vector(0, 0);
    this.actionType = null;
    this.actionSubtype = null;
    this.spriteNumber = null;
    this.spriteUpperBound = null;
    this.timer = 0;
    this.daggers = [];
    this.daggerLoaded = true;
    this.swords = [];
    this.swordTimer = 0;
    this.swordDrawn = false;
  }

  /* ==== ACT ===============================================================
     ======================================================================== */

  act(step, sublevel) {
    this.setAction(sublevel);
    this.resetCoords();
    this.setTimer();
    this.handleGravity(step);
    this.handleYObstacles(step, sublevel);
    this.handleXObstacles(step, sublevel);
    this.actorCollision(sublevel);
    this.setDirection();
    this.stand();
    this.run();
    this.squat();
    this.crawl();
    this.jump();
    this.climb(step, sublevel);
    // this.moveDaggers(step, sublevel);
    this.moveSwords(step, sublevel);
    this.setSize();
    this.setActionSubtype();

  }

  /* ==== HELPERS ==============================================================
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

  /* ==== SETTINGS ==========================================================
     ======================================================================== */

  setAction(sublevel) {
    // Standing conditions.
    if (!(keys.left || keys.right || keys.down || keys.up) && this.actionType !== 'climbing') {
      this.actionType = 'standing';
    }
    // Running conditions.
    if ((keys.left || keys.right) && !(keys.down || keys.up)) {
      if (this.actionType !== 'running') { this.actionType = 'running'; }
    }
    // Squatting conditions.
    if (keys.down && this.obstacle.y) {
      this.actionType = 'squatting';
    }
    // Crawling conditions.
    if (keys.down && (keys.left || keys.right) && this.obstacle.y) {
      this.actionType = 'crawling';
    }
    // Jumping conditions.
    if (keys.up) {
      this.actionType = 'jumping';
    }
    // Climbing conditions.
    if (sublevel.actorAt(this) && sublevel.actorAt(this).type === 'ladder') {
      if ((this.coords.bottom) <= (sublevel.actorAt(this).coords.bottom)) {
        if (keys.up || keys.down) {
          this.actionType = 'climbing';
        }
      }
    }
  }

  setActionSubtype() {
    if (this.swordDrawn) {
      this.actionSubtype = 'sword';
    } else {
      this.actionSubtype = null;
    }
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
    this.speed.y += step * settings.gravity;
    this.motion = new Vector(0, this.speed.y * step);
  }

  setDirection() {
    if (keys.left) { this.direction = 'left'; }
    if (keys.right) { this.direction = 'right'; }
  }

  /* ==== INTERACTIONS =========================================================
     ======================================================================== */

  handleYObstacles(step, sublevel) {
    const oldPos = this.pos;
    const actorAt = sublevel.actorAt(this);
    this.newPos = this.pos.plus(this.motion);
    this.obstacle.y = sublevel.obstacleAt(this.newPos, this.size, this.buffer);
    if (this.obstacle.y) {
      if ((this.speed.y > 0) && (!keys.up)) {
        this.speed.y = 0;
      }
      console.log(this.obstacle.y.type);
      if (this.obstacle.x && (keys.right || keys.left)) {
        if (this.obstacle.y.type === 'grassyhill') {
          this.pos.y = this.pos.y - 1;
        }
      }
    } else if (this.actionType !== 'climbing') {
      this.pos = this.newPos;
    }
    if (actorAt && actorAt.type === 'ladder') {
      const mountedOnLadder = this.coords.top > actorAt.coords.top - 5;
      if (mountedOnLadder && this.actionType === 'climbing') {
        this.speed.y = 0;
        this.pos = oldPos;
      }
    }
    if (actorAt && actorAt.type === 'ladder') {
      const topOfLadder = this.coords.top < actorAt.coords.top;
      if (topOfLadder) {
        this.speed.y = 0;
        this.pos = oldPos;
      }
    }
    audio.handleWalkingOnSounds(sublevel.obstacleAt(this.newPos, this.size, this.buffer));
  }

  handleXObstacles(step, sublevel) {
    this.newPos = this.pos.plus(new Vector(this.speed.x * step, 0));
    this.obstacle.x = sublevel.obstacleAt(this.newPos, this.size, this.buffer);
    if (!this.obstacle.x) {
      this.pos = this.newPos;
    }
  }

  touchedEnemy(enemy, sublevel) {
    if (sublevel.status.lifeMeter > 0) {
      if (!this.damaged) {
        audio.play('hurt');
        sublevel.status.lifeMeter -= 1;
        this.damaged = true;
        setTimeout(() => {
          this.damaged = false;
          this.damageTimer = 0;
        }, 600);
      }
    } else {
      sublevel.status.condition = 'lost';
    }
  }

  touchedItem(item, sublevel) {
    const removeItem = () => {
      sublevel.actors = sublevel.actors.filter(other => other !== item);
    };
    const addHealth = (amount) => {
      const status = sublevel.status;
      status.lifeMeter = ((amount + status.lifeMeter) > 10) ? 10 : status.lifeMeter + amount;
    };
    const type = item.type;
    switch (type) {
      case 'flag': {
        sublevel.status.condition = 'won';
        break;
      }
      case 'door': {
        if (keys.up) {
          sublevel.status.condition = 'won sublevel';
        }
        break;
      }
      case 'pizza': {
        audio.play(type);
        removeItem();
        addHealth(2);
        break;
      }
      case 'soda': {
        audio.play(type);
        removeItem();
        addHealth(1);
        break;
      }
      default:
    }
  }

  actorCollision(sublevel) {
    const actor = sublevel.actorAt(this);
    if (actor) {
      switch (actor.actorCategory) {
        case 'enemy':
          this.touchedEnemy(actor, sublevel);
          break;
        case 'item':
          this.touchedItem(actor, sublevel);
          break;
        default:
      }
    }
  }

  /* ==== BEHAVIORS =========================================================
     ======================================================================== */

  stand() {
    if (this.actionType === 'standing') {
      if (!this.actionSubtype) {
        this.spriteUpperBound = 1;
        this.spriteNumber = helpers.pad(1, 3);
      }
      if (this.actionSubtype === 'sword') {
        this.spriteUpperBound = 4;
        if (this.spriteNumber >= this.spriteUpperBound) {
          this.spriteNumber = helpers.pad(1, 3);
        }
        this.imageSwap('standing', this.spriteUpperBound);
      }

      this.speed.x = 0;
    }
  }

  run() {
    if (this.actionType === 'running') {
      if (!this.actionSubtype) {
        this.spriteUpperBound = 6;
        if (this.spriteNumber >= this.spriteUpperBound) { this.spriteNumber = helpers.pad(1, 3); }
        this.imageSwap('running', this.spriteUpperBound);
      }
      if (this.actionSubtype === 'sword') {
        this.spriteUpperBound = 4;
        if (this.spriteNumber >= this.spriteUpperBound) { this.spriteNumber = helpers.pad(1, 3); }
        this.imageSwap('running', this.spriteUpperBound);
      }

      this.speed.x = 0;
      if (keys.left) { this.speed.x -= settings.speed; }
      if (keys.right) { this.speed.x += settings.speed; }
    }
  }

  squat() {
    if (this.actionType === 'squatting') {
      if (!this.actionSubtype) {
        this.spriteUpperBound = 1;
        this.spriteNumber = helpers.pad(1, 3);
      }
      if (this.actionSubtype === 'sword') {
        this.spriteUpperBound = 4;
        if (this.spriteNumber >= this.spriteUpperBound) {
          this.spriteNumber = helpers.pad(1, 3);
        }
        this.imageSwap('squatting', this.spriteUpperBound);
      }
      this.speed.x = 0;
    }
  }

  crawl() {
    if (this.actionType === 'crawling') {
      if (!this.actionSubtype) {
        this.spriteUpperBound = 4;
        if (this.spriteNumber >= this.spriteUpperBound) { this.spriteNumber = helpers.pad(1, 3);}
        this.imageSwap('crawling', this.spriteUpperBound);
      }
      if (this.actionSubtype === 'sword') {
        this.spriteUpperBound = 4;
        if (this.spriteNumber >= this.spriteUpperBound) { this.spriteNumber = helpers.pad(1, 3);}
        this.imageSwap('crawling', this.spriteUpperBound);
      }
      this.speed.x = 0;
      if (keys.left) { this.speed.x -= settings.speed; }
      if (keys.right) { this.speed.x += settings.speed; }

    }
  }

  jump() {
    if (this.actionType === 'jumping') {
      if (!this.actionSubtype) {
        this.spriteUpperBound = 6;
        if (this.spriteNumber >= this.spriteUpperBound) {
          this.spriteNumber = helpers.pad(1, 3);
        }
      }
      if (this.actionSubtype === 'sword') {
        this.spriteUpperBound = 4;
        if (this.spriteNumber >= this.spriteUpperBound) { this.spriteNumber = helpers.pad(1, 3); }
        this.imageSwap('jumping', this.spriteUpperBound);
      }

      if (this.obstacle.y && this.speed.y > 0) { this.speed.y = -settings.jumpSpeed; }
    }
  }

  climb(step, sublevel) {
    if (this.actionType === 'climbing') {
      this.spriteUpperBound = 8;
      if (this.spriteNumber >= this.spriteUpperBound) {
        this.spriteNumber = helpers.pad(1, 3);
      }
      if (keys.up || keys.down) { this.imageSwap('climbing', this.spriteUpperBound); }
      const actorAt = sublevel.actorAt(this);
      if (actorAt && actorAt.type === 'ladder') {
        const ladder = actorAt;
        const playerMountedTheLadder = (this.coords.top) < (ladder.coords.bottom - (this.size.y));
        if (playerMountedTheLadder && keys.down) {
          this.pos = this.pos.plus(new Vector(0, settings.climbSpeed));
        }
        const topOfLadder = this.coords.top < ladder.coords.top - 0.5;
        if (keys.up && !topOfLadder) {
            this.pos = this.pos.plus(new Vector(0, -settings.climbSpeed));
            this.speed.x = 0;
        }
        const onTheLeftSide = (this.pos.x < ladder.coords.left - 0.33);
        const onTheRightSide = (this.pos.x > ladder.coords.left - 0.33);
        if (onTheLeftSide || onTheRightSide) {
          if (keys.up || keys.down) { this.pos.x = ladder.coords.left - 3.1; }
        }
      }
    }
  }

  /* ==== WEAPON BEHAVIORS ==================================================
     ======================================================================== */


  removeDagger(sublevel, daggerToBeRemoved) {
    sublevel.player.daggers = sublevel.player.daggers.filter(dagger => dagger !== daggerToBeRemoved);
  }

  moveDaggers(step, sublevel) {
    if (keys.spacebar) {
      if (this.daggerLoaded) {
        audio.play('dagger');
        this.daggers.push(new Dagger(sublevel.player.pos));
        this.daggerLoaded = false;
      }
    }
    if (!keys.spacebar) { this.daggerLoaded = true; }
    sublevel.player.daggers.forEach((daggerCheck) => {
      const obstacle = sublevel.obstacleAt(daggerCheck.pos, daggerCheck.size, this.buffer);
      if (obstacle) {
        if (obstacle.type === 'wall') { this.removeDagger(sublevel, daggerCheck); }
      }
      const xDagger = daggerCheck.pos.x;
      const xPlayer = sublevel.player.pos.x;
      const movedFarAway = (
        (xDagger > xPlayer + 200) || (xDagger < xPlayer - 200)
      );
      if (movedFarAway) { this.removeDagger(sublevel, daggerCheck); }
    });
    this.daggers.forEach((dagger) => {
      dagger.act(step, sublevel, keys);
    });
  }

  removeSword(sublevel, swordToBeRemoved) {
    sublevel.player.swords = sublevel.player.swords.filter(sword => sword !== swordToBeRemoved);
  }

  moveSwords(step, sublevel) {
    if (keys.spacebar && this.swordDrawn === false && this.actionType !== 'climbing') {
      if (this.swordDrawn === false) { this.swordDrawn = true; }
      audio.play('sword');
      this.swords.push(new Sword(this.pos));
    }
    if (this.swordDrawn) {
      if (this.swordTimer < 12) {
        this.swordTimer += 1;
      } else {
        this.swordTimer = 0;
        this.removeSword(sublevel, this.swords[0]);
        this.swordDrawn = false;
        this.spriteNumber = '001';
      }
    }
    if (this.swords[0]) { this.swords[0].pos = this.pos; }
    this.swords.forEach((sword) => {
      sword.act(step, sublevel, keys);
    });
  }

}
export default Player;
