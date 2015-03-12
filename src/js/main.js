/*
 * bear run
 * this is a html5 web game built with phaser
 * and inspired by chorme offline hidden game t-rex runner
 * v1.2.0
 * for more info pls head to https://github.com/wayou/bear-run
 *
 *CREDITS:
 *- code and art : wayou
 *- the bear stuff characters are created by tiaba ue team, and all characters used in this game are adapted from their works by wayou
 *- score snd by AdamWeeden licensed under the cc license
 *- https://www.freesound.org/people/AdamWeeden/sounds/157217/
 *- gameover snd by fins licensed under the cc license  
 *- http://www.freesound.org/people/fins/sounds/146734/
 *- jump snd by LloydEvans09 Rossley licensed under the cc license
 *- http://www.freesound.org/people/LloydEvans09/sounds/187024/
 *- coin snd by DrMinky licensed under the cc license
 *- https://www.freesound.org/people/DrMinky/sounds/166184/
 *- bite snd by yottasounds and published as public domain
 *- https://www.freesound.org/people/yottasounds/sounds/232133/
 *
 *- tools used to create this game:
 *- convert wav audio to mp3 http://media.io/
 *
 * new UE stuff are created by Na

 * CHANGELOG
 
 * v1.2.0
 * - handle window resize and reset the buttons
 
 * v1.1.1
 * - add baidu event track
 
 * v1.1.0
 * - refactor the buttons within gameover board to track the click
  
 * v1.0.0
 * - v1.0 release
  
 * v0.13.0
 * - test share
 
 * v0.12.1
 * - new UE asserts
 * - swap the replay btn and share btn

* v0.12.0
 * - get the floating text back to game
 * - fix the sky color

 * v0.11.4
 * - change document title from 「呆萌熊」to 「熊孩子」

* v0.11.3
 * - add share button and share hint pic when game over

 * v0.11.2
 * - fix weixin share thumbnail and title

 * v0.11.1
 * - generate the coin and obstacle parallel

 * v0.11.0
 * - show acchievements

 * v0.10.0
 * - preset colors

 * v0.9.5
 * - decrease the change for coin
 * - test floating text in the sky
 
 * * v0.9.4
 * - tween welcome text to right
 * - set the coin probability to 0.1
 * 
 * v0.9.3
 * - add tap instruction
 * - adjustment the game speed
 * 
 * v0.9.2
 * - add hidden pic for share
 * 
 * v0.9.1
 * - try orientation detect
 * 
  
 * v0.9.0
 * - optimize the runing animation for the player: check the isPlaying property to determine whether to replay the runing animation within the update function of the player. this brings performance improvemece.
 * - fix bug: collect a star and enter the super mode, do not jump, till the super mode ended, the player still plays the super frames
 * - kill obstacle when in super mode and the player collide with it
 * - add eat sound for kill obstacle
 * 

 * v0.8.3
 * - fix bug: the obstacles shows when game started immediately
 * 
 * v0.8.2
 * - randomize the game color
 * 
 * v0.8.1
 * - fix super mode timeout bug

 * v0.8.0
 * - complete the super mode

 * v0.8.0 -pre
 * - reimplement the obstacle generation logic, add a coin to enter the super mode
 * - add super mode sprites

 * v0.7.1
 * - fix replay bug

* v0.7.0
 * - fix speed acceleration
 * - add some more obstacles and refactor the logic of generating obstacles

 * v0.6.1
 * - optimize the score text

 * v0.6.0
 * - refactor the cloud, move it up so users can focus on the player
 * - adjust some data to make the game more reasonable

 * v0.5.1
 * - optimize the blink rate
 * - increase the game ratio from -20 to -25
 * - increase the MAX_SPEED from -500 to -600

 * v0.5.0
 * - blink the score when level up
 * - increase the game ratio from -10 to -20

 * v0.4.0
 * - resize the collide body for sprites for better experience

 * v0.3.1
 * - fix timer and the score
 
 * v0.3.0
 * - speed up scrolling when level up
 * - introduce debug
 
 * v0.2.0
 * - new obstacle icon
 * -  new replay button
 * - refactor the ground with new tile sprite
 
 * v0.1.2
 * - fix obstacle recyling and memery leask on mobile
 
 * v0.1.1
 * - add sound for game over
 */

'use strict';

var game = new Phaser.Game(320, 480, Phaser.CANVAS, '');
//use canvas mode for debuging purpose, for the game.debug only works in canvas mode
//fix me: even change to canvas mode the game.debug still not working
// var game = new Phaser.Game(320, 480, Phaser.CANVAS, '');

game.global = {
    score: 0,
    superMode: false,
    highScore: localStorage && localStorage.getItem('brhs') || 0, //get the high score from local storage if possible
    status: 0, //0 not started|1 started
    speed: -300,
    RATIO: -20, //how fast the speed grow during the game running
    MAX_SPEED: -560,
    SKY_COLORS: ['#03426D', '#7CC4DE'],
    BARRAGE_COLORS: ['#6AFCAF', '#ECA806', '#69F7AC', '#FF2F2F', '#FF477B'],
    barrages: ['00后早恋吧：好爱感觉不会再累了',
        '00后七天情侣吧：我们不落后，一直在刷新爱情的耐久度',
        '00后亲：虽然还没到能法定年龄，但已决定今生非你莫属',
        '戒色吧：天降大任于斯些人也，必让他们先戒色',
        '守贞吧：不随便开始，不急着妥协',
        'BL吧：爱情和性别没有关系，我们只是爱上了而已！',
        '拉拉吧：性别不一样怎么谈恋爱！',
        // '备胎吧：我爱你，跟你没有关系。只求你一切安好，我们愿意备胎到老',
        // '第三者吧：我爱你，跟你全家都有关系。你一天不给我名分，我们一天不让你好混',
        '二号男主角：如果我爱你，而你也正巧的爱我，那该多美好',
        '掏粪男孩吧：掏粪不死，圣战不休！',
        '黑幂吧：喜欢和恨只是一念之差！',
        // '弱智吧：我知道你不信，但我们就是一群伪装成弱智，有组织有纪律地编写高品质段子的人',
        '高智商吧：有一句老话：进不了门萨，就上高智商吧！',
        // '技术宅吧：嘲笑geek狗没女友？我们能分分钟给你造一个出来！',
        // '男主角受伤吧：一次元高大上男主角统统滚开，让我们撕开你们的伪装，反复品味你们胸口傲娇的伤！',
        // '神id联盟：我们的目标是：占领所有古怪ID，让世间再没有更神奇的ID！',
        // '抠脚大汉：抠的一手好脚，卖的一手好萌，虽然我们也不知道哪里萌了',
        '吊车司机吧：生活太苦闷，贴吧多欢乐',
        // '广场舞吧：年轻人嫌我们吵整天动次大次，不过想跟着鼓点跳起再年轻一次',
        '燃烧十字军团吧：唯一能跟天涯观光团抗衡的团体！',
        '要么备胎到老，要么高调挡道',
        '性别不重要，年纪不重要！',
        '不过是牵起了同性的手，一切与你想象的没什么不同！',
        // '明知是备胎被发好人卡后，15%的备胎们选择去好人卡吧吐吐槽，玩一玩LOL，看几集海贼，第二天阳光仍旧灿烂，仍旧默默去爱',
        '小明因长期被爸妈蒙在鼓里，最终导致窒息死亡',
        '心爱的小狗惨遭邻居毒害，愤怒的小明拉起了“还我狗命”的横幅',
        '我舅临死前才告诉我我不是他亲生的',
        '一男子失明多年竟奇迹复明，只因争吵中女友一句“我死给你看”',
        '面对倒地的老奶奶，小明果断的给她充了一个复活币',
        '我马上就要和我家老母猪奉子成婚，要不要买一份人兽保险？',
        '为了给相亲对象留个好印象，王老汉拿起菜谱:“这书写得不错。”',
        '唐僧临死之前机智地吃了一块自己的肉得以长生不死',
        '宁可笑尿，也不吃药',
        '乐此不疲吧：土豪包养本吧，全场免费',
        '乐此不疲吧：据说隔壁小明老来这个吧抢钱',
        '乐此不疲吧，小游戏专属贴吧，怪咖太多啦',
        '乐此不疲吧：玩我，拿我，雅蠛蝶！'
    ]
};

game.state.add('Boot', require('./states/boot'));
game.state.add('Preloader', require('./states/preloader'));
game.state.add('Menu', require('./states/menu'));
game.state.add('Game', require('./states/game'));

game.state.start('Boot');

/* messenger初始化 */
var messenger = new Messenger('gameIframe', 'tiebaGame');
messenger.addTarget(window.parent, 'tiebaIframe');
/* 接收信息 */
messenger.listen(function(data) {
    console.log('evet got');
    setTimeout(function() {
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
    });
});