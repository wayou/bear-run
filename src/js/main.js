'use strict';

var game = new Phaser.Game(320,480, Phaser.AUTO, '');

window.Utils = require('./utils');

game.state.add('Boot', require('./states/boot'));
game.state.add('Preloader', require('./states/preloader'));
game.state.add('Menu', require('./states/menu'));
game.state.add('Game', require('./states/game'));
game.state.add('Gameover', require('./states/gameover'));

game.state.start('Boot');
