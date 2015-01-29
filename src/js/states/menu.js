var Ground = require('../entities/ground');

var Menu = function() {
    this.text = null;
};

Menu.prototype = {
    create: function() {

        this.game.stage.backgroundColor = '#068CFD';
        
        //place the ground
        this.ground = new Ground(this.game, 0, this.game.height / 2, 335, 312, 'ground');
        //fill the bottom half screen
        this.game.add.existing(this.ground);

        this.startBtn = this.game.add.button(this.game.width / 2, this.game.height / 2, 'startBtn', this.startClick, this);
        this.startBtn.anchor.setTo(0.5, 0.5);

    },
    startClick: function() {
        this.game.state.start('Game');
    }

};

module.exports = Menu;