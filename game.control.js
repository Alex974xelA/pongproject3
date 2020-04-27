game.control = {

    controlSystem : null,
    mousePointer : null,

    onKeyDown : function(event) {

        if ( event.keyCode == game.keycode.KEYDOWN ) {
            game.control.controlSystem = "KEYBOARD";
            game.player.goDown = true;
        } else if ( event.keyCode == game.keycode.KEYUP ) {
            game.control.controlSystem = "KEYBOARD";
            game.player.goUp = true;
        }

        if ( event.keyCode == game.keycode.SPACEBAR && !game.ball.inGame) {
            if (game.gameOn && game.playerOne.retainBall) {
                game.ball.inGame = true;
                game.playerOne.retainBall = false;
                game.ball.sprite.posX = game.playerOne.sprite.posX + game.playerOne.sprite.width + 10;
                game.ball.sprite.posY = game.playerOne.sprite.posY + game.playerOne.sprite.height / 2;
                game.ball.directionX = 1;
                game.ball.directionY = 1;
            }else if (game.player.number!=1){
                socket.emit('sendBall', game.player);
            }

        }
    },

    onKeyUp : function(event) {

        if ( event.keyCode == game.keycode.KEYDOWN ) {
            game.player.goDown = false;
        } else if ( event.keyCode == game.keycode.KEYUP ) {
            game.player.goUp = false;
        }
    },

    onMouseMove : function(event) {

        game.control.controlSystem = "MOUSE";

        if ( event ) {
            game.control.mousePointer = event.clientY - conf.MOUSECORRECTIONPOSY;
        }

        if ( game.control.mousePointer > game.player.sprite.posY ) {
            game.player.goDown = true;
            game.player.goUp = false;
        } else if ( game.control.mousePointer < game.player.sprite.posY ) {
            game.player.goDown = false;
            game.player.goUp = true;
        } else {
            game.player.goDown = false;
            game.player.goUp = false;
        }
    },

    onStartGameClickButton : function() {
        if ( !game.gameOn && game.player.number==1 ) {
            game.reinitGame();
            game.gameOn = true;
            game.pauseGameButton.style.display = 'inline';
            game.continueGameButton.style.display = 'none';

        } else
            socket.emit('startGameClickButton');
    },

    onPauseGameClickButton : function() {
        if ( game.gameOn ) {
            game.gameOn = false;
            game.pauseGameButton.style.display = 'none';
            game.continueGameButton.style.display = 'inline';
        } else {
            game.pauseGameButton.style.display = 'none';
            game.continueGameButton.style.display = 'inline';
            socket.emit('pauseGameClickButton');
        }
    },

    onContinueGameClickButton : function() {
        if ( !game.gameOn && game.player.number == 1) {
            game.gameOn = true;
            game.pauseGameButton.style.display = 'inline';
            game.continueGameButton.style.display = 'none';
        } else {
            game.pauseGameButton.style.display = 'inline';
            game.continueGameButton.style.display = 'none';
            socket.emit('continueGameClickButton');
        }
    }
};
