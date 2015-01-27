'use strict';

var Player = function(game, x, y, key, frame) {
    Phaser.Sprite.call(this, game, x, y, key, frame);

    this.game.physics.arcade.enableBody(this);

    this.anchor.setTo(0.5, 0.5);

    this.body.collideWorldBounds = true;

    //create runing animation
    this.animations.add('run', [5, 6, 7, 8], 10, true); //add(name, frames, frameRate, loop, useNumericIndex) 
    this.animations.play('run'); //play(name, frameRate, loop, killOnComplete)
}

Player.prototype = Object.create(Phaser.Sprite.prototype);
Player.prototype.constructor = Player;

/**
 * Automatically called by World.update
 */
Player.prototype.update = function() {};

module.exports = Player;