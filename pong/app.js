(function(){
  'use strict';

  var animate = window.requestAnimationFrame;
  var canvas  = document.querySelector('canvas');
  var context = canvas.getContext('2d');

  window.addEventListener('load', function() {
    animate(step);
  });

  var step = function() {
    update();
    render();
    animate(step);
  };

  var update = function() {};

  var render = function() {
    context.fillStyle = '#000';
    context.fillRect(0, 0, canvas.width, canvas.height);
  };
})();
