class Vector2 {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }

  clone() {

    return new this.constructor(this.x, this.y);
  }

  add(v) {
    this.x += v.x;
    this.y += v.y;

    return this;
  }

  sub(v) {
    this.x -= v.x;
    this.y -= v.y;

    return this;
  }

  mult(v) {
    if (v instanceof Vector2) {
      this.x *= v.x;
      this.y *= v.y;
      this.z *= v.z;
      
      return this;
    } else {
      this.x *= v;
      this.y *= v;
      this.z *= v;

      return this;
    }
  }

  abs() {
    this.x = Math.abs(this.x);
    this.y = Math.abs(this.y);

    return this;
  }

  max(v) {
    this.x = Math.max(this.x, v.x);
    this.y = Math.max(this.y, v.y);
    
    return this;
  }

  min(v) {
    this.x = Math.min(this.x, v.x);
    this.y = Math.min(this.y, v.y);
    
    return this;
  }

  dot(v) {

    return this.x * v.x + this.y * v.y;
  }
}
