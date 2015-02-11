/*
 * bear run
 * this is a html5 web game built with phaser
 * and inspired by chorme offline hidden game t-rex runner
 * v0.13.0
 * for more info pls head to https://github.com/wayou/bear-run
 *
 *CREDITS:
 *- code and art : wayou
 *- the bear stuff characters are created by tiaba ue team, and all characters used in this game are adapted from their works by wayou
 *- score snd by Cabeeno Rossley licensed under the cc license
 *- http://www.freesound.org/people/Cabeeno%20Rossley/sounds/126422/
 *- gameover snd by fins licensed under the cc license  
 *- http://www.freesound.org/people/fins/sounds/146734/
 *- jump snd by LloydEvans09 Rossley licensed under the cc license
 *- http://www.freesound.org/people/LloydEvans09/sounds/187024/
 *- coin snd by DrMinky licensed under the cc license
 *- https://www.freesound.org/people/DrMinky/sounds/166184/
 *- bite snd by yottasounds and published as public domain
 *- https://www.freesound.org/people/yottasounds/sounds/232133/
 *
 *- tools used to create this game:
 *- convert wav audio to mp3 http://media.io/
 *

 * CHANGELOG
 
 * v0.13.0
 * - test share
 
 * v0.12.1
 * - new UE asserts
 * - swap the replay btn and share btn

* v0.12.0
 * - get the floating text back to game
 * - fix the sky color

 * v0.11.4
 * - change document title from 「呆萌熊」to 「熊孩子」

* v0.11.3
 * - add share button and share hint pic when game over

 * v0.11.2
 * - fix weixin share thumbnail and title

 * v0.11.1
 * - generate the coin and obstacle parallel

 * v0.11.0
 * - show acchievements

 * v0.10.0
 * - preset colors

 * v0.9.5
 * - decrease the change for coin
 * - test floating text in the sky
 
 * * v0.9.4
 * - tween welcome text to right
 * - set the coin probability to 0.1
 * 
 * v0.9.3
 * - add tap instruction
 * - adjustment the game speed
 * 
 * v0.9.2
 * - add hidden pic for share
 * 
 * v0.9.1
 * - try orientation detect
 * 
  
 * v0.9.0
 * - optimize the runing animation for the player: check the isPlaying property to determine whether to replay the runing animation within the update function of the player. this brings performance improvemece.
 * - fix bug: collect a star and enter the super mode, do not jump, till the super mode ended, the player still plays the super frames
 * - kill obstacle when in super mode and the player collide with it
 * - add eat sound for kill obstacle
 * 

 * v0.8.3
 * - fix bug: the obstacles shows when game started immediately
 * 
 * v0.8.2
 * - randomize the game color
 * 
 * v0.8.1
 * - fix super mode timeout bug

 * v0.8.0
 * - complete the super mode

 * v0.8.0 -pre
 * - reimplement the obstacle generation logic, add a coin to enter the super mode
 * - add super mode sprites

 * v0.7.1
 * - fix replay bug

* v0.7.0
 * - fix speed acceleration
 * - add some more obstacles and refactor the logic of generating obstacles

 * v0.6.1
 * - optimize the score text

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
    superMode: false,
    highScore: localStorage && localStorage.getItem('brhs') || 0, //get the high score from local storage if possible
    status: 0, //0 not started|1 started
    speed: -300,
    RATIO: -20, //how fast the speed grow during the game running
    MAX_SPEED: -560,
    SKY_COLORS: [0x3a5fcd, 0x27408b, 0x4a708b, 0x262626,  0x1975d1, 0x165bb6, 0x3399ff, 0x800080, 0x0057E7, 0x5D5D5D, 0x2C003A, 0x0099ff],
    GROUND_COLORS: [0x2f0919, 0x262626, 0x309060, 0x003333, 0x845422, 0x854442, 0x854442, 0x4B3832, 0xD3A625, 0x777696, 0xF37736, 0xD0B783, 0x5B391E, 0x796878, 0x9D6C05],
    barrages:['守贞吧：叔叔，不约不约~', '李毅吧：帝吧才是你的归属~', '广场舞大妈吧：弯弯的河水从天上来...', '90后吧：向来情深，奈何缘浅', '网友俱乐部：上贴吧找——————']
};

game.state.add('Boot', require('./states/boot'));
game.state.add('Preloader', require('./states/preloader'));
game.state.add('Menu', require('./states/menu'));
game.state.add('Game', require('./states/game'));

game.state.start('Boot');