'use strict';

var game = new Phaser.Game(320,480, Phaser.AUTO, '');

game.global={
    status:0,//0 stop 1 running
    score:0,
    bestScore:0
}

window.Utils = require('./utils');

game.state.add('Boot', require('./states/boot'));
game.state.add('Preloader', require('./states/preloader'));
game.state.add('Menu', require('./states/menu'));
game.state.add('Game', require('./states/game'));
game.state.add('Gameover', require('./states/gameover'));

game.state.start('Boot');
