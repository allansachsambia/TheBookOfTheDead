import Vector from '../../vector';

class Skeleton {
  constructor(pos, type) {
    this.pos = pos;
    this.fightPos = { x: null, y: null };
    this.images = { walking: 'images/enemies/skeleton/striking-01.png' }
    this.direction = 'right';
    this.skeletonCounter = 0;
    this.size = new Vector(9, 9);
    this.unstick = new Unstick
    this.lifeMeter = 10;
    this.action = { walking: true }
    this.type = 'skeleton';
    this.actorType = 'enemy';
    this.speed = new Vector(3, 0);
    this.coords = {
      left: this.pos.x,
      right: this.pos.x + this.size.x,
      top: this.pos.y,
      bottom: this.pos.y + this.size.y
    };
  }

  act(step, sublevel) {
    this.moveX(step, sublevel);
    this.moveY(step, sublevel);
  }

  moveX(step, sublevel) {
    let self = this;
    if (self.fightPos.x === null) { self.fightPos.x = this.pos.x; }
    let imgSwap = (lowerBound, upperBound, imageName, size) => {
      if ((self.skeletonCounter > lowerBound - 1) && (self.skeletonCounter < upperBound + 1)) {
        if (size) {
          if (self.fightPos) {
            if (self.direction === 'left') {
              self.pos.x = ((self.fightPos.x + 2.5) - (size.x)).toFixed(2);
            }
          }
          self.size.x = size.x;
        }
        self.images.walking = 'images/enemies/skeleton/' + imageName;
      }
    }
    this.skeletonCounter += 1;
    this.skeletonCounter === 40 ? this.skeletonCounter = 0 : this.skeletonCounter = this.skeletonCounter;
    imgSwap(0,  19, 'striking-01.png', {x:5,y:9});
    imgSwap(11, 20, 'striking-02.png', {x:6,y:9});
    imgSwap(21, 29, 'striking-03.png', {x:6,y:9});
    imgSwap(30, 39, 'striking-04.png', {x:8,y:9});
    imgSwap(31, 39, 'striking-05.png', {x:9,y:9});
    if ((sublevel.player.pos.y >= this.pos.y) &&  (sublevel.player.pos.y <= this.pos.y + 2))  {
      if ((sublevel.player.pos.x > this.pos.x - 200) || (sublevel.player.pos.x < this.pos.x + 200)) {
        let playersDirection;
        if (sublevel.player.pos.x < this.pos.x) {
          playersDirection = 'left';
        } else if (sublevel.player.pos.x > this.pos.x) {
          playersDirection = 'right';
        }
        let turnAround = false;
        if (playersDirection === 'left' && this.direction === 'right') {
          turnAround = true;
        } else if (playersDirection === 'right' &&  this.direction === 'left') {
          turnAround = true;
        } else {
          turnAround = false;
        }

        if (turnAround) {
          self.speed = this.speed.times(-1);
          this.direction === 'right' ? this.direction = 'left' : this.direction = 'right';
        }
      }
    }
  }

  moveY(step, sublevel) {
    this.speed.y = 20
    let motion = new Vector(0, this.speed.y * step);
    let newPos = this.pos.plus(motion);
    let obstacle = sublevel.obstacleAt(newPos, this.size, 'y');
    if (!obstacle) { this.pos = newPos }
  }

}

export default Skeleton
