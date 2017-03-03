import Vector from '../vector';
import Sword from './sword';
import keys from '../keys';
import audio from '../audio';
import { settings, scale, actorChars, obstacleChars } from '../globals';
import helpers from '../helpers';

/**
 * The main player in the game.
 */
class Player {

  /**
   * Most of the properties and data in the constructor section of all actors,
   * including this one, contains mutable data that changes relative to the
   * users behavior in the game.  It does not directly lead to the changes
   * on the screen.  The visible changes which manifest on the screen are made
   * by the Render class, which keeps an eye on these properties and renders
   * them to the screen (partly using CSS classes and their properties).  The
   * properties listed are mostly self explanatory.
   */
  constructor(pos) {
    this.size = new Vector(2.5, 4.5);
    this.lifeMeter = 10;
    this.pos = pos.plus(new Vector(0, -0.5));
    this.coords = {
      left: this.pos.x,
      right: this.pos.x + this.size.x,
      top: this.pos.y,
      bottom: this.pos.y + this.size.y,
    };
    this.direction = 'right';
    this.damaged = false;
    this.damageFilter = null;
    this.damageTimer = 0;
    this.touchingFloor = false;
    this.swords = [];
    this.swordLoaded = true;
    this.speed = new Vector(0, 0);
    this.type = 'player';
    this.timers = {
      running: 0,
      climbing: 0,
      crawling: 0,
    };
    this.action = {
      standing: null,
      running: null,
      jumping: null,
      squatting: null,
      crawling: null,
      climbing: null,
    };
    this.climbSpeed = 0.4;
    this.underLadder = false;
    this.cssClass = 'player-running-01';
  }

  imageSwap({ bounds, type }) {
    let counter = 0;
    let addZero = false;
    bounds.forEach((image) => {
      counter += 1;
      if (counter.toString().length === 1) { addZero = true; }
      if ((this.timers[type] >= image.lowerBound) && (this.timers[type] <= image.upperBound)) {
        this.cssClass = `player-${type}-0${counter}`;
      }
    }, this);
  }

  /**
   * All 'act' methods are fired repeatedly as a part of the animation loop
   * within the 'animate' method located in the Sublevel class and this is no
   * exception.  This method initiates by passing in and firing the moveX and
   * moveY methods on this class (the Player class).  It also repeatedly resets
   * the coords of the player.
   */
  act(step, sublevel) {
    this.moveX(step, sublevel);
    this.moveY(step, sublevel);
    this.moveSwords(step, sublevel);
    this.coords = {
      left: this.pos.x,
      right: this.pos.x + this.size.x,
      top: this.pos.y,
      bottom: this.pos.y + this.size.y,
    };
  }

  /**
   * This method is invoked by the act method, which means it will mostly be
   * firing constantly and it is simply a way of grouping a bunch of other
   * methods that handle x-axis operations.
   */
  moveX(step, sublevel) {
    this.handleXSpeed(step);
    this.setDirection();
    this.stand();
    this.run();
    this.crawl();
    this.handleObstacle(step, sublevel);
    this.handleActor(sublevel);
  }

  /**
   * Resets the players x-axis speed to 0 and then increments/decrements it
   * relative to whether the player presses the right or left key.
   */
  handleXSpeed(step) {
    this.speed.x = 0;
    if (keys.left) { this.speed.x -= settings.speed; }
    if (keys.right) { this.speed.x += settings.speed; }
  }

  /**
   * Changes the players direction depending on whether they hit the left or
   * right arrow key.
   */
  setDirection() {
    if (keys.left) { this.direction = 'left'; }
    if (keys.right) { this.direction = 'right'; }
  }

  /**
   * Checks the speed to determine whether the player is 'running' or not and
   * keeps a constant record of which action is being taken, be it running or
   * standing.
   */
  stand() {
    const notMoving = (this.speed.x === 0);
    if (notMoving) {
      this.action.running = false;
      this.action.standing = true;
      this.timers.running = 0;
      this.cssClass = 'player-standing-01';
    }
  }

  /**
   * Changes the players direction depending on whether they hit the left or
   * right arrow key.
   */
  run() {
    let moving = (this.speed.x !== 0);
    let notMoving = (this.speed.x === 0);
    if (moving) {
      this.action.running = true;
      this.action.standing = false;
    }
    moving = (this.speed.x !== 0);
    notMoving = (this.speed.x === 0);
    if (moving) {
      this.timers.running += 1;
      this.timers.running === 20
        ? this.timers.running = 0
        : this.timers.running = this.timers.running;
      this.imageSwap({
        type: 'running',
        bounds: [
          { lowerBound: 0, upperBound: 3 },
          { lowerBound: 4, upperBound: 7 },
          { lowerBound: 8, upperBound: 11 },
          { lowerBound: 12, upperBound: 15 },
          { lowerBound: 16, upperBound: 19 },
          { lowerBound: 20, upperBound: 23 },
        ],
      });
    }
  }

  handleObstacle(step, sublevel) {
    const newPos = this.pos.plus(new Vector(this.speed.x * step, 0));
    const obstacle = sublevel.obstacleAt(newPos, this.size, 'x');
    if (obstacle) {
      sublevel.playerTouched(obstacle);
      this.hillEffects(step, sublevel, obstacle);
      if (obstacle.type === 'ladder' || obstacle.type === 'door') {
        this.pos = newPos;
      }
    } else { this.pos = newPos; }
  }

  handleActor(sublevel) {
    const actorAt = sublevel.actorAt(this);
    if (actorAt) { sublevel.playerTouched(actorAt); }
  }

  crawl() {
    if (!this.action.climbing) {
      if (this.action.squatting && keys.down && (keys.left || keys.right) && (this.speed.y === 0)) {
        this.action.crawling = true;
        if (keys.right || keys.left) {
          this.timers.crawling += 1;
          if (this.timers.crawling === 40) {
            this.timers.crawling = 0;
          } else {
            this.timers.crawling = this.timers.crawling;
          }
          this.imageSwap({
            type: 'crawling',
            bounds: [
              { lowerBound: 0, upperBound: 7 },
              { lowerBound: 8, upperBound: 15 },
              { lowerBound: 16, upperBound: 23 },
              { lowerBound: 24, upperBound: 35 },
              { lowerBound: 32, upperBound: 39 },
            ],
          });
        }
        this.size = new Vector(5, 3);
      }
      if (this.action.squatting && !(keys.left || keys.right)) {
        this.action.crawling = false;
        this.size = new Vector(2.5, 3);
      }
      if (!(keys.down) && (this.action.crawling === true)) {
        this.action.crawling = false;
        this.size = new Vector(2.5, 4.5);
      }
    }
  }

  hillEffects(step, sublevel, obstacle) {
    const firstLevel = sublevel.mapNumber === 0;
    if (firstLevel) {
      if (obstacle.pos) {
        if (obstacle.pos.x === 59 && obstacle.pos.y === 55 && this.direction === 'left') {
          this.pos = this.pos.plus(new Vector(-1, -1));
        }
        if (obstacle.pos.x === 141 && obstacle.pos.y === 55 && this.direction === 'right') {
          this.pos = this.pos.plus(new Vector(1, -1));
        }
      }
    }
  }

  moveY(step, sublevel) {
    this.speed.y += step * settings.gravity;
    const motion = new Vector(0, this.speed.y * step);
    const newPos = this.pos.plus(motion);
    const obstacle = sublevel.obstacleAt(newPos, this.size, 'y');
    this.gravity(sublevel, obstacle, newPos);
    this.jump(step, sublevel, obstacle, motion);
    this.squat();
    this.climbLadder(step, sublevel, obstacle, newPos);
    audio.handleWalkingOnSounds(obstacle);
  }

  gravity(sublevel, obstacle, newPos) {
    const actorAt = sublevel.actorAt(this);
    const oldPos = this.pos;
    if (!obstacle) { this.pos = newPos; }
    if (actorAt && actorAt.type === 'ladder') {
      this.handleLadderGravity(actorAt, oldPos);
    }
    if (obstacle) {
      if ((this.speed.y > 0) && (!keys.up)) { this.speed.y = 0; }
    }
  }

  jump(step, sublevel, obstacle, motion) {
    const actorAt = sublevel.actorAt(this);
    if (obstacle) {
      if (keys.up && this.speed.y > 0) {
        this.speed.y = -settings.jumpSpeed;
      }
    }
    if (actorAt && actorAt.type === 'ladder') {
      if (this.pos.y < actorAt.pos.y - 2.5) {
        if (keys.up && this.speed.y > 0) {
          this.speed.y = -settings.jumpSpeed;
        }
      }
    }
  }

  squat() {
    if (!this.action.climbing) {
      if (keys.down) {
        if (!this.action.squatting) {
          this.size = new Vector(2.5, 3);
          this.pos.y = this.pos.y + 1.5;
          this.action.squatting = true;
        }
        if (!this.action.crawling) {
          this.cssClass = 'player-squatting-01';
        }
      } else {
        if (this.action.squatting) {
          this.size = new Vector(2.5, 4.5);
          this.pos.y = this.pos.y - 1.5;
          this.action.squatting = false;
          this.cssClass = 'player-squatting-01';
        }
      }
    }
  }

  handleLadderGravity(ladder, oldPos) {
    const preventGravity = () => { this.pos = oldPos; };
    const inLadder = this.coords.top > ladder.coords.top - 4.5;
    const inLadderTop = this.coords.bottom < ladder.coords.top + 5;
    if ((inLadder && this.action.climbing) || (inLadderTop)) { preventGravity(); }
  }

  centerPlayerOnLadder(ladder) {
    const left = (this.pos.x < ladder.coords.left - 0.33);
    const right = (this.pos.x > ladder.coords.left - 0.33);
    if (left || right) {
      if (keys.up || keys.down) {
        this.pos.x = ladder.coords.left - 0.3;
      }
    }
  }

  setupClimb(ladder) {
    if (!this.action.climbing) {
      const pressingUpArrow = this.keys && this.keys.up;
      const inLadderBottom = this.coords.bottom > ladder.coords.bottom - 6;
      const inLadderTop = this.coords.top < ladder.coords.top + 6;
      if (pressingUpArrow || !(inLadderBottom)) {
        this.action.climbing = true;
      }
    }
    if ((this.pos.y > ladder.coords.bottom - 6) && (keys.down)) {
      this.action.climbing = false;
    }
  }

  moveUpAndDownLadder(ladder) {
    const topOfLadder = (this.coords.top < ladder.coords.top);
    if ((keys.up) && (!topOfLadder)) {
      this.pos = this.pos.plus(new Vector(0, -this.climbSpeed));
    }
    if (keys.down) {
      this.pos = this.pos.plus(new Vector(0, this.climbSpeed));
    }
  }

  climbingImages() {
    if (this.action.climbing) {
      if (keys.up || keys.down) {
        this.timers.climbing += 1;
        this.timers.climbing === 20
          ? this.timers.climbing = 0
          : this.timers.climbing = this.timers.climbing;
        this.imageSwap({
          type: 'climbing',
          bounds: [
            { lowerBound: 0, upperBound: 4 },
            { lowerBound: 5, upperBound: 9 },
            { lowerBound: 10, upperBound: 14 },
            { lowerBound: 15, upperBound: 19 },
          ],
        });
      }
    }
  }

  handleLadderAscent() {
    if (keys.up) {
      this.action.climbing = true;
      this.pos = this.pos.plus(new Vector(0, -0.5));
      this.size = new Vector(2.5, 4.5);
      this.action.squatting = false;
    }
    this.speed.y = 0;
  }

  handleLadderUse(ladder) {
    if (keys.up || keys.down) {
      this.setupClimb(ladder);
      this.moveUpAndDownLadder(ladder);
    }
  }

  killSquatIfClimbing() {
    if (this.action.climbing) {
      this.action.squatting = false;
      this.size = new Vector(2.5, 4.5);
    }
  }

  ungluePlayer(ladder) {
    const atBottomOfLadder = this.coords.bottom > (ladder.coords.bottom - 5);
    if (atBottomOfLadder) {
      if (this.coords.bottom > ladder.coords.bottom + 0.9) {
        this.pos.y = ladder.coords.bottom - this.size.y + 0.5;
      }
    }
  }

  climbLadder(step, sublevel, obstacle, newPos) {
    const actorAt = sublevel.actorAt(this);
    if (actorAt && actorAt.type === 'ladder') {
      const ladder = actorAt;
      const playerIsOnLadder = (
        (this.coords.top) < (ladder.coords.bottom - this.size.y)
      );
      if (playerIsOnLadder) { this.handleLadderUse(ladder); }
      if (!playerIsOnLadder) { this.handleLadderAscent(); }
      this.centerPlayerOnLadder(ladder);
      this.killSquatIfClimbing(ladder);
      this.ungluePlayer(ladder);
    }
    this.action.climbing = (!actorAt) ? false : this.action.climbing;
    this.climbingImages();
  }

  removeSword(sublevel, swordToBeRemoved) {
    sublevel.player.swords = sublevel.player.swords.filter(sword => sword !== swordToBeRemoved);
  }

  moveSwords(step, sublevel) {
    if (keys.spacebar) {
      if (this.swordLoaded) {
        audio.play('sword');
        this.swords.push(new Sword(sublevel.player.pos));
        this.swordLoaded = false;
      }
    }
    if (!keys.spacebar) { this.swordLoaded = true; }
    sublevel.player.swords.forEach((swordCheck) => {
      const obstacle = sublevel.obstacleAt(swordCheck.pos, swordCheck.size);
      if (obstacle) {
        if (obstacle.type === 'wall') { this.removeSword(sublevel, swordCheck); }
      }
      const xSword = swordCheck.pos.x;
      const xPlayer = sublevel.player.pos.x;
      const movedFarAway = (
        (xSword > xPlayer + 200) || (xSword < xPlayer - 200)
      );
      if (movedFarAway) { this.removeSword(sublevel, swordCheck); }
    });
    this.swords.forEach((sword) => {
      sword.act(step, sublevel, keys);
    });
  }
}
export default Player
