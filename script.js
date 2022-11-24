const winW = window.innerWidth, winH = window.innerHeight;
const col = 9, row = 3, gapCol = winW*0.01, gapRow = winH * 0.02
let dx = winW*0.001, dy = winH*-0.001;

class Item {
  constructor() {
    this.element = document.createElement("div");
  }

  draw() {
    document.body.appendChild(this.element);

    this.element.style.width = this.width + 'px';
    this.element.style.height = this.height + 'px';
    this.element.style.left = this.x + 'px';
    this.element.style.top = this.y + 'px';
  }
}

class Brick extends Item {
  constructor(r, c) {
    super();
    this.height = winH * 0.07;
    this.width = (winW-(col+1)*gapCol) / col;
    this.x = c*this.width + (c+1)*gapCol;
    this.y = r*this.height + (r+1)*gapRow;
  }
}

class Stick extends Item {
  constructor() {
    super();
    this.height = winH * 0.03;
    this.width = winW * 0.1;
    this.x = (winW-this.width) / 2;
    this.y = winH * 0.9

    this.draw();
  }
}

class Ball extends Item {
  constructor() {
    super();
    this.height = winW * 0.015;
    this.width = winW * 0.015;
    this.x = (winW-this.width) / 2;
    this.y = winH * 0.85
    this.radius = 100;
  }

  draw() {
    super.draw();
    this.element.style['border-radius'] = this.radius + '%';
  }

  move() {
    this.x += dx;
    this.y += dy;
  }

  update() {
    if(this.x<=0 || this.x>=winW-this.width) dx *= -1;
    if(this.y<=0) dy *= -1;
    if(this.y >= winH-this.height) {
      clearInterval(loop);
      alert("Game Over");
    }
  }
}

const brick = [];
for(let r = 0; r < row; r++) {
  brick[r] = [];
  for(let c = 0; c < col; c++) {
    brick[r][c] = new Brick(r, c);
    brick[r][c].draw();
  }
}

const stick = new Stick();
const ball = new Ball();

const loop = setInterval(run, 1);

function run() {
  ball.move();
  ball.draw();
  ball.update();
}
