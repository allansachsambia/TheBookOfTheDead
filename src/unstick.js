class Unstick {
  constructor(x, y) {
    this.stuckCheck = {
      check01: null,
      check02: null,
      check03: null,
      check04: null,
      check05: null,
      check06: null,
    };
    this.stuck = null;
    this.stuckDirection = null;
  }

  static x(actor, xAxisObstacle, actorsLeftPos) {
    function fillSixPositions() {
      if (actor.unstick.stuckCheck.check01 === null) {
        actor.unstick.stuckCheck.check01 = actor.pos.x;
      } else if (actor.unstick.stuckCheck.check02 === null) {
        actor.unstick.stuckCheck.check02 = actor.pos.x;
      } else if (actor.unstick.stuckCheck.check03 === null) {
        actor.unstick.stuckCheck.check03 = actor.pos.x;
      } else if (actor.unstick.stuckCheck.check04 === null) {
        actor.unstick.stuckCheck.check04 = actor.pos.x;
      } else if (actor.unstick.stuckCheck.check05 === null) {
        actor.unstick.stuckCheck.check05 = actor.pos.x;
      } else if (actor.unstick.stuckCheck.check06 === null) {
        actor.unstick.stuckCheck.check06 = actor.pos.x;
      }
    }
    fillSixPositions();
    function allPositionsFilled() {
      if ( (actor.unstick.stuckCheck.check01 !== null) &&
           (actor.unstick.stuckCheck.check02 !== null) &&
           (actor.unstick.stuckCheck.check03 !== null) &&
           (actor.unstick.stuckCheck.check04 !== null) &&
           (actor.unstick.stuckCheck.check05 !== null) &&
           (actor.unstick.stuckCheck.check06 !== null) ) {
        return true;
      } else {
        return false;
      }
    }
    if (allPositionsFilled()) {
      const lowCheck = Math.ceil(actor.unstick.stuckCheck.check01);
      const highCheck = Math.ceil(actor.unstick.stuckCheck.check05);
      const highestCheck = Math.ceil(actor.unstick.stuckCheck.check06);
      if (lowCheck === highCheck || lowCheck === highestCheck) {
        actor.unstick.stuck = true;
      } else {
        actor.unstick.stuck = false;
        actor.unstick.stuckCheck.check01 = null;
        actor.unstick.stuckCheck.check02 = null;
        actor.unstick.stuckCheck.check03 = null;
        actor.unstick.stuckCheck.check04 = null;
        actor.unstick.stuckCheck.check05 = null;
        actor.unstick.stuckCheck.check06 = null;
        actor.unstick.stuckDirection = null;
      }
    }
    if (actor.unstick.stuck) {
      if (xAxisObstacle.pos.x > actorsLeftPos) {
        actor.unstick.stuckDirection = 'right';
        if (actor.speed.x > 0) { actor.speed = actor.speed.times(-1) }
      }
      if (xAxisObstacle.pos.x <= actorsLeftPos) {
        actor.unstick.stuckDirection = 'left';
        if (actor.speed.x < 0) { actor.speed = actor.speed.times(-1) }
      }
    }
  }
}

export default Unstick
