'use strict';

var Player = function(game, x, y, key, frame) {
    Phaser.Sprite.call(this, game, x, y, key, frame);

    this.frame = 5;

    this.game.physics.arcade.enableBody(this);

    this.anchor.setTo(0.5, 0.5);

    //decrease the collide body for better experience
    this.body.setSize(this.body.width - 15, this.body.height);

    // this.body.collideWorldBounds = true;

    this.jumpSnd = this.game.add.audio('jump');

    this.runAni = this.animations.add('run', [5, 6, 7, 8], 10, true); //add(name, frames, frameRate, loop, useNumericIndex) 
    this.superRunAni = this.animations.add('super', [9, 10, 11, 12], 10, true);

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
        if (this.game.global.superMode) {
            if (!this.superRunAni.isPlaying) {
                this.superRun();
            }
        } else {
            if (!this.runAni.isPlaying) {
                if (this.superRunAni.isPlaying) {
                    this.superStop();
                }
                this.run();
            }
        }
    }
};

Player.prototype.jump = function() {
    if (this.body.touching.down && this.game.global.status === 1) {
        this.body.velocity.y = -500;

        if (this.superRunAni.isPlaying) {
            this.superStop();
        }
        if (this.runAni.isPlaying) {
            this.stop();
        }

        //toggle jump frame
        if (this.game.global.superMode) {
            this.jumpFrame = this.jumpFrame === 10 ? 12 : 10; //if in super mode, these two frame should be 10 & 12
        } else {
            this.jumpFrame = this.jumpFrame === 6 ? 8 : 6;
        }
        this.frame = this.jumpFrame;

        this.jumpSnd.play();
    }
};

Player.prototype.run = function() {
    this.animations.play('run');
};

Player.prototype.superRun = function() {
    this.animations.play('super');
};

Player.prototype.stop = function() {
    this.animations.stop('run');
};

Player.prototype.superStop = function() {
    this.animations.stop('super');
};

module.exports = Player;