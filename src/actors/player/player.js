import Vector from '../../vector';
import Sword from './sword';
import keys from '../../keys';
import { settings, scale, actorChars, obstacleChars } from '../../globals';
import { jamjar } from '../../jamjar';

class Player {
  constructor(pos) {
    this.lifeMeter = 10;
    this.pos = pos.plus(new Vector(0, -0.5));
    this.direction = 'right';
    this.damaged = false;
    this.damageFilter = null;
    this.touchingFloor = false;
    this.swords = [];
    this.swordLoaded = true;
    this.size = new Vector(2.5, 4.5);
    this.speed = new Vector(0, 0);
    this.type = 'player';
    this.direction = 'right';
    this.damageTimer = 0;
    this.timers = {
      running: 0,
      climbing: 0,
      crawling: 0
    }
    this.action = {
      standing: null,
      running: null,
      jumping: null,
      squatting: null,
      crawling: null,
      climbing: null,
    }
    this.climbSpeed = 0.4;
    this.underLadder = false;
    this.audioLoaded = false;
    this.images = {
      standing:  'images/player/standing-01.png',
      running:   'images/player/running-01.png',
      squatting: 'images/player/squatting-01.png',
      crawling:  'images/player/crawling-01.png',
      climbing:  'images/player/climbing-01.png'
    }
    this.coords = {
      left: this.pos.x,
      right: this.pos.x + this.size.x,
      top: this.pos.y,
      bottom: this.pos.y + this.size.y
    };
  }

  act(step, sublevel){
    this.moveX(step, sublevel);
    this.moveY(step, sublevel);
    this.moveSwords(step, sublevel);
    this.coords = {
      left: this.pos.x,
      right: this.pos.x + this.size.x,
      top: this.pos.y,
      bottom: this.pos.y + this.size.y
    };
  }

  imageSwap(images) {
    let counter = 0;
    let addZero = false;
    images.bounds.forEach((image) => {
      counter += 1;
      if (counter.toString().length === 1) { addZero = true; }
      if ((this.timers[images.type] >= image.lowerBound)
          && (this.timers[images.type] <= image.upperBound)) {
        if (addZero) {
          this.images[images.type] =
            'images/player/' + images.type + '-0' + counter + '.png';
        } else if (!addZero) {
          this.images[images.type] =
            'images/player/' + images.type + '-' + counter + '.png';
        }
      }
    }, this);
  }

  moveX(step, sublevel) {
    this.resetSpeed(step);
    this.setDirection();
    this.stand();
    this.run();
    this.crawl();
    this.handleObstacle(step, sublevel);
    this.handleActor(sublevel);
  }

  resetSpeed(step) {
    this.speed.x = 0;
  }

  setDirection() {
    if (keys.left) {
      this.speed.x -= settings.speed;
      this.direction = 'left';
    }
    if (keys.right) {
      this.speed.x += settings.speed;
      this.direction = 'right';
    }
  }

  handleObstacle(step, sublevel) {
    let newPos = this.pos.plus(new Vector(this.speed.x * step, 0));
    let obstacle = sublevel.obstacleAt(newPos, this.size, 'x');
    if (obstacle) {
      sublevel.playerTouched(obstacle)
      this.hillEffects(step, sublevel, obstacle);
      if (obstacle.type === 'ladder' || obstacle.type === 'door') {
        this.pos = newPos
      }
    } else { this.pos = newPos; }
  }

  handleActor(sublevel) {
    let actorAt = sublevel.actorAt(this);
    if (actorAt) { sublevel.playerTouched(actorAt); }
  }

  stand() {
    let moving = (this.speed.x !== 0);
    let notMoving = (this.speed.x === 0);
    if (notMoving) {
      this.action.running = false;
      this.action.standing = true;
    }
    if (notMoving) {
      this.timers.running = 0;
      this.images.standing = 'images/player/standing-01.png';
    }
  }

  run() {
    let moving = (this.speed.x !== 0);
    let notMoving = (this.speed.x === 0);
    if (moving) {
      this.action.running = true
      this.action.standing = false
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
          {lowerBound: 0, upperBound: 3},
          {lowerBound: 4, upperBound: 7},
          {lowerBound: 8, upperBound: 11},
          {lowerBound: 12, upperBound: 15},
          {lowerBound: 16, upperBound: 19}
        ]
      });
    }
  }

  crawl() {
    if (!this.action.climbing) {
      if (this.action.squatting && keys.down && (keys.left || keys.right) && (this.speed.y === 0)) {
        this.size = new Vector(4.5, 3);
        this.action.crawling = true;
        if (keys.right || keys.left) {
          this.timers.crawling += 1;
          this.timers.crawling === 40
            ? this.timers.crawling = 0
            : this.timers.crawling = this.timers.crawling;
          this.imageSwap({
            type: 'crawling',
            bounds: [
              {lowerBound: 0, upperBound: 7},
              {lowerBound: 8, upperBound: 15},
              {lowerBound: 16, upperBound: 23},
              {lowerBound: 24, upperBound: 35},
              {lowerBound: 32, upperBound: 39}
            ]
          });
        }
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
    let firstLevel = sublevel.sublevelNumber === 0;
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
    let motion = new Vector(0, this.speed.y * step);
    let newPos = this.pos.plus(motion);
    let obstacle = sublevel.obstacleAt(newPos, this.size, 'y');
    this.gravity(sublevel, obstacle, newPos);
    this.jump(step, sublevel, obstacle, motion);
    this.squat();
    this.climbLadder(step, sublevel, obstacle, newPos);
    this.walkingSounds(obstacle);
  }

  gravity(sublevel, obstacle, newPos) {
    let actorAt = sublevel.actorAt(this);
    let oldPos = this.pos;
    if (!obstacle) { this.pos = newPos; }
    if (actorAt && actorAt.type === 'ladder') {
      this.handleLadderGravity(actorAt, oldPos);
    }
    if (obstacle) {
      if ((this.speed.y > 0) && (!keys.up)) { this.speed.y = 0; }
    }
  }

  jump(step, sublevel, obstacle, motion) {
    let actorAt = sublevel.actorAt(this);
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
      } else {
        if (this.action.squatting) {
          this.size = new Vector(2.5, 4.5);
          this.pos.y = this.pos.y - 1.5;
          this.action.squatting = false;
        }
      }
    }
  }

  handleLadderGravity(ladder, oldPos) {
    let preventGravity = () => { this.pos = oldPos; }
    let inLadder = this.coords.top > ladder.coords.top - 4.5;
    let inLadderTop = this.coords.bottom < ladder.coords.top + 5;
    if (inLadder && this.action.climbing || inLadderTop) { preventGravity(); }
  }

  centerPlayerOnLadder(ladder) {
    let left = (this.pos.x < ladder.coords.left - 0.33);
    let right = (this.pos.x > ladder.coords.left - 0.33);
    if (left || right) {
      if (keys.up || keys.down) {
        this.pos.x = ladder.coords.left - 0.3;
      }
    }
  }

  setupClimb(ladder) {
    if (!this.action.climbing) {
      let pressingUpArrow = this.keys && this.keys.up;
      let inLadderBottom = this.coords.bottom > ladder.coords.bottom - 6;
      let inLadderTop = this.coords.top < ladder.coords.top + 6;
      if (pressingUpArrow || !(inLadderBottom) ) {
        this.action.climbing = true;
      }
    }
    if ((this.pos.y > ladder.coords.bottom - 6) && (keys.down)) {
      this.action.climbing = false;
    }
  }

  moveUpAndDownLadder(ladder) {
    let topOfLadder = (this.coords.top < ladder.coords.top);
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
            {lowerBound: 0, upperBound: 4},
            {lowerBound: 5, upperBound: 9},
            {lowerBound: 10, upperBound: 14},
            {lowerBound: 15, upperBound: 19}
          ]
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
    let atBottomOfLadder = this.coords.bottom > (ladder.coords.bottom - 5);
    if (atBottomOfLadder) {
      if (this.coords.bottom > ladder.coords.bottom + 0.9) {
        this.pos.y = ladder.coords.bottom - this.size.y + 0.5;
      }
    }
  }

  climbLadder(step, sublevel, obstacle, newPos) {
    let actorAt = sublevel.actorAt(this);
    if (actorAt && actorAt.type === 'ladder') {
      let ladder = actorAt;
      let playerIsOnLadder = (
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

  walkingSounds(obstacle) {
    const self = this;
    const playAudio = (audioId, type) => {
      const audioEl = document.querySelector(`.${audioId}`);
      if (obstacle && obstacle.type === type) {
        if (keys.right || keys.left) {
          if (!self.audioLoaded) {
            jamjar.play(audioId, 'loop');
            self.audioLoaded = true;
          }
          if (audioEl.paused) {
            audioEl.volume = .4;
            audioEl.currentTime = 0;
            setTimeout(() => { if (audioEl.paused) { audioEl.play();} }, 150);
          }
        } else { if (!audioEl.paused) { audioEl.pause(); } }
      } else { if (!audioEl.paused) { audioEl.pause(); } }
    }
    playAudio('walking-on-grass', 'grass');
    playAudio('walking-on-water', 'water');
    playAudio('walking-on-wood', 'wood');
  }

  removeSword(sublevel, swordToBeRemoved) {
    sublevel.player.swords = sublevel.player.swords.filter((sword) => {
      return sword !== swordToBeRemoved;
    });
  }

  moveSwords(step, sublevel) {
    if (keys.spacebar) {
      if (this.swordLoaded) {
        jamjar.play('sword');
        this.swords.push(new Sword(sublevel.player.pos));
        this.swordLoaded = false;
      }
    }
    if (!keys.spacebar) { this.swordLoaded = true; }
    sublevel.player.swords.forEach(swordCheck => {
      const obstacle = sublevel.obstacleAt(swordCheck.pos, swordCheck.size);
      if (obstacle) {
        if (obstacle.type === 'wall') { this.removeSword(sublevel, swordCheck); }
      }
      const xSword = swordCheck.pos.x;
      const xPlayer = sublevel.player.pos.x;
      const movedFarAway = (
        (xSword > xPlayer + 200) || (xSword < xPlayer - 200)
      )
      if (movedFarAway) { this.removeSword(sublevel, swordCheck); }
    });
    this.swords.forEach(sword => {
      sword.act(step, sublevel, keys);
    })
  }
}
export default Player