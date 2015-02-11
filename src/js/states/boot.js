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
        } else {
            // this.game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
            this.game.scale.scaleMode = Phaser.ScaleManager.EXACT_FIT;
            this.game.scale.setMinMax(240, 320, 375,667);
            this.game.scale.forceOrientation(false, true);

            this.scale.enterIncorrectOrientation.add(this.enterIncorrectOrientation, this);
            this.scale.leaveIncorrectOrientation.add(this.leaveIncorrectOrientation, this);
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

    }
};