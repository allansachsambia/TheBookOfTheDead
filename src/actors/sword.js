import Vector from "../vector";
import audio from "../audio";
import keys from "../keys";

class Sword {
  constructor(pos) {
    this.type = "sword";
    this.category = "item";
    this.pos = pos;
    this.size = new Vector(5, 1);
    this.innerSize = new Vector(1, 1);
    this.buffer = new Vector(0, 0);
    this.direction = null;
    this.speed = new Vector(0.7, 0);
    this.throwDirection = null;
    this.coords = {
      left: this.pos.x,
      right: this.pos.x + this.size.x,
      top: this.pos.y,
      bottom: this.pos.y + this.size.y
    };
  }

  act(step, sublevel) {
    this.resetPos();
    this.adjustSwordPosition(sublevel);
    this.resetCoords();
    this.handleActorStrike(sublevel);
  }

  resetPos() {
    this.pos = this.pos.plus(new Vector(-0.9, 2));
  }

  adjustSwordPosition(sublevel) {
    switch (sublevel.player.direction) {
      case "right":
        this.pos.x = this.pos.x + 4;
        break;
      case "left":
        this.pos.x = this.pos.x;
        break;
      default:
    }
  }

  resetCoords() {
    this.coords = {
      left: this.pos.x,
      right: this.pos.x + this.size.x,
      top: this.pos.y,
      bottom: this.pos.y + this.size.y
    };
  }

  handleActorStrike(sublevel) {
    const otherActor = sublevel.actorAt(this);
    if (otherActor) {
      this.swordTouchedActor(otherActor, sublevel);
    }
  }

  swordTouchedActor(actor, sublevel) {
    if (actor.damaged === false) {
      const hit = increment => {
        if (actor.lifeMeter > 0) {
          audio.play("kill-shot");
          actor.lifeMeter -= 1;
          actor.damaged = true;
          setTimeout(() => {
            actor.damaged = false;
          }, 150);
        }

        if (actor.lifeMeter === 0) {
          sublevel.actors = sublevel.actors.filter(other => other !== actor);
        }
        sublevel.status.score += increment;
      };
      switch (actor.type) {
        case "zombie":
          hit(400);
          break;
        default:
      }
    }
  }
}

export default Sword;
