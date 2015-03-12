var Boot = function() {};

module.exports = Boot;

Boot.prototype = {

    preload: function() {
        this.load.image('slogan', 'assets/slogan.png');
    },

    create: function() {

        this.game.input.maxPointers = 1;

        if (this.game.device.desktop) {
            this.game.scale.pageAlignHorizontally = true;
            this.game.scale.pageAlignVertically = true;

            //reset the buttons
            // window.onresize = function() {
            // // playce the buttons
            // var gameCanvas = document.querySelector('canvas');

            // var shareHintPic = document.querySelector('#share-hint');
            // shareHintPic.style.width = gameCanvas.style.width;
            // shareHintPic.style.height = gameCanvas.style.height;
            // shareHintPic.style.left = gameCanvas.style.marginLeft;
            // shareHintPic.style.top = gameCanvas.style.marginTop;

            // var replayBtn = document.querySelector('#button-replay');
            // replayBtn.style.left = (parseInt(gameCanvas.style.marginLeft) || 0) + parseInt(gameCanvas.style.width) / 2 - 90 + 'px';
            // replayBtn.style.top = (parseInt(gameCanvas.style.marginTop) || 0) + parseInt(gameCanvas.style.height) / 2 + 60 * (parseInt(gameCanvas.style.height) / 480) + 'px';

            // var shareBtn = document.querySelector('#button-share');
            // shareBtn.style.left = (parseInt(gameCanvas.style.marginLeft) || 0) + parseInt(gameCanvas.style.width) / 2 + 11 + 'px';
            // shareBtn.style.top = (parseInt(gameCanvas.style.marginTop) || 0) + parseInt(gameCanvas.style.height) / 2 + 60 * (parseInt(gameCanvas.style.height) / 480) + 'px';

            // var goBtn = document.querySelector('#button-go');
            // goBtn.style.left = (parseInt(gameCanvas.style.marginLeft) || 0) + parseInt(gameCanvas.style.width) / 2 - 84 + 'px';
            // goBtn.style.top = (parseInt(gameCanvas.style.marginTop) || 0) + parseInt(gameCanvas.style.height) - 60 + 'px';

            // var moreBtn = document.querySelector('#button-more');
            // moreBtn.style.left = (parseInt(gameCanvas.style.marginLeft) || 0) + parseInt(gameCanvas.style.width) / 2 - 84 + 'px';
            // moreBtn.style.top = (parseInt(gameCanvas.style.marginTop) || 0) + parseInt(gameCanvas.style.height) - 110 + 'px';
            // };

            this.scale.setResizeCallback(this.placeBtns, this);

        } else {
            // this.game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
            this.game.scale.scaleMode = Phaser.ScaleManager.EXACT_FIT;
            // this.game.scale.setMinMax(240, 320, 414,736);
            this.game.scale.forceOrientation(false, true);

            // this.scale.enterIncorrectOrientation.add(this.enterIncorrectOrientation, this);
            // this.scale.leaveIncorrectOrientation.add(this.leaveIncorrectOrientation, this);
        }

        this.game.state.start('Preloader');
    },
    enterIncorrectOrientation: function() {

        this.game.global.orientated = true;

        document.getElementById('orientation').style.display = 'block';

    },

    leaveIncorrectOrientation: function() {

        this.game.global.orientated = false;

        document.getElementById('orientation').style.display = 'none';

    },

    placeBtns: function() {
        // playce the buttons
        var gameCanvas = document.querySelector('canvas');

        var shareHintPic = document.querySelector('#share-hint');
        shareHintPic.style.width = gameCanvas.style.width;
        shareHintPic.style.height = gameCanvas.style.height;
        shareHintPic.style.left = gameCanvas.style.marginLeft;
        shareHintPic.style.top = gameCanvas.style.marginTop;

        var replayBtn = document.querySelector('#button-replay');
        replayBtn.style.left = (parseInt(gameCanvas.style.marginLeft) || 0) + parseInt(gameCanvas.style.width) / 2 - 90 + 'px';
        replayBtn.style.top = (parseInt(gameCanvas.style.marginTop) || 0) + parseInt(gameCanvas.style.height) / 2 + 60 * (parseInt(gameCanvas.style.height) / 480) + 'px';

        var shareBtn = document.querySelector('#button-share');
        shareBtn.style.left = (parseInt(gameCanvas.style.marginLeft) || 0) + parseInt(gameCanvas.style.width) / 2 + 11 + 'px';
        shareBtn.style.top = (parseInt(gameCanvas.style.marginTop) || 0) + parseInt(gameCanvas.style.height) / 2 + 60 * (parseInt(gameCanvas.style.height) / 480) + 'px';

        var goBtn = document.querySelector('#button-go');
        goBtn.style.left = (parseInt(gameCanvas.style.marginLeft) || 0) + parseInt(gameCanvas.style.width) / 2 - 84 + 'px';
        goBtn.style.top = (parseInt(gameCanvas.style.marginTop) || 0) + parseInt(gameCanvas.style.height) - 60 + 'px';

        var moreBtn = document.querySelector('#button-more');
        moreBtn.style.left = (parseInt(gameCanvas.style.marginLeft) || 0) + parseInt(gameCanvas.style.width) / 2 - 84 + 'px';
        moreBtn.style.top = (parseInt(gameCanvas.style.marginTop) || 0) + parseInt(gameCanvas.style.height) - 110 + 'px';
    }
};