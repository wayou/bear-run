var Menu = function() {
    this.text = null;
};

module.exports = Menu;

Menu.prototype = {
    create: function() {

this.game.background='#068CFD';
        this.startBtn = this.game.add.button(this.game.width / 2, 300, 'startBtn', this.startClick, this);
        this.startBtn.anchor.setTo(0.5,0.5);

    },
    startClick:function(){
      this.game.state.start('Game');
    }

};