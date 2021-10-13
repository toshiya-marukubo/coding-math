class Point{
  constructor(x, y) {
    this.c = new Vector2(x, y);

    this.initialize();
  }

  initialize() {
    this.v = new Vector2(Math.cos(Math.PI * 2 * Math.random()), Math.sin(Math.PI * 2 * Math.random()));
    this.g = 0.15;
  }

  updatePosition() {
    this.v.y += this.g;
    this.c.add(this.v.clone().mult(gui.params.speed));
  }

  bounceOffTheWall() {
    if (this.c.x < 0) {
      this.v.x *= -1;
      this.c.x = 0;
    }

    if (this.c.x > width) {
      this.v.x *= -1;
      this.c.x = width;
    }

    if (this.c.y < 0) {
      this.v.y *= -1;
      this.v.y *= Math.random();
      this.c.y = 0;
    }

    if (this.c.y > height) {
      if (Math.random() < 0.1) {
        this.v.y *= -1;
        this.v.y -= 1;
      } else {
        this.v.y *= -1;
      }

      this.c.y = height;
    }
  }

  render() {
    this.updatePosition();
    this.bounceOffTheWall();
  }
}
