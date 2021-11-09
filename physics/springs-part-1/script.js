let gui, canvas, c, width, height, id;
let particle, vector, utils, springPoint, k; 

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
  utils = Utils;
  
  springPoint = vector.create(width / 2, height / 2);
  weight = particle.create(width * Math.random(), height * Math.random(), 50, Math.PI * 2 * Math.random());
  weight.radius = 20;
  weight.friction = Math.random() * 0.5 + 0.5;

  k = 0.01 + Math.random() * 0.5;

  draw(0);
};

const draw = (t) => {
  t *= gui.params.timeScale;
 
  c.save();
  
  c.clearRect(0, 0, width, height);

  const dist = springPoint.subtract(weight.position);
  const springForce = dist.multiply(k);

  weight.velocity.addTo(springForce);
  weight.update();

  c.beginPath();
  c.arc(weight.position.getX(), weight.position.getY(), weight.radius, 0, Math.PI * 2, false);
  c.fill();
  
  c.beginPath();
  c.arc(springPoint.getX(), springPoint.getY(), 4, 0, Math.PI * 2, false);
  c.fill();

  c.beginPath();
  c.moveTo(weight.position.getX(), weight.position.getY());
  c.lineTo(springPoint.getX(), springPoint.getY());
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

  document.body.addEventListener('mousemove', (e) => {
   springPoint.setX(e.clientX);
   springPoint.setY(e.clientY);
  });
})();
