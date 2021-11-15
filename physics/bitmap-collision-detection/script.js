let gui, canvas, c, width, height, id, particle, vector, utils, mouseX, mouseY;
let target, tc, p;

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
  target = document.createElement('canvas');
  document.getElementsByTagName('body')[0].appendChild(target);
  tc = target.getContext('2d');
};

const initialize = () => {
  if (id) {
    cancelAnimationFrame(id);
  }

  width = canvas.width = target.width = window.innerWidth;
  height = canvas.height = target.height = window.innerHeight;

  vector = new Vector();
  particle = new Particle(vector);
  utils = Utils;

  p = particle.create(0, height / 2, 5, 0);
  p.radius = 50;

  tc.beginPath();
  tc.arc(width / 2, height / 2, 100, 0, Math.PI * 2, false);
  tc.fill();
  
  draw(0);
};

const draw = (t) => {
  t *= gui.params.timeScale;
 
  c.save();
  
  c.clearRect(0, 0, width, height);

  p.update();
  
  c.beginPath();
  c.arc(p.position.getX(), p.position.getY(), p.radius, 0, Math.PI * 2, false);
  c.fill();

  const imageData = tc.getImageData(p.position.getX(), p.position.getY(), 1, 1);
  
  if (imageData.data[3] > 0) {
    tc.globalCompositeOperation = 'destination-out';
    tc.beginPath();
    tc.arc(p.position.getX(), p.position.getY(), 50, 0, Math.PI * 2, false);
    tc.fill();
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

  document.body.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
  });
})();
