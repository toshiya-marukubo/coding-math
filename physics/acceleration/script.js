let gui, canvas, c, width, height, id, particles, particle, vector, p, accel;

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

  particle = new Particle();
  vector = new Vector();

  particles = new Array();

  for (let i = 0; i < 100; i++) {
    const p = particle.create(0, -100, Math.random() * 5 + 2, Math.PI * 2 * Math.random(), 0.1);
    
    particles.push(p);
  }

  draw(0);
};

const draw = (t) => {
  t *= gui.params.timeScale;
 
  c.save();
  
  c.clearRect(0, 0, width, height);
  c.translate(width / 2, height / 2);

  for (let i = 0; i < particles.length; i++) {
    const p = particles[i];

    p.update();

    c.beginPath();
    c.arc(p.position.getX(), p.position.getY(), 4, 0, Math.PI * 2, false);
    c.fill();
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
