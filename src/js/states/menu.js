var Menu = function() {
    this.text = null;
};

module.exports = Menu;

Menu.prototype = {
    preload: function() {

    },

    create: function() {
        //make background full screen
        //method 1
        // this.background = this.game.add.tileSprite(0, 0, this.game.width, this.game.height, 'background');
        //method 2
        this.background = this.game.add.sprite(0, 0, 'background');
        this.background.width = this.game.width;
        this.background.height = this.game.height;

        this.ground = this.game.add.tileSprite(0, 400, 335, 112, 'ground'); //tileSprite(x, y, width, height, key, frame, group) 
        this.ground.autoScroll(-200, 0);

        this.titleGroup = this.game.add.group();

        this.title = this.game.add.sprite(0, 0, 'title');
        this.titleGroup.add(this.title);

        this.bird = this.game.add.sprite(200, 5, 'bird');
        this.titleGroup.add(this.bird);

        this.bird.animations.add('flap');
        this.bird.animations.play('flap', 12, true);

        this.titleGroup.x = 30;
        this.titleGroup.y = 100;

        this.game.add.tween(this.titleGroup).to({
            y: 115
        }, 350, Phaser.Easing.Linear.NONE, true, 0, -1, true); //to(properties, duration, ease, autoStart, delay, repeat, yoyo)

        this.startBtn = this.game.add.button(this.game.width / 2, 300, 'startButton', this.startClick, this);
        this.startBtn.anchor.setTo(0.5,0.5);

    },

    update: function() {

    },
    startClick:function(){
      this.game.state.start('Game');
    }

};