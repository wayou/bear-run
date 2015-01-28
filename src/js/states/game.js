var Player = require('../entities/player');
var Ground = require('../entities/ground');

var Game = function() {};

module.exports = Game;

Game.prototype = {

    create: function() {

        //set background color for the game
        this.game.stage.backgroundColor = '#068CFD';

        //enable physics system
        this.game.physics.startSystem(Phaser.Physics.ARCADE);
        this.game.physics.arcade.gravity.y = 1200;

        //place the ground
        this.ground = new Ground(this.game, 0, this.game.height/2, 335, 112, 'ground');
        //fill the bottom half screen
        this.ground.scale.setTo(1,2.2);
        this.game.add.existing(this.ground);

        //the player
        this.player = new Player(this.game, 60, 100, 'player');
        this.game.add.existing(this.player);

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

    },

    update: function() {
        //print debug info and show sprite box
        this.game.debug.body(this.player);

        this.game.physics.arcade.collide(this.player, this.ground);

    },
    startGame: function() {
        this.game.global.status = 1; //set to 1 to tell the player that he can run and jum
        this.player.run();
        this.ground.scroll();
    },
    gameOver: function() {
        this.game.global.status = 0;
        this.player.stop();
        this.ground.stop();
    },
    shutdown: function() {

    }
};