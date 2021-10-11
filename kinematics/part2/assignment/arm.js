class Arm {
  constructor() {
    this.x = 0;
    this.y = 0;
    this.angle = 0;
    this.scale = 0;
    this.length = 0;
    this.centerAngle = 0;
    this.rotationRange = Math.PI / 4;
    this.parent = null;
    this.phaseOffset = 0;
  }

  create(length, centerAngle, rotationRange, phaseOffset, scale) {
    const obj = new this.constructor();
    obj.initialize(length, centerAngle, rotationRange, phaseOffset, scale);

    return obj;
  }

  initialize(length, centerAngle, rotationRange, phaseOffset, scale) {
    this.length = length;
    this.centerAngle = centerAngle;
    this.rotationRange = rotationRange;
    this.phaseOffset = phaseOffset;
    this.scale = scale;
  }

  setPhase(phase) {
    this.angle = this.centerAngle + Math.sin(phase + this.phaseOffset) * this.rotationRange;
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
    c.lineCap = 'round';
    c.lineWidth = 30 * this.scale;

    if (this.parent === null) {
      // body
      c.beginPath();
      c.moveTo(this.x, this.y);
      c.lineTo(this.x, this.y - this.length);
      c.stroke();
      // head
      c.beginPath();
      c.arc(this.x, this.y - this.length, gui.params.maxSize * this.scale, 0, Math.PI * 2, false);
      c.fill();
      // shadow
      c.save();
      c.globalAlpha = 0.03;
      c.beginPath();
      c.ellipse(this.x, this.y + this.length * 2, this.length * 3 * this.scale, this.length / 2 * this.scale, 0, Math.PI * 2, false);
      c.fill();
      c.restore();
    }

    c.beginPath();
    c.moveTo(this.x, this.y);
    c.lineTo(this.getEndX(), this.getEndY());
    c.stroke();
  }
}
