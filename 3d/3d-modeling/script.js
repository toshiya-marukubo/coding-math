let gui, canvas, c, width, height, id, particle, vector, utils;
let fl, points;

const randomRange = (min, max) => {
  return Math.random() * (max - min) + min;
};

const norm = (value, min, max) => {
  return (value - min) / (max - min);
};

const lerp = (norm, min, max) => {
  return (max - min) * norm + min;
};

const map = (value, sourceMin, sourceMax, destMin, destMax) => {
  return lerp(norm(value, sourceMin, sourceMax), destMin, destMax);
};

const setupGui = () => {
  gui = new dat.GUI();
  
  gui.params = {
    timeScale: 0.01,
    scale: 500,
    lineWidth: 5,
    centerZ: 500,
    reset: () => initialize()
  };

  gui.ctrls = {
    timeScale: gui.add(gui.params, 'timeScale', 0.001, 0.1, 0.001),
    scale: gui.add(gui.params, 'scale', 1, 1000, 1)
      .onChange(() => {initialize()}),
    lineWidth: gui.add(gui.params, 'lineWidth', 1, 1000, 1)
      .onChange(() => {initialize()}),
    centerZ: gui.add(gui.params, 'centerZ', 0, 1500, 1)
      .onChange(() => {initialize()}),
    reset: gui.add(gui.params, 'reset')
  };
};

const setupCanvas = () => {
  canvas = document.createElement('canvas');
  document.getElementsByTagName('body')[0].appendChild(canvas);
  c = canvas.getContext('2d');
};

const initialize = () => {
  if (id) {
    cancelAnimationFrame(id);
  }

  width = canvas.width = window.innerWidth;
  height = canvas.height = window.innerHeight;

  fl = 300;
  centerZ = gui.params.centerZ;
  angle = 1;
  scale = gui.params.scale;
  points = [];

  points[0] = {x: -1, y: -1, z:  1};
  points[1] = {x:  1, y: -1, z:  1};
  points[2] = {x:  1, y: -1, z: -1};
  points[3] = {x: -1, y: -1, z: -1};
  points[4] = {x: -1, y:  1, z:  1};
  points[5] = {x:  1, y:  1, z:  1};
  points[6] = {x:  1, y:  1, z: -1};
  points[7] = {x: -1, y:  1, z: -1};

  draw(0);
};

const sort = (a, b) => {
  return b.z - a.z;
};

const project = () => {
  for (let i = 0; i < points.length; i++) {
    const p = points[i];
    const scale = fl / (fl + p.z + centerZ);

    p.sx = p.x * scale;
    p.sy = p.y * scale;
  }
};

const drawLine = (...args) => {
  let p = points[args[0]];
  c.moveTo(p.sx * scale, p.sy * scale);

  for (let i = 0; i < args.length; i++) {
    p = points[args[i]];
    c.lineTo(p.sx * scale, p.sy * scale);
  }
};

const translateModel = (x, y, z) => {
  for (let i = 0; i < points.length; i++) {
    points[i].x += x;
    points[i].y += y;
    points[i].z += z;
  }
};

const rotateX = (angle) => {
  const cos = Math.cos(angle);
  const sin = Math.sin(angle);

  for (let i = 0; i < points.length; i++) {
    const p = points[i];
    const y = p.y * cos - p.z * sin;
    const z = p.z * cos + p.y * sin;

    p.y = y;
    p.z = z;
  }
};

const rotateZ = (angle) => {
  const cos = Math.cos(angle);
  const sin = Math.sin(angle);

  for (let i = 0; i < points.length; i++) {
    const p = points[i];
    const x = p.x * cos - p.y * sin;
    const y = p.y * cos + p.x * sin;

    p.x = x;
    p.y = y;
  }
};

const draw = (t) => {
  t *= gui.params.timeScale;
 
  c.save();
  c.clearRect(0, 0, width, height);
  c.translate(width / 2, height / 2);
  c.lineWidth = gui.params.lineWidth;
  c.lineCap = 'round';
  c.lineJoin = 'round';

  project();
  
  c.beginPath();
  drawLine(0, 1, 2, 3, 0);
  drawLine(4, 5, 6, 7, 4);
  drawLine(0, 4);
  drawLine(1, 5);
  drawLine(2, 6);
  drawLine(3, 7);
  c.stroke();

  c.restore();

  rotateZ(1 * gui.params.timeScale);
  rotateX(1 * gui.params.timeScale * 0.5);

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
