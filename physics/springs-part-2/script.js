let gui, canvas, c, width, height, id, particle, vector, utils;
let springPoint, k, particles, separation, mouseX, mouseY; 

const setupGui = () => {
  gui = new dat.GUI();
  
  gui.params = {
    timeScale: 0.001,
    size: 100,
    k: 0.01,
    reset: () => initialize()
  };

  gui.ctrls = {
    timeScale: gui.add(gui.params, 'timeScale', 0.001, 0.01, 0.001),
    size: gui.add(gui.params, 'size', 1, 500, 1),
    k: gui.add(gui.params, 'k', 0.001, 0.01, 0.001)
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

  vector = new Vector();
  particle = new Particle(vector);
  utils = Utils;
  particles = new Array();

  for (let i = 0; i < 100; i++) {
    const p = particle.create(utils.randomRange(0, width), utils.randomRange(0, height), 0, utils.randomRange(0, Math.PI * 2));
    p.radius = 5;
    p.friction = 0.9;
    particles.push(p);
  }

  k = gui.params.k;
  separation = 300;
  
  draw(0);
};

const spring = (arr, separation) => {
  for (let j = 0; j < arr.length; j++) {
    const p = arr[j];

    for (let i = j + 1; i < arr.length; i++) {
      const np = arr[i];

      const dist = p.position.subtract(np.position);
      
      dist.setLength(dist.getLength() - separation);

      const springForce = dist.multiply(k);

      p.velocity.subtractFrom(springForce);
      np.velocity.addTo(springForce);
    }
  }
};

const draw = (t) => {
  t *= gui.params.timeScale;
 
  c.save();
  
  c.clearRect(0, 0, width, height);

  if (Math.random() < 0.1) {
    const rand = utils.randomInt(0, particles.length - 1);
    particles[rand].position.setX(particles[rand].position.getX() + Math.cos(Math.PI * 2 * Math.random()) * 100);
    particles[rand].position.setY(particles[rand].position.getY() + Math.sin(Math.PI * 2 * Math.random()) * 100);
  }

  spring(particles, separation);

  for (let i = 0; i < particles.length; i++) {
    const p = particles[i];
    const np = i === particles.length - 1 ? particles[0] : particles[i + 1];

    c.beginPath();
    c.arc(p.position.getX(), p.position.getY(), p.radius, 0, Math.PI * 2, false);
    c.fill();

    c.beginPath();
    c.moveTo(p.position.getX(), p.position.getY());
    c.lineTo(np.position.getX(), np.position.getY());
    c.stroke();
    
    p.update();
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
