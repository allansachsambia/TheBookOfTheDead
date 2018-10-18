import Vector from "./vector";
import { settings, actorChars, obstacleChars } from "./globals";
import audio from "./audio";
import keys from "./keys";

class Sublevel {
  constructor(map, mapNumber, status) {
    this.mapNumber = mapNumber;
    this.map = map;
    this.width = map[0].length;
    this.height = map.length;
    this.actors = [];

    this.typeMap = map.map((row, y) => {
      return row.split("").map((char, x) => {
        const Actor = actorChars[char];
        if (Actor) {
          this.actors.push(new Actor(new Vector(x, y), char));
        }
        return obstacleChars[char] ? obstacleChars[char] : null;
      });
    });

    this.player = this.actors.filter(actor => actor.type === "player")[0];
    this.status = status;
  }

  animate(step) {
    this.statusTimer();
    this.actors.forEach(actor => {
      if (actor.act) {
        actor.act(step, this);
      }
    }, this);
  }

  statusTimer() {
    this.status.time = this.status.time - 1;
    if (this.status.time === 0) {
      this.status.condition = "lost";
    }
  }

  obstacleAt(newPos, size, buffer) {
    const offScreen = {
      left: Math.floor(newPos.x + 3) < 0,
      right: Math.ceil(newPos.x + size.x - 3) > this.width,
      top: Math.floor(newPos.y) < 0,
      bottom: Math.ceil(newPos.y + size.y) > this.height
    };
    const coordsOffScreen = offScreen.left || offScreen.top || offScreen.right;
    if (coordsOffScreen) {
      return "wall";
    }
    const actorHasFallen = Math.ceil(newPos.y + size.y) > this.height;
    if (actorHasFallen) {
      return "fallen";
    }

    const newCoords = {
      left: Math.floor(newPos.x) + buffer.x,
      right: Math.ceil(newPos.x + size.x) - buffer.x,
      top: Math.floor(newPos.y),
      bottom: Math.ceil(newPos.y + size.y)
    };
    for (let y = newCoords.top; y < newCoords.bottom; y += 1) {
      for (let x = newCoords.left; x < newCoords.right; x += 1) {
        if (this.typeMap[y] && this.typeMap[y][x]) {
          const type = this.typeMap[y][x];
          return { type, pos: { x, y } };
        }
      }
    }
  }

  actorAt(actor) {
    for (let i = 0; i < this.actors.length; i += 1) {
      const otherActor = this.actors[i];
      const xBuffer = actor.buffer.x + otherActor.buffer.x;
      const yBuffer = actor.buffer.y + otherActor.buffer.y;
      const actorsOverlap =
        actor.coords.right - xBuffer > otherActor.coords.left &&
        actor.coords.left < otherActor.coords.right - xBuffer &&
        actor.coords.bottom > otherActor.coords.top &&
        actor.coords.top + yBuffer < otherActor.coords.bottom;
      const yOverlap =
        actor.coords.bottom > otherActor.coords.top &&
        actor.coords.top < otherActor.coords.bottom;
      if (otherActor !== actor && actorsOverlap) {
        return otherActor;
      }
    }
    return null;
  }
}

export default Sublevel;
