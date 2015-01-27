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
        this.ground = new Ground(this.game, 0, 400, 335, 112, 'ground');
        this.game.add.existing(this.ground);

         //the player
        this.player = new Player(this.game, 100, 100, 'player');
        this.game.add.existing(this.player);

        

    },

    update: function() {
        //print debug info and show sprite box
        this.game.debug.body(this.player);

    this.game.physics.arcade.collide(this.player, this.ground);

    },
    shutdown: function() {

    }
};