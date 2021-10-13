let gui, canvas, c, width, height, id, items;

const setupGui = () => {
  gui = new dat.GUI();
  
  gui.params = {
    timeScale: 0.001,
    number: 3000,
    maxWidth: 30,
    maxHeight: 30,
    spacing: 1,
    alignment: 'center',
    wrap: true,
    animationVer: false,
    animationHol: true,
    color: '#000'
  };

  gui.ctrls = {
    timeScale: gui.add(gui.params, 'timeScale', 0.001, 0.1, 0.001),
    number: gui.add(gui.params, 'number', 1, 5000, 1)
      .onChange(() => initialize()),
    maxWidth: gui.add(gui.params, 'maxWidth', 10, 500, 1)
      .onChange(() => initialize()),
    maxHeight: gui.add(gui.params, 'maxHeight', 10, 500, 1)
      .onChange(() => initialize()),
    spacing: gui.add(gui.params, 'spacing', 1, 100, 1)
      .onChange(() => initialize()),
    alignment: gui.add(gui.params, 'alignment', ['top', 'center', 'bottom'])
      .onChange(() => initialize()),
    wrap: gui.add(gui.params, 'wrap', true)
      .onChange(() => initialize()),
    animationVer: gui.add(gui.params, 'animationVer', true),
    animationHol: gui.add(gui.params, 'animationHol', true),
    color: gui.addColor(gui.params, 'color')
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

  items = [];

  for (let i = 0; i < gui.params.number; i++) {
    const tmp = {
      w: Math.max(gui.params.maxWidth * Math.random(), 10),
      h: Math.max(gui.params.maxHeight * Math.random(), 10)
    };

    items.push(tmp);
  }

  draw(0);
};

const hbox = (items, spacing, alignment, wrap, t) => {
  let x = 0;
  let y = 0;
  let maxHeight = 0;
  let yPos = 0;

  for (let i = 0; i < items.length; i++) {
    maxHeight = Math.max(maxHeight, items[i].h);
  }

  for (let i = 0; i < items.length; i++) {
    const item = items[i];

    if (wrap && x + item.w + spacing >= width + item.w + spacing) {
      x = 0;
      y += maxHeight + spacing;
    }

    if (alignment === 'bottom') {
      yPos = maxHeight - item.h;
    }

    if (alignment === 'center') {
      yPos = (maxHeight - item.h) / 2;
    }

    if (y > height) {
      return;
    }

    c.fillStyle = gui.params.color;

    if (gui.params.animationVer) {
      c.fillRect(x, y + yPos, item.w, Math.sin(t + x / width * Math.PI) * item.h);
    } else if (gui.params.animationHol) {
      c.fillRect(x, y + yPos, Math.sin(t + (y + yPos) / height * Math.PI) * item.w, item.h);
    } else {
      c.fillRect(x, y + yPos, item.w, item.h);
    }

    x += item.w + spacing;
  }
};

const draw = (t) => {
  t *= gui.params.timeScale;
 
  c.save();
  
  c.clearRect(0, 0, width, height);

  hbox(items, gui.params.spacing, gui.params.alignment, gui.params.wrap, t);
  
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
