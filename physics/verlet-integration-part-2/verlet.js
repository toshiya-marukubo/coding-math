class Verlet {
  constructor(w, h, mx, my) {
    this.width = w;
    this.height = h;
    this.mx = mx;
    this.my = my;
    this.points = [];
    this.sticks = [];
    this.forms = [];

    this.initialize();
  }

  distance(p0, p1) {
    const dx = p1.x - p0.x;
    const dy = p1.y - p0.y;

    return Math.sqrt(dx * dx + dy * dy);
  }

  initialize() {
    this.life = 1;
    this.bounce = 0.9;
    this.gravity = 0.5;
    this.friction = 0.99;
    this.elastic = Math.min(Math.random() * 5, 1);
    this.posX = this.mx || this.width / 2;
    this.posY = this.my || this.height / 2;
    this.size = Math.random() * 50 + 30;

    for (let i = 0; i < 4; i++) {
      const x = Math.cos(i / 4 * Math.PI * 2) * this.size + this.posX;
      const y = Math.sin(i / 4 * Math.PI * 2) * this.size + this.posY;
       
      let obj;
      if (i === 0) {
        obj = {
          x: x,
          y: y,
          oldX: x + Math.random() * 100 - 50,
          oldY: y + Math.random() * 100 - 50
        };
      } else {
        obj = {
          x: x,
          y: y,
          oldX: x,
          oldY: y
        };
      }
      this.points.push(obj);
    }

    for (let i = 0; i < 5; i++) {
      let obj;
      if (i === 3) {
        obj = {
          p0: this.points[i],
          p1: this.points[0],
          length: this.distance(this.points[i], this.points[0]),
        };
      } else if (i === 4) {
        obj = {
          p0: this.points[0],
          p1: this.points[2],
          length: this.distance(this.points[0], this.points[2]),
          hidden: true
        };
      } else {
        obj = {
          p0: this.points[i],
          p1: this.points[i + 1],
          length: this.distance(this.points[i], this.points[i + 1])
        };
      }
      this.sticks.push(obj);
    }

    this.forms.push({
      path: [
        this.points[0],
        this.points[1],
        this.points[2],
        this.points[3]
      ],
      color: pallete[getRandomIntNumber(0, pallete.length - 1)]
    });

  }

  updatePoints() {
    for (let i = 0; i < this.points.length; i++) {
      const p = this.points[i];
      const vx = (p.x - p.oldX) * this.friction;
      const vy = (p.y - p.oldY) * this.friction;

      p.oldX = p.x;
      p.oldY = p.y;
      p.x += vx;
      p.y += vy;
      p.y += this.gravity;
    }
  }

  constrainPoints() {
    for (let i = 0; i < this.points.length; i++) {
      const p = this.points[i];
      const vx = (p.x - p.oldX) * this.friction;
      const vy = (p.y - p.oldY) * this.friction;

      if (p.x > this.width) {
        p.x = this.width;
        p.oldX = p.x + vx * this.bounce;
      } 
      
      if (p.x < 0) {
        p.x = 0;
        p.oldX = p.x + vx * this.bounce;
      }

      if (p.y > this.height) {
        p.y = this.height;
        p.oldY = p.y + vy * this.bounce;
      }
      
      if (p.y < 0) {
        p.y = 0;
        p.oldY = p.y + vy * this.bounce;
      }
    }
  }

  updateSticks() {
    for (let i = 0; i < this.sticks.length; i++) {
      const s = this.sticks[i];
      const dx = s.p1.x - s.p0.x;
      const dy = s.p1.y - s.p0.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      const difference = s.length - dist;
      const percent = difference / dist / 2;
      const offsetX = dx * percent;
      const offsetY = dy * percent;

      s.p0.x -= offsetX;
      s.p0.y -= offsetY;
      s.p1.x += offsetX;
      s.p1.y += offsetY;
    }
  }
  
  renderForms(c) {
    for (let i = 0; i < this.forms.length; i++) {
      const f = this.forms[i];

      c.fillStyle = f.color;
      c.globalAlpha = this.life;
      c.beginPath();
      c.moveTo(f.path[0].x, f.path[0].y);
      for (let j = 1; j < f.path.length; j++) {
        c.lineTo(f.path[j].x, f.path[j].y);
      }
      c.fill();
    }
  }

  updateParams() {
    this.life -= 0.005;
    if (this.life < 0) {
      this.kill = true;
    }
  }

  render(c) {
    this.updatePoints();
    for (let i = 0; i < 5; i++) {
      this.updateSticks();
      this.constrainPoints();
    }
    this.renderForms(c);
    this.updateParams();
  }
}

