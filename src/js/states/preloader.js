var Preloader = function(game) {
    this.asset = null;
    this.ready = false;
};

module.exports = Preloader;

Preloader.prototype = {

    preload: function() {

        this.game.stage.backgroundColor = '#068CFD';

        //show a loading indicator while loading game resources
        // this.indicator = this.add.sprite(this.game.width / 2, this.game.height / 2, 'preloader'); //sprite(x, y, key, frame, group) 
        // this.indicator.anchor.setTo(0.5, 0.5);

        //the following preload bar code is taken from http://www.html5gamedevs.com/topic/7281-creating-a-progressbar/?p=43464
        this.preloadBar = this.game.add.graphics(0, 0);
        this.preloadBar.lineStyle(3, 0xffffff, 1);
        this.preloadBar.moveTo(0, this.game.height / 2);
        this.preloadBar.lineTo(this.game.width, this.game.height / 2);

        this.preloadBar.scale.x = 0; // set the bar to the beginning position

        this.game.load.onFileComplete.add(this.fileComplete, this);

        this.load.onLoadComplete.addOnce(this.onLoadComplete, this);

        // this.load.setPreloadSprite(this.indicator);

        //central the indicator
        // this.indicator.x = this.game.width / 2;
        // this.indicator.y = this.game.height / 2;

        //load game resources
        //the player
        this.load.spritesheet('player', 'assets/player.png', 32, 48);

        //the ground
        this.load.image('ground', 'assets/ground.png');

        //obstacle
        this.load.image('dustbin', 'assets/dustbin.png');

        //background clouds
        this.load.image('cloud1', 'assets/cloud1.png');
        this.load.image('cloud2', 'assets/cloud2.png');

        //welcome pic
        this.load.image('welcome', 'assets/welcome.png');

        //the button
        this.load.image('startBtn', 'assets/play2.png');
        this.load.image('replayBtn', 'assets/replay.png');

        //obstacles
        this.load.spritesheet('obstacles', 'assets/obstacles.png', 80, 60);

        this.load.audio('jump', 'assets/snd/jump.mp3');
        this.load.audio('scored', 'assets/snd/scored.mp3');
        this.load.audio('gameOver', 'assets/snd/game-over.mp3');

        //the font
        //todo get a nicer font
        // this.load.bitmapFont('fnt', 'assets/font/coder.png', 'assets/font/coder.fnt');

        this.loadingText = this.game.add.text(this.game.width / 2, this.game.height / 2 - 10, 'loading...', {
            font: '12px arial',
            fill: '#fff',
            align: 'enter'
        });
        this.loadingText.anchor.setTo(0.5, 0.5);
    },

    update: function() {
        if ( !! this.ready) {
            this.game.state.start('Menu');
        }
    },
    fileComplete: function(progress, cacheKey, success, totalLoaded, totalFiles) {

        this.loadingText.setText("资源加载中，完成: " + progress + "%");
        // this.loadingText.setText("资源加载中，已完成: " + progress + "% - " + totalLoaded + " 总共：" + totalFiles);

        this.preloadBar.scale.x = progress * 0.01;

    },

    onLoadComplete: function() {
        this.ready = true;
    }
};