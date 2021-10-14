let gui, canvas, c, width, height, id, mouseX, mouseY, handle, offset;

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

  mouseX = 0;
  mouseY = 0;

  handle = {
    x: width / 2,
    y: height / 2,
    radius: 20
  };

  offset = {};

  draw(0);
};

const onMouseMove = (e) => {
  handle.x = e.clientX - offset.x;
  handle.y = e.clientY - offset.y;
};

const onMouseUp = (e) => {
  window.removeEventListener('mousemove', onMouseMove);
  window.removeEventListener('mouseup', onMouseUp);
};

const draw = (t) => {
  t *= gui.params.timeScale;

  c.save();
  
  c.clearRect(0, 0, width, height);

  c.fillStyle = 'gray';
  c.beginPath();
  c.arc(handle.x, handle.y, handle.radius, 0, Math.PI * 2, false);
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

  window.addEventListener('mousemove', (e) => {
    console.log(e);
    mouseX = e.clientX;
    mouseY = e.clientY;
  });

  window.addEventListener('mousedown', (e) => {
    const dx = e.clientX - handle.x;
    const dy = e.clientY - handle.y;
    const dist = Math.sqrt(dx * dx + dy * dy);

    if (dist < handle.radius) {
      window.addEventListener('mousemove', onMouseMove);
      window.addEventListener('mouseup', onMouseUp);

      offset.x = e.clientX - handle.x;
      offset.y = e.clientY - handle.y;
    }
  });
})();
