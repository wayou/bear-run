var Player = require('../entities/player');
var Ground = require('../entities/ground');
var Obstacle = require('../entities/obstacle');
var Background = require('../entities/background');
var Coin = require('../entities/coin');

var Game = function() {};

Game.prototype = {

    create: function() {

        //set background color for the game
        this.game.stage.backgroundColor = this.game.global.SKY_COLORS[Math.floor(Math.random() * this.game.global.SKY_COLORS.length)];

        //enable physics system
        this.game.physics.startSystem(Phaser.Physics.ARCADE);
        this.game.physics.arcade.gravity.y = 1500;

        //place the background
        this.background = new Background(this.game);
        this.game.add.existing(this.background);

        //the bottom background
        // this.bottomGroundGraphics = this.game.add.graphics(0, 0);
        // this.bottomGroundGraphics.lineStyle(0);
        // this.bottomGroundGraphics.beginFill(this.game.global.GROUND_COLORS[Math.floor(Math.random() * this.game.global.GROUND_COLORS.length)], 1);
        // this.bottomGroundGraphics.drawRect(0, this.game.height / 3*2, this.game.width, this.game.height / 3*2);

        //place the ground
        // this.ground = new Ground(this.game, 0, this.game.height / 3 * 2, 531, 222, Math.random() > 0.5 ? 'ground-1' : 'ground-2');
        this.ground = new Ground(this.game, 0, this.game.height / 3 * 2, 2084, 436, Math.random() > 0.5 ? 'ground-1' : 'ground-2');
        this.game.add.existing(this.ground);

        this.obstacles = this.game.add.group();
        //add all obstacles to the group
        this.obstacles.add(new Obstacle(this.game, -50, this.game.height / 3 * 2 - 30, 'obstacles', 0, 0));
        this.obstacles.add(new Obstacle(this.game, -50, this.game.height / 3 * 2 - 30, 'obstacles', 1, 1));
        this.obstacles.add(new Obstacle(this.game, -50, this.game.height / 3 * 2 - 30, 'obstacles', 2, 2));
        this.obstacles.add(new Obstacle(this.game, -50, this.game.height / 3 * 2 - 30, 'obstacles', 3, 3));

        this.coin = new Coin(this.game, this.game.width + 50, this.game.height / 3 * 2 - 100, 'ducoin');
        this.game.add.existing(this.coin);

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

        this.highScore = this.game.add.text(0, 0, 'BEST:' + this.game.global.highScore + 'm', style);

        this.score = this.game.add.text(100, 0, '  SCORE:0m', style);
        this.blinkScore = this.game.add.tween(this.score).to({
            alpha: 1
        }, 400, Phaser.Easing.Bounce.Out, false, 0, 4, false);

        //THINGS I LEARNT:reuse the tween, I think this's a bug, directlly use the this.blinkScore will not work properly while I need to reassign a new tween to it after the previous is completed.
        this.blinkScore.onComplete.add(this.reInitializeScoreTween, this);

        this.scoreBoard.add(this.highScore);
        this.scoreBoard.add(this.score);
        this.scoreBoard.x = 10;
        this.scoreBoard.y = 10;

        this.info = this.game.add.text(this.game.width / 2, 70, '组织在前方等你~', {
            font: '20px Microsoft Yahei',
            fill: '#F53E62',
            // stroke: '#000',
            fontWeight: 'bold'
            // strokeThickness: 1
        });
        this.info.anchor.setTo(0.5, 0.5);
        // this.info.alpha = 0;

        this.blinkInfo = this.game.add.tween(this.info).to({
            x: this.game.width + 100
        }, 1000, Phaser.Easing.Linear.NONE, false, 1000, 0, false);
        //THINGS I LEARNT:reuse the tween, I think this's a bug, directlly use the this.blinkScore will not work properly while I need to reassign a new tween to it after the previous is completed.
        this.blinkInfo.onComplete.add(this.reInitializeInfoTween, this);

        //auto start the game after 3 secs
        // this.autoStartTimer = this.game.time.events.add(Phaser.Timer.SECOND * 3, this.startGame, this);

        this.tap = this.game.add.sprite(this.game.width / 2, this.game.height / 2, 'tap');
        this.tap.anchor.setTo(0.5, 0.5);

        this.superTimeRemained = 0;

        //JUST FOR TEST PURPOSE DANMU
        this.barrageTxt = this.game.add.text(this.game.width + 1, this.game.rnd.integerInRange(50, this.game.height / 3 * 2 - 100), this.game.global.barrages[Math.floor(Math.random() * this.game.global.barrages.length)], {
            font: '20px Microsoft Yahei',
            fill: '#FAAA1F',
            fontWeight: 'bold'
        });
        this.barrageTxt.exists = false;

        this.flowBarrage = this.game.add.tween(this.barrageTxt).to({
            x: -this.barrageTxt.width
        }, 4000, Phaser.Easing.Linear.NONE, false, 0, 0, false);

        this.flowBarrage.onComplete.add(this.reInitializeBarrageTween, this);
        //TEST END

        this.overBoard = this.game.add.group();

        this.endPic = this.game.add.sprite(this.game.width / 2, this.game.height / 2, 'end');
        this.endPic.width = this.game.width;
        this.endPic.height = this.game.height;
        this.endPic.anchor.setTo(0.5, 0.5);
        this.overBoard.add(this.endPic);

        this.finalScore = this.add.text(this.game.width / 2, 170, '0', {
            font: '25px Microsoft Yahei',
            fill: '#ffff00',
            fontWeight: 'bold'
        });
        this.finalScore.anchor.setTo(0.5, 0.5);
        this.overBoard.add(this.finalScore);

        //12一行
        this.finalTxt = this.add.text(this.game.width / 2, 220, '', {
            font: '14px Microsoft Yahei',
            fill: '#000000',
            fontWeight: 'bold',
            align: 'center'
        });
        // this.finalTxt.wordWrapWidth = 190;
        // this.finalTxt.wordWrap = true;
        this.finalTxt.anchor.setTo(0.5, 0);
        this.overBoard.add(this.finalTxt);

        // this.replayBtn = this.game.add.button(this.game.width / 2 - 47, this.game.height - 140, 'replayBtn', this.replay, this);
        // this.replayBtn.anchor.setTo(0.5, 0.5);
        // this.overBoard.add(this.replayBtn);

        // this.shareBtn = this.game.add.button(this.game.width / 2 + 47, this.game.height - 140, 'shareBtn', this.share, this);
        // this.shareBtn.anchor.setTo(0.5, 0.5);
        // this.overBoard.add(this.shareBtn);

        // this.goBtn = this.game.add.button(this.game.width / 2, this.game.height - 50, 'goBtn', this.goBar, this);
        // this.goBtn.anchor.setTo(0.5, 0.5);
        // this.overBoard.add(this.goBtn);

        // this.replayBtn.visible = false;
        this.overBoard.visible = false;
        document.querySelector('.btn-wrapper').style.display = 'none';

        this.shareHint = this.game.add.sprite(0, 0, 'shareHint');
        this.shareHint.width = this.game.width;
        this.shareHint.height = this.game.height;
        this.shareHint.visible = false;
        this.shareHint.inputEnabled = true;
        this.shareHint.events.onInputDown.add(this.closeHint, this);

        this.game.global.btnSeted = false;

    },
    //FOR TEST
    reInitializeBarrageTween: function() {
        this.barrageTxt.exists = false;
        this.barrageTxt.x = this.game.width + 1;
        this.barrageTxt.y = this.game.rnd.integerInRange(50, this.game.height / 3 * 2 - 100);
        this.barrageTxt.text = this.game.global.barrages[Math.floor(Math.random() * this.game.global.barrages.length)];
        this.barrageTxt.fill = this.game.global.BARRAGE_COLORS[Math.floor(Math.random() * this.game.global.BARRAGE_COLORS.length)];
        this.barrageTxt.fontSize = this.game.rnd.integerInRange(20, 25);

        this.flowBarrage = this.game.add.tween(this.barrageTxt).to({
            x: -this.barrageTxt.width
        }, 4000, Phaser.Easing.Linear.NONE, false, 0, 0, false);
        this.flowBarrage.onComplete.add(this.reInitializeBarrageTween, this);
    },
    //TEST END
    share: function() {
        //tieba app or weixin
        this.shareHint.visible = true;
    },
    goBar: function() {
        window.location.href = 'http://tieba.baidu.com/f?kw=%D5%D2%D7%E9%D6%AF';
    },
    closeHint: function() {
        this.shareHint.visible = false;
    },
    reInitializeScoreTween: function() {
        this.blinkScore = this.game.add.tween(this.score).to({
            alpha: 1
        }, 400, Phaser.Easing.Bounce.Out, false, 0, 4, false);
        this.blinkScore.onComplete.add(this.reInitializeScoreTween, this);
    },
    reInitializeInfoTween: function() {
        this.info.alpha = 0;
        this.info.x = this.game.width / 2;
        this.blinkInfo = this.game.add.tween(this.info).to({
            alpha: 1
        }, 1000, Phaser.Easing.Bounce.Out, false, 0, 5, false);
        this.blinkInfo.onComplete.add(this.reInitializeInfoTween, this);
    },
    replay: function() {
        this.game.state.start('Game');
        //baidu track
        _hmt.push(['_trackEvent', 'bearun', '重玩']);
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

        if (!this.game.global.btnSeted) {
            this.placeBtns();
            this.game.global.btnSeted = true;
        }

    },
    placeBtns: function() {
        // playce the buttons
        var gameCanvas = document.querySelector('canvas');

        var shareHintPic = document.querySelector('#share-hint');
        shareHintPic.style.width = gameCanvas.style.width;
        shareHintPic.style.height = gameCanvas.style.height;
        shareHintPic.style.left = gameCanvas.style.marginLeft;
        shareHintPic.style.top = gameCanvas.style.marginTop;
        shareHintPic.onclick = function() {
            this.style.display = 'none';
        };

        var shareHintPic2 = document.querySelector('#share-hint2');
        shareHintPic2.style.width = gameCanvas.style.width;
        shareHintPic2.style.height = gameCanvas.style.height;
        shareHintPic2.style.left = gameCanvas.style.marginLeft;
        shareHintPic2.style.top = gameCanvas.style.marginTop;
        shareHintPic2.onclick = function() {
            this.style.display = 'none';
        };

        var replayBtn = document.querySelector('#button-replay');
        replayBtn.style.left = (parseInt(gameCanvas.style.marginLeft) || 0) + parseInt(gameCanvas.style.width) / 2 - 90 + 'px';
        replayBtn.style.top = (parseInt(gameCanvas.style.marginTop) || 0) + parseInt(gameCanvas.style.height) / 2 + 60 * (parseInt(gameCanvas.style.height) / 480) + 'px';
        replayBtn.onclick = this.replay.bind(this);

        var shareBtn = document.querySelector('#button-share');
        shareBtn.style.left = (parseInt(gameCanvas.style.marginLeft) || 0) + parseInt(gameCanvas.style.width) / 2 + 11 + 'px';
        shareBtn.style.top = (parseInt(gameCanvas.style.marginTop) || 0) + parseInt(gameCanvas.style.height) / 2 + 60 * (parseInt(gameCanvas.style.height) / 480) + 'px';
        var isDesktop=this.game.device.desktop;
        shareBtn.onclick = function() {

            if (isDesktop) {
                document.querySelector('#share-hint2').style.display = 'block';
            } else {
                document.querySelector('#share-hint').style.display = 'block';
            }
            //baidu track
            _hmt.push(['_trackEvent', 'bearun', '分享']);
        };

        var goBtn = document.querySelector('#button-go');
        goBtn.style.left = (parseInt(gameCanvas.style.marginLeft) || 0) + parseInt(gameCanvas.style.width) / 2 - 84 + 'px';
        goBtn.style.top = (parseInt(gameCanvas.style.marginTop) || 0) + parseInt(gameCanvas.style.height) - 60 + 'px';

        var moreBtn = document.querySelector('#button-more');
        moreBtn.style.left = (parseInt(gameCanvas.style.marginLeft) || 0) + parseInt(gameCanvas.style.width) / 2 - 84 + 'px';
        moreBtn.style.top = (parseInt(gameCanvas.style.marginTop) || 0) + parseInt(gameCanvas.style.height) - 110 + 'px';
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

        if (!this.game.global.superMode) {
            this.showAcchievement();
        }

        //if reachs a new high score
        if (this.game.global.highScore < this.game.global.score) {
            this.updateHighScore();
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
            this.blinkScore.start();
        }

        // this.scoreBoard.text = 'BEST:' + this.game.global.highScore + '  SCORE:' + this.game.global.score;
        this.score.text = '  SCORE:' + this.game.global.score + 'm';

        //JUST FOR TEST PURPOSE
        if (!this.barrageTxt.exists) {
            if (Math.random() - 0.5 > 0) {
                this.barrageTxt.exists = true;
                this.flowBarrage.start();
            }
        }
        //TESET END

    },
    showAcchievement: function() {
        switch (this.game.global.score) {
            case 100:
                this.info.text = '「百米之星，我骄傲」';
                this.blinkInfo.start();
                break;
            case 500:
                this.info.text = '机智如你，轻松完成500米';
                this.blinkInfo.start();
                break;
            case 1000:
                this.info.text = '到达「千里之外」！';
                this.blinkInfo.start();
                break;
            case 5000:
                this.info.text = '天了噜！万里长征跑了一半了~';
                this.blinkInfo.start();
                break;
            case 10000:
                this.info.text = 'You are amazing！完爆夸父！';
                this.blinkInfo.start();
                break;
            default:
                break;
        }
    },
    generateObstacle: function() {
        // var x = this.game.rnd.integerInRange(this.game.width, this.game.width + 150);

        // var obstacle = this.obstacles.getFirstExists(false);
        // if (!obstacle) {
        //     obstacle = new Obstacle(this.game, x, this.game.height / 3*2 - 30, 'dustbin');
        //     this.obstacles.add(obstacle);
        // } else {
        //     obstacle.reset(x, this.game.height / 3*2 - 30);
        //     obstacle.body.velocity.x = this.game.global.speed;
        // }

        //basically, the following new logic to generate a new obstacle is that we get a random child from the obstacles group. note there are 4 types of obstacle. if the one we got is already existing, that is to say it's on the screen, then we try to get the same type from the reminds. if there's no available same type obstacles, we simply create one.
        // if the one we get at first time does net exists, that's quite nice, use it directly. just reset it before we reues it.

        var x = this.game.rnd.integerInRange(this.game.width, this.game.width + 150);
        var xForCoin = this.game.rnd.integerInRange(this.game.width, this.game.width + 150);

        //random generate a coin instead of normal obstacles
        if (xForCoin < this.game.width + 5 && !this.coin.exists && !this.game.global.superMode) {
            this.coin.reset(xForCoin, this.coin.y);
            this.coin.body.velocity.x = this.game.global.speed;
        }

        var obstacle = this.obstacles.getRandom();

        if (obstacle.exists) {
            //try get the next same type children
            var typedChildren = this.obstacles.filter(function(child, index, children) {
                return !child.exists && child.obstacleIndex === obstacle.obstacleIndex && child.z !== obstacle.z;
            }, false);

            if (!typedChildren.first) {
                obstacle = new Obstacle(this.game, x, this.game.height / 3 * 2 - 30, 'obstacles', obstacle.obstacleIndex, obstacle.obstacleIndex);
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

            //if there are running tween on info text, sotp it
            if (this.blinkInfo.isRunning) {
                this.blinkInfo.stop(true);
            }

            this.info.text = '来自组织的关爱：' + this.superTimeRemained;
            this.info.alpha = 1;

            return;
        }

        this.game.global.status = 0;
        this.game.global.speed = -300;

        this.obstacles.setAll('body.velocity.x', 0);
        this.coin.body.velocity.x = 0;

        player.stop();

        // this.replayBtn.visible = true;
        //结束文案goes here 
        this.finalScore.text = this.game.global.score;
        this.finalTxt.text = this.getFinalTxt();
        this.overBoard.visible = true;
        //show buttons
        document.querySelector('.btn-wrapper').style.display = 'block';

        player.body.gravity = 0;

        this.player.frame = 4;

        this.ground.stop();
        this.background.stop();

        // this.obstacleGenerator.timer.stop();
        this.gameTimer.stop();
        // this.scoreTimer.stop();

        this.flowBarrage.stop();

        //update high score
        if (this.game.global.highScore < this.game.global.score) {
            this.updateHighScore();
        }

        this.game.global.score = 0;
        this.gameOverSnd.play();

        //weixin share
        document.title = '【组织召集令】我在路上都跑了' + this.game.global.highScore + 'm了，你人呢？！';
    },
    getFinalTxt: function() {
        var score = this.game.global.score,
            txt = '';
        if (score < 100) {
            txt = '亲还是比较适合短跑的呵呵，\n多多训练哦！这样才能向组\n织靠拢！';
        } else if (score < 500) {
            txt = '恭喜你获得‘百米之星’称号~继\n续加油！组织正在不远处向\n你招手！';
        } else if (score < 1000) {
            txt = '潜力股！组织可以考虑培养你！\n前提是你先找到人家哦~';
        } else if (score < 5000) {
            txt = '一口气跑这么远也是醉了~快来\n喝口茶继续的！';
        } else if (score < 10000) {
            txt = '风一样的熊仔！组织欣赏你！\n不摔你就能找到我了！哎。。';
        } else {
            txt = '是你！就是你！组织的人才，\n小快腿（shou）！准你入组织\n了！';
        }
        return txt;
    },
    updateHighScore: function() {
        this.game.global.highScore = this.game.global.score;
        localStorage && localStorage.setItem('brhs', this.game.global.highScore);
    },
    shutdown: function() {
        this.game.input.keyboard.removeKey(Phaser.Keyboard.SPACEBAR);
        this.game.input.keyboard.removeKey(this.arrow);
        this.player.destroy();
        this.shareHint.destroy();
        this.obstacles.destroy();
        this.overBoard.destroy();
        this.scoreBoard.destroy();
        this.barrageTxt.destroy();
        this.ground.destroy();
        // this.bottomGroundGraphics.destroy();
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