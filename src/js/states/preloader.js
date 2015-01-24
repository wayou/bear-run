var Preloader = function(game) {
    this.asset = null;
    this.ready = false;
};

module.exports = Preloader;

Preloader.prototype = {

    preload: function() {
        this.indicator = this.add.sprite(320, this.game.height / 2, 'preloader'); //sprite(x, y, key, frame, group) 
        this.indicator.anchor.setTo(0.5, 0.5);

        this.load.onLoadComplete.addOnce(this.onLoadComplete, this);
        this.load.setPreloadSprite(this.indicator);

        //load stuff
        this.load.image('background', 'assets/background.png');
        this.load.image('ground', 'assets/ground.png');
        this.load.image('title', 'assets/title.png');
        this.load.image('startButton', 'assets/start-button.png');

        //the palyer
        this.load.spritesheet('player', 'assets/player.png');//this.load.spritesheet(key, url, frameWidth, frameHeight, numberOfFrames);  
        //the bird
        this.load.spritesheet('bird', 'assets/bird.png',34,24,3);

        this.load.spritesheet('pipe','assets/pipes.png',54,320,2);
    },

    create: function() {
        // this.indicator.cropEnabled = false;
    },

    update: function() {
        if ( !! this.ready) {
            this.game.state.start('Game');
        }
    },

    onLoadComplete: function() {
        this.ready = true;
    }
};

