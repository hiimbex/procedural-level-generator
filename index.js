(function () {
  var requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;
  window.requestAnimationFrame = requestAnimationFrame;
})();

var canvas = document.getElementById("canvas"),
  ctx = canvas.getContext("2d"),
  width = 1000,
  height = 500,
  player = {
      x: 20,
      y: height - 130,
      width: 30,
      height: 50,
      speed: 3.5,
      velX: 0,
      velY: 0,
      jumping: false,
      grounded: false,
      won: false
  },
  keys = [],
  friction = .7,
  gravity = 0.3;

var boxes = [];

// dimensions
boxes.push({
  x: 0,
  y: 0,
  width: 10,
  height: height
});
boxes.push({
  x: 0,
  y: height - 2,
  width: width,
  height: 50
});
boxes.push({
  x: width - 10,
  y: 0,
  width: 50,
  height: height
});

const random = (min, max) => Math.random() * (max - min) + min;

let current = {
  x: random(50, 200),
  y: random(height - 85, height),
  width: random(10, 100),
  height: 10
}
boxes.push(current)

function getJumpable(current) {
  // implements 'jumpability' parameter to ensure level completability
  let x = random(current.x + 30, current.x + 100)
  let y = random(current.y - 85, current.y - 60)
  return {x, y}
}

while ((current.y - 120) > 0) {
  let {x, y} = getJumpable(current)
  // make a random shape based on jumpability
  current = {
    x,
    y,
    width: random(10, 100),
    height: 10 // keep height consistent fir math purposes
  }
  boxes.push(current)
}

canvas.width = width;
canvas.height = height;

function update() {
  // check keys
  if (keys[38] || keys[32] || keys[87]) {
      // up arrow or space
      if (!player.jumping && player.grounded) {
          player.jumping = true;
          player.grounded = false;
          player.velY = -player.speed * 2;
      }
  }
  if (keys[39] || keys[68]) {
      // right arrow
      if (player.velX < player.speed) {
          player.velX++;
      }
  }
  if (keys[37] || keys[65]) {
      // left arrow
      if (player.velX > -player.speed) {
          player.velX--;
      }
  }

  player.velX *= friction;
  player.velY += gravity;

  ctx.clearRect(0, 0, width, height);
  ctx.fillStyle = "black";
  ctx.beginPath();

  player.grounded = false;
  for (var i = 0; i < boxes.length; i++) {
      ctx.rect(boxes[i].x, boxes[i].y, boxes[i].width, boxes[i].height);

      var dir = colCheck(player, boxes[i]);

      if (dir === "l" || dir === "r") {
          player.velX = 0;
          player.jumping = false;
      } else if (dir === "b") {
          player.grounded = true;
          player.jumping = false;
      } else if (dir === "t") {
          player.velY *= -1;
      }

  }

  player.x += player.velX;
  player.y += player.velY;

  if (player.grounded){
       player.velY = 0;
  }

  if (player.y <= 0 && player.won !== true) {
    player.won = true;
    // do win screen
    console.log('winner!!')
    if (confirm('Congrats, you won! Play again?')) {
      location.reload();
    } else {
      location.reload();
    }
  }

  const image = document.getElementById('source');
  ctx.fill();
  //ctx.drawImage(image, player.x, player.y, player.width, player.height);
  ctx.drawImage(image, player.x, player.y, 60, 60);
  // ctx.fillStyle = "red";
  // ctx.fillRect(player.x, player.y, player.width, player.height);

  requestAnimationFrame(update);
}

function colCheck(shapeA, shapeB) {
  // get the vectors to check against
  var vX = (shapeA.x + (shapeA.width / 2)) - (shapeB.x + (shapeB.width / 2)),
      vY = (shapeA.y + (shapeA.height / 2)) - (shapeB.y + (shapeB.height / 2)),
      // add the half widths and half heights of the objects
      hWidths = (shapeA.width / 2) + (shapeB.width / 2),
      hHeights = (shapeA.height / 2) + (shapeB.height / 2),
      colDir = null;

  // if the x and y vector are less than the half width or half height, they we must be inside the object, causing a collision
  if (Math.abs(vX) < hWidths && Math.abs(vY) < hHeights) {
      // figures out on which side we are colliding (top, bottom, left, or right)
      var oX = hWidths - Math.abs(vX),
          oY = hHeights - Math.abs(vY);
      if (oX >= oY) {
          if (vY > 0) {
              colDir = "t";
              shapeA.y += oY;
          } else {
              colDir = "b";
              shapeA.y -= oY;
          }
      } else {
          if (vX > 0) {
              colDir = "l";
              shapeA.x += oX;
          } else {
              colDir = "r";
              shapeA.x -= oX;
          }
      }
  }
  return colDir;
}

document.body.addEventListener("keydown", function (e) {
  keys[e.keyCode] = true;
});

document.body.addEventListener("keyup", function (e) {
  keys[e.keyCode] = false;
});


window.addEventListener("load", function () {
  update();
});
