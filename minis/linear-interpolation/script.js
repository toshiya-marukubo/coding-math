let gui, canvas, c, width, height, id, minX, maxX, minY, maxY, minAlpha, maxAlpha, minRadius, maxRadius;

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

  minX = 0;
  maxX = width - 50;
  minY = 0;
  maxY = height - 100;
  minAlpha = 0;
  maxAlpha = 1;
  minRadius = 10;
  maxRadius = 300;

  draw(0);
};

const draw = (t) => {
  t *= gui.params.timeScale;

  t %= 1;
 
  c.save();
  
  c.clearRect(0, 0, width, height);

  c.globalAlpha = Utils.lerp(t, maxAlpha, minAlpha);
  c.beginPath();
  c.arc(
    Utils.lerp(t, minX, maxX),
    Utils.lerp(t, minY, maxY),
    Utils.lerp(t, minRadius, maxRadius),
    0, Math.PI * 2, false
  );
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
