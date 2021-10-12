let gui, canvas, c, width, height, id, iks;

const setupGui = () => {
  gui = new dat.GUI();
  
  gui.params = {
    timeScale: 0.001,
    number: 20,
    length: 100,
    lineWidth: 30,
    beta: 0.0,
    delta: 0.0,
    reset: () => initialize()
  };

  gui.ctrls = {
    timeScale: gui.add(gui.params, 'timeScale', 0.001, 0.01, 0.001),
    number: gui.add(gui.params, 'number', 1, 500, 1)
      .onChange(() => initialize()),
    length: gui.add(gui.params, 'length', 1, 200, 1)
      .onChange(() => initialize()),
    lineWidth: gui.add(gui.params, 'lineWidth', 1, 100, 1),
    beta: gui.add(gui.params, 'beta', 0.0, 1, 0.1),
    delta: gui.add(gui.params, 'delta', 0.0, 1, 0.1),
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

  iks = new IKSystem(width / 2, height / 2);

  for (let i = 0; i < gui.params.number; i++) {
    iks.addArm(gui.params.length, i / gui.params.number);
  }

  draw(0);
};

const draw = (t) => {
  t *= gui.params.timeScale;
 
  c.save();
  
  c.clearRect(0, 0, width, height);
  
  iks.render(c);

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

  window.addEventListener('mousemove', (e) => {
    iks.drag(e.clientX, e.clientY);
  });

  window.addEventListener('touchmove', (e) => {
    const touch = e.targetTouches[0];
    iks.drag(touch.pageX, touch.pageY);
  });
})();
