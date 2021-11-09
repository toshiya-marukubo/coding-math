class Utils{
  static norm(value, min, max) {
    return (value - min) / (max - min);
  }

  static lerp(norm, min, max) {
    return (max - min) * norm + min;
  }

  static map(value, sourceMin, sourceMax, destMin, destMax) {
    return this.lerp(this.norm(value, sourceMin, sourceMax), destMin, destMax);
  }

  static clamp(value, min, max) {
    return Math.min(Math.max(value, Math.min(min, max)), Math.max(min, max));
  }

  static distance(p0, p1) {
    const dx = p1.x - p0.x;
    const dy = p1.y - p0.y;

    return Math.sqrt(dx * dx + dy * dy);
  }

  static distanceXY(x0, y0, x1, y1) {
    const dx = x1 - x0;
    const dy = y1 - y0;

    return Math.sqrt(dx * dx + dy * dy);
  }

  static randomRange(min, max) {
    return min + Math.random() * (max - min);
  }

  static randomInt(min, max) {
    return Math.floor(min + Math.random() * (max - min + 1));
  }

  static randomDist(min, max, iterations) {
    let total = 0;

    for (let i = 0; i < iterations; i++) {
      total += this.randomRange(min, max);
    }

    return total / iterations;
  }

  static degreesToRads(degrees) {
    return degrees / 180 * Math.PI;
  }

  static radsToDegrees(radians) {
    return radians * 180 / Math.PI;
  }

  static roundToPlaces(value, places) {
    const mult = Math.pow(10, places);

    return Math.round(value * mult) / mult;
  }

  static roundNearest(value, nearest) {
    return Math.round(value / nearest) * nearest;
  }

  static circleCollision(c0, c1) {
    return this.distance(c0, c1) <= c0.radius + c1.radius;
  }

  static circlePointCollision(x, y, circle) {
    return this.distanceXY(x, y, circle.x, circle.y) < circle.radius;
  }

  static pointInRect(x, y, rect) {
    return this.inRange(x, rect.x, rect.x + rect.width) &&
           this.inRange(y, rect.y, rect.y + rect.height);
  }

  static inRange(value, min, max) {
    return value >= Math.min(min, max) && value <= Math.max(min, max);
  }

  static rangeIntersect(min0, max0, min1, max1) {
    return Math.max(min0, max0) >= Math.min(min1, max1) &&
           Math.min(min0, max0) <= Math.max(min1, max1);
  }

  static rectIntersect(r0, r1) {
    return this.rangeIntersect(r0.x, r0.x + r0.width, r1.x, r1.x + r1.width) &&
           this.rangeIntersect(r0.y, r0.y + r0.height, r1.y, r1.y + r1.height);
  }
}
