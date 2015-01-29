'use strict';

var Cloud = function(game, x, y, width, height, key, speed) {
    Phaser.TileSprite.call(this, game, x, y, width, height, key); //new TileSprite(game, x, y, width, height, key, frame) 

    this.game.physics.arcade.enableBody(this);

    this.body.allowGravity = false;
    this.body.immovable = true;

    this.scrollSpeed = speed;
};

Cloud.prototype = Object.create(Phaser.TileSprite.prototype);
Cloud.prototype.constructor = Cloud;

Cloud.prototype.update = function() {
    // write your prefab's specific update code here  
};

Cloud.prototype.scroll = function() {
    this.autoScroll(this.scrollSpeed, 0);
};

Cloud.prototype.stop = function() {
    this.stopScroll();
};

module.exports = Cloud;