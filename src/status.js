import Vector from './vector';
import { settings, actorChars, obstacleChars } from './globals';
import keys from './keys';

class Status {
  constructor() {
    this.lifeMeter = 10;
    this.name = 'Wanda'.toUpperCase();
    this.score = 0;
    this.sublevelNumber = 0;
    this.levelNumber = 0;
    this.time = 10000;
    this.condition = null;
  }
}

export default Status
