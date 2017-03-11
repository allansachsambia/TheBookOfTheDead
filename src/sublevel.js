import Vector from './vector';
import { settings, actorChars, obstacleChars } from './globals';
import helpers from './helpers';
import audio from './audio';
import keys from './keys';

class Sublevel {

  constructor(map, mapNumber, status) {
    this.mapNumber = mapNumber;
    this.map = map;
    this.width = map[0].length;
    this.height = map.length;
    this.typeMap = [];
    this.actors = [];
    for (let y = 0; y < this.height; y += 1) {
      const line = map[y];
      const gridLine = [];
      for (let x = 0; x < this.width; x += 1) {
        const character = line[x];
        const Actor = actorChars[character];
        let type = null;
        if (Actor) {
          this.actors.push(new Actor(new Vector(x, y), character));
        }
        Object.keys(obstacleChars).forEach((key) => {
          if (character === key) { type = obstacleChars[key]; }
        });
        gridLine.push(type);
      }
      this.typeMap.push(gridLine);
    }
    this.player = this.actors.filter(actor => actor.type === 'player')[0];
    this.status = status;
    this.status.mapNumber = mapNumber;
    this.status.levelNumber = 1;
  }

  animate(step) {
    this.statusTimer();
    this.actors.forEach((actor) => {
      if (actor.act) {
        actor.act(step, this);
      }
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

  obstacleAt(pos, size, axis, actorType) {
    const actor = {
      x: {
        left: Math.floor(pos.x),
        right: Math.ceil(pos.x + size.x),
      },
      y: {
        top: Math.floor(pos.y),
        bottom: Math.ceil(pos.y + size.y),
      },
      offScreen: {
        left: Math.floor(pos.x + 3) < 0,
        right: Math.ceil((pos.x + size.x) - 3) > this.width,
        top: Math.floor(pos.y) < 0,
        bottom: Math.ceil(pos.y + size.y) > this.height,
      },
    };
    if (actor.offScreen.left || actor.offScreen.top || actor.offScreen.right) {
      return 'wall';
    } else if (actor.offScreen.bottom) {
      return 'fallen';
    }
    for (let y = actor.y.top; y < actor.y.bottom; y += 1) {
      let xDirection;
      let yDirection;

      if (actorType === 'player') {
        for (let x = (actor.x.left + 3); x < (actor.x.right - 3); x += 1) {
          if (this.typeMap[y]) {
            const type = this.typeMap[y][x];
            if (type) {
              if (axis) {
                if (axis === 'x') {
                  xDirection = actor.x.left < x ? 'right' : 'left';
                  yDirection = null;
                }
                if (axis === 'y') {
                  xDirection = null;
                  yDirection = actor.y.top < y ? 'bottom' : 'top';
                }
              }
              return {
                type,
                pos: { x, y },
                direction: {
                  x: xDirection,
                  y: yDirection,
                },
              };
            }
          }
        }
      } else {
        for (let x = actor.x.left; x < actor.x.right; x += 1) {
          if (this.typeMap[y]) {
            const type = this.typeMap[y][x];
            if (type) {
              if (axis) {
                if (axis === 'x') {
                  xDirection = actor.x.left < x ? 'right' : 'left';
                  yDirection = null;
                }
                if (axis === 'y') {
                  xDirection = null;
                  yDirection = actor.y.top < y ? 'bottom' : 'top';
                }
              }
              return {
                type,
                pos: { x, y },
                direction: {
                  x: xDirection,
                  y: yDirection,
                },
              };
            }
          }
        }
      }
    }
  }

  actorAt(actor) {
    if (actor.type === 'player') {
      for (let i = 0; i < this.actors.length; i += 1) {
        const otherActor = this.actors[i];
        if (otherActor !== actor &&
          actor.pos.x + (actor.size.x - 3) > otherActor.pos.x &&
          actor.pos.x < otherActor.pos.x + (otherActor.size.x - 3) &&
          actor.pos.y + actor.size.y > otherActor.pos.y &&
          actor.pos.y < otherActor.pos.y + otherActor.size.y
        ) { return otherActor; }
      }
    }
    if (actor.type !== 'player') {
      for (let i = 0; i < this.actors.length; i += 1) {
        const otherActor = this.actors[i];
        if (otherActor !== actor &&
          actor.pos.x + actor.size.x > otherActor.pos.x &&
          actor.pos.x < otherActor.pos.x + otherActor.size.x &&
          actor.pos.y + actor.size.y > otherActor.pos.y &&
          actor.pos.y < otherActor.pos.y + otherActor.size.y
        ) { return otherActor; }
      }
    }
  }

  playerHit(obstacle) {
    const player = this.player;
    if (!player.damaged) {
      audio.play('hurt');
      player.lifeMeter -= 1;
      player.damaged = true;
      setTimeout(() => {
        player.damaged = false;
        player.damageTimer = 0;
      }, 600);
    }
  }

  damageEffects(obstacle) {
    const self = this;
    self.player.damageTimer += 1;
    if (self.player.damageTimer === 10) { self.player.damageTimer = 1; }
    if (self.player.damageTimer > 0 && self.player.damageTimer < 9) {
      self.player.damageFilter = 'lowOpacity';
    } else if (self.player.damageTimer > 8 && self.player.damageTimer < 10) {
      self.player.damageFilter = 'highOpacity';
    }
  }

  playerTouchedEnemy(obstacle) {
    const self = this;
    const playerStillAlive = (this.player.lifeMeter > 0);
    if (obstacle.type === 'ghost') {
      const enemyIsVisible = !(obstacle.opacity === '0.0');
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
    const type = obstacle.type;
    switch (type) {
      case 'flag': {
        audio.play('flag');
        this.actors = this.actors.filter(other => other !== obstacle);
        const flagCollected = !this.actors.some(actor => actor.type === 'flag');
        if (flagCollected) { this.status.condition = 'won'; }
        break;
      }
      case 'door': {
        if (keys.up) {
          this.actors = this.actors.filter(other => other !== obstacle);
          const openedDoor = !this.actors.some(actor => actor.type === 'door');
          if (openedDoor) { this.status.condition = 'won'; }
        }
        break;
      }
      case 'pizza': {
        audio.play('pizza');
        this.actors = this.actors.filter(other => other !== obstacle);
        if (this.player.lifeMeter < 10) { this.player.lifeMeter += 1; }
        break;
      }
      default:
    }
  }

  playerTouched(obstacle) {
    switch (obstacle.actorType) {
      case 'enemy':
        this.playerTouchedEnemy(obstacle);
        break;
      case 'item':
        this.playerTouchedItem(obstacle);
        break;
      default:
    }
  }

  daggerTouchedActor(obstacle, actor) {
    const hit = (increment, deathRattle) => {
      audio.play('kill-shot');
      if (obstacle.lifeMeter > 0) {
        obstacle.lifeMeter -= 1;
        obstacle.damaged = true;
        setTimeout(() => { obstacle.damaged = false; }, 100);
      } else {
        this.actors = this.actors.filter(other => other !== obstacle);
      }
      this.player.daggers = this.player.daggers.filter(dagger => dagger !== actor);
      this.status.score += increment;
    };
    switch (obstacle.type) {
      case ('zombie'):
        hit(400);
        break;
      case ('skeleton'):
        hit(100);
        break;
      case ('ghost'):
        hit(100, 'ghost-death');
        break;
      default:
    }
  }

  swordTouchedActor(obstacle, actor) {
    const hit = (increment, deathRattle) => {
      audio.play('kill-shot');
      if (obstacle.lifeMeter > 0) {
        obstacle.lifeMeter -= 1;
        obstacle.damaged = true;
        setTimeout(() => { obstacle.damaged = false; }, 100);
      } else {
        this.actors = this.actors.filter(other => other !== obstacle);
      }
      this.player.swords = this.player.swords.filter(sword => sword !== actor);
      this.status.score += increment;
    };
    switch (obstacle.type) {
      case ('zombie'):
        hit(400);
        break;
      case ('skeleton'):
        hit(100);
        break;
      case ('ghost'):
        hit(100, 'ghost-death');
        break;
      default:
    }
  }
}

export default Sublevel
