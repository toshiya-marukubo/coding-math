let gui, canvas, c, width, height, id;
let particle, vector, sun, planet;

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

  vector = new Vector();
  particle = new Particle(vector);
  
  sun = particle.create(0, 0, 0, 0);
  planet = particle.create(200, 0, 10, -Math.PI / 2); 
  
  sun.mass = 20000; 

  draw(0);
};

const draw = (t) => {
  t *= gui.params.timeScale;
 
  c.save();
  
  c.clearRect(0, 0, width, height);
  c.translate(width / 2, height / 2);

  planet.gravitateTo(sun);
  planet.update();

  c.fillStyle = '#FF0000';
  c.beginPath();
  c.arc(sun.position.getX(), sun.position.getY(), 20, 0, Math.PI * 2, false);
  c.fill();

  c.fillStyle = '#0000FF';
  c.beginPath();
  c.arc(planet.position.getX(), planet.position.getY(), 5, 0, Math.PI * 2, false);
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
