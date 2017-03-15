import Vector from '../vector';
import audio from '../audio';
import keys from '../keys';

/**
 * A long range weapon.
 */
class Dagger {
  constructor(pos) {
    this.type = 'dagger';
    this.type = 'item';
    this.pos = pos;
    this.size = new Vector(3, 1);
    this.innerSize = new Vector(3, 1);
    this.size = new Vector(0, 0);
    this.direction = null;
    this.speed = new Vector(0.7, 0);
    this.throwDirection = null;
    this.coords = {
      left: this.pos.x,
      right: this.pos.x + this.size.x,
      top: this.pos.y,
      bottom: this.pos.y + this.size.y,
    };
  }

  /* ==== ACT ===============================================================
     ======================================================================== */

  act(step, sublevel) {
    this.setThrowDirection();
    this.daggerTouchedActor(this);
    this.setDirection();
  }

  /* ==== SETTINGS ==========================================================
     ======================================================================== */

  setThrowDirection() {
    if (!this.throwDirection) {
      if (sublevel.player.direction === 'right') {
        this.throwDirection = 'right';
      } else {
        this.throwDirection = 'left';
      }
    }
  }

  setDirection() {
    if (this.throwDirection === 'right') {
      this.direction = 'right';
      const newPos = this.pos.plus(new Vector(0.9, 0));
      this.pos = newPos;
    } else {
      this.direction = 'left';
      const newPos = this.pos.plus(new Vector(-0.9, 0));
      this.pos = newPos;
    }
  }

  /* ==== INTERACTIONS =========================================================
     ======================================================================== */

  daggerTouchedActor(sublevel) {
    const actor = sublevel.actorAt(this);
    if (otherActor) {
      const hit = (increment) => {
        audio.play('kill-shot');
        if (actor.lifeMeter > 0) {
          actor.lifeMeter -= 1;
          actor.damaged = true;
          setTimeout(() => { actor.damaged = false; }, 100);
        } else {
          sublevel.actors = sublevel.actors.filter(other => other !== actor);
        }
        sublevel.player.daggers = sublevel.player.daggers.filter(dagger => dagger !== this);
        sublevel.status.score += increment;
      };
      switch (actor.type) {
        case ('zombie'):
          hit(400);
          break;
        default:
      }
    }
  }

}

export default Dagger;
