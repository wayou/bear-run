'use strict';

var Cloud = require('../entities/cloud');

var Background = function(game, parent) {

    Phaser.Group.call(this, game, parent);

    this.add(new Cloud(this.game, 0, 0, 640, 480, 'cloud1', -80));
    this.add(new Cloud(this.game, 0, 0, 640, 480, 'cloud2', -40));

};

Background.prototype = Object.create(Phaser.Group.prototype);
Background.prototype.constructor = Background;

Background.prototype.update = function() {};

Background.prototype.scroll = function() {
    this.callAll('scroll');
};

Background.prototype.stop = function() {
    this.callAll('stop');
};

module.exports = Background;