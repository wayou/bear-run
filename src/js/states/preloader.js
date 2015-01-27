var Preloader = function(game) {
    this.asset = null;
    this.ready = false;
};

module.exports = Preloader;

Preloader.prototype = {

    preload: function() {
        //show a loading indicator while loading game resources
        this.indicator = this.add.sprite(320, this.game.height / 2, 'preloader'); //sprite(x, y, key, frame, group) 
        this.indicator.anchor.setTo(0.5, 0.5);
        this.load.onLoadComplete.addOnce(this.onLoadComplete, this);
        this.load.setPreloadSprite(this.indicator);

        //central the indicator
        this.indicator.x = this.game.width / 2;
        this.indicator.y = this.game.height / 2;

        //load game resources
        //the player
        this.load.spritesheet('player', 'assets/player.png', 32, 48);

        //the ground
        this.load.image('ground', 'assets/ground.png');

        //the button
        this.load.image('startBtn', 'assets/start-button.png');

        //the font
        this.load.bitmapFont('flappyfont', 'assets/font/minecraftia.png', 'assets/font/minecraftia.xml');

    },

    update: function() {
        if ( !! this.ready) {
            this.game.state.start('Menu');
        }
    },

    onLoadComplete: function() {
        this.ready = true;
    }
};