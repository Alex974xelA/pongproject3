const game = {
    groundColor: "#000000",
    netColor: "#FFFFFF",
    scoreLayer : null,
    playersBallLayer : null,
    terrainLayer : null,
    resultLayer : null,
    instructionLayer : null,
    wallSound : null,
    playerSound : null,
    divGame: null,
    gameOn : false,
    startGameButton : null,
    continueGameButton : null,
    pauseGameButton : null,
    blocToCenter : null,

    devResX : 1920,
    devResY : 1200,
    targeResX : null,
    targetResY : null,
    ratioResX : null,
    ratioResY : null,

    player : null,

    ball : {
        sprite : null,
        color : "#FFFFFF",
        speed : 1,
        directionX : 1,
        directionY : 1,
        inGame : false,

        move : function() {
            if ( this.inGame ) {
                this.sprite.posX += this.directionX * this.speed;
                this.sprite.posY += this.directionY * this.speed;
            }
        },

        bounce : function(soundToPlay) {
            if ( this.sprite.posX > conf.GROUNDLAYERWIDTH || this.sprite.posX < 0 ) {
                this.directionX = -this.directionX;
                soundToPlay.play();
            }
            if ( this.sprite.posY + this.sprite.height > conf.GROUNDLAYERHEIGHT || this.sprite.posY < 0  ) {
                this.directionY = -this.directionY;
                soundToPlay.play();
            }
        },

        collide : function(anotherItem) {
            if ( !( this.sprite.posX >= anotherItem.sprite.posX + anotherItem.sprite.width || this.sprite.posX <= anotherItem.sprite.posX - this.sprite.width
                || this.sprite.posY >= anotherItem.sprite.posY + anotherItem.sprite.height || this.sprite.posY <= anotherItem.sprite.posY - this.sprite.height ) ) {
                // Collision
                return true;
            }
            return false;
        },

        lost : function(player) {
            var returnValue = false;
            if ( player.originalPosition == "left" && this.sprite.posX < player.sprite.posX - this.sprite.width ) {
                returnValue = true;
            } else if ( player.originalPosition == "right" && this.sprite.posX > player.sprite.posX + player.sprite.width ) {
                returnValue = true;
            }
            return returnValue;
        },
        speedUp: function() {
            this.speed = this.speed + .1;
        },
    },

    playerOne : {
        number : 1,
        sprite : null,
        color : "#FFFFFF",
        goUp : false,
        goDown : false,
        originalPosition : "left",
        score : 0,
        ai : false,
        retainBall : true,
    },

    playerTwo : {
        number : 2,
        sprite : null,
        color : "#FFFFFF",
        goUp : false,
        goDown : false,
        originalPosition : "right",
        score : 0,
        ai : true,
        retainBall : false,
    },

    playerThree : {
        number : 3,
        sprite : null,
        color : "#FFFFFF",
        goUp : false,
        goDown : false,
        originalPosition : "left",
        score : 0,
        ai : true,
        retainBall : false,
        hidden: true
    },

    playerFour : {
        number : 4,
        sprite : null,
        color : "#FFFFFF",
        goUp : false,
        goDown : false,
        originalPosition : "right",
        score : 0,
        ai : true,
        retainBall : false,
        hidden: true
    },

    init : function(numjoueur) {


        //this.initScreenRes();
        //this.resizeDisplayData(conf,this.ratioResX,this.ratioResY);
        this.blocToCenter = document.getElementById("blocToCenter");
        this.blocToCenter.style.width = conf.BLOCCENTERWIDTH + "px";
        this.blocToCenter.style.height = conf.BLOCCENTERHEIGHT + "px";
        this.blocToCenter.style.margin = "-" + conf.BLOCCENTERHEIGHT/2 + "px 0 0 -" + conf.BLOCCENTERWIDTH/2 + "px";


        this.blocRight = document.getElementById("right");
        this.blocRight.style.width = conf.BLOCRIGHTWIDTH + "px";
        this.blocRight.style.height = conf.BLOCRIGHTHEIGHT + "px";

        this.divGame = document.getElementById("divGame");
        this.divGame.style.width = conf.BLOCDIVGAMEWIDTH + "px";
        this.divGame.style.height = conf.BLOCDIVGAMEHEIGHT + "px";

        this.startGameButton = document.getElementById("startGame");
        this.startGameButton.style.width = conf.BUTTONSTARTGAMEWIDTH + "px";

        this.pauseGameButton = document.getElementById("pauseGame");
        this.pauseGameButton.style.width = conf.BUTTONPAUSEGAMEWIDTH + "px";

        this.continueGameButton = document.getElementById("continueGame");
        this.continueGameButton.style.width = conf.BUTTONCONTINUEGAMEWIDTH + "px";

        this.ball.sprite = game.display.createSprite(conf.BALLWIDTH,conf.BALLHEIGHT,conf.BALLPOSX,conf.BALLPOSY,"./img/ball.png");
        this.playerOne.sprite = game.display.createSprite(conf.PLAYERONEWIDTH,conf.PLAYERONEHEIGHT,conf.PLAYERONEPOSX,conf.PLAYERONEPOSY,"./img/playerOne.png");
        this.playerTwo.sprite = game.display.createSprite(conf.PLAYERTWOWIDTH,conf.PLAYERTWOHEIGHT,conf.PLAYERTWOPOSX,conf.PLAYERTWOPOSY,"./img/playerTwo.png");
//-----------------------------------------------
        this.playerThree.sprite = game.display.createSprite(conf.PLAYERONEWIDTH,conf.PLAYERONEHEIGHT,conf.PLAYERONEPOSX+200,conf.PLAYERONEPOSY,"./img/playerOne.png");
        this.playerFour.sprite = game.display.createSprite(conf.PLAYERONEWIDTH,conf.PLAYERONEHEIGHT,conf.PLAYERTWOPOSX-200,conf.PLAYERTWOPOSY,"./img/playerTwo.png");
//--------------------------------------------------
        this.wallSound = new Audio("./sound/pingMur.ogg");
        this.playerSound = new Audio("./sound/pingRaquette.ogg");

        this.terrainLayer= game.display.createLayer("terrain", conf.GROUNDLAYERWIDTH, conf.GROUNDLAYERHEIGHT, this.divGame, 0, "#000000", 10, 50);
        game.display.drawRectangleInLayer(this.terrainLayer, conf.NETWIDTH, conf.GROUNDLAYERHEIGHT, this.netColor, conf.GROUNDLAYERWIDTH/2 - conf.NETWIDTH/2, 0);

        this.scoreLayer = game.display.createLayer("score", conf.GROUNDLAYERWIDTH, conf.GROUNDLAYERHEIGHT, this.divGame, 1, undefined, 10, 50);

        this.instructionLayer = game.display.createLayer("instructions", conf.GROUNDLAYERWIDTH, conf.GROUNDLAYERHEIGHT, this.divGame, 1, undefined, 10, 50);
        game.display.drawTextInLayer(this.instructionLayer , "Appuyez sur START", "15px Arial", "#FF0000", 10, 15);
        game.display.drawTextInLayer(this.instructionLayer , "puis sur <ESPACE>", "15px Arial", "#FF0000", 10, 35);
        game.display.drawTextInLayer(this.instructionLayer , "pour initier le jeu", "15px Arial", "#FF0000", 10, 55);
        game.display.drawTextInLayer(this.instructionLayer , "Si un seul joueur est connecté en local vous", "15px Arial", "#FF0000", 10, 75);
        game.display.drawTextInLayer(this.instructionLayer , "jouez contre l'IA sinon pour augmenter en direct", "15px Arial", "#FF0000", 10, 95);
        game.display.drawTextInLayer(this.instructionLayer , "le nombre de joueur il faut se connecter dans un", "15px Arial", "#FF0000", 10, 115);
        game.display.drawTextInLayer(this.instructionLayer , "nouvel onglet 4 connections simultanées seulement", "15px Arial", "#FF0000", 10, 135);
        game.display.drawTextInLayer(this.instructionLayer , "sont autorisées.", "15px Arial", "#FF0000", 10, 155);

        this.playersBallLayer = game.display.createLayer("joueursetballe", conf.GROUNDLAYERWIDTH, conf.GROUNDLAYERHEIGHT, this.divGame, 2, undefined, 10, 50);
        game.display.drawTextInLayer(this.playersBallLayer, "JOUEURSETBALLE", "10px Arial", "#FF0000", 100, 100);

        this.resultLayer = game.display.createLayer("joueursetballe", conf.GROUNDLAYERWIDTH, conf.GROUNDLAYERHEIGHT, this.divGame, 2, undefined, 10, 50);

        var newFont = new FontFace('DS-DIGIB', 'url(./font/ds_digital/DS-DIGIB.TTF)');
        newFont.load().then(function(font){
            document.fonts.add(font);
            game.displayScore(0,0);
        });

        this.displayBall(200,200);

        this.displayPlayers();

        game.speedUpBall();

        this.initKeyboard(game.control.onKeyDown, game.control.onKeyUp);
        this.initMouse(game.control.onMouseMove);
        this.initStartGameButton();
        this.initPauseGameButton();
        this.initContinueGameButton();

        switch (numjoueur){
            case 1 :
                this.player = this.playerOne;
                game.ai.setPlayerAndBall(this.playerTwo, this.ball);
                break;
            case 2 :
                this.player = this.playerTwo;
                this.scoreLayer.clear();
                this.instructionLayer.clear();
                socket.emit('updatePlayerOne');
                break;
//-----------------------------------------
            case 3 :
                this.playerThree.hidden = false;
                this.player = this.playerThree;
                this.scoreLayer.clear();
                this.instructionLayer.clear();
                socket.emit('updatePlayerOneTwo');
                break;
            case 4 :
                this.playerThree.hidden = false;
                this.playerFour.hidden = false;
                this.player = this.playerFour;
                this.scoreLayer.clear();
                this.instructionLayer.clear();
                socket.emit('updatePlayerOneTwoThree');
                break;
//-----------------------------------------
            default :

        }

    },

    displayScore : function(scorePlayer1, scorePlayer2) {
        game.display.drawTextInLayer(this.scoreLayer, scorePlayer1, conf.SCOREFONTSIZE + "pt DS-DIGIB", "#FFFFFF", conf.SCOREPOSXPLAYER1, conf.SCOREPOSYPLAYER1);
        game.display.drawTextInLayer(this.scoreLayer, scorePlayer2, conf.SCOREFONTSIZE + "pt DS-DIGIB", "#FFFFFF", conf.SCOREPOSXPLAYER2, conf.SCOREPOSYPLAYER2);
    },

    displayBall : function() {
        game.display.drawImageInLayer(this.playersBallLayer, this.ball.sprite.img, this.ball.sprite.posX, this.ball.sprite.posY, conf.BALLWIDTH, conf.BALLHEIGHT);
    },

    displayPlayers : function() {
        game.display.drawImageInLayer(this.playersBallLayer, this.playerOne.sprite.img, this.playerOne.sprite.posX, this.playerOne.sprite.posY, conf.PLAYERONEWIDTH, conf.PLAYERONEHEIGHT);
        game.display.drawImageInLayer(this.playersBallLayer, this.playerTwo.sprite.img, this.playerTwo.sprite.posX, this.playerTwo.sprite.posY, conf.PLAYERTWOWIDTH, conf.PLAYERTWOHEIGHT);

//--------------------------------------------------
        if (!this.playerThree.hidden)
            game.display.drawImageInLayer(this.playersBallLayer, this.playerThree.sprite.img, this.playerThree.sprite.posX, this.playerThree.sprite.posY, conf.PLAYERONEWIDTH, conf.PLAYERONEHEIGHT);
        if (!this.playerFour.hidden)
            game.display.drawImageInLayer(this.playersBallLayer, this.playerFour.sprite.img, this.playerFour.sprite.posX, this.playerFour.sprite.posY, conf.PLAYERONEWIDTH, conf.PLAYERONEHEIGHT);
//--------------------------------------------------
    },

    moveBall : function() {
        this.ball.move();
        this.ball.bounce(this.wallSound);
        this.displayBall();
    },

    clearLayer : function(targetLayer) {
        targetLayer.clear();
    },

    initKeyboard : function(onKeyDownFunction, onKeyUpFunction) {
        window.onkeydown = onKeyDownFunction;
        window.onkeyup = onKeyUpFunction;
    },

    initMouse : function(onMouseMoveFunction) {
        window.onmousemove = onMouseMoveFunction;
    },

    movePlayers : function() {

        var up;
        var down;

        if ( game.control.controlSystem == "KEYBOARD" ) {
            if ( this.player.goUp ) {
                up = true;
                down= false;
            } else if ( this.player.goDown ) {
                up = false;
                down= true;
            }
        } else if ( game.control.controlSystem == "MOUSE" ) {
            if (this.player.goUp && this.player.sprite.posY > game.control.mousePointer ) {
                up = true;
                down= false;
            } else if (this.player.goDown && this.player.sprite.posY < game.control.mousePointer ) {
                up = false;
                down= true;
            }
        }

        if ( up && this.player.sprite.posY > 5 )
            this.player.sprite.posY-=5;
        else if ( down && this.player.sprite.posY < conf.GROUNDLAYERHEIGHT - this.player.sprite.height-5)
            this.player.sprite.posY+=5;

    },

    collideBallWithPlayersAndAction : function() {
        if ( this.ball.collide(game.playerOne) ) {
            this.changeBallPath(game.playerOne, game.ball);
            this.playerSound.play();
        }
        if ( this.ball.collide(game.playerTwo) ) {
            this.changeBallPath(game.playerTwo, game.ball);
            this.playerSound.play();
        }
//--------------------------------------------------
        if (!this.playerThree.hidden) {
            if (this.ball.collide(game.playerThree)) {
                this.changeBallPath(game.playerThree, game.ball);
                this.playerSound.play();
            }
        }

        if (!this.playerFour.hidden) {
            if (this.ball.collide(game.playerFour)) {
                this.changeBallPath(game.playerFour, game.ball);
                this.playerSound.play();
            }
        }
//--------------------------------------------------
    },

    lostBall : function() {
        if ( this.ball.lost(this.playerOne) ) {
            this.playerOne.retainBall = true;
            this.playerTwo.score++;
            socket.emit('scoreChanged', this.playerOne.score, this.playerTwo.score);
            if ( this.playerTwo.score > 2 ) {
                socket.emit('winnerIs', game.playerTwo.number);
                game.display.drawTextInLayer(this.resultLayer , "YOU LOOSE", "100px Arial", "#FF0000", 50, 200);
                this.gameOn = false;
            } else {
                this.ball.inGame = false;

                if ( this.playerOne.ai ) {
                    setTimeout(game.ai.startBall(), 3000);
                }
            }
        } else if ( this.ball.lost(this.playerTwo) ) {
            this.playerTwo.retainBall = true;
            this.playerOne.score++;
            socket.emit('scoreChanged', this.playerOne.score, this.playerTwo.score);
            if ( this.playerOne.score > 2 ) {
                socket.emit('winnerIs', game.playerOne.number);
                game.display.drawTextInLayer(this.resultLayer , "YOU WIN", "100px Arial", "#FF0000", 120, 200);
                this.gameOn = false;
            } else {
                this.ball.inGame = false;

                if ( this.playerTwo.ai ) {
                    setTimeout(game.ai.startBall(), 3000);
                }
            }
        }

        this.scoreLayer.clear();
        this.displayScore(game.playerOne.score, game.playerTwo.score);
    },

    initStartGameButton : function() {
        this.startGameButton.onclick = game.control.onStartGameClickButton;
    },

    reinitGame : function() {
        console.log('reinitgame');
        this.ball.inGame = false;
        this.playerOne.retainBall = true;
        this.ball.speed = 1;
        this.playerOne.score = 0;
        this.playerTwo.score = 0;
        this.scoreLayer.clear();
        this.resultLayer.clear();
        this.instructionLayer.clear();
        this.displayScore(this.playerOne.score, this.playerTwo.score);
        socket.emit('reinitPlayers');
    },

    ballOnPlayer : function(player, ball) {
        var returnValue = "CENTER";
        var playerPositions = player.sprite.height/5;
        if ( ball.sprite.posY > player.sprite.posY && ball.sprite.posY < player.sprite.posY + playerPositions ) {
            returnValue = "TOP";
        } else if ( ball.sprite.posY >= player.sprite.posY + playerPositions && ball.sprite.posY < player.sprite.posY + playerPositions*2 ) {
            returnValue = "MIDDLETOP";
        } else if ( ball.sprite.posY >= player.sprite.posY + playerPositions*2 && ball.sprite.posY < player.sprite.posY +
            player.sprite.height - playerPositions ) {
            returnValue = "MIDDLEBOTTOM";
        } else if ( ball.sprite.posY >= player.sprite.posY + player.sprite.height - playerPositions && ball.sprite.posY < player.sprite.posY +
            player.sprite.height ) {
            returnValue = "BOTTOM";
        }
        return returnValue;
    },

    changeBallPath : function(player, ball) {
        if (player.originalPosition == "left") {
            switch (game.ballOnPlayer(player, ball)) {
                case "TOP":
                    ball.directionX = 1;
                    ball.directionY = -3;
                    break;
                case "MIDDLETOP":
                    ball.directionX = 1;
                    ball.directionY = -1;
                    break;
                case "CENTER":
                    ball.directionX = 2;
                    ball.directionY = 0;
                    break;
                case "MIDDLEBOTTOM":
                    ball.directionX = 1;
                    ball.directionY = 1;
                    break;
                case "BOTTOM":
                    ball.directionX = 1;
                    ball.directionY = 3;
                    break;
            }
        } else {
            switch (game.ballOnPlayer(player, ball)) {
                case "TOP":
                    ball.directionX = -1;
                    ball.directionY = -3;
                    break;
                case "MIDDLETOP":
                    ball.directionX = -1;
                    ball.directionY = -1;
                    break;
                case "CENTER":
                    ball.directionX = -2;
                    ball.directionY = 0;
                    break;
                case "MIDDLEBOTTOM":
                    ball.directionX = -1;
                    ball.directionY = 1;
                    break;
                case "BOTTOM":
                    ball.directionX = -1;
                    ball.directionY = 3;
                    break;
            }
        }

    },

    speedUpBall: function() {
        setInterval(function() {
            game.ball.speedUp();
        }, 5000);
    },

    initScreenRes : function() {
        this.targetResX = window.screen.availWidth;
        this.targetResY = window.screen.availHeight;
        this.ratioResX = this.targetResX/this.devResX;
        this.ratioResY = this.targetResY/this.devResY;
    },

    resizeDisplayData : function(object, ratioX, ratioY) {
        var property;
        for ( property in object ) {
            if ( property.match(/^.*X.*$/i) || property.match(/^.*WIDTH.*$/i) ) {
                object[property] = Math.round(object[property] * ratioX);
            } else {
                object[property] = Math.round(object[property] * ratioY);
            }
        }
    },

    initPauseGameButton : function() {
        this.pauseGameButton.onclick = game.control.onPauseGameClickButton;
    },

    initContinueGameButton : function() {
        this.continueGameButton.onclick = game.control.onContinueGameClickButton;
    }
};
