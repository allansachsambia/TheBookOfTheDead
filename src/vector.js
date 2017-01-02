class Vector {
  constructor(x,y) {
    this.x = x;
    this.y = y;
  }
  plus(step) { return new Vector(this.x + step.x, this.y + step.y); }
  times(factor) { return new Vector(this.x * factor, this.y * factor); }
}

export default Vector
