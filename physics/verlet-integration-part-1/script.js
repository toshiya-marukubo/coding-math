let gui, canvas, c, width, height, id, particle, vector, utils, mouseX, mouseY;
let target, tc, points, bounce, gravity, friction;

const setupGui = () => {
  gui = new dat.GUI();
  
  gui.params = {
    timeScale: 0.001,
    size: 100,
    reset: () => initialize()
  };

  gui.ctrls = {
    timeScale: gui.add(gui.params, 'timeScale', 0.001, 0.01, 0.001),
    size: gui.add(gui.params, 'size', 1, 500, 1),
    reset: gui.add(gui.params, 'reset')
  };
};

const setupCanvas = () => {
  canvas = document.createElement('canvas');
  document.getElementsByTagName('body')[0].appendChild(canvas);
  c = canvas.getContext('2d');
  target = document.createElement('canvas');
  document.getElementsByTagName('body')[0].appendChild(target);
  tc = target.getContext('2d');
};

const initialize = () => {
  if (id) {
    cancelAnimationFrame(id);
  }

  width = canvas.width = target.width = window.innerWidth;
  height = canvas.height = target.height = window.innerHeight;

  points = [];
  bounce = 0.9;
  gravity = 0.5;
  friction = 0.999;

  points.push({
    x: 100,
    y: 100,
    oldX: 95,
    oldY: 95
  }); 

  draw(0);
};

const updatePoints = function() {
  for (let i = 0; i < points.length; i++) {
    const p = points[i];
    const vx = (p.x - p.oldX) * friction;
    const vy = (p.y - p.oldY) * friction;

    p.oldX = p.x;
    p.oldY = p.y;

    p.x += vx;
    p.y += vy;
    p.y += gravity;

    if (p.x > width) {
      p.x = width;
      p.oldX = p.x + vx * 0.9;
    } else if (p.x < 0) {
      p.x = 0;
      p.oldX = p.x + vx * 0.9;
    }

    if (p.y > height) {
      p.y = height;
      p.oldY = p.y + vy * 0.9;
    } else if (p.y < 0) {
      p.y = 0;
      p.oldY = p.y + vy * 0.9;
    }

  }
};

const renderPoints = function() {
  c.clearRect(0, 0, width, height);
  for (let i = 0; i < points.length; i++) {
    const p = points[i];
    c.beginPath();
    c.arc(p.x, p.y, 5, 0, Math.PI * 2, false);
    c.fill();
  }
};

const draw = (t) => {
  t *= gui.params.timeScale;
 
  c.save();

  updatePoints();
  renderPoints();
  
  c.restore();

  id = requestAnimationFrame(draw);
};

(() => {
  window.addEventListener('DOMContentLoaded', () => {
    console.clear();

    setupGui();
    setupCanvas();
    
    initialize();
  });

  window.addEventListener('resize', () => {
    initialize();
  });

  document.body.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
  });
})();
