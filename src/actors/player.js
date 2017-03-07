import Vector from '../vector';
import Dagger from './dagger';
import Sword from './sword';
import keys from '../keys';
import { settings, scale, actorChars, obstacleChars } from '../globals';
import helpers from '../helpers';
import audio from '../audio';

/**
 * The main 'player' actor in the game.
 */
class Player {

  /**
   * These are properties for the actual player 'actor' in the game.  This sets
   * the size of the player, a motion pressure, x and y axis obstacles that
   * the player detects prior to interacting with, a life meter which is self
   * explanatory, x y position data of the player, coords which set exactly
   * where the top, right, bottom and left side of the player are at any given
   * moment, current direction of the player which is to be determined by their
   * arrow key strokes, whether they are currently in a state of 'damage' or
   * not a period which lasts about a second when an enemy touches the player,
   * the damage timer keeps a record of this time.  There is a record of x and y
   * speed which is what drives the direction of the player, a generic all
   * purpose actor 'type' set for the class, a current actionType set which
   * generally refers to the type of action the player is currently engaged in,
   * such as 'squatting', 'running', 'climbing', etc...There is a 'spriteNumber'
   * which keeps a record of changing sprites set by the imageSwap method, so
   * this changes the sprite number which updates the css classname in the
   * render class which in turn continuously changes the background position of
   * the player sprite, the timer property works together with this in that it
   * is on a forever loop resetting to 0 every four iterations of the whole
   * animation loop that the act method is in, this is set so that the sprites
   * are updates in these spaced out increments, the imageSwap function waits
   * for the timer to be set to 0 and it increments to the next css sprite.
   */
  constructor(pos) {
    this.size = new Vector(2.5, 4.5);
    this.motion = new Vector(0, 0);
    this.obstacle = new Vector(0, 0);
    this.lifeMeter = 10;
    this.pos = pos.plus(new Vector(0, -0.5));
    this.coords = { left: null, right: null, top: null, bottom: null };
    this.direction = 'right';
    this.damaged = false;
    this.damageTimer = 0;
    this.speed = new Vector(0, 0);
    this.type = 'player';
    this.actionType = null;
    this.spriteNumber = null;
    this.timer = 0;
    this.daggers = [];
    this.daggerLoaded = true;
    this.swords = [];
    this.swordTimer = 0;
    this.swordDrawn = false;
  }

  /* ==== ACT ===============================================================
     ======================================================================== */

  /**
   * This method is wired up within the forever loop inside of the sublevel
   * object.  'Step' is basically an quantity of about `0.0166` but it changes
   * to compensate for browser environment hiccups sort of like suspension in
   * a car absorbing shock.  Sublevel is the particular level 'part' that the
   * player is located within.  I pass it in like this rather than attaching it
   * to the player class as a property because it's way too taxing on the
   * browser and just redundant to constantly keep reattaching it to the player
   * class.  In any case, the
   */
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
    this.moveDaggers(step, sublevel);
    this.moveSwords(step, sublevel);
  }

  /* ==== HELPERS ==============================================================
     ======================================================================== */


  /**
   * This method is invoked whenever a behavior function is invoked and it just
   * resets the sprite number to 001 if the sprite number is higher than the
   * upperbounds of the particular actions sprite.  For example, if you are
   * 'running' and then suddenly you are 'climbing' and the spriteNumber is
   * still set at 005 after the crossover from one action to the next and the
   * upperBound of climbing is 004 this would be bad because you would end up
   * setting the sprite to a className that is higher than any that exists,
   * it would be .player-climbing-005, which does not exist.  To prevent this
   * error we check if it's over that bound and if it is, we quickly reset it
   * to 001.  All actions have at least an 001, so this works.
   */
  resetSpriteNumber(last) {
    if (this.spriteNumber >= last) {
      this.spriteNumber = '001';
    }
  }

  /**
   * This function is what makes it possible to swap CSS classes, and therefore
   * to swap background powsitions on the sprite map.  I first check that I
   * only increment the sprite every four iterations of the overall loop using
   * this.timer, this sets an acceptable pace for the changing sprites.  I
   * then check if this actionType is even set at all or if it's set on the
   * last spriteNumber, if that's the case I simply reset the sprite to 001
   * (using a padding helper).  If an actionType is set to the current one, and
   * it is not on the last spriteNumber, simply take whatever spriteNumber is
   * present, parse it from string to number, increment it, then pad it and
   * reset it again.
   */
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

  /* ==== SETTINGS AND CONDITIONS ===========================================
     ======================================================================== */

  /**
   * This section aims to set the conditions required in order to produce an
   * actionType, insofar as it is possible to extract it into a separate
   * function.
   */
  setAction(sublevel) {
    // Standing conditions.
    if (!(keys.left || keys.right || keys.down || keys.up) && this.actionType !== 'climbing') {
      this.actionType = 'standing';
    }
    // Running conditions.
    if ((keys.left || keys.right) && !(keys.down || keys.up)) {
      this.actionType = 'running';
    }
    // Squatting conditions.
    if (keys.down && this.obstacle.y && this.actionType !== 'climbing') {
      this.actionType = 'squatting';
    }
    // Crawling conditions.
    if (keys.down && (keys.left || keys.right) && this.obstacle.y) {
      this.actionType = 'crawling';
    }
    // Jumping conditions.
    if (keys.up && this.actionType !== 'climbing') {
      this.actionType = 'jumping';
    }
    // Climbing conditions.
    if (sublevel.actorAt(this) && sublevel.actorAt(this).type === 'ladder') {
      if ((this.coords.top) < (sublevel.actorAt(this).coords.bottom - this.size.y)) {
        if (keys.up || keys.down) {
          this.actionType = 'climbing';
        }
      }
    }
  }

  /**
   * This section resets the coords of the player with every iteration.
   */
  resetCoords() {
    this.coords = {
      left: this.pos.x,
      right: this.pos.x + this.size.x,
      top: this.pos.y,
      bottom: this.pos.y + this.size.y,
    };
  }

  /**
   * This is just a timer that keeps moving from 0 to 3 over and over again.
   * I use it to set the sprite changing rate.
   */
  setTimer() {
    this.timer = (this.timer < 3) ? this.timer += 1 : this.timer = 0;
  }

  /**
   * Step is roughtly 0.016 and settings.gravity is 100, which means
   * this.speed.y ends up being roughly 1.66.  Then when multiplied
   * by step this brings it back down to approximately 0.027.  It should
   * be noted that if you do not reset speed.y to 0 there will just be
   * a build up of pressure.  handleYObstacle resets it.
   */
  handleGravity(step) {
    this.speed.y += step * settings.gravity;
    this.motion = new Vector(0, this.speed.y * step);
  }

  /**
   * This basically checks the y-axis for any obstacles and if there are any
   * it resets speed.y to 0 as long as the player doesn't press they up key
   * and it most importantly does not update the player to the new position.
   * Otherwise it just resets the players position to the new position as
   * long as they are not climbing.  Does not allow the effect of gravity
   * `this.pos.plus(this.motion)` to have an effect on the player if they are
   * in the ladder and are climbing.
   */
  handleYObstacles(step, sublevel) {
    const oldPos = this.pos;
    const actorAt = sublevel.actorAt(this);
    // Check and update new position.
    this.newPos = this.pos.plus(this.motion);
    this.obstacle.y = sublevel.obstacleAt(this.newPos, this.size, 'y');
    if (this.obstacle.y) {
      if ((this.speed.y > 0) && (!keys.up)) {
        this.speed.y = 0;
      }
    } else if (this.actionType !== 'climbing') {
      this.pos = this.newPos;
    }
    // Handle ladder.
    if (actorAt && actorAt.type === 'ladder') {
      const mountedOnLadder = this.coords.top > actorAt.coords.top - 5;
      if (mountedOnLadder && this.actionType === 'climbing') {
        this.speed.y = 0;
        this.pos = oldPos;
      }
    }
  }

  /**
   * If the player touches an 'obstacle' run it through the playerTouched
   * function on the sublevel class to handle what to do about it.  Otherwise,
   * just move to the next position.
   */
  handleXObstacles(step, sublevel) {
    this.newPos = this.pos.plus(new Vector(this.speed.x * step, 0));
    this.obstacle.x = sublevel.obstacleAt(this.newPos, this.size, 'x');
    if (this.obstacle.x) {
      sublevel.playerTouched(this.obstacle.x);
    } else {
      this.pos = this.newPos;
    }
  }

  /**
   * If the player touches another 'actor', such as an item or an enemy, run
   * the 'playerTouched' method on the sublevel class.
   */
  actorCollision(sublevel) {
    const actorAt = sublevel.actorAt(this);
    if (actorAt) { sublevel.playerTouched(actorAt); }
  }

  /**
   * This just resets the players direction when they hit the left or right
   * key, this gives the player element a class that will flip the sprite
   * depending on the direction.
   */
  setDirection() {
    if (keys.left) { this.direction = 'left'; }
    if (keys.right) { this.direction = 'right'; }
  }

  /* ==== BEHAVIORS =========================================================
     ======================================================================== */

 /**
  * This checks if the correct conditions are set for the player to be standing,
  * and if they are, it resets the x speed to 0.  If the players size is not
  * set to `new Vector(2.5, 4.5)` it probably means they are still set for
  * squatting or crawling in terms of size, so fix it.
  */
  stand() {
    if (this.actionType === 'standing') {
      this.speed.x = 0;
      if (this.size.y === 3 && !(keys.down)) {
        this.pos.y = this.pos.y - 1.5;
        this.size = new Vector(2.5, 4.5);
      }
      this.spriteNumber = helpers.pad(1, 3);
    }
  }

  /**
   * This checks if the correct conditions are set for the player to be running,
   * sets the upperbound and resets the sprite number.  If the sprite size is
   * not set to `new Vector(2.5, 4.5)` it probably means they are still set for
   * squatting or crawling in terms of size, so fix it.  Set the x speed to 0
   * and then reduce it by settings.speed if keys are left and increase it if
   * the user is pressing the right key and init the imageSwap function.
   */
  run() {
    if (this.actionType === 'running') {
      const upperBound = 6;
      this.resetSpriteNumber(upperBound);
      if (this.size.y === 3 && !(keys.down)) {
        this.pos.y = this.pos.y - 1.5;
        this.size = new Vector(2.5, 4.5);
      }
      this.speed.x = 0;
      if (keys.left) {
        this.speed.x -= settings.speed;
        this.imageSwap('running', upperBound);
      }
      if (keys.right) {
        this.speed.x += settings.speed;
        this.imageSwap('running', upperBound);
      }
    }
  }

  /**
   * This checks if the correct conditions are set for the player to be
   * squatting, sets the upperbound, the size and the spriteNumber. For the
   * moment there is only one image for squatting so no need for imageSwap.
   */
  squat() {
    if (this.actionType === 'squatting') {
      const upperBound = 1;
      this.resetSpriteNumber(upperBound);
      this.size = new Vector(2.5, 3);
      this.spriteNumber = helpers.pad(1, 3);
    }
  }

  /**
   * This checks if the correct conditions are set for the player to be
   * crawling, sets the upperbound, resets the spriteNumber, kills x speed,
   * then if the left key is pressed reduce x speed and if right increase it,
   * then run imageSwap and set the size appropriately.
   */
  crawl() {
    if (this.actionType === 'crawling') {
      const upperBound = 4;
      this.resetSpriteNumber(upperBound);
      this.speed.x = 0;
      if (keys.left) {
        this.speed.x -= settings.speed;
      }
      if (keys.right) {
        this.speed.x += settings.speed;
      }
      this.imageSwap('crawling', upperBound);
      this.size = new Vector(5, 3);
    }
  }

  /**
   * This checks if the correct conditions are set for the player to be
   * jumping, sets the upperbound, resets the spriteNumber, then checks that
   * the player is on the ground and if they are, allows them to jump.
   * also sets up the exact same conditions used in running except with the
   * jumping image sprites.
   */
  jump() {
    if (this.actionType === 'jumping') {
      const upperBound = 6;
      this.resetSpriteNumber(upperBound);
      if (this.obstacle.y && this.speed.y > 0) {
        this.speed.y = -settings.jumpSpeed;
      }
      this.speed.x = 0;
      if (keys.left) {
        this.speed.x -= settings.speed;
        this.imageSwap('jumping', upperBound);
      }
      if (keys.right) {
        this.speed.x += settings.speed;
        this.imageSwap('jumping', upperBound);
      }
    }
  }

  /**
   * Reset the speed in case it has some built up from a 'run-jump-mount'
   * or 'crawl-mount', edge cases, etc...
   * Set a variable for any actors you cross paths with.
   * Check if the actor is a ladder.
   * Set ladder as the constant for the actor if it has been verified.
   * If the actor is crawling or squatting straighten them out.
   * Check if the player is on the ladder or not.
   * If the player is mounted on the ladder and they key up or down.
   * If the player is not standing on the top of the ladder and they press
   * the 'up' key move them upwards.
   * If the player presses the 'down' key, move the player downward.
   * Set up the climbing image sprites here.
   * Center player on ladder
   * Keep the player from sinking into the floor underneath the ladder.
   */
  climb(step, sublevel) {
    if (this.actionType === 'climbing') {
      this.speed.x = 0;
      const upperBound = 8;
      this.resetSpriteNumber(upperBound);
      const actorAt = sublevel.actorAt(this);
      if (actorAt && actorAt.type === 'ladder') {
        const ladder = actorAt;
        if (this.size.y === 3) {
          this.size = new Vector(2.5, 4.5);
        }
        const playerMountedTheLadder = ((this.coords.top) < (ladder.coords.bottom - (this.size.y) ));
        if (playerMountedTheLadder && keys.down) {
          this.pos = this.pos.plus(new Vector(0, settings.climbSpeed));
          this.imageSwap('climbing', upperBound);
        }
        if (keys.up) {
          const topOfLadder = this.coords.top < ladder.coords.top;
          if (keys.up && !topOfLadder) {
            this.pos = this.pos.plus(new Vector(0, -settings.climbSpeed));
            this.imageSwap('climbing', upperBound);
          }
        }
        const onTheLeftSide = (this.pos.x < ladder.coords.left - 0.33);
        const onTheRightSide = (this.pos.x > ladder.coords.left - 0.33);
        if (onTheLeftSide || onTheRightSide) {
          if (keys.up || keys.down) {
            this.pos.x = ladder.coords.left - 0.3;
          }
        }
        const atBottomOfLadder = this.coords.bottom > (ladder.coords.bottom - 5);
        if (atBottomOfLadder) {
          if (this.coords.bottom > ladder.coords.bottom + 0.9) {
            this.pos.y = ladder.coords.bottom - (this.size.y + 0.5);
          }
        }
      }
    }
  }

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
      const obstacle = sublevel.obstacleAt(daggerCheck.pos, daggerCheck.size);
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

    // // The property this.swordDrawn is initially set to false.
    // // If you hit the spacebar set this.swordDrawn to true so it won't fire
    // // multiple times as the player presses the spacebar.  Then play the sword
    // // audio and push a new sword to the swords array.
    // if (keys.spacebar && this.swordDrawn === false) {
    //   if (this.swordDrawn === false) { this.swordDrawn = true; }
    //   audio.play('sword');
    //   this.swords.push(new Sword(this.pos));
    // }
    //
    // // When you press the spacebar this.swordDrawn will be set to true, so this
    // // will fire.  It will check to see if the swordTimer is less than 10.  It
    // // will be, at first, so it will keep incrementing it until it gets to 9.
    // // When it hits 9, iy will reset the swordTimer to 0, remove the sword from
    // // the array of swords and set swordDrawn to false, which means that the
    // // player will be listening for the user to press the spacebar again.
    // if (this.swordDrawn) {
    //   if (this.swordTimer < 10) {
    //     this.swordTimer += 1;
    //   } else {
    //     this.swordTimer = 0;
    //     this.removeSword(sublevel, this.swords[0]);
    //     this.swordDrawn = false;
    //   }
    // }
    // // This just sets the sword to follow the player around wherever they are.
    // if (this.swords[0]) { this.swords[0].pos = this.pos; }
    // this.swords.forEach((sword) => {
    //   sword.act(step, sublevel, keys);
    // });
  }


}
export default Player;
