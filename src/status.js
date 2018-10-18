class Status {
  constructor() {
    this.lifeMeter = 10;
    this.name = "Star".toUpperCase();
    this.score = 0;
    this.mapNumber = 0;
    this.levelNumber = 1;
    this.sublevelNumber = 1;
    this.time = 10000;
    this.condition = null;
  }

  sublevelReset() {
    this.mapNumber = this.mapNumber;
    this.sublevelNumber += 1;
    this.levelNumber = this.levelNumber === 0 ? 1 : this.levelNumber;
    this.condition = null;
  }

  levelReset() {
    this.lifeMeter = 10;
    this.mapNumber = this.mapNumber;
    this.levelNumber += 1;
    this.sublevelNumber = 1;
    this.time = 10000;
    this.condition = null;
  }

  totalReset() {
    this.lifeMeter = 10;
    this.score = 0;
    this.mapNumber = 0;
    this.levelNumber = 1;
    this.sublevelNumber = 1;
    this.time = 10000;
    this.condition = null;
  }
}

export default Status;
