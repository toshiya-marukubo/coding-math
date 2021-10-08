let gui, params, ctrls;
let canvas, canvas2, c, c2, width, height, id, arm;

const setupGui = () => {
  gui = new dat.GUI();
  
  gui.params = {
    length: 80,
    lineWidth: 0.4,
    timeScale: 0.001,
    draw: false,
    reset: () => initialize()
  };

  gui.ctrls = {
    length: gui.add(gui.params, 'length', 1, 200, 1)
      .onChange(() => initialize()),
    lineWidth: gui.add(gui.params, 'lineWidth', 0.1, 100, 0.1),
    timeScale: gui.add(gui.params, 'timeScale', 0.001, 0.01, 0.001),
    draw: gui.add(gui.params, 'draw'),
    reset: gui.add(gui.params, 'reset')
  };
};

const setupCanvas = () => {
  canvas2 = document.createElement('canvas');
  document.getElementsByTagName('body')[0].appendChild(canvas2);
  c2 = canvas2.getContext('2d');
  
  canvas = document.createElement('canvas');
  document.getElementsByTagName('body')[0].appendChild(canvas);
  c = canvas.getContext('2d');
};

const initialize = () => {
  if (id) {
    cancelAnimationFrame(id);
  }

  width = canvas.width = canvas2.width = window.innerWidth;
  height = canvas.height = canvas2.height = window.innerHeight;

  arm = new Arm(0, 0, gui.params.length, 0);
  arm2 = arm.create(arm.getEndX(), arm.getEndY(), gui.params.length, 1.3);
  arm3 = arm.create(arm2.getEndX(), arm2.getEndY(), gui.params.length, 1.3);
  arm2.parent = arm;
  arm3.parent = arm2;
  
  draw(0);
};

const updatePrameters = (t) => {
  arm.angle = Math.sin(t) * Math.PI * 2;
  arm2.angle = Math.cos(t * 0.873) * Math.PI * 2;
  arm3.angle = Math.sin(t * 1.573) * Math.PI * 2;
  
  arm2.x = arm.getEndX();
  arm2.y = arm.getEndY();
  arm3.x = arm2.getEndX();
  arm3.y = arm2.getEndY();
};

const draw = (t) => {
  t *= gui.params.timeScale;
 
  c.save();
  
  if (gui.params.draw) {
    c2.save();
    c2.translate(width / 2, height / 2);
    c2.lineCap = 'round';
    c2.strokeStyle = `hsl(${Math.sin(t) * 360}, 80%, 60%)`;
    c2.lineWidth = gui.params.lineWidth;
    c2.beginPath();
    c2.moveTo(arm3.getEndX(), arm3.getEndY());
  }

  c.clearRect(0, 0, width, height);
  c.translate(width / 2, height / 2);

  arm.render(c);
  arm2.render(c);
  arm3.render(c);
  
  updatePrameters(t);

  if (gui.params.draw) {
    c2.lineTo(arm3.getEndX(), arm3.getEndY());
    c2.stroke();
    c2.restore();
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
