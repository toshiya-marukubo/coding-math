let gui, canvas, c, width, height, id, xRadius, yRadius, x, y, tScaleX, tScaleY;

const setupGui = () => {
  gui = new dat.GUI();
  
  gui.params = {
    tScaleX: 0.001,
    tScaleY: 0.003,
    xRadius: 100,
    yRadius: 200,
    reset: () => initialize()
  };

  gui.ctrls = {
    tScaleX: gui.add(gui.params, 'tScaleX', 0.001, 0.01, 0.001)
      .onChange(() => initialize()),
    tScaleY: gui.add(gui.params, 'tScaleY', 0.001, 0.01, 0.001)
      .onChange(() => initialize()),
    xRadius: gui.add(gui.params, 'xRadius', 1, 500, 1)
      .onChange(() => initialize()),
    yRadius: gui.add(gui.params, 'yRadius', 1, 500, 1)
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
  xRadius = gui.params.xRadius;
  yRadius = gui.params.yRadius;
  tScaleX = gui.params.tScaleX;
  tScaleY = gui.params.tScaleY;

  draw(0);
};

const draw = (t) => {
  c.save();
  
  c.clearRect(0, 0, width, height);
  c.translate(width / 2, height / 2);

  x = Math.cos(t * tScaleX) * xRadius;
  y = Math.sin(t * tScaleY) * yRadius;

  c.beginPath();
  c.arc(x, y, 5, 0, Math.PI * 2, false);
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
})();
