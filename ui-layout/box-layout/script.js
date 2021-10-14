let gui, canvas, c, width, height, id, items;

const setupGui = () => {
  gui = new dat.GUI();
  
  gui.params = {
    number: 50,
    maxWidth: 80,
    maxHeight: 80,
    spacing: 5,
    alignment: 'top',
    wrap: true
  };

  gui.ctrls = {
    number: gui.add(gui.params, 'number', 1, 2000, 1)
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
      .onChange(() => initialize())
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

const hbox = (items, spacing, alignment, wrap) => {
  let x = 0;
  let y = 0;
  let maxHeight = 0;
  let yPos = 0;

  for (let i = 0; i < items.length; i++) {
    maxHeight = Math.max(maxHeight, items[i].h);
  }

  for (let i = 0; i < items.length; i++) {
    const item = items[i];

    if (wrap && x + item.w + spacing > width + item.w) {
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
      break;
    }

    c.fillRect(x, y + yPos, item.w, item.h);
    x += item.w + spacing;
  }
};

const draw = (t) => {
  t *= gui.params.timeScale;
 
  c.save();
  
  c.clearRect(0, 0, width, height);

  hbox(items, gui.params.spacing, gui.params.alignment, gui.params.wrap);
  
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
