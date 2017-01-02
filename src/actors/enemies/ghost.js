import Vector from '../../vector';
import Unstick from '../../unstick';

class Ghost {
  constructor(pos, type) {
    this.pos = pos;
    this.damaged = false;
    this.images = {gliding:  'images/enemies/ghost/gliding-01.png'}
    this.unstick = new Unstick;
    this.ghostimageswapCounter = 0;
    this.ghostMoveCounter = 0;
    this.ghostVisibilityCounter = Math.ceil(Math.random() * 1000);
    this.opacity = '3';
    this.lifeMeter = 30;
    this.size = new Vector(9, 11);
    this.type = 'ghost';
    this.actorType = 'enemy';
    this.speed = new Vector(3, 0);
    this.action = { gliding: true }
    this.direction = (Math.round(Math.random()) === 1) ? 'right' : 'left'
    this.speed = (this.direction === 'left') ? this.speed.times(-1) : this.speed;
  }

  moveX(step, sublevel) {
    let self = this;
    let newPos = this.pos;
    newPos.x = this.pos.x + this.speed.times(step).x;
    this.pos = newPos;
    let obstacle = sublevel.obstacleAt(newPos, this.size, this);
    let xStart = Math.floor(this.pos.x);
    let xEnd   = Math.ceil(this.pos.x + this.size.x);
    let yStart = Math.floor(this.pos.y);
    let yEnd   = Math.ceil(this.pos.y + this.size.y);
    let leftSublevelEnd = xStart < 0;
    let rightSublevelEnd = xEnd > sublevel.width;
    let topSublevelEnd = yStart < 0
    let imgSwap = (lowerBound, upperBound, spriteName) => {
        if ((self.ghostimageswapCounter > lowerBound - 1) && (self.ghostimageswapCounter < upperBound + 1)) {
          self.images.gliding = 'images/enemies/ghost/' + spriteName;
        }
    }
      this.ghostimageswapCounter += 1;
      this.ghostimageswapCounter === 40 ? this.ghostimageswapCounter = 0 : this.ghostimageswapCounter = this.ghostimageswapCounter;
      imgSwap(0,  7,  'gliding-01.png');
      imgSwap(8,  15,  'gliding-01.png');
      imgSwap(16, 23, 'gliding-01.png');
      imgSwap(24, 31, 'gliding-01.png');
      imgSwap(32, 39, 'gliding-01.png');
    if (obstacle) {
      if (leftSublevelEnd || rightSublevelEnd || topSublevelEnd) {
        this.speed = this.speed.times(-1);
        if (this.direction === 'right') {
          this.direction = 'left';
        } else {
          this.direction = 'right';
        }
      } else {
        let ghostBottomYPos = this.pos.y + this.size.y;
        let obstacleYPos = obstacle.pos.y;
        let xAxisObstacle = ghostBottomYPos > obstacleYPos;
        let yAxisObstacle = ghostBottomYPos <= obstacleYPos;
        if (xAxisObstacle) {
          this.speed = this.speed.times(-1);
          if (this.direction === 'right') {
            this.direction = 'left';
          } else {
            this.direction = 'right';
          }
        }
      }
      let actorsLeftPos = Math.floor(this.pos.x);
      this.unstick.x(this, obstacle, actorsLeftPos)
    }
    self.ghostMoveCounter += 1;
    if (self.ghostMoveCounter === 400) {
        self.ghostMoveCounter = 0;
        self.speed = this.speed.times(-1);
      if (this.direction === 'right') {
        this.direction = 'left';
      } else {
        this.direction = 'right';
      }
    }
    self.ghostVisibilityCounter += 1;
    if (self.ghostVisibilityCounter === 1300) {
      self.ghostVisibilityCounter = 0;
    }
    if ((self.ghostVisibilityCounter >= 300) && (self.ghostVisibilityCounter < 310)) {
      self.opacity = '0.5';
    } else if ((self.ghostVisibilityCounter >= 310) && (self.ghostVisibilityCounter < 320)) {
      self.opacity = '0.2';
    } else if ((self.ghostVisibilityCounter >= 320) && (self.ghostVisibilityCounter < 330)) {
      self.opacity = '0.05';
    } else if ((self.ghostVisibilityCounter >= 330) && (self.ghostVisibilityCounter <= 600)) {
      self.opacity = '0.0';
    } else if ((self.ghostVisibilityCounter >= 600) && (self.ghostVisibilityCounter <= 610)) {
      self.opacity = '0.05';
    } else if ((self.ghostVisibilityCounter >= 610) && (self.ghostVisibilityCounter <= 620)) {
      self.opacity = '0.2';
    } else if ((self.ghostVisibilityCounter >= 620) && (self.ghostVisibilityCounter <= 630)) {
      self.opacity = '0.5';
    } else {
      self.opacity = '0.9';
    }
  }

  act(step, sublevel) { this.moveX(step, sublevel); }
}

export default Ghost
