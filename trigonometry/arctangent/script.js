let gui, canvas, c, width, height, id, arrowX, arrowY, dx, dy, angle;

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

  arrowX = width / 2;
  arrowY = height / 2;
  angle = 0;

  draw(0);
};

const draw = (t) => {
  t *= gui.params.timeScale;
 
  c.save();
  
  c.clearRect(0, 0, width, height);
  c.translate(arrowX, arrowY);
  c.rotate(angle);

  c.beginPath();
  c.moveTo(20, 0);
  c.lineTo(-20, 0);
  c.moveTo(20, 0);
  c.lineTo(10, -10);
  c.moveTo(20, 0);
  c.lineTo(10, 10);
  c.stroke();
  
  c.restore();
  
  arrowX = Math.cos(t) * 200 + width / 2;
  arrowY = Math.sin(t) * 200 + height / 2;

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

  document.body.addEventListener('mousemove', (e) => {
    dx = e.clientX - arrowX;
    dy = e.clientY - arrowY;
    angle = Math.atan2(dy, dx);
    //angle = Math.atan(dy / dx);
  });
})();
