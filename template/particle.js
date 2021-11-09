class Particle {
  constructor(vector) {
    this.vector = vector;
    this.position = null;
    this.velocity = null;
    this.gravity = null;
    this.mass = 1;
    this.radius = 0;
    this.bounce = -1;
    this.friction = 1;
  }

  create(x, y, speed, direction, gravity) {
    const obj = new this.constructor(this.vector);

    obj.position = this.vector.create(x, y);
    obj.velocity = this.vector.create(0, 0);
    obj.velocity.setLength(speed);
    obj.velocity.setAngle(direction);
    obj.gravity = this.vector.create(0, gravity || 0);

    return obj;
  }

  accelerate(accel) {
    this.velocity.addTo(accel);
  }

  angleTo(p2) {
    return Math.atan2(p2.position.getY() - this.position.getY(), p2.position.getX() - this.position.getX());
  }

  distanceTo(p2) {
    const dx = p2.position.getX() - this.position.getX();
    const dy = p2.position.getY() - this.position.getY();

    return Math.sqrt(dx * dx + dy * dy);
  }

  gravitateTo(p2) {
    const grav = this.vector.create(0, 0);
    const dist = this.distanceTo(p2); 

    grav.setLength(p2.mass / (dist * dist));
    grav.setAngle(this.angleTo(p2));

    this.velocity.addTo(grav);
  }

  update() {
    this.velocity.multiplyBy(this.friction);
    this.velocity.addTo(this.gravity);
    this.position.addTo(this.velocity);
  }
}
