let gui, canvas, c, width, height, id, particle, vector, utils;
let target, tc, p0, p1, p2, tx, ty;

const setupGui = () => {
  gui = new dat.GUI();
  
  gui.params = {
    timeScale: 0.001,
    size: 200,
    reset: () => initialize()
  };

  gui.ctrls = {
    timeScale: gui.add(gui.params, 'timeScale', 0.0001, 0.01, 0.0001),
    size: gui.add(gui.params, 'size', 1, 500, 1)
      .onChange(() => {initialize()}),
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

const drawTriangle = (p0, p1, p2) => {
  c.beginPath();
  c.moveTo(p0.x, p0.y);
  c.lineTo(p1.x, p1.y);
  c.lineTo(p2.x, p2.y);
  c.closePath();
  //c.stroke();
  c.fill();
};

const sierpinski = (p0, p1, p2, limit, t) => {
  //tx = Math.cos(t - limit / Math.PI * 2) * limit * 0.1 + 0.5;
  //ty = Math.sin(t - limit / Math.PI * 2) * limit * 0.1 + 0.5;
  tx = Math.cos(t) * 0.1 + 0.5;
  ty = Math.sin(t) * 0.1 + 0.5;
  
  if (limit > 0) {
    const pa = {
      x: p0.x + (p1.x - p0.x) * tx,
      y: p0.y + (p1.y - p0.y) * ty
    };
    const pb = {
      x: p1.x + (p2.x - p1.x) * tx,
      y: p1.y + (p2.y - p1.y) * ty
    }; 
    const pc = {
      x: p2.x + (p0.x - p2.x) * tx,
      y: p2.y + (p0.y - p2.y) * ty
    };

    sierpinski(p0, pa, pc, limit - 1, t);
    sierpinski(pa, p1, pb, limit - 1, t);
    sierpinski(pc, pb, p2, limit - 1, t);
  } else {
    drawTriangle(p0, p1, p2);
  }
};

const initialize = () => {
  if (id) {
    cancelAnimationFrame(id);
  }

  width = canvas.width = target.width = window.innerWidth;
  height = canvas.height = target.height = window.innerHeight;

  const points = [];
  for (let i = 0; i < 3; i++) {
    const x = Math.cos(i / 3 * Math.PI * 2) * gui.params.size;
    const y = Math.sin(i / 3 * Math.PI * 2) * gui.params.size;
    let obj = {
      x: x,
      y: y
    };
    points.push(obj);
  }

  p0 = points[0];
  p1 = points[1];
  p2 = points[2];

  draw(0);
};

const draw = (t) => {
  t *= gui.params.timeScale;
 
  c.save();
  c.clearRect(0, 0, width, height);
  c.translate(width / 2 - p0.x, height / 2);
  
  for (let i = 0; i < 6; i++) {
    c.translate(p0.x, p0.y);
    c.rotate(Math.PI * 2 / 6);
    c.translate(-p0.x, -p0.y);
    sierpinski(p0, p1, p2, 5, t);
  } 

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
})();
