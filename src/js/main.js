/*
 * bear run
 * this is a html5 web game built with phaser
 * and inspired by chorme offline hidden game t-rex runner
 * v0.1.0
 * for more info pls head to https://github.com/wayou/bear-run
 */

'use strict';

var game = new Phaser.Game(320, 480, Phaser.AUTO, '');

game.global = {
    score: 0,
    highScore: localStorage && localStorage.getItem('bear-run-high-score') || 0, //get the high score from local storage if possible
    bestScore: 0,
    isOver: false,
    status: 0, //0 not started|1 started|2 game over
    level: 1,
    ratio: 1 //determie the scrolling speed and the frequency of the obstacles,increase with the time elapsed
}

window.Utils = require('./utils');

game.state.add('Boot', require('./states/boot'));
game.state.add('Preloader', require('./states/preloader'));
game.state.add('Menu', require('./states/menu'));
game.state.add('Game', require('./states/game'));
game.state.add('Gameover', require('./states/gameover'));

game.state.start('Boot');