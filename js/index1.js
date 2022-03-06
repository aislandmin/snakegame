var canvas = document.querySelector("#snakeArea");
var ctx = canvas.getContext("2d");
canvas.width = 500;
canvas.height = 500;

var snakeArr = [new SnakePart(1, 0), new SnakePart(0, 0)];
var headDir = 39; //default right

var headImg = document.createElement("img");
var bodyImg = document.createElement("img");
headImg.src = "image/head.jpg";
bodyImg.src = "image/body.jpg";

headImg.onload = function () {
  bodyImg.onload = function () {
    renderSnake();
  };
};

function renderSnake() {
  let head = snakeArr[0];
  let body = snakeArr[1];
  ctx.drawImage(headImg, 0, 0, 20, 20, head.x * 20, head.y * 20, 20, 20);
  ctx.drawImage(bodyImg, 0, 0, 20, 20, body.x * 20, body.y * 20, 20, 20);
}

document.body.onkeydown = function (e) {
  switch (e.keyCode) {
    case 37: //left
      break;
    case 38: //up
      break;
    case 39: //right
      break;
    case 40: //down
      break;
  }
};

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
