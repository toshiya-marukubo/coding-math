let gui, canvas, c, width, height, id, particle, vector, utils;
let fl, shapePos, shapesPos;

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

  fl = 100;

  shapes = [];
  for (let i = 0; i < 100; i++) {
    const tmp = {
      x: randomRange(-width / 2, width / 2),
      y: randomRange(-height / 2, height / 2),
      z: randomRange(0, width * 2),
      s: randomRange(50, 100)
    };

    shapes.push(tmp);
  }

  draw(0);
};

const draw = (t) => {
  t *= gui.params.timeScale;
 
  c.save();
  c.clearRect(0, 0, width, height);

  c.translate(width / 2, height / 2);
  
  for (let i = 0; i < shapes.length; i++) {
    const s = shapes[i];
    const perspective = fl / (fl + s.z);
    c.save();
    c.translate(s.x * perspective, s.y * perspective);
    c.scale(perspective, perspective);
    c.fillRect(-s.s / 2, -s.s / 2, s.s, s.s);
    c.restore();
    s.z += 5;
    if (s.z > width * 2) {
      s.z = 0;
    }
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
