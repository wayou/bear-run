var Player = require('../entities/player');
var Ground = require('../entities/ground');
var Obstacle = require('../entities/obstacle');

var Game = function() {};

module.exports = Game;

Game.prototype = {

    create: function() {

        //set background color for the game
        this.game.stage.backgroundColor = '#068CFD';

        //enable physics system
        this.game.physics.startSystem(Phaser.Physics.ARCADE);
        this.game.physics.arcade.gravity.y = 1500;

        //place the ground
        this.ground = new Ground(this.game, 0, this.game.height / 2, 335, 312, 'ground');
        //fill the bottom half screen
        // this.ground.scale.setTo(1, 2);
        this.game.add.existing(this.ground);

        this.obstacles = this.game.add.group();

        //the player
        this.player = new Player(this.game, 60, 100, 'player');
        this.game.add.existing(this.player);

        //sound
        this.scoreSnd = this.game.add.audio('scored');

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
        this.scoreBoard = this.game.add.bitmapText(10, 10, 'minecraftfnt', this.game.global.score.toString(), 15);
        this.scoreBoard.align = 'right';
        this.timeMark = this.game.time.time;

        this.game.global.isOver = false;

    },

    update: function() {
        //print debug info and show sprite box
        this.game.debug.body(this.player);

        this.game.physics.arcade.collide(this.player, this.ground);

        if (!this.game.global.isOver) {
            var score = this.game.time.elapsedSince(this.timeMark).toString();
            this.scoreBoard.text = score.substring(0, score.length - 2);
        }

        this.obstacles.forEach(function(obstacle) {
            //debug
            this.game.debug.body(obstacle);

            this.game.physics.arcade.collide(this.player, obstacle, this.gameOver, null, this);
        }, this);

    },
    startGame: function() {
        this.player.run();
        this.ground.scroll();

        // add a timer
        this.obstacleGenerator = this.game.time.events.loop(Phaser.Timer.SECOND * 2, this.generateObstacle, this);
        this.obstacleGenerator.timer.start();
    },
    generateObstacle: function() {
        var obstacle = this.obstacles.getFirstExists(false);
        if (!obstacle) {
            obstacle = new Obstacle(this.game, this.game.width, this.game.height / 2, 'obstacles', 6);
            this.obstacles.add(obstacle);
        } else {
            obstacle.reset(this.game.width, this.game.height / 2);
        }
    },
    gameOver: function() {
        this.game.global.isOver = true;
        this.player.stop();
        this.ground.stop();
        this.obstacleGenerator.timer.stop();
        this.game.global.highScore = this.scoreBoard.text;

    },
    shutdown: function() {

    }
};