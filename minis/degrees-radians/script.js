let gui, canvas, c, width, height, id, mouseX, mouseY;

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

  draw(0);
};

const draw = (t) => {
  t *= gui.params.timeScale;

  c.save();
  
  c.clearRect(0, 0, width, height);

  c.translate(width / 2, height / 2);
  c.rotate(Utils.degreesToRads(90));

  c.beginPath();
  c.arc(0, 0, 20, 0, Math.PI * 2, false);
  c.fill();

  c.lineWidth = 10;
  c.beginPath();
  c.moveTo(0, 0);
  c.lineTo(50, 0);
  c.stroke();

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
