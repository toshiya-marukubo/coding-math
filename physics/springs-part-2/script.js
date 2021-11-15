let gui, canvas, c, width, height, id, particle, vector, utils;
let springPoint, k, particles, separation, mouseX, mouseY, clicked; 

const setupGui = () => {
  gui = new dat.GUI();
  
  gui.params = {
    timeScale: 0.001,
    size: 5,
    number: 100,
    separation: 250,
    friction: 0.9,
    k: 0.008,
    line: true,
    reset: () => initialize()
  };

  gui.ctrls = {
    timeScale: gui.add(gui.params, 'timeScale', 0.001, 0.01, 0.001),
    size: gui.add(gui.params, 'size', 1, 100, 1)
      .onChange(() => initialize()),
    number: gui.add(gui.params, 'number', 1, 500, 1)
      .onChange(() => initialize()),
    separation: gui.add(gui.params, 'separation', 1, 500, 1)
      .onChange(() => initialize()),
    friction: gui.add(gui.params, 'friction', 0.5, 0.99, 0.01)
      .onChange(() => initialize()),
    k: gui.add(gui.params, 'k', 0.001, 0.01, 0.001)
      .onChange(() => initialize()),
    line: gui.add(gui.params, 'line'),
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

  for (let i = 0; i < gui.params.number; i++) {
    const p = particle.create(width * Math.random(), height * Math.random(), 0, utils.randomRange(0, Math.PI * 2));
    
    p.radius = gui.params.size;
    p.friction = gui.params.friction;
    particles.push(p);
  }

  clicked = false;
  separation = gui.params.separation;
  k = gui.params.k;
  
  draw(0);
};

const spring = (arr, separations) => {
  for (let j = 0; j < arr.length; j++) {
    const p = arr[j];

    if (!clicked) {
      for (let i = j + 1; i < arr.length; i++) {
        const np = arr[i];

        const dist = p.position.subtract(np.position);
        
        dist.setLength(dist.getLength() - separation);

        const springForce = dist.multiply(k);

        p.velocity.subtractFrom(springForce);
        np.velocity.addTo(springForce);
      }
    } else {
      const v = vector.create(mouseX, mouseY);
      const dist = p.position.subtract(v);

      dist.setLength(dist.getLength() - separation);

      const springForce = dist.multiply(k);

      p.velocity.subtractFrom(springForce);
    }
  }
};

const draw = (t) => {
  t *= gui.params.timeScale;
 
  c.save();
  
  c.clearRect(0, 0, width, height);

  c.lineWidth = 0.4;

  spring(particles, separation);

  for (let i = 0; i < particles.length; i++) {
    const p = particles[i];
    const np = i === particles.length - 1 ? particles[0] : particles[i + 1];
   
    c.beginPath();
    c.arc(p.position.getX(), p.position.getY(), p.radius, 0, Math.PI * 2, false);
    c.fill();
    
    if (gui.params.line) {
      c.beginPath();
      c.moveTo(p.position.getX(), p.position.getY());
      c.lineTo(np.position.getX(), np.position.getY());
      c.stroke();
    } 
    
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

  document.body.addEventListener('mousedown', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    clicked = true;
  });

  document.body.addEventListener('mouseup', (e) => {
    clicked = false;
  });
  
  document.body.addEventListener('touchstart', (e) => {
    const t = e.touches[0];
    
    mouseX = t.clientX;
    mouseY = t.clientY;
    clicked = true;
  });

  document.body.addEventListener('touchmove', (e) => {
    const t = e.touches[0];
  
    mouseX = t.clientX;
    mouseY = t.clientY;
  });

  document.body.addEventListener('touchend', (e) => {
    clicked = false;
  });
})();
