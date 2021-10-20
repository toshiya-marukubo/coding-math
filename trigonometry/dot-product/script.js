let gui, canvas, c, width, height, id, p0, p1, p2, dragPoint;

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

  p0 = {
    x: 200,
    y: 400
  };

  p1 = {
    x: 250,
    y: 200
  };

  p2 = {
    x: 350,
    y: 150
  };

  draw(0);
};

const vec = (p0, p1) => {
  return {
    x: p1.x - p0.x,
    y: p1.y - p0.y
  };
};

const dotProduct = (v0, v1) => {
  return v0.x * v1.x + v0.y * v1.y;
};

const mag = (v) => {
  return Math.sqrt(v.x * v.x + v.y * v.y);
};

const normalize = (v) => {
  const m = mag(v);

  return {
    x: v.x / m,
    y: v.y / m
  };
};

const angleBetween = (v0, v1) => {
  const dp = dotProduct(v0, v1);
  const mag0 = mag(v0);
  const mag1 = mag(v1);

  return Math.acos(dp / mag0 / mag1);
};

const drawPoint = (p) => {
  c.beginPath();
  c.arc(p.x, p.y, 10, 0, Math.PI * 2, false);
  c.stroke();
};

const drawLines = () => {
  c.beginPath();
  c.moveTo(p1.x, p1.y);
  c.lineTo(p0.x, p0.y);
  c.lineTo(p2.x, p2.y);
  c.stroke();
};

const onMouseMove = (e) => {
  dragPoint.x = e.clientX;
  dragPoint.y = e.clientY;
  
  draw();
};

const onMouseDown = (e) => {
  dragPoint = findDragPoint(e.clientX, e.clientY);

  if (dragPoint) {
    dragPoint.x = e.clientX;
    dragPoint.y = e.clientY;
    draw();
    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
  }
};

const onMouseUp = () => {
  document.removeEventListener('mousemove', onMouseMove);
  document.removeEventListener('mouseup', onMouseUp);
};

const findDragPoint = (x, y) => {
  if (hitTest(p0, x, y)) return p0;
  if (hitTest(p1, x, y)) return p1;
  if (hitTest(p2, x, y)) return p2;

  return null;
};

const hitTest = (p, x, y) => {
  const dx = p.x - x;
  const dy = p.y - y;

  return Math.sqrt(dx * dx + dy * dy) <= 10;
};

const draw = (t) => {
  t *= gui.params.timeScale;
 
  c.save();
  
  c.clearRect(0, 0, width, height);

  drawPoint(p0); 
  drawPoint(p1); 
  drawPoint(p2);
  drawLines();

  const v0 = vec(p1, p0);
  const v1 = vec(p2, p0);
  //const dp = dotProduct(normalize(v0), normalize(v1));
  const angle = angleBetween(v0, v1) * 180 / Math.PI;

  c.font = '30px Arial';
  c.fillText(angle, 30, 30);
  
  c.restore();
  
  //id = requestAnimationFrame(draw);
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

  window.addEventListener('mousedown', onMouseDown);
})();
