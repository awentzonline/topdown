(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';


function ActorControls() {
  this.moveUp = false;
  this.moveDown = false;
  this.moveLeft = false;
  this.moveRight = false;
  this.moveJump = false;
}

function Actor(game, x, y, key, frame) {
  Phaser.Sprite.call(this, game, x, y, key, frame);
  this.controls = new ActorControls();
}

Actor.prototype = Object.create(Phaser.Sprite.prototype);
Actor.prototype.constructor = Actor;

module.exports = {
  Actor: Actor,
  ActorControls: ActorControls
};

},{}],2:[function(require,module,exports){
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

},{"./actor":1}],3:[function(require,module,exports){
'use strict';

//global variables
window.onload = function () {
  var game = new Phaser.Game(800, 600, Phaser.AUTO, 'topdown');

  // Game States
  game.state.add('boot', require('./states/boot'));
  game.state.add('gameover', require('./states/gameover'));
  game.state.add('menu', require('./states/menu'));
  game.state.add('play', require('./states/play'));
  game.state.add('preload', require('./states/preload'));
  

  game.state.start('boot');
};
},{"./states/boot":4,"./states/gameover":5,"./states/menu":6,"./states/play":7,"./states/preload":8}],4:[function(require,module,exports){

'use strict';

function Boot() {
}

Boot.prototype = {
  preload: function() {
    this.load.image('preloader', 'assets/preloader.gif');
  },
  create: function() {
    this.game.input.maxPointers = 1;
    this.game.state.start('preload');
  }
};

module.exports = Boot;

},{}],5:[function(require,module,exports){

'use strict';
function GameOver() {}

GameOver.prototype = {
  preload: function () {

  },
  create: function () {
    var style = { font: '65px Arial', fill: '#ffffff', align: 'center'};
    this.titleText = this.game.add.text(this.game.world.centerX,100, 'Game Over!', style);
    this.titleText.anchor.setTo(0.5, 0.5);

    this.congratsText = this.game.add.text(this.game.world.centerX, 200, 'You did not survive', { font: '32px Arial', fill: '#ffffff', align: 'center'});
    this.congratsText.anchor.setTo(0.5, 0.5);

    this.instructionText = this.game.add.text(this.game.world.centerX, 300, 'Click To Play Again', { font: '16px Arial', fill: '#ffffff', align: 'center'});
    this.instructionText.anchor.setTo(0.5, 0.5);
  },
  update: function () {
    if(this.game.input.activePointer.justPressed()) {
      this.game.state.start('play');
    }
  }
};
module.exports = GameOver;

},{}],6:[function(require,module,exports){

'use strict';
function Menu() {}

Menu.prototype = {
  preload: function() {

  },
  create: function() {
    //var img = this.game.add.sprite(0, 0, 'title');
    var style = { font: '65px Arial', fill: '#ffffff', align: 'center'};
    this.titleText = this.game.add.text(this.game.world.centerX, 300, 'Game: The Game', style);
    this.titleText.anchor.setTo(0.5, 0.5);

    this.instructionsText = this.game.add.text(this.game.world.centerX, 400, 'Click anywhere to play', { font: '16px Arial', fill: '#ffffff', align: 'center'});
    this.instructionsText.anchor.setTo(0.5, 0.5);
  },
  update: function() {
    if(this.game.input.activePointer.justPressed()) {
      this.game.state.start('play');
    }
  }
};

module.exports = Menu;

},{}],7:[function(require,module,exports){
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

},{"../elements/walker":2}],8:[function(require,module,exports){

'use strict';
function Preload() {
  this.asset = null;
  this.ready = false;
}

Preload.prototype = {
  preload: function() {
    this.asset = this.add.sprite(this.width/2,this.height/2, 'preloader');
    this.asset.anchor.setTo(0.5, 0.5);

    this.load.onLoadComplete.addOnce(this.onLoadComplete, this);
    this.load.setPreloadSprite(this.asset);
    this.load.spritesheet('suit_walk', 'assets/suit_walk_top.png', 177, 100, 8);
    this.load.image('terrain0', 'assets/ground_cobblestone4.jpg');
  },
  create: function() {
    this.asset.cropEnabled = false;
  },
  update: function() {
    if(!!this.ready) {
      this.game.state.start('menu');
    }
  },
  onLoadComplete: function() {
    this.ready = true;
  }
};

module.exports = Preload;

},{}]},{},[3])