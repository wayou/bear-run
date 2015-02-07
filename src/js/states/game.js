var Player = require('../entities/player');
var Ground = require('../entities/ground');
var Obstacle = require('../entities/obstacle');
var Background = require('../entities/background');
var Coin = require('../entities/coin');

var Game = function() {};

Game.prototype = {

    create: function() {

        //set background color for the game
        // this.game.stage.backgroundColor = '#0099ff';
        this.game.stage.backgroundColor = Math.random() * 0xffffff;

        //enable physics system
        this.game.physics.startSystem(Phaser.Physics.ARCADE);
        this.game.physics.arcade.gravity.y = 1500;

        //place the background
        this.background = new Background(this.game);

        this.game.add.existing(this.background);

        //the bottom background
        this.bottomGroundGraphics = this.game.add.graphics(0, 0);
        this.bottomGroundGraphics.lineStyle(0);
        // this.bottomGroundGraphics.beginFill(0x9D6C05, 1);
        this.bottomGroundGraphics.beginFill(Math.random() * 0xffffff, 1);
        this.bottomGroundGraphics.drawRect(0, this.game.height / 2, this.game.width, this.game.height / 2);

        //place the ground
        this.ground = new Ground(this.game, 0, this.game.height / 2, 335, 25, 'ground');
        //fill the bottom half screen
        this.game.add.existing(this.ground);

        this.obstacles = this.game.add.group();

        //add all obstacles to the group
        this.obstacles.add(new Obstacle(this.game, -50, this.game.height / 2 - 30, 'obstacles', 0, 0));
        this.obstacles.add(new Obstacle(this.game, -50, this.game.height / 2 - 30, 'obstacles', 1, 1));
        this.obstacles.add(new Obstacle(this.game, -50, this.game.height / 2 - 30, 'obstacles', 2, 2));
        this.obstacles.add(new Obstacle(this.game, -50, this.game.height / 2 - 30, 'obstacles', 3, 3));

        this.coin = this.game.add.existing(new Coin(this.game, this.game.width + 50, this.game.height / 2 - 100, 'ducoin'));

        //the player
        this.player = new Player(this.game, 60, 100, 'player');
        this.game.add.existing(this.player);

        //sound
        this.scoreSnd = this.game.add.audio('scored');
        this.gameOverSnd = this.game.add.audio('gameOver');
        this.coinSnd = this.game.add.audio('coin');
        this.biteSnd = this.game.add.audio('bite');

        /*key control*/
        this.arrow = this.game.input.keyboard.createCursorKeys();
        //prevent the space bar from scrolling the page
        this.game.input.keyboard.addKeyCapture(this.arrow);

        this.spacebar = this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);

        // keep the spacebar from propogating up to the browser
        this.game.input.keyboard.addKeyCapture([Phaser.Keyboard.SPACEBAR]);

        this.arrow.up.onDown.addOnce(this.startGame, this);
        this.arrow.up.onDown.add(this.player.jump, this.player);

        this.spacebar.onDown.addOnce(this.startGame, this);
        this.spacebar.onDown.add(this.player.jump, this.player);

        // add mouse/touch controls
        this.game.input.onDown.addOnce(this.startGame, this);
        this.game.input.onDown.add(this.player.jump, this.player);
        /*key control end*/

        //display score
        //in order to highlight the score when level up, we need to split the high score and the normal score, put them into a group for better managment 
        this.scoreBoard = this.game.add.group();
        var style = {
            font: '16px arial',
            fill: '#fff',
            stroke: '#000',
            fontWeight: 'bold',
            strokeThickness: 2
        };

        this.highScore = this.game.add.text(0, 0, 'BEST:' + this.game.global.highScore, style);
        // this.highScore.anchor.setTo(0.5, 0.5);

        this.score = this.game.add.text(100, 0, '  SCORE:0', style);
        // this.score.anchor.setTo(0.5, 0.5);
        this.blinkScore = this.game.add.tween(this.score).to({
            alpha: 1
        }, 400, Phaser.Easing.Bounce.Out, false, 0, 4, false);

        //THINGS I LEARNT:reuse the tween, I think this's a bug, directlly use the this.blinkScore will not work properly while I need to reassign a new tween to it after the previous is completed.
        this.blinkScore.onComplete.add(this.reInitializeScoreTween, this);

        this.scoreBoard.add(this.highScore);
        this.scoreBoard.add(this.score);
        this.scoreBoard.x = 10;
        this.scoreBoard.y = 10;

        this.replayBtn = this.game.add.button(this.game.width / 2, this.game.height / 2, 'replayBtn', this.replay, this);
        this.replayBtn.anchor.setTo(0.5, 0.5);
        this.replayBtn.visible = false;

        this.info = this.game.add.text(this.game.width / 2, 70, '组织在前方等你~', {
            font: '20px Microsoft Yahei',
            fill: '#ffff00',
            stroke: '#000',
            fontWeight: 'bold',
            strokeThickness: 1
        });
        this.info.anchor.setTo(0.5, 0.5);
        // this.info.alpha = 0;

        this.blinkInfo = this.game.add.tween(this.info).to({
            x: this.game.width+100
        }, 500, Phaser.Easing.Linear.NONE, false, 1000, 0, false);

        //THINGS I LEARNT:reuse the tween, I think this's a bug, directlly use the this.blinkScore will not work properly while I need to reassign a new tween to it after the previous is completed.
        this.blinkInfo.onComplete.add(this.reInitializeInfoTween, this);

        //auto start the game after 3 secs
        // this.autoStartTimer = this.game.time.events.add(Phaser.Timer.SECOND * 3, this.startGame, this);

        this.tap = this.game.add.sprite(this.game.width / 2, this.game.height / 2 , 'tap');
        this.tap.anchor.setTo(0.5,0.5);

        this.superTimeRemained = 0;

    },
    reInitializeScoreTween: function() {
        this.blinkScore = this.game.add.tween(this.score).to({
            alpha: 1
        }, 400, Phaser.Easing.Bounce.Out, false, 0, 4, false);
        this.blinkScore.onComplete.add(this.reInitializeScoreTween, this);
    },
    reInitializeInfoTween: function() {
        this.info.alpha = 0;
        this.info.x = this.game.width/2;
        this.blinkInfo = this.game.add.tween(this.info).to({
            alpha: 1
        }, 400, Phaser.Easing.Bounce.Out, false, 0, 4, false);
        this.blinkInfo.onComplete.add(this.reInitializeInfoTween, this);
    },
    replay: function() {
        this.game.state.start('Game');
    },

    update: function() {
        //print debug info and show sprite box
        // this.game.debug.body(this.player);

        this.game.physics.arcade.collide(this.player, this.ground);

        this.game.physics.arcade.overlap(this.player, this.coin, this.gameOver, this.shouldGameover, this);

        this.obstacles.forEach(function(obstacle) {
            //debug
            // this.game.debug.body(obstacle);

            this.game.physics.arcade.overlap(this.player, obstacle, this.gameOver, this.shouldGameover, this);
        }, this);

    },
    shouldGameover: function() {
        //if status is 0, the game already stopped,prevent the gameOver callback to execute
        // if (this.game.global.status === 1 && !this.game.global.superMode) {
        if (this.game.global.status === 1) {
            return true;
        } else {
            return false;
        }
    },
    startGame: function() {

        if (this.game.global.status !== 0) {
            return;
        }

        this.tap.visible = false;
        this.game.global.status = 1;

        //fix a bug
        this.game.input.onDown.remove(this.startGame, this);
        this.arrow.up.onDown.remove(this.startGame, this);
        this.spacebar.onDown.remove(this.startGame, this);

        this.player.run();
        this.ground.scroll(this.game.global.speed);
        this.background.scroll();

        // add a timer
        // THINGS I LEARNT: the events timer will automatically start while the time timer not
        // so in this case the obstacle generator should be started automatically, we use events timer
        // this.obstacleGenerator = this.game.time.events.loop(Phaser.Timer.SECOND * 1.4, this.generateObstacle, this);

        // this.obstacleGenerator.timer.start();

        //fix me: it seems there's bug when a state has more than 2 timers
        // this.scoreTimer = this.game.time.create(false);
        // this.scoreTimer.loop(100, this.levelup, this);
        // this.scoreTimer.start();
        // 
        // so lets just create one timer and do all stuff within it
        this.gameTimer = this.game.time.create(false);
        this.gameTimer.loop(100, this.timeUpdate, this);
        this.gameTimer.start();

        this.blinkInfo.start();

    },
    timeUpdate: function() {
        if (this.game.global.status !== 1) {
            return;
        }

        this.game.global.score += 1;

        //timeout the super mode
        if (this.game.global.superMode && this.game.global.score % 10 === 0) {
            this.superTimeRemained -= 1;
            this.info.text = '来自组织的关爱：' + this.superTimeRemained;
            if (this.superTimeRemained === 0) {
                this.game.global.superMode = false;
                this.info.alpha = 0;
            }
        }

        //generate obstacle every 1.1 sec
        if (this.game.global.score % 11 === 0) {
            this.generateObstacle();
        }

        /*level up every 10 sec*/
        if (!(this.game.global.score % 100)) {
            //update the game speed when level up
            if (this.game.global.speed > this.game.global.MAX_SPEED) {
                this.game.global.speed += this.game.global.RATIO;
                this.ground.scroll(this.game.global.speed);
            }

            this.scoreSnd.play();

            //highlight the score text
            this.score.alpha = 0;
            // this.shineScore.start();
            // fix me: does this implementation will create a new tween every time and the previous are still exists? if so there will be potential memory leak
            // this.game.add.tween(this.score).to({
            //     alpha: 1
            // }, 300, Phaser.Easing.Linear.NONE, true, 0, 4, false);

            this.blinkScore.start();

            // this.info.text = '不错哦~新的最高分！';
            // this.blinkInfo.start();
        }

        // this.scoreBoard.text = 'BEST:' + this.game.global.highScore + '  SCORE:' + this.game.global.score;
        this.score.text = '  SCORE:' + this.game.global.score;

    },
    generateObstacle: function() {
        // var x = this.game.rnd.integerInRange(this.game.width, this.game.width + 150);

        // var obstacle = this.obstacles.getFirstExists(false);
        // if (!obstacle) {
        //     obstacle = new Obstacle(this.game, x, this.game.height / 2 - 30, 'dustbin');
        //     this.obstacles.add(obstacle);
        // } else {
        //     obstacle.reset(x, this.game.height / 2 - 30);
        //     obstacle.body.velocity.x = this.game.global.speed;
        // }

        //basically, the following new logic to generate a new obstacle is that we get a random child from the obstacles group. note there are 4 types of obstacle. if the one we got is already existing, that is to say it's on the screen, then we try to get the same type from the reminds. if there's no available same type obstacles, we simply create one.
        // if the one we get at first time does net exists, that's quite nice, use it directly. just reset it before we reues it.

        var x = this.game.rnd.integerInRange(this.game.width, this.game.width + 150);

        //random generate a coin instead of normal obstacles
        if (x < this.game.width + 15 && !this.coin.exists && !this.game.global.superMode) {

            this.coin.reset(x, this.coin.y);
            this.coin.body.velocity.x = this.game.global.speed;
        } else {
            var obstacle = this.obstacles.getRandom();

            if (obstacle.exists) {
                //try get the next same type children
                var typedChildren = this.obstacles.filter(function(child, index, children) {
                    return !child.exists && child.obstacleIndex === obstacle.obstacleIndex && child.z !== obstacle.z;
                }, false);

                if (!typedChildren.first) {
                    obstacle = new Obstacle(this.game, x, this.game.height / 2 - 30, 'obstacles', obstacle.obstacleIndex, obstacle.obstacleIndex);
                    this.obstacles.add(obstacle);
                } else {
                    obstacle = typedChildren.first;
                    obstacle.reset(x, obstacle.y);
                    obstacle.body.velocity.x = this.game.global.speed;
                }

            } else {
                obstacle.reset(x, obstacle.y);
                obstacle.body.velocity.x = this.game.global.speed;
            }
        }
    },
    gameOver: function(player, obstacle) {

        if (this.game.global.superMode) {
            //in super mode, dont over the game, kill the obstacle instead
            obstacle.kill();
            this.biteSnd.play();
            return;
        }

        //if the obstacle is coin, then start the super mode and the game should not be over
        if (obstacle.name === 'coin') {
            this.game.global.superMode = true;
            obstacle.kill();
            this.coinSnd.play();

            //super time random within 5 to 15 sec
            this.superTimeRemained = this.game.rnd.integerInRange(5, 9);

            this.info.text = '来自组织的关爱：' + this.superTimeRemained;
            this.info.alpha = 1;

            return;
        }

        this.game.global.status = 0;
        this.game.global.speed = -300;

        this.obstacles.setAll('body.velocity.x', 0);
        this.coin.body.velocity.x = 0;

        player.stop();

        this.replayBtn.visible = true;
        player.body.gravity = 0;

        this.player.frame = 4;

        this.ground.stop();
        this.background.stop();

        // this.obstacleGenerator.timer.stop();
        this.gameTimer.stop();
        // this.scoreTimer.stop();

        //update high score
        if (this.game.global.highScore < this.game.global.score) {
            this.game.global.highScore = this.game.global.score;
            localStorage && localStorage.setItem('brhs', this.game.global.highScore);
        }
        this.game.global.score = 0;
        this.gameOverSnd.play();

    },
    shutdown: function() {
        this.game.input.keyboard.removeKey(Phaser.Keyboard.SPACEBAR);
        this.game.input.keyboard.removeKey(this.arrow);
        this.player.destroy();
        this.obstacles.destroy();
        this.ground.destroy();
        this.bottomGroundGraphics.destroy();
        this.gameTimer.removeAll();
        this.gameTimer.destroy();
        this.game.time.removeAll();
        this.tap.destroy();
    }
    //fix me : why this not working
    // render: function() {
    //     this.game.debug.text('current speed:' + (-this.game.global.speed));
    // }
};

module.exports = Game;