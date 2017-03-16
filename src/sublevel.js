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
    this.status.sublevelNumber = this.mapNumber + 1;

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

  obstacleAt(pos, size, axis, actorCategory) {
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

      if (actorCategory === 'player') {
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
    for (let i = 0; i < this.actors.length; i += 1) {
      const otherActor = this.actors[i];
      const xBuffer = actor.buffer.x + otherActor.buffer.x;
      const yBuffer = actor.buffer.y + otherActor.buffer.y;
      const actorsOverlap = (
        actor.coords.right - xBuffer > otherActor.coords.left
        && actor.coords.left < otherActor.coords.right - xBuffer
        && actor.coords.bottom > otherActor.coords.top
        && actor.coords.top + yBuffer < otherActor.coords.bottom
      );
      const yOverlap = (
        actor.coords.bottom > otherActor.coords.top
        && actor.coords.top < otherActor.coords.bottom
      )
      if (otherActor !== actor && actorsOverlap) {
        return otherActor;
      }
    }
    return null;
  }

}

export default Sublevel
