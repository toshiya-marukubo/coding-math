let gui, canvas, c, width, height, id, particle, vector, utils, mouseX, mouseY;
let target, tc, verlets, pallete = ['#3EB3FF', '#FFEDDA', '#FEB831', '#FE2543'], intervalId;

const getRandomIntNumber = function(min, max) {
  return Math.floor(min + Math.random() * (max - min + 1));
};

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

  gui.hide();
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

  verlets = [];

  for (let i = 0; i < 1; i++) {
    const v = new Verlet(width, height);
    verlets.push(v);
  }

  draw(0);
};

const draw = (t) => {
  t *= gui.params.timeScale;
  
  c.save();
  c.clearRect(0, 0, width, height);

  for (let i = 0; i < verlets.length; i++) {
    verlets[i].render(c);
    if (verlets[i].kill) {
      verlets.splice(i, 1);
    }
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
    intervalId = setInterval(() => {
      const v = new Verlet(width, height, mouseX, mouseY);
      verlets.push(v);
    }, 40);
  });

  document.body.addEventListener('mouseup', (e) => {
    clearInterval(intervalId);
  });

  document.body.addEventListener('touchstart', (e) => {
    const touch = e.touches[0];
    mouseX = touch.clientX;
    mouseY = touch.clientY;
    intervalId = setInterval(() => {
      const v = new Verlet(width, height, mouseX, mouseY);
      verlets.push(v);
    }, 40);
  });
  
  document.body.addEventListener('touchmove', (e) => {
    const touch = e.touches[0];
    mouseX = touch.clientX;
    mouseY = touch.clientY;
  });

  document.body.addEventListener('touchend', (e) => {
    clearInterval(intervalId);
  });
})();
