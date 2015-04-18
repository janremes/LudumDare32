(function() {
  'use strict';

  function Game() {
    this.player = null;
    this.map = null;
  }

  Game.prototype = {

    create: function () {
      var x = this.game.width / 2
        , y = this.game.height / 2;

      this.map = this.add.sprite(x,y,'map_svg');
        
     // this.player = this.add.sprite(x, y, 'player');
      this.map.anchor.setTo(0.5, 0.5);
      this.input.onDown.add(this.onInputDown, this);
    },

    update: function () {
      // var x, y, cx, cy, dx, dy, angle, scale;

      // x = this.input.position.x;
      // y = this.input.position.y;
      // cx = this.world.centerX;
      // cy = this.world.centerY;

      // angle = Math.atan2(y - cy, x - cx) * (180 / Math.PI);
      // this.map.angle = angle;

      // dx = x - cx;
      // dy = y - cy;
      // scale = Math.sqrt(dx * dx + dy * dy) / 100;

      // this.map.scale.x = scale * 0.6;
      // this.map.scale.y = scale * 0.6;
    },

    onInputDown: function () {
      //this.game.state.start('menu');

      console.log("clicked map");
    }

  };

  window['ludumdare'] = window['ludumdare'] || {};
  window['ludumdare'].Game = Game;

}());
