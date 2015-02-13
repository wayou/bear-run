var Preloader = function(game) {
    this.asset = null;
    this.ready = false;
};

module.exports = Preloader;

Preloader.prototype = {

    preload: function() {

        this.game.stage.backgroundColor = '#0099ff';

        this.slogan = this.game.add.sprite(this.game.width / 2, this.game.height / 2 - 50, 'slogan');
        this.slogan.anchor.setTo(0.5, 0.5);
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
        // this.load.image('ground', 'assets/ground.png');
        this.load.image('ground-1', 'assets/ground-1.jpg');
        this.load.image('ground-2', 'assets/ground-2.jpg');

        //the du coin
        this.load.image('ducoin', 'assets/du_coin.png');

        //device orientation
        // this.load.image('orientation', 'assets/orientation.jpg');

        //instruction
        this.load.image('tap', 'assets/tap.png');

        //obstacle
        // this.load.image('dustbin', 'assets/dustbin.png');

        //background clouds
        this.load.image('cloud1', 'assets/cloud1.png');
        this.load.image('cloud2', 'assets/cloud2.png');

        //welcome pic
        this.load.image('welcome', 'assets/welcome.jpg');
        this.load.image('shareHint', 'assets/share-hint.png');

        //the button
        // this.load.image('startBtn', 'assets/play2.png');
        this.load.image('startBtn', 'assets/play.png');
        this.load.image('replayBtn', 'assets/replay-btn.png');
        this.load.image('shareBtn', 'assets/share-btn.png');
        this.load.image('goBtn', 'assets/go.png');

        this.load.image('end', 'assets/end.png');

        //obstacles
        this.load.spritesheet('obstacles', 'assets/obstacles.png', 88, 121);

        this.load.audio('jump', 'assets/snd/jump.mp3');
        this.load.audio('scored', 'assets/snd/scored.mp3');
        this.load.audio('gameOver', 'assets/snd/game-over.mp3');
        this.load.audio('coin', 'assets/snd/coin.mp3');
        this.load.audio('bite', 'assets/snd/bite.mp3');

        //the font
        //todo get a nicer font
        // this.load.bitmapFont('fnt', 'assets/font/coder.png', 'assets/font/coder.fnt');

        this.loadingText = this.game.add.text(this.game.width / 2, this.game.height / 2 - 10, 'LOADING...', {
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

        this.loadingText.setText('资源加载中，完成: ' + progress + '%');
        this.preloadBar.scale.x = progress * 0.01;

    },

    onLoadComplete: function() {
        this.ready = true;
    }
};