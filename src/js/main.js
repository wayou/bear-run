/*
 * bear run
 * this is a html5 web game built with phaser
 * and inspired by chorme offline hidden game t-rex runner
 * v0.6.0
 * for more info pls head to https://github.com/wayou/bear-run
 *
 *credits:
 *- code and art : wayou
 *- the bear stuff characters are created by tiaba ue team, and all characters used in this game are adapted from their works by wayou
 *- score snd by Cabeeno Rossley licensed under the cc license
* - http://www.freesound.org/people/Cabeeno%20Rossley/sounds/126422/
 *- gameover snd by fins licensed under the cc license  
 *- http://www.freesound.org/people/fins/sounds/146734/
 *- jump snd by LloydEvans09 Rossley licensed under the cc license
 *- http://www.freesound.org/people/LloydEvans09/sounds/187024/
 *
 *- tools used to create this game:
 *- convert wav audio to mp3 http://media.io/
 *

 * CHANGELOG
 
 * v0.6.0
 * - refactor the cloud, move it up so users can focus on the player
 * - adjust some data to make the game more reasonable

 * v0.5.1
 * - optimize the blink rate
 * - increase the game ratio from -20 to -25
 * - increase the MAX_SPEED from -500 to -600

 * v0.5.0
 * - blink the score when level up
 * - increase the game ratio from -10 to -20

 * v0.4.0
 * - resize the collide body for sprites for better experience

 * v0.3.1
 * - fix timer and the score
 
 * v0.3.0
 * - speed up scrolling when level up
 * - introduce debug
 
 * v0.2.0
 * - new obstacle icon
 * -  new replay button
 * - refactor the ground with new tile sprite
 
 * v0.1.2
 * - fix obstacle recyling and memery leask on mobile
 
 * v0.1.1
 * - add sound for game over
 */

'use strict';

var game = new Phaser.Game(320, 480, Phaser.AUTO, '');
//use canvas mode for debuging purpose, for the game.debug only works in canvas mode
//fix me: even change to canvas mode the game.debug still not working
// var game = new Phaser.Game(320, 480, Phaser.CANVAS, '');

game.global = {
    score: 0,
    highScore: localStorage && localStorage.getItem('bear-run-high-score') || 0, //get the high score from local storage if possible
    status: 0, //0 not started|1 started
    speed: -300,
    RATIO: -20, //how fast the speed grow during the game running
    MAX_SPEED: -460
};

window.Utils = require('./utils');

game.state.add('Boot', require('./states/boot'));
game.state.add('Preloader', require('./states/preloader'));
game.state.add('Menu', require('./states/menu'));
game.state.add('Game', require('./states/game'));
game.state.add('Gameover', require('./states/gameover'));

game.state.start('Boot');