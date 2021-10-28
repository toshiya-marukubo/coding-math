class Particle {
  constructor() {
    this.position = null;
    this.velocity = null;
    this.gravity = null;
  }

  create(x, y, speed, direction, gravity) {
    const obj = new this.constructor();
    const vector = new Vector();

    obj.position = vector.create(x, y);
    obj.velocity = vector.create(0, 0);
    obj.velocity.setLength(speed);
    obj.velocity.setAngle(direction);
    obj.gravity = vector.create(0, gravity || 0);

    return obj;
  }

  accelerate(accel) {
    this.velocity.addTo(accel);
  }

  update() {
    this.velocity.addTo(this.gravity);
    this.position.addTo(this.velocity);
  }
}
