let canvas, c, width, height, id, arm;

const setupCanvas = () => {
  canvas = document.createElement('canvas');
  document.getElementsByTagName('body')[0].appendChild(canvas);
  canvas.style.width = '100%';
  canvas.style.height = '100%';
  c = canvas.getContext('2d');
};

const initialize = () => {
  width = canvas.width = window.innerWidth;
  height = canvas.height = window.innerHeight;

  arm = new Arm();
  arm2 = arm.create(arm.getEndX(), arm.getEndY(), 100, 1.3);
  arm3 = arm.create(arm2.getEndX(), arm2.getEndY(), 100, 1.3);
  arm2.parent = arm;
  arm3.parent = arm2;
};

const update = (t) => {
  arm.angle = Math.sin(t) * 1.2;
  arm2.angle = Math.cos(t * 0.873) * 0.92;
  arm3.angle = Math.sin(t * 1.573) * 1.34;
  
  arm2.x = arm.getEndX();
  arm2.y = arm.getEndY();
  arm3.x = arm2.getEndX();
  arm3.y = arm2.getEndY();
};

const draw = (t) => {
  t *= 0.001;
  c.save();
  c.clearRect(0, 0, width, height);
  c.translate(width / 2, height / 2);

  arm.render(c);
  arm2.render(c);
  arm3.render(c);

  update(t);
  
  c.restore();
  id = requestAnimationFrame(draw);
};

(() => {
  window.addEventListener('DOMContentLoaded', () => {
    console.clear();

    setupCanvas();
    initialize();
    draw();
  });

  window.addEventListener('resize', () => {
    cancelAnimationFrame(id);

    initialize();
    draw();
  });
})();
