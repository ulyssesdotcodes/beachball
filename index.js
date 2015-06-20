var canvas, ctx, center, prevSeconds, ballR, mouseVelocity, mousePos;

var ball, cat, background, sand;

var assets = "assets/";

var dampening = 0.8;
var gravity = 6.8;

var lastKickTime = -10;
var kickDuration = 0.5;

function init() {
  canvas = document.getElementById('tutorial');
  canvas.width = window.innerWidth - 50;
  canvas.height = window.innerHeight - 50;

  ball = new Image();
  ball.src = assets + "ball.png";

  cat = new Image();
  cat.src = assets + "cat02.png";

  background = new Image();
  background.src = assets + "background.png";

  sand = new Image();
  sand.src = assets + "sand.png";

  mouseVelocity = [0, 0];
  mousePos = [0, (canvas.height - cat.height) / canvas.height];

  // canvas.addEventListener('mousemove', function(e) {
  //   var rect = canvas.getBoundingClientRect();
  //   var curMousePos = [(e.clientX - rect.left) / canvas.width, (e.clientY - rect.top) / canvas.height]
  //   mouseVelocity[0] = curMousePos[0] - mousePos[0];
  //   mouseVelocity[1] = curMousePos[1] - mousePos[1];
  //   mousePos = curMousePos;
  // });

  window.addEventListener('keydown', function(e) {
    switch(e.keyCode) {
      case 37:
        mouseVelocity[0] -= 0.03;
        break;
      case 39:
        mouseVelocity[0] += 0.03;
        break;
      case 38:
        if(mousePos[1] > 0.9) {
          mouseVelocity[1] -= 0.08;
        }
        break;
    }
  });

  window.addEventListener('keyup', function(e) {
    switch(e.keyCode) {
      case 37:
        if(mouseVelocity[0] < 0) {
          mouseVelocity[0] = 0;
        }
        break;
      case 39:
        if(mouseVelocity[0] > 0) {
          mouseVelocity[0] = 0;
        }
        break;
      }
    }
  );

  center = [0.5, 0];
  window.vel = [0, 0];

  ballR = 0.05;

  prevSeconds = Date.now() * 0.001;

  ctx = canvas.getContext('2d');

  requestAnimationFrame(draw);
}


function draw(){
  function length(v1, v2) {
    return Math.sqrt(Math.pow(v1[0] - v2[0], 2) + Math.pow(v1[1] - v2[1], 2));
  }

  var vel = window.vel;
  // var mouseVelocity = window.mouseVelocity;

  var seconds = Date.now() * 0.001;
  var dt = seconds - prevSeconds;
  prevSeconds = seconds;

  // Update center
  vel = [vel[0], vel[1] + gravity * dt * 0.33 * 0.1];
  center = [center[0] + vel[0], center[1] + vel[1]];

  if(center[1] > 1.0 || center[1] < 0.0) {
    var side = 0.0;
    if(center[1] > 1.0) {
      side = 1.0;
    }
    center[1] = side - side * ballR;
    vel[1] = -vel[1] * dampening;
  }

  if(center[0] > 1.0 || center[0] < 0.0) {
    var side = 0.1;
    if(center[0] > 1.0) {
      side = 1.0;
    }
    center[0] = side - side * ballR;
    vel[0] = -vel[0] * dampening;
  }

  // Update cat
  mouseVelocity = [mouseVelocity[0], mouseVelocity[1] + gravity * dt * 0.33 * 0.1];
  mousePos = [mousePos[0] + mouseVelocity[0], mousePos[1] + mouseVelocity[1]];

  if (mousePos[0] < 0) {
    mousePos[0] = cat.width * 0.5 / canvas.width;
    mouseVelocity[0] = 0;
  }

  if (mousePos[0] > 1.0 - cat.width * 0.5 / canvas.width) {
    mousePos[0] = 1.0 - cat.width * 0.5 / canvas.width;
    mouseVelocity[0] = 0;
  }

  if (mousePos[1] > 1.0 - cat.height * 0.5 / canvas.height) {
    mousePos[1] = 1.0 - cat.height * 0.5 / canvas.height;
    mouseVelocity[1] = 0;
  }


  // Collisions

  var length = length(mousePos, center);
  if (length < ballR * 2 && seconds - lastKickTime > kickDuration) {
    var normal = [center[0] - mousePos[0], center[1] - mousePos[1]];
    normal = [normal[0] / Math.abs(length), normal[1] / Math.abs(length)];
    var dot = vel[0] * normal[0] + vel[1] * normal[1];
    vel = [vel[0] - 2 * dot * normal[0], vel[1] - 2 * dot * normal[1]];
    vel[0] += mouseVelocity[0];
    vel[1] += mouseVelocity[1];
    lastKickTime = seconds;
  }

  if(seconds - lastKickTime < kickDuration) {
    cat.src = assets + "cat02_kick.png";
  }
  else {
    cat.src = assets + "cat02.png";
  }


  ctx = canvas.getContext('2d');
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  ctx.drawImage(background, 0, 0, canvas.width, canvas.height);

  ctx.drawImage(sand, 0, canvas.height - sand.height, canvas.width, sand.height);
  ctx.drawImage(ball, center[0] * canvas.width, center[1] * canvas.height, ballR * canvas.width, ballR * canvas.width);
  ctx.drawImage(cat, mousePos[0] * canvas.width - cat.width * 0.5, mousePos[1] * canvas.height - cat.height * 0.5, cat.width, cat.height);


  // ctx.beginPath();
  // ctx.arc(center[0] * canvas.width, center[1] * canvas.height, ballR * canvas.width, 0, 2 * Math.PI);
  // ctx.fillStyle = "rgb(200,0,0)";
  // ctx.fill();
  // ctx.strokeStyle = 'rgba(0,153,255,0.4)';
  // ctx.stroke();
  // ctx.closePath();


  window.vel = vel;
  // window.mouseVelocity = mouseVelocity;
  requestAnimationFrame(draw);
}
