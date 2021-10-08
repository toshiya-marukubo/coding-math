class Arm {
  constructor(x, y, length, angle) {
    this.x = x;
    this.y = y;
    this.length = length;
    this.angle = angle;
    this.parent = null;
  }

  create(x, y, length, angle) {
    const obj = new this.constructor();
    obj.initialize(x, y, length, angle);

    return obj;
  }

  initialize(x, y, length, angle) {
    this.x = x;
    this.y = y;
    this.length = length;
    this.angle = angle;
  }

  getEndX() {
    let angle = this.angle;
    let parent = this.parent;

    while (parent) {
      angle += parent.angle;
      parent = parent.parent;
    }

    return Math.cos(angle) * this.length + this.x;
  }

  getEndY() {
    let angle = this.angle;
    let parent = this.parent;

    while (parent) {
      angle += parent.angle;
      parent = parent.parent;
    }
    
    return Math.sin(angle) * this.length + this.y;
  }

  render(c) {
    c.lineWidth = 10;
    c.lineCap = 'round';
    c.beginPath();
    c.moveTo(this.x, this.y);
    c.lineTo(this.getEndX(), this.getEndY());
    c.stroke();
  }
}
