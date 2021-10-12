class IKSystem{
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.arms = [];
    this.lastArm = null;
  }

  addArm(length) {
    const arm = new Arm(0, 0, length, 0);

    if (this.lastArm) {
      arm.x = this.lastArm.getEndX();
      arm.y = this.lastArm.getEndY();
      arm.parent = this.lastArm;
    } else {
      arm.x = this.x;
      arm.y = this.y;
    }

    this.arms.push(arm);
    this.lastArm = arm;
  }

  render (c) {
    for (let i = 0; i < this.arms.length; i++) {
      this.arms[i].render(c);
    }
  }

  drag(x, y) {
    this.lastArm.drag(x, y);
  }
}
