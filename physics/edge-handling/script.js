let gui, canvas, c, width, height, id;
let particle, vector, sun, planet, particles;

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

  particles = new Array();

  for (let i = 0; i < 100; i++) {
    const p = particle.create(width / 2, height, Math.random() * 8 + 5, -Math.PI / 2 + (Math.random() * 0.2 - 0.1), 0.1);
    p.radius = Math.random() * 10 + 2;
    p.bounce = -0.9;
    particles.push(p);
  }

  draw(0);
};

const removeParticles = (arr) => {
  for (let i = arr.length - 1; i >= 0; i--) {
    const p = arr[i];

    if (
      p.position.getX() - p.radius > width ||
      p.position.getX() - p.radius < 0 ||
      p.position.getY() - p.radius > height ||
      p.position.getY() - p.radius < 0
      ) 
    {
      arr.splice(i, 1);
    }
  }
};

const draw = (t) => {
  t *= gui.params.timeScale;
 
  c.save();
  
  c.clearRect(0, 0, width, height);

  for (let i = 0; i < particles.length; i++) {
    const p = particles[i];

    p.update();

    c.beginPath();
    c.arc(p.position.getX(), p.position.getY(), p.radius, 0, Math.PI * 2, false);
    c.fill();

    /*
    if (p.position.getY() - p.radius > height) {
      p.position.setX(width / 2);
      p.position.setY(height);
      p.velocity.setLength(Math.random() * 8 + 5);
      p.velocity.setAngle(-Math.PI / 2 + (Math.random() * 0.2 - 0.1));
    }
    */

    if (p.position.getX() + p.radius > width) {
      p.position.setX(width - p.radius);
      p.velocity.setX(p.velocity.getX() * p.bounce);
    }
    if (p.position.getX() - p.radius < 0) {
      p.position.setX(p.radius);
      p.velocity.setX(p.velocity.getX() * p.bounce);
    }
    if (p.position.getY() + p.radius > height) {
      p.position.setY(height - p.radius);
      p.velocity.setY(p.velocity.getY() * p.bounce);
    }
    if (p.position.getY() - p.radius < 0) {
      p.position.setY(p.radius);
      p.velocity.setY(p.velocity.getY() * p.bounce);
    }
  }
  
  removeParticles(particles);

  /*
  if (p.position.getX() - p.radius > width) {
    p.position.setX(-p.radius);
  }
  if (p.position.getX() + p.radius < 0) {
    p.position.setX(width + p.radius);
  }
  if (p.position.getY() - p.radius > height) {
    p.position.setY(-p.radius);
  }
  if (p.position.getY() + p.radius < 0) {
    p.position.setY(height + p.radius);
  }
  */

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
