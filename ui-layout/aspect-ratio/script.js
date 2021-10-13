let gui, canvas, c, width, height, id, img, scaleMode;

const setupGui = () => {
  gui = new dat.GUI();
  
  gui.params = {
    type: 'fill',
  };

  gui.ctrls = {
    type: gui.add(gui.params, 'type', ['fill', 'showAll'])
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

  scaleMode = gui.params.type;

  img = new Image();
  //img.crossOrigin = 'Anonymous';
  img.src = './raccoons.jpeg';
  img.addEventListener('load', draw(0));
};

const getWidthFirst = (scaleMode, imageAspectRatio, containerAspectRatio) => {
  if (scaleMode === 'showAll') {

    return imageAspectRatio > containerAspectRatio;
  } else {

    return imageAspectRatio < containerAspectRatio;
  }
};

const draw = (t) => {
  t *= gui.params.timeScale;
  
  let imageWidth, imageHeight;
  let imageAspectRatio = img.width / img.height;
  
  const containerAspectRatio = width / height;
  const widthFirst = getWidthFirst(scaleMode, imageAspectRatio, containerAspectRatio);

  if (widthFirst) {
    imageWidth = width;
    imageHeight = imageWidth / imageAspectRatio;
  } else {
    imageHeight = height;
    imageWidth = imageHeight * imageAspectRatio;
  }
 
  c.save();
  
  c.clearRect(0, 0, width, height);

  c.drawImage(
    img,
    0, 0, img.width, img.height,
    (width - imageWidth) / 2, (height - imageHeight) / 2, imageWidth, imageHeight
  );
   
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
