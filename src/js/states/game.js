var Player = require('../entities/player');
var Ground = require('../entities/ground');
var Obstacle = require('../entities/obstacle');
var Background = require('../entities/background');

var Game = function() {};

Game.prototype = {

    create: function() {

        //set background color for the game
        this.game.stage.backgroundColor = '#068CFD';

        //enable physics system
        this.game.physics.startSystem(Phaser.Physics.ARCADE);
        this.game.physics.arcade.gravity.y = 1500;

        //place the ground
        this.background = new Background(this.game);

        //fill the bottom half screen
        this.game.add.existing(this.background);

        //place the ground
        this.ground = new Ground(this.game, 0, this.game.height / 2, 335, 312, 'ground');
        //fill the bottom half screen
        this.game.add.existing(this.ground);

        this.obstacles = this.game.add.group();

        //the player
        this.player = new Player(this.game, 60, 100, 'player');
        this.game.add.existing(this.player);

        //sound
        this.scoreSnd = this.game.add.audio('scored');
        this.gameOverSnd = this.game.add.audio('gameOver');

        /*key control*/
        this.arrow = this.game.input.keyboard.createCursorKeys();
        //prevent the space bar from scrolling the page
        this.game.input.keyboard.addKeyCapture(this.arrow);

        this.spacebar = this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);

        // keep the spacebar from propogating up to the browser
        this.game.input.keyboard.addKeyCapture([Phaser.Keyboard.SPACEBAR]);

        this.arrow.up.onDown.addOnce(this.startGame, this);
        this.arrow.up.onDown.add(this.player.jump, this.player);

        this.spacebar.onDown.addOnce(this.startGame, this);
        this.spacebar.onDown.add(this.player.jump, this.player);

        // add mouse/touch controls
        this.game.input.onDown.addOnce(this.startGame, this);
        this.game.input.onDown.add(this.player.jump, this.player);
        /*key control end*/

        //display score
        this.scoreBoard = this.game.add.bitmapText(10, 10, 'fnt', 'BEST:' + this.game.global.highScore + '  SCORE:0', 32);
        this.scoreBoard.align = 'right';

        this.replayBtn = this.game.add.button(this.game.width / 2, this.game.height / 2, 'replayBtn', this.replay, this);
        this.replayBtn.anchor.setTo(0.5, 0.5);
        this.replayBtn.visible = false;

    },
    replay: function() {
        this.game.global.status = 0;
        this.game.state.start('Game');
    },

    update: function() {
        //print debug info and show sprite box
        // this.game.debug.body(this.player);

        this.game.physics.arcade.collide(this.player, this.ground);

        if (this.game.global.status == 1) {

            this.game.global.score = Math.floor(this.game.time.elapsedSince(this.timeMark) / 100);

            //play sound every 100 score acchieved
            if (this.game.global.score && !(this.game.global.score % 100)) {
                this.scoreSnd.play();
            }

            this.scoreBoard.text = 'BEST:' + this.game.global.highScore + '  SCORE:' + this.game.global.score;
        }

        this.obstacles.forEach(function(obstacle) {
            //debug
            // this.game.debug.body(obstacle);

            this.game.physics.arcade.overlap(this.player, obstacle, this.gameOver, this.shouldGameover, this);
        }, this);

    },
    shouldGameover: function() {
        //if status is 2, the game already stopped,prevent the gameOver callback to execute
        if (this.game.global.status != 2) {
            return true;
        } else {
            return false;
        }
    },
    startGame: function() {

        if (this.game.global.status !== 0) {
            return;
        }

        this.game.global.status = 1;

        this.timeMark = this.game.time.time;

        this.player.run();
        this.ground.scroll();
        this.background.scroll();

        // add a timer
        this.obstacleGenerator = this.game.time.events.loop(Phaser.Timer.SECOND * 2, this.generateObstacle, this);

        this.obstacleGenerator.timer.start();
    },
    generateObstacle: function() {
        var obstacle = this.obstacles.getFirstExists(false);
        if (!obstacle) {
            obstacle = new Obstacle(this.game, this.game.width, this.game.height / 2 - 10, 'obstacles', 6);

            this.obstacles.add(obstacle);
        } else {
            obstacle.reset(this.game.width, this.game.height / 2 - 10);
            obstacle.body.velocity.x = -200;
        }

    },
    gameOver: function(player, obstacle) {
        this.game.global.status = 2;

        obstacle.body.velocity.x = 0;

        this.replayBtn.visible = true;

        this.player.stop();
        this.player.frame = 4; //TODO a dead frame

        this.ground.stop();
        this.background.stop();

        this.obstacleGenerator.timer.stop();

        //update high score
        if (this.game.global.highScore < this.game.global.score) {
            this.game.global.highScore = this.game.global.score;
            localStorage && localStorage.setItem('bear-run-high-score', this.game.global.score);
        }
        this.gameOverSnd.play();
    },
    shutdown: function() {
        this.game.input.keyboard.removeKey(Phaser.Keyboard.SPACEBAR);
        this.game.input.keyboard.removeKey(this.arrow);
        this.player.destroy();
        this.obstacles.destroy();
    }
};

module.exports = Game;