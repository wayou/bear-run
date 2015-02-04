var Obstacle = function(game, x, y, key, frame, obstacleIndex) {
    Phaser.Sprite.call(this, game, x, y, key, frame);
    //use this property to create a same obstacle when we use getRandom
    this.obstacleIndex = obstacleIndex;
    this.game.physics.arcade.enableBody(this);
    this.anchor.setTo(0.5, 0.5);
    this.scale.setTo(0.5, 0.5);

    //decrease the collide body for better experience
    this.body.setSize(this.body.width - 15, this.body.height - 5, -3, 5);

    this.body.allowGravity = false;
    this.body.immovable = true;

    this.body.velocity.x = this.game.global.speed;

    this.checkWorldBounds = true;
    this.outOfBoundsKill = true;

};

Obstacle.prototype = Object.create(Phaser.Sprite.prototype);
Obstacle.prototype.constructor = Obstacle;

Obstacle.prototype.update = function() {

};

module.exports = Obstacle;