'use strict';

var Ground = function(game, x, y, width, height, key) {
    Phaser.TileSprite.call(this, game, x, y, width, height, key); //new TileSprite(game, x, y, width, height, key, frame) 

    this.game.physics.arcade.enableBody(this);

    this.scale.setTo(0.5,0.5);

    this.body.allowGravity = false;
    this.body.immovable = true;

};

Ground.prototype = Object.create(Phaser.TileSprite.prototype);
Ground.prototype.constructor = Ground;

Ground.prototype.update = function() {
    // write your prefab's specific update code here  
};

Ground.prototype.scroll = function(speed) {
    this.autoScroll(speed*2, 0);
};

Ground.prototype.stop = function() {
    this.stopScroll();
};

module.exports = Ground;