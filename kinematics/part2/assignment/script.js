let gui, canvas, c, width, height, id, fks, runners;

const setupGui = () => {
  gui = new dat.GUI();
  
  gui.params = {
    timeScale: 0.001,
    number: window.innerWidth < 500 ? 50 : 50,
    maxSize: 50,
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

    const rand = Math.max(Math.random(), 0.3);
    
    const s = y / height;
    
    let v = 10;
    
    if (Math.random() < 0.5) {
      v *= -1;
    }

    const vs = Math.abs(v / gui.params.maxSpeed);

    const right = new FKSystem(x, y, v * s, rand * s);
    const left  = new FKSystem(x, y, v * s, rand * s);
    
    left.phase = Math.PI;
     
    if (v < 0) {
      // length, center angle, rotation angle, phase offset, scale
      right.addArm(gui.params.maxSize * s, Math.PI / 2, Math.PI / 4, 0, s);
      right.addArm(gui.params.maxSize * s, -0.87, 0.87, -1.5, s);
      
      left.addArm(gui.params.maxSize * s, Math.PI / 2, Math.PI / 4, 0, s);
      left.addArm(gui.params.maxSize * s, -0.87, 0.87, -1.5, s);
    } else {
      right.addArm(gui.params.maxSize * s, Math.PI / 2, Math.PI / 4, 0, s);
      right.addArm(gui.params.maxSize * s, 0.87, 0.87, -1.5, s);
      
      left.addArm(gui.params.maxSize * s, Math.PI / 2, Math.PI / 4, 0, s);
      left.addArm(gui.params.maxSize * s, 0.87, 0.87, -1.5, s);
    }
    
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
      runners[j][i].render(c, t);
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
