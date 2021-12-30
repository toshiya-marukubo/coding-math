let gui, canvas, c, width, height, id, particle, vector, utils;
let focusLength, shapes, centerZ, radius, baseAngle, rotationSpeed, shapeNum;

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
    timeScale: 0.001,
    number: 500,
    reset: () => initialize()
  };

  gui.ctrls = {
    timeScale: gui.add(gui.params, 'timeScale', 0.0001, 0.01, 0.0001),
    number: gui.add(gui.params, 'number', 1, 1000, 1)
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

  focusLength = width;

  shapeNum = gui.params.number;
  shapes = [];
  centerZ = 0;
  //radius = width / 5;
  baseAngle = 0;
  rotationSpeed = 0.01;

  for (let i = 0; i < shapeNum; i++) {
    const tmp = {
      a: randomRange(0, Math.PI * 2),
      r: randomRange(50, width / 3),
      y: randomRange(-height / 2, height / 2),
      va: Math.random() * 0.02,
      vy: Math.random() * 2 + 0.5,
      st: randomRange(0, 1),
      s: randomRange(2, 6),
      c: `rgb(${randomRange(0, 255)}, ${randomRange(0, 255)}, ${randomRange(200, 255)})`
    };
    tmp.x = Math.cos(tmp.a) * tmp.r;
    tmp.z = Math.sin(tmp.a) * tmp.r + centerZ;
    shapes.push(tmp);
  }

  draw(0);
};

const sort = (a, b) => {
  return b.z - a.z;
};

const updateParams = (s, t) => {
  s.a += s.va;
  s.x = Math.cos(s.a) * s.r;
  s.y -= s.vy;
  s.z = Math.sin(s.a) * s.r + centerZ;

  if (s.y < -height / 2) {
    s.y = height / 2;
  }
};

const draw = (t) => {
  t *= gui.params.timeScale;

  shapes.sort(sort);
 
  c.save();
  c.clearRect(0, 0, width, height);
  c.translate(width / 2, height / 2);
  
  c.globalCompositeOperation = 'lighter';
  
  for (let i = 0; i < shapes.length; i++) {
    const s = shapes[i];
    const perspective = focusLength / (focusLength + s.z);
    
    c.save();
    c.scale(perspective, perspective);

    c.globalAlpha = map(s.y, height / 2, -height / 2, 1, 0.2);

    c.fillStyle = s.c;
    c.beginPath();
    c.arc(s.x, s.y, s.s, 0, Math.PI * 2, false);
    c.fill();

    c.restore();

    updateParams(s, t);
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

  document.body.addEventListener('mousemove', (e) => {
    rotationSpeed = (e.clientX - width / 2) * 0.00005;
  });
})();
