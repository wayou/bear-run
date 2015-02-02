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

        //place the background
        this.background = new Background(this.game);

        this.game.add.existing(this.background);

        //the bottom background
        this.bottomGroundGraphics = this.game.add.graphics(0, 0);
        this.bottomGroundGraphics.lineStyle(0);
        this.bottomGroundGraphics.beginFill(0x9D6C05, 1);
        this.bottomGroundGraphics.drawRect(0, this.game.height / 2, this.game.width, this.game.height / 2);

        //place the ground
        this.ground = new Ground(this.game, 0, this.game.height / 2, 335, 25, 'ground');
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
        //fix me the font size not working
        this.scoreBoard = this.game.add.text(10, 10, 'BEST:' + this.game.global.highScore + '  SCORE:0', {
            font: '16px arial',
            fill: '#fff',
            stroke: '1px solid #000'
        });

        this.replayBtn = this.game.add.button(this.game.width / 2, this.game.height / 2, 'replayBtn', this.replay, this);
        this.replayBtn.anchor.setTo(0.5, 0.5);
        this.replayBtn.visible = false;

    },
    replay: function() {

        this.game.state.start('Game');

    },

    update: function() {
        //print debug info and show sprite box
        // this.game.debug.body(this.player);

        this.game.physics.arcade.collide(this.player, this.ground);

        if (this.game.global.status === 1) {

            this.game.global.score = Math.floor(this.game.time.elapsedSince(this.timeMark) / 100);

            //play sound every 100 score acchieved
            if (this.game.global.score /*in case the very first time the score was ZERO*/ && !(this.game.global.score % 100 /*level up every 10 sec*/ )) {
                //update the game speed when level up
                if (this.game.global.speed > this.game.global.MAX_SPEED) {
                    this.game.global.speed += this.game.global.RATIO;
                    this.ground.scroll(this.game.global.speed);
                }

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
        //if status is 0, the game already stopped,prevent the gameOver callback to execute
        if (this.game.global.status === 1) {
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
        this.ground.scroll(this.game.global.speed);
        this.background.scroll();

        // add a timer
        this.obstacleGenerator = this.game.time.events.loop(Phaser.Timer.SECOND * 2, this.generateObstacle, this);

        this.obstacleGenerator.timer.start();
    },
    generateObstacle: function() {
        var x = this.game.rnd.integerInRange(this.game.width, this.game.width + 100);

        var obstacle = this.obstacles.getFirstExists(false);
        if (!obstacle) {
            obstacle = new Obstacle(this.game, x, this.game.height / 2 - 30, 'dustbin');
            this.obstacles.add(obstacle);
        } else {
            obstacle.reset(x, this.game.height / 2 - 30);
            obstacle.body.velocity.x = this.game.global.speed;
        }

    },
    gameOver: function(player, obstacle) {
        this.game.global.status = 0;
        this.game.global.speed = -200;

        obstacle.body.velocity.x = 0;

        player.stop();

        this.replayBtn.visible = true;
        player.body.gravity = 0;

        //todo : delay the player's gravity and show replay button
        // var timer = this.game.time.create(1000, false);
        // timer.add(1000);
        // timer.onEvent.add(function(){
        //     this.replayBtn.visible = true;
        // }, this);
        // timer.start();

        // this.player.frame = 4; //TODO a dead frame

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
        this.ground.destroy();
        this.bottomGroundGraphics.destroy();
        this.obstacleGenerator.timer.destroy();
    },
    render:function(){
         this.game.debug.text(this.game.global.speed);
    }
};

module.exports = Game;