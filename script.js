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
    this.shield = Math.floor(Math.random()*4 + 1);
  }

  update() {
    if(this.shield <= 0) {
      this.width = 0;
      this.height = 0;
    }
    this.element.style['background-color'] = colors[this.shield];
  }
}

class Stick extends Item {
  constructor() {
    super();
    this.height = winH * 0.03;
    this.width = winW * 0.1;
    this.x = (winW-this.width) / 2;
    this.y = winH * 0.9
    this.goRight = false;
    this.goLeft = false;
  }

  update() {
    if(this.goRight && this.x+this.width<winW) this.x += winW/1500;
    if(this.goLeft && this.x>0) this.x -= winW/1500;
  }
}

class Ball extends Item {
  constructor() {
    super();
    this.height = winW * 0.015;
    this.width = winW * 0.015;
    this.x = (winW-this.width) / 2;
    this.y = winH * 0.85
  }

  draw() {
    super.draw();
    this.element.style['border-radius'] = '100%';
  }

  update() {
    this.x += dx;
    this.y += dy;

    // game over
    if(this.y >= winH-this.height) {
      clearInterval(loop);
      title.innerHTML = 'game over!';
      content.innerHTML = 'score: ' + score; 
      menu.style.visibility = 'visible';
      scoreDisplay.style.visibility = 'hidden';
    }

    // hit broader
    if(this.x<=0 || this.x>=winW-this.width) dx *= -1;
    if(this.y<=0) dy *= -1;

    // hit stick
    if(this.x>=stick.x && this.x<=stick.x+stick.width && this.y+this.height>=stick.y) dy *= -1;

    // hit bricks
    for(let r = 0; r < row; r++) {
      for(let c = 0; c < col; c++) {
        if(brick[r][c].shield <= 0) continue;

        // bottom
        if(this.x>=brick[r][c].x &&
          this.x<=brick[r][c].x+brick[r][c].width &&
          this.y>=brick[r][c].y &&
          this.y<=brick[r][c].y+brick[r][c].height) {
          dy *= -1;
          score += 5-brick[r][c].shield;
          brick[r][c].shield--;
        } // right
        else if(this.x>=brick[r][c].c && this.x <= brick[r][c].x+brick[r][c].width &&
          this.y>=brick[r][c].y && this.y<=brick[r][c].y+brick[r][c].height) {
          dx *= -1;
          score += 5-brick[r][c].shield;
          brick[r][c].shield--;
        } // left
        else if(this.x+this.width>=brick[r][c].x && this.x+this.width<=brick[r][c].x+brick[r][c].width &&
          this.y>=brick[r][c].y && this.y<=brick[r][c].y+brick[r][c].height) {
          dx *= -1;
          score += 5-brick[r][c].shield;
          brick[r][c].shield--;
        }
      }
    }
  }
}

const winW = window.innerWidth, winH = window.innerHeight;
const col = 9, row = 3, gapCol = winW*0.004, gapRow = winH * 0.01
const colors = ['', '#F38BA8', '#F9E2AF', '#89B4FA', '#A6E3A1'];
let dx = winW*0.001*Math.sign(Math.random()-0.5);
let dy = winH*0.001*Math.sign(Math.random()-0.5);
let score = 0;

// create bricks
const brick = [];
for(let r = 0; r < row; r++) {
  brick[r] = [];
  for(let c = 0; c < col; c++) {
    brick[r][c] = new Brick(r, c);
  }
}

const stick = new Stick();
const ball = new Ball();
const menu = document.getElementById('menu');
const title = document.getElementById('title');
const content = document.getElementById('content');
const scoreDisplay = document.getElementById('scoreDisplay');
let gameStart = false;

// start moving stick
document.addEventListener('keydown', (event) => {
  console.log(event.key);
  if(event.key == 'h') {
    stick.goLeft = true;
  }
  else if(event.key == 'l') {
    stick.goRight = true;
  }
  else if(event.key=='Enter' && !gameStart) {
    gameStart = true;
    menu.style.visibility = 'hidden';
  }
});

// stop moving stick
document.addEventListener('keyup', (event) => {
  if(event.key == 'h') {
    stick.goLeft = false;
  }
  else if(event.key == 'l') {
    stick.goRight = false;
  }
});

// game loop
const loop = setInterval(run, 1);

function run() {
  if(gameStart) {
    ball.update();
    stick.update();

    // update score
    scoreDisplay.innerHTML = 'score: ' + score;
  }

  ball.draw();
  stick.draw();

  // update brick
  for(let r = 0; r < row; r++) {
    for(let c = 0; c < col; c++) {
      brick[r][c].update();
      brick[r][c].draw();
    }
  }
}
