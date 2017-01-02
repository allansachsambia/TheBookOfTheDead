import Vector from './vector';
import { settings, actorChars, obstacleChars } from './globals';
import { jamjar } from './jamjar';
import keys from './keys';

class Sublevel {

  constructor(map, sublevelNumber, status) {
    this.sublevelNumber = sublevelNumber;
    this.map = map;
    this.width = map[0].length;
    this.height = map.length;
    this.typeMap = [];
    this.actors = [];
    for (let y = 0; y < this.height; y++) {
      let line = map[y];
      let gridLine = [];
      for (let x = 0; x < this.width; x++) {
        let character = line[x];
        let Actor = actorChars[character];
        let type = null;
        if (Actor) {
          this.actors.push(new Actor(new Vector(x, y), character));
        }
        Object.keys(obstacleChars).forEach((key) => {
          if (character === key) { type = obstacleChars[key] }
        });
        gridLine.push(type);
      }
      this.typeMap.push(gridLine);
    }
    this.player = this.actors.filter((actor) => {
      return actor.type === 'player';
    })[0];
    this.status = status;
    this.status.sublevelNumber = sublevelNumber
    this.status.levelNumber = 1
  }

  animate(step) {
    this.statusTimer();
    this.actors.forEach((actor) => {
      actor.act(step, this);
    }, this);
  }

  statusTimer() {
    this.status.time = this.status.time - 1;
    if (this.status.time === 0) {
      this.status.condition = 'lost';
    }
  }

  isFinished() {
    return this.status.condition !== null;
  }

  obstacleAt(pos, size, axis) {
    let actor = {
      x: {
        left: Math.floor(pos.x),
        right: Math.ceil(pos.x + size.x),
      },
      y: {
        top: Math.floor(pos.y),
        bottom: Math.ceil(pos.y + size.y),
      },
      offScreen: {
        left: Math.floor(pos.x) < 0,
        right: Math.ceil(pos.x + size.x) > this.width,
        top: Math.floor(pos.y) < 0,
        bottom: Math.ceil(pos.y + size.y) > this.height
      },
    }
    if (actor.offScreen.left || actor.offScreen.top || actor.offScreen.right) {
      return 'wall'
    } else if (actor.offScreen.bottom) {
      return 'fallen'
    }
    for (let y = actor.y.top; y < actor.y.bottom; y++) {
      let xDirection, yDirection;
      for (let x = actor.x.left; x < actor.x.right; x++) {
        if (this.typeMap[y]) {
          let type = this.typeMap[y][x];
          if (type) {
            if (axis) {
              if (axis === 'x') {
                let xDirection = actor.x.left < x ? 'right' : 'left';
                let yDirection = null;
              }
              if (axis === 'y') {
                let xDirection = null;
                let yDirection = actor.y.top < y ? 'bottom' : 'top';
              }
            }
            return {
              type: type,
              pos: { x: x, y: y },
              direction: {
                x: xDirection,
                y: yDirection
              }
            }
          }
        }
      }
    }
  }

  actorAt(actor) {
    for (let i = 0; i < this.actors.length; i++) {
      let otherActor = this.actors[i];
      if (otherActor !== actor &&
        actor.pos.x + actor.size.x > otherActor.pos.x &&
        actor.pos.x < otherActor.pos.x + otherActor.size.x &&
        actor.pos.y + actor.size.y > otherActor.pos.y &&
        actor.pos.y < otherActor.pos.y + otherActor.size.y
      ) { return otherActor; }
    }
  }

  playerHit(obstacle) {
  let player = this.player;
    if (!player.damaged) {
      jamjar.play('hurt');
      player.lifeMeter -= 1;
      player.damaged = true
      setTimeout(() => {
        player.damaged = false;
        player.damageTimer = 0;
      }, 600);
    }
  }

  damageEffects(obstacle) {
    let self = this;
    self.player.damageTimer += 1;
    if (self.player.damageTimer === 10) { self.player.damageTimer = 1; }
    if (self.player.damageTimer > 0 && self.player.damageTimer < 9) {
      self.player.damageFilter = 'lowOpacity';
    } else if (self.player.damageTimer > 8 && self.player.damageTimer < 10)  {
      self.player.damageFilter = 'highOpacity';
    }
  }

  playerTouchedEnemy(obstacle) {
    let self = this;
    let playerStillAlive = (this.player.lifeMeter > 0);
    if (obstacle.type === 'ghost') {
      let enemyIsVisible = !(obstacle.opacity === '0.0');
      if ((playerStillAlive) && (enemyIsVisible)) {
       self.playerHit();
       self.damageEffects();
      }
      if (!(playerStillAlive) && !(enemyIsVisible)) {
        self.status.condition = 'lost';
      }
    }
    if (playerStillAlive) {
     self.playerHit();
     self.damageEffects();
    }
    if (!playerStillAlive) {
      self.status.condition = 'lost';
    }
  }

  playerTouchedItem(obstacle) {
    let self;
    let type = obstacle.type;
    switch (type) {
      case 'coin':
        jamjar.play('coin');
        this.actors = this.actors.filter((other) => {
          return other !== obstacle;
        });
        self.status.score += 500;
        break;
      case 'flag':
        jamjar.play('flag');
        this.actors = this.actors.filter((other) => {
          return other !== obstacle;
        });
        let flagCollected = !this.actors.some((actor) => {
          return actor.type === 'flag';
        });
        if (flagCollected) { this.status.condition = 'won'; }
        break;
      case 'door':
        if (keys.up) {
          this.actors = this.actors.filter((other) => {
            return other !== obstacle;
          });
          let openedDoor = !this.actors.some((actor) => {
            return actor.type === 'door';
          });
          if (openedDoor) { this.status.condition = 'won'; }
        }
        break;
      case 'pizza':
        jamjar.play('pizza');
        this.actors = this.actors.filter((other) => {
          return other !== obstacle;
        });
        if (this.player.lifeMeter < 10) { this.player.lifeMeter += 1; }
        break;
    }
  }

  playerTouched(obstacle) {
    switch (obstacle.actorType) {
      case 'enemy':
        this.playerTouchedEnemy(obstacle);
      case 'item':
        this.playerTouchedItem(obstacle);
    }
  }

  swordTouchedActor(obstacle, actor) {
    let hit = (increment, deathRattle) => {
      jamjar.play('kill-shot');
      if (obstacle.lifeMeter > 0) {
        obstacle.lifeMeter -= 1;
        obstacle.damaged = true
        setTimeout(() => { obstacle.damaged = false; }, 100);
      } else {
        this.actors = this.actors.filter((other) => {
          return other !== obstacle;
        });
      }
      this.player.swords = this.player.swords.filter((sword) => {
        return sword !== actor;
      });
      this.status.score += increment;
    }
    switch (obstacle.type) {
      case ('zombie'):
        hit(400);
        break;
      case ('skeleton'):
        hit(100);
        break;
      case ('ghost'):
        hit(100, 'ghost-death');
    }
  }
}

export default Sublevel
