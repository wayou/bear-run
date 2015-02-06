var Coin = function(game, x, y, key, frame) {
    Phaser.Sprite.call(this, game, x, y, key, frame);
    //use this property to create a same Coin when we use getRandom
    this.game.physics.arcade.enableBody(this);
    this.anchor.setTo(0.5, 0.5);
    this.scale.setTo(0.5, 0.5);

    this.name = 'coin';

    //decrease the collide body for better experience
    this.body.setSize(this.body.width - 15, this.body.height - 5, -3, 5);

    this.body.allowGravity = false;
    this.body.immovable = true;

    this.body.velocity.x = 0;

    this.checkWorldBounds = true;
    this.outOfBoundsKill = true;

};

Coin.prototype = Object.create(Phaser.Sprite.prototype);
Coin.prototype.constructor = Coin;

Coin.prototype.update = function() {

};

module.exports = Coin;