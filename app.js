(function(){
  'use strict';

  var animate  = window.requestAnimationFrame;
  var canvas   = document.querySelector('canvas');
  var context  = canvas.getContext('2d');
  var player   = new Player();
  var computer = new Computer();
  var ball     = new Ball(200, 300);
  var keysDown = {};

  window.addEventListener('load', function() {
    animate(step);
  });

  window.addEventListener('keydown', function(event) {
    keysDown[event.keyCode] = true;
  });

  window.addEventListener('keyup', function(event) {
    delete keysDown[event.keyCode];
  });

  // 1. Updates the player's paddle, the computer's paddle and the ball.
  // 2. Render these objects.
  // 3. recursevely leverage requestAnimationFrame to animate the canvas.
  var step = function() {
    update();
    render();
    animate(step);
  };

  var update = function() {
    player.update();
    computer.update(ball);
    ball.update(player.paddle, computer.paddle);
  };

  var render = function() {
    context.fillStyle = '#000';
    context.fillRect(0, 0, canvas.width, canvas.height);
    player.render();
    computer.render();
    ball.render();
  };

  function Paddle(x, y, width, height) {
    this.x = x;
    this.y = y;
    this.width  = width;
    this.height = height;
    this.xSpeed = 0;
    this.ySpeed = 0;
  }

  Paddle.prototype.render = function() {
    context.fillStyle = '#FFF';
    context.fillRect(this.x, this.y, this.width, this.height);
  };

  Paddle.prototype.move = function(x, y) {
    this.x += x;
    this.y += y;
    this.xSpeed = x;
    this.ySpeed = y;

    if (this.x < 0) {
      this.x = 0;
      this.xSpeed = 0;
    }
    else if (this.x + this.width > canvas.width) {
      this.x = canvas.width - this.width;
      this.xSpeed = 0;
    }
  };

  function Player() {
    this.paddle = new Paddle(175, 580, 50, 10);
  }

  function Computer() {
    this.paddle = new Paddle(175, 10, 50, 10);
  }

  function Ball(x, y) {
    this.x = x;
    this.y = y;
    this.xSpeed = 0;
    this.ySpeed = 3;
    this.radius = 5;
  }

  Player.prototype.render = function() {
    this.paddle.render();
  };

  Player.prototype.update = function() {
    for(var key in keysDown) {
      var value = Number(key);

      // Left arrow
      if (value == 37) {
        this.paddle.move(-4, 0);
      }
      // Right arrow
      else if (value == 39) {
        this.paddle.move(4, 0);
      }
      else {
        this.paddle.move(0, 0);
      }
    }
  };

  Computer.prototype.render = function() {
    this.paddle.render();
  };

  Computer.prototype.update = function(ball) {
    var diff = -((this.paddle.x + (this.paddle.width / 2)) -  ball.x);

    // Max speed left
    if (diff < 0 && diff < -4) {
      diff = -5;
    }
    // Max speed right
    else if (diff > 0 && diff > 4) {
      diff = 5;
    }

    this.paddle.move(diff, 0);

    if (this.paddle.x < 0) {
      this.paddle.x = 0;
    }
    else if (this.paddle.x + this.paddle.width > canvas.width) {
      this.paddle.x = canvas.width - this.paddle.width;
    }
  };

  Ball.prototype.render = function() {
    context.beginPath();
    context.arc(this.x, this.y, this.radius, Math.PI * 2, false);
    context.fillStyle = '#FFF';
    context.fill();
  };

  Ball.prototype.update = function(playerPaddle, computerPaddle) {
    this.x += this.xSpeed;
    this.y += this.ySpeed;

    var topX    = this.x -5;
    var topY    = this.y -5;
    var bottomX = this.x + 5;
    var bottomY = this.y + 5;

    // ---------------------------------------------------------------------------------------------------------------
    // AABB collision detection. (http://en.wikipedia.org/wiki/Minimum_bounding_box#Axis-aligned_minimum_bounding_box)
    // ---------------------------------------------------------------------------------------------------------------

    // Hitting the left wall
    if (this.x - 5 < 0) {
      this.x = 5;
      this.xSpeed = -this.xSpeed;
    }
    // Hitting the right wall
    else if(this.x + 5 > canvas.width) {
      this.x = canvas.width - 5;
      this.xSpeed = -this.xSpeed;
    }

    // Point was scored
    if (this.y < 0 || this.y > canvas.height) {
      this.xSpeed = 0;
      this.ySpeed = 3;
      this.x = 200;
      this.y = 300;
    }

    if (topY >  canvas.height / 2) {
      // Hit the player's paddle
      if (topY < (playerPaddle.y + playerPaddle.height) && bottomY > playerPaddle.y && topX < (playerPaddle.x + playerPaddle.width) && bottomX > playerPaddle.x) {
        this.ySpeed = -3;
        this.xSpeed += (playerPaddle.xSpeed / 2);
        this.y += this.ySpeed;
      }
    }
    else {
      // Hit the computer's paddle
      if (topY < (computerPaddle.y + computerPaddle.height) && bottomY > computerPaddle.y && topX < (computerPaddle.x + computerPaddle.width) && bottomX > computerPaddle.x) {
        this.ySpeed = 3;
        this.xSpeed += (computerPaddle.xSpeed / 2);
        this.y += this.ySpeed;
      }
    }
  };
})();
