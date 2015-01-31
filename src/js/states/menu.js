var Background = require('../entities/background');
var Ground = require('../entities/ground');

var Menu = function() {
    this.text = null;
};

Menu.prototype = {
    create: function() {

        this.game.stage.backgroundColor = '#068CFD';

        //place the background
        this.background = new Background(this.game);

        //fill the bottom half screen
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

        this.menu = this.game.add.group();

        this.menu.add(this.game.add.sprite(0, 0, 'welcome'));

        this.startBtn = this.game.add.button(200, 130, 'startBtn', this.startClick, this);
        this.startBtn.anchor.setTo(0.5, 0.5);
        this.menu.add(this.startBtn);

        //center the menu group
        this.menu.x = 20;
        this.menu.y = this.game.height / 4;

    },
    startClick: function() {
        this.game.state.start('Game');
    }

};

module.exports = Menu;