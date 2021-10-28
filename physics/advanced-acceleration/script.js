let gui, canvas, c, width, height, id, particle, vector, ship, thrust, angle, turningRight, turningLeft, thrusting;

const setupGui = () => {
  gui = new dat.GUI();
  
  gui.params = {
    timeScale: 0.001,
    number: 100,
    reset: () => initialize()
  };

  gui.ctrls = {
    timeScale: gui.add(gui.params, 'timeScale', 0.001, 0.01, 0.001),
    number: gui.add(gui.params, 'number', 1, 2000, 1),
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

  particle = new Particle();
  vector = new Vector();

  ship = particle.create(width / 2, height / 2, 0, 0);
  thrust = vector.create(0, 0);
  angle = 0;
  turningRight = false;
  turningLeft = false;
  thrusting = false;

  draw(0);
};

const draw = (t) => {
  t *= gui.params.timeScale;
 
  c.save();
  
  c.clearRect(0, 0, width, height);
  //c.translate(width / 2, height / 2);

  if (turningLeft) {
    angle -= 0.05;
  }

  if (turningRight) {
    angle += 0.05;
  }

  thrust.setAngle(angle);

  if (thrusting) {
    thrust.setLength(0.1);
  } else {
    thrust.setLength(0);
  }

  // animation goes here
  ship.accelerate(thrust);
  ship.update();
  
  c.save();
  c.translate(ship.position.getX(), ship.position.getY());
  c.rotate(angle);

  c.beginPath();
  c.moveTo(10, 0);
  c.lineTo(-10, -10);
  c.lineTo(-10, 10);
  c.lineTo(10, 0);
  if (thrusting) {
    c.moveTo(-10, 0);
    c.lineTo(-20, 0);
  }
  c.stroke();

  c.restore();
 
  if (ship.position.getX() > width) {
    ship.position.setX(0);
  }
  if (ship.position.getX() < 0) {
    ship.position.setX(width);
  }
  if (ship.position.getY() > height) {
    ship.position.setY(0);
  }
  if (ship.position.getY() < 0) {
    ship.position.setY(height);
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

  document.body.addEventListener('keydown', (e) => {
    //console.log(e.keyCode);

    switch(e.keyCode) {
      case 38:
        thrusting = true;
        break;

      case 37:
        turningLeft = true;
        break;

      case 39:
        turningRight = true;
        break;

      default:
        break;
    }
  });
  
  document.body.addEventListener('keyup', (e) => {
    //console.log(e.keyCode);

    switch(e.keyCode) {
      case 38:
        thrusting = false;
        break;

      case 37:
        turningLeft = false;
        break;

      case 39:
        turningRight = false;
        break;

      default:
        break;
    }
  });
})();
