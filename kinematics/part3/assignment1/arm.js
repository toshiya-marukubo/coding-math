class Arm{
  constructor(x, y, length, angle, i) {
    this.x = x;
    this.y = y;
    this.length = length;
    this.angle = angle;
    this.i = i;
    this.parent = null;
  }

  getEndX() {
    return this.x + Math.cos(this.angle) * this.length;
  }

  getEndY() {
    return this.y + Math.sin(this.angle) * this.length;
  }

  render(c) {
    c.strokeStyle = `hsl(${360 * this.i}, 80%, 60%)`;
    c.lineWidth = gui.params.lineWidth;
    c.lineCap = 'round';
    c.beginPath();
    c.moveTo(this.x, this.y);
    c.lineTo(this.getEndX(), this.getEndY());
    c.stroke();
  }

  pointAt(x, y) {
    const dx = x - this.x;
    const dy = y - this.y;

    this.angle = Math.atan2(dy, dx);
  }

  drag(x, y) {
    this.pointAt(x, y);

    this.x = x - Math.cos(this.angle) * this.length;
    this.y = y - Math.sin(this.angle) * this.length;
     
    if (this.parent) {
      this.parent.drag(this.x, this.y);
    }

    this.updatePosition();
  }

  updatePosition() {
    if (this.parent) {
      let dx = (this.getEndX() - this.parent.x) * gui.params.beta;
      let dy = (this.getEndY() - this.parent.y) * gui.params.beta;
      dx *= gui.params.delta;
      dy *= gui.params.delta;

      this.x += dx;
      this.y += dy;
    }
  }
}
