'use strict';

var Actor = require('./actor').Actor;

function Walker(game, x, y, key, frame) {
  Actor.call(this, game, x, y, key, frame);
  game.physics.enable(this, Phaser.Physics.ARCADE);
  this.walkSpeed = 400;
  this.walkFps = 20;
  this.idleFps = 1;
  this.anchor.setTo(0.5, 0.5);
}

Walker.prototype = Object.create(Actor.prototype);
Walker.prototype.constructor = Walker;

Walker.prototype.update = function () {
  Actor.prototype.update.call(this);
  // handle movement
  var controls = this.controls;
  var xDir = controls.moveLeft ? -1 : 0;
  xDir += controls.moveRight ? 1 : 0;
  var yDir = controls.moveUp ? -1 : 0;
  yDir += controls.moveDown ? 1 : 0;
  var xSpeed = 0;
  var ySpeed = 0;
  if (xDir || yDir) {
    var angle = Math.atan2(yDir, xDir);
    this.rotation += Phaser.Math.normalizeAngle((angle - this.rotation)) * 0.6;
    xSpeed = this.walkSpeed * Math.cos(angle);
    ySpeed = this.walkSpeed * Math.sin(angle);
    this.animations.play('walk', this.walkFps);
  } else {
    this.animations.play('idle', this.walkFps);
  }
  this.body.velocity.setTo(xSpeed, ySpeed);
  if (xDir || yDir) {
    
  }

}

module.exports = Walker;
