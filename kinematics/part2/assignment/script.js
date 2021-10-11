let gui, canvas, c, width, height, id, fks, runners;

const setupGui = () => {
  gui = new dat.GUI();
  
  gui.params = {
    timeScale: 0.001,
    number: window.innerWidth < 500 ? 50 : 100,
    maxSize: 100,
    maxSpeed: 20, 
    reset: () => initialize()
  };

  gui.ctrls = {
    timeScale: gui.add(gui.params, 'timeScale', 0.001, 0.01, 0.001),
    number: gui.add(gui.params, 'number', 1, 500, 1)
      .onChange(() => initialize()),
    maxSize: gui.add(gui.params, 'maxSize', 50, 200, 1)
      .onChange(() => initialize()),
    maxSpeed: gui.add(gui.params, 'maxSpeed', 1, 100, 1)
      .onChange(() => initialize()),
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

  runners = [];

  for (let i = 0; i < gui.params.number; i++) {
    const x = width * Math.random();
    const y = height * Math.random() * Math.random();

    const rand = Math.random();
    
    const s = y / height;
    
    const v = Math.random() * gui.params.maxSpeed * s + 3;
    const vs = v / gui.params.maxSpeed;

    const right = new FKSystem(x, y, v * s, vs);
    const left  = new FKSystem(x, y, v * s, vs);
    
    left.phase = Math.PI;
    
    right.addArm(gui.params.maxSize * s, Math.PI / 2, Math.PI / 4, vs, s);
    right.addArm(gui.params.maxSize * s, 0.87, 0.87, -1.5, s);
    
    left.addArm(gui.params.maxSize * s, Math.PI / 2, Math.PI / 4, vs, s);
    left.addArm(gui.params.maxSize * s, 0.87, 0.87, -1.5, s);

    runners.push([right, left]);
  }
  
  draw(0);
};

const draw = (t) => {
  t *= gui.params.timeScale;
 
  c.save();
  c.clearRect(0, 0, width, height);
  
  for (let j = 0; j < runners.length; j++) {
    for (let i = 0; i < runners[j].length; i++) {
      runners[j][i].render(c);
      runners[j][i].update();
      runners[j][i].updatePosition();
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
