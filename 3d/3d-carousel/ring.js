let gui, canvas, c, width, height, id, particle, vector, utils;
let focusLength, shapes, centerZ, radius, baseAngle, rotationSpeed, shapeNum;

const randomRange = (min, max) => {
  return Math.random() * (max - min) + min;
};

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
};

const initialize = () => {
  if (id) {
    cancelAnimationFrame(id);
  }

  width = canvas.width = window.innerWidth;
  height = canvas.height = window.innerHeight;

  focusLength = width;

  shapeNum = 500;
  shapes = [];
  centerZ = 0;
  radius = width / 3;
  baseAngle = 0;
  rotationSpeed = 0.01;

  for (let i = 0; i < shapeNum; i++) {
    const tmp = {
      a: i / shapeNum * Math.PI * 2 * 10,
      y: i / shapeNum * height / 2 - height / 4,
    };
    tmp.x = Math.cos(tmp.a) * radius;
    tmp.z = Math.sin(tmp.a) * radius + centerZ;
    shapes.push(tmp);
  }

  draw(0);
};

const zsort = (cardA, cardB) => {
  return cardB.z - cardA.z;
};

const draw = (t) => {
  t *= gui.params.timeScale;

  baseAngle = t;
  shapes.sort(zsort);
 
  c.save();
  c.clearRect(0, 0, width, height);

  c.translate(width / 2, height / 2);
  
  for (let i = 0; i < shapes.length; i++) {
    const s = shapes[i];
    const perspective = focusLength / (focusLength + s.z);
    
    c.save();
    c.scale(perspective, perspective);

    c.fillStyle = `hsl(${360 * i / shapes.length}, 80%, 60%)`;
    c.beginPath();
    c.arc(s.x, s.y, 5, 0, Math.PI * 2, false);
    c.fill();

    c.restore();
    
    s.x = Math.cos(s.a + baseAngle) * radius;
    s.z = Math.sin(s.a + baseAngle) * radius + centerZ;
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
