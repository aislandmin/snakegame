var canvas = document.querySelector("#snakeArea");
var ctx = canvas.getContext("2d");
canvas.width = 500;
canvas.height = 500;

var headDir = 39; //default right
var snakeArr = [
  new SnakePart(1, 0, headDir, -1),
  new SnakePart(0, 0, headDir, 0),
];

var foodLocation = { x: -1, y: -1 }; //保存食物坐标
var speed = 300; //ms
var timerId = -1;
var tracks = []; //运动轨迹数组，用于保存头部所走过的位置
var toAddBody = null; //保存蛇尾部的最近一个位置
var gameOverFlag = false; //游戏结束标志位，默认false

var headImg = document.createElement("img");
var bodyImg = document.createElement("img");
var foodImg = document.createElement("img");
headImg.src = "image/head.jpg";
bodyImg.src = "image/body.jpg";
foodImg.src = "image/food.png";

// headImg.onload = function () {
//   bodyImg.onload = function () {
//     renderSnake();
//   };
// };

// foodImg.onload = function () {
//   createRandomFood();
//   renderFood();
// };

function renderSnake() {
  //render head
  let head = snakeArr[0];
  ctx.drawImage(headImg, 0, 0, 20, 20, head.x * 20, head.y * 20, 20, 20);

  //render body
  for (let i = 1; i < snakeArr.length; i++) {
    let body = snakeArr[i];
    ctx.drawImage(bodyImg, 0, 0, 20, 20, body.x * 20, body.y * 20, 20, 20);
  }
}

document.body.onkeydown = function (event) {
  switch (event.keyCode) {
    case 37: //left
      headDir = 37;
      break;
    case 38: //up
      headDir = 38;
      break;
    case 39: //right
      headDir = 39;
      break;
    case 40: //down
      headDir = 40;
      break;
  }
};

//开始移动，启动定时器，每隔一段时间执行移动操作
function startMove() {
  timerId = setInterval(interval, speed);
  
  document.querySelector("#bgmusic").play();
}

function interval() {
  if (!gameOverFlag) {
    ctx.clearRect(0, 0, canvas.width, canvas.height); //清屏
    drawBoard();
    moveSnake();
    renderSnake();
    renderFood();
    eatFood();
    judgeGameOver();
  } else {
    pauseMove(); //暂停移动
    alert("Game Over");

    //界面重置
    ctx.clearRect(0, 0, canvas.width, canvas.height); //清屏
    drawBoard();
    document.querySelector(".start").style.display = "block";
  }
}

function pauseMove() {
  clearInterval(timerId);
  timerId = -1;

  document.querySelector("#bgmusic").pause();
}

function moveSnake() {
  let head = snakeArr[0];
  //recode current location and dir of snake head
  tracks.push(new Track(head.x, head.y, headDir));

  //head move
  switch (headDir) {
    case 37: //left
      head.x--;
      break;
    case 38: //up
      head.y--;
      break;
    case 39: //right
      head.x++;
      break;
    case 40: //down
      head.y++;
      break;
  }

  //移动前， 把尾部位置保存下来，作为吃到食物时增加身体的位置
  var tail = snakeArr[snakeArr.length - 1];
  toAddBody = new SnakePart(tail.x, tail.y, tail.dir, tail.next);
  //body move，明确蛇身体每一个部分的下一个移动位置
  for (let i = 1; i < snakeArr.length; i++) {
    let bodyPart = snakeArr[i];
    let next = tracks[bodyPart.next];
    bodyPart.x = next.x;
    bodyPart.y = next.y;
    bodyPart.dir = next.dir;
    bodyPart.next++;
  }
}

//在随机坐标位置生成食物
function createRandomFood() {
  //create random x and y
  //canvas width, height, 列数 = width / 20， 行数= height / 20
  let x = Math.floor(Math.random() * (canvas.width / 20)); //parseInt is ok as well
  let y = Math.floor(Math.random() * (canvas.height / 20));

  foodLocation.x = x;
  foodLocation.y = y;
}

//绘制食物
function renderFood() {
  ctx.drawImage(
    foodImg,
    0,
    0,
    146,
    173,
    foodLocation.x * 20,
    foodLocation.y * 20,
    20,
    20
  );
}

//判断是否可以吃食物
function eatFood() {
  let head = snakeArr[0];
  if (head.x === foodLocation.x && head.y === foodLocation.y) {
    //可以吃食物了：贪吃蛇生长，重新生成随机食物
    snakeArr.push(toAddBody);
    createRandomFood();
  }
}

function judgeGameOver() {
  let head = snakeArr[0];

  //出界
  if (
    head.x < 0 ||
    head.y < 0 ||
    head.x >= canvas.width / 20 ||
    head.y >= canvas.height / 20
  ) {
    gameOverFlag = true;
    return;
  }

  //头部和身体相遇
  for (let i = 1; i < snakeArr.length; i++) {
    if (head.x === snakeArr[i].x && head.y === snakeArr[i].y) {
      gameOverFlag = true;
      return;
    }
  }
}

document.querySelector(".start").addEventListener("click", function () {
  this.style.display = "none";

  //游戏重置
  headDir = 39; //default right
  snakeArr = [
    new SnakePart(1, 0, headDir, -1),
    new SnakePart(0, 0, headDir, 0),
  ];
  tracks = [];
  toAddBody = null;
  gameOverFlag = false;
  createRandomFood();

  startMove();
});

document.querySelector("#snakeArea").addEventListener("click", function () {
  document.querySelector(".suspend").style.display = "block";
  pauseMove();
});

document.querySelector(".suspend").addEventListener("click", function () {
  this.style.display = "none";
  startMove();
});

function drawBoard() {
  ctx.beginPath();
  for (let x = 0; x <= canvas.width; x += 20) {
    ctx.moveTo(x, 0);
    ctx.lineTo(x, canvas.height);
  }

  for (let x = 0; x <= canvas.height; x += 20) {
    ctx.moveTo(0, x);
    ctx.lineTo(canvas.width, x);
  }

  ctx.lineWidth = 0.5;
  ctx.closePath();
  ctx.stroke();
}
drawBoard();
