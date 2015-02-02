'use strict';

var Player = function(game, x, y, key, frame) {
    Phaser.Sprite.call(this, game, x, y, key, frame);

    this.frame = 5;

    this.game.physics.arcade.enableBody(this);

    this.anchor.setTo(0.5, 0.5);

    // this.body.collideWorldBounds = true;

    this.jumpSnd = this.game.add.audio('jump');

    this.animations.add('run', [5, 6, 7, 8], 10, true); //add(name, frames, frameRate, loop, useNumericIndex) 

    //set jump frame alternately
    this.jumpFrame = 6; //true for frame 6 and false for 8
};

Player.prototype = Object.create(Phaser.Sprite.prototype);
Player.prototype.constructor = Player;

/**
 * Automatically called by World.update
 */
Player.prototype.update = function() {
    if (this.body.touching.down && this.game.global.status === 1) {
        this.run();
    }
};

Player.prototype.jump = function() {
    if (this.body.touching.down && this.game.global.status ===1) {
        this.body.velocity.y = -600;
        this.stop();
        //toggle jump frame
        this.jumpFrame = this.jumpFrame == 6 ? 8 : 6
        this.frame = this.jumpFrame;

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