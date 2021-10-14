let gui, canvas, c, width, height, id, mouseX, mouseY, gridSize;

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
};

const initialize = () => {
  if (id) {
    cancelAnimationFrame(id);
  }

  width = canvas.width = window.innerWidth;
  height = canvas.height = window.innerHeight;

  mouseX = 0;
  mouseY = 0;
  gridSize = 40;

  draw(0);
};

const drawGrid = () => {
  c.beginPath();
  c.strokeStyle = '#ccc';
  for (let x = 0; x <= width; x += gridSize) {
    c.moveTo(x, 0);
    c.lineTo(x, height);
  }
  for (let y = 0; y <= height; y += gridSize) {
    c.moveTo(0, y);
    c.lineTo(width, y);
  }
  c.stroke();
};

const draw = (t) => {
  t *= gui.params.timeScale;

  c.save();
  
  c.clearRect(0, 0, width, height);

  drawGrid();

  const x = Utils.roundNearest(mouseX, gridSize);
  const y = Utils.roundNearest(mouseY, gridSize);

  c.beginPath();
  c.arc(x, y, 20, 0, Math.PI * 2, false);
  c.fill();

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
    mouseX = e.clientX;
    mouseY = e.clientY;
  });
})();
