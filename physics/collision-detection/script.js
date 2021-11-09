let gui, canvas, c, width, height, id;
let particle, vector, sun, planet, particles, friction, circle0, circle1, utils, rect0, rect1;

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

   rect0 = {
     x: 200,
     y: 200,
     width: 200,
     height: 100
   };

   rect1 = {
     x: 0,
     y: 0,
     width: 100,
     height: 200
   };
  
  //draw(0);
};

const draw = (t) => {
  t *= gui.params.timeScale;
 
  c.save();
  
  c.clearRect(0, 0, width, height);

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
    c.clearRect(0, 0, width, height);

    rect1.x = e.clientX - 50;
    rect1.y = e.clientY - 100;

    if (utils.rectIntersect(rect0, rect1)) {
      c.fillStyle = '#ff6666';
    } else {
      c.fillStyle = '#999999';
    }

    c.fillRect(rect0.x, rect0.y, rect0.width, rect0.height);
    c.fillRect(rect1.x, rect1.y, rect1.width, rect1.height);


  });
})();
