'use strict';

var Ground = function(game, x, y, width, height, key) {
    Phaser.TileSprite.call(this, game, x, y, width, height, key); //new TileSprite(game, x, y, width, height, key, frame) 

    this.game.physics.arcade.enableBody(this);

    this.autoScroll(-200, 0);

    this.body.allowGravity = false;
    this.body.immovable = true;
};

Ground.prototype = Object.create(Phaser.TileSprite.prototype);
Ground.prototype.constructor = Ground;

Ground.prototype.update = function() {
    // write your prefab's specific update code here  
};

module.exports = Ground;