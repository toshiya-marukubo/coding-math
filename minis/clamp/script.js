let gui, canvas, c, width, height, id, mouseX, mouseY, rect;

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

  rect = {
    x: width / 2 - 200,
    y: height / 2 - 150,
    width: 400,
    height: 300
  };

  draw(0);
};

const draw = (t) => {
  t *= gui.params.timeScale;

  t %= 1;
 
  c.save();
  
  c.clearRect(0, 0, width, height);

  const x = Utils.clamp(mouseX, rect.x, rect.x + rect.width);
  const y = Utils.clamp(mouseY, rect.y, rect.y + rect.height);

  c.fillStyle = '#ccc';
  c.fillRect(rect.x - 10, rect.y - 10, rect.width + 20, rect.height + 20);

  c.fillStyle = '#000';
  c.beginPath();
  c.arc(x, y, 10, 0, Math.PI * 2, false);
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
