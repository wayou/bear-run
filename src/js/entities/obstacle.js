var Obstacle = function(game, x, y, key, frame) {
    Phaser.Sprite.call(this, game, x, y, key, frame);
    this.anchor.setTo(0.5, 0.5);

    this.scale.setTo(0.5,0.5);

    this.game.physics.arcade.enableBody(this);

    this.body.allowGravity = false;
    this.body.immovable = true;

    this.body.velocity.x = -200;

    this.checkWorldBounds = true;
    this.outOfBoundsKill = true;

};

Obstacle.prototype = Object.create(Phaser.Sprite.prototype);
Obstacle.prototype.constructor = Obstacle;

Obstacle.prototype.update = function() {

};

module.exports = Obstacle;