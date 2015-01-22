var Boot = function() {};

module.exports = Boot;

Boot.prototype = {

    preload: function() {
        this.load.image('preloader', 'assets/preloader.gif');
    },

    create: function() {
        this.game.input.maxPointers = 1;

        if (this.game.device.desktop) {
            this.game.scale.pageAlignHorizontally = true;
            this.game.scale.pageAlignVertically = true;
        } else {
            this.game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
            this.game.scale.setMinMax(240, 320, 480, 640);
            this.game.scale.forceOrientation(false, true);

        }

        this.game.state.start('Preloader');
    }
};