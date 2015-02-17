'use strict';

var Walker = require('../elements/walker');

function Play() {}

Play.prototype = {
  create: function() {
    this.game.input.keyboard.addKeyCapture([
      Phaser.Keyboard.LEFT,
      Phaser.Keyboard.RIGHT,
      Phaser.Keyboard.UP,
      Phaser.Keyboard.DOWN
    ]);
    this.game.physics.startSystem(Phaser.Physics.ARCADE);
    var gameWidth = 10000;
    var gameHeight = 10000;
    this.game.world.setBounds(0, 0, gameWidth, gameHeight);
    this.terrain = this.game.add.tileSprite(0, 0, this.game.width, this.game.height, 'terrain0');
    this.terrain.fixedToCamera = true;
    
    this.player = new Walker(this.game, gameWidth * 0.5, gameHeight * 0.5, 'suit_walk');   
    this.player.animations.add('idle', [0]);
    this.player.animations.add('walk', [0,1,2,3,4,5,6,7]); 
    this.game.add.existing(this.player);
    this.game.camera.follow(this.player);
  },
  update: function() {
    if (this.game.device.desktop) {
      this.updateKeyControls();
    } else {
      this.updateTouchControls();
    }
    this.terrain.tilePosition.setTo(-this.camera.view.x, -this.camera.view.y);
  },
  updateKeyControls: function () {
    var controls = this.player.controls;
    var keyboard = this.game.input.keyboard;
    controls.moveLeft = controls.moveRight = false;
    controls.moveLeft = keyboard.isDown(Phaser.Keyboard.LEFT);
    controls.moveRight = keyboard.isDown(Phaser.Keyboard.RIGHT);
    controls.moveUp = keyboard.isDown(Phaser.Keyboard.UP);
    controls.moveDown = keyboard.isDown(Phaser.Keyboard.DOWN);
  },
  updateTouchControls: function () {
    var controls = this.player.controls;
    var pointer = this.game.input.activePointer;
    if (pointer) {
      var epsilon = Math.min(this.player.width, this.player.height) * 0.25;
      var dx = pointer.worldX - this.player.x;
      var dy = pointer.worldY - this.player.y;
      controls.moveUp = controls.moveDown = controls.moveLeft = controls.moveRight = false;
      if (dx * dx + dy * dy > epsilon * epsilon) {
        controls.moveLeft = controls.moveRight = false;
        controls.moveLeft = pointer.worldX < this.player.x - epsilon;
        controls.moveRight = pointer.worldX > this.player.x + epsilon;
        controls.moveUp = pointer.worldY < this.player.y - epsilon;
        controls.moveDown = pointer.worldY > this.player.y + epsilon;
      }
    }
  }
};

module.exports = Play;
