'use strict';

var Player = function(game, x, y, key, frame) {
    Phaser.Sprite.call(this, game, x, y, key, frame);

    this.frame = 5;

    this.game.physics.arcade.enableBody(this);

    this.anchor.setTo(0.5, 0.5);

    this.body.collideWorldBounds = true;

    this.jumpSnd = this.game.add.audio('jump');

    this.animations.add('run', [5, 6, 7, 8], 10, true); //add(name, frames, frameRate, loop, useNumericIndex) 
}

Player.prototype = Object.create(Phaser.Sprite.prototype);
Player.prototype.constructor = Player;

/**
 * Automatically called by World.update
 */
Player.prototype.update = function() {
    if (this.body.touching.down && this.game.global.status == 1) {
        this.run();
    }
};

Player.prototype.jump = function() {
    if (this.body.touching.down) {
        this.body.velocity.y = -650;
        this.stop();
        // this.frame = 6;
        this.jumpSnd.play();
    }
};

Player.prototype.run = function() {
    this.animations.play('run');
};

Player.prototype.stop = function() {
    this.animations.stop('run');
};

module.exports = Player;