/*

    <script src="script.js"></script>

*/

var canvas;
var canvasContext;
var ballX = 50;
var ballSpeedX = 10;
var ballY = 80;
var ballSpeedY = 5;

var paddle1Y = 250;
var paddle2Y = 250;

var player1Score  = 0;
var player2Score = 0;
const WINNING_SCORE = 3;
var showingWinScreen = false;
// my additions
var menuOptions = 0; //var for menu creation
var distanceFromEdge = 12;
var keyPressedIs = 27; // 27 : ESC, 49 : '1', 50 : '2', 51 : '3'
var computerSpeed = 5;
var FPS = 30/60;
// end
const PADDLE_HEIGHT = 100;
const PADDLE_THICKNESS = 10;

function calculateMousePos(evt){
  var rect = canvas.getBoundingClientRect();
  var root = document.documentElement;
  var mouseX = evt.clientX - rect.left - root.scrollLeft;
  var mouseY = evt.clientY - rect.top - root.scrollTop;

  return{
    x: mouseX,
    y: mouseY
  };
}

/*
jquery function to listen to key press
*/
$(document).keydown(function(event) {
  keyPressedIs = event.keyCode;
  if (keyPressedIs == 49 && menuOptions == 0) {
    menuOptions = 1;
    ballSpeedX = 10 * FPS;
    ballSpeedY = 3 * FPS;
    computerSpeed = 6 * FPS;
  } else if (keyPressedIs == 50 && menuOptions == 0) {
    menuOptions = 2;
    ballSpeedX = 13 * FPS;
    ballSpeedY = 5 * FPS;
    computerSpeed = 10 * FPS;
  } else if (keyPressedIs == 51 && menuOptions == 0) {
    menuOptions = 3;
    ballSpeedX = 20 * FPS;
    ballSpeedY = 11 * FPS;
    computerSpeed = 11 * FPS;
  } else if (keyPressedIs == 27) {
    menuOptions = 0; // this is ESC
    ballReset();
    player1Score = 0;
    player2Score = 0;
    showingWinScreen = false;
  }
  console.log(keyPressedIs);
  event.preventDefault();
});
function handleMouseClick(evt){
  if (showingWinScreen){
    player1Score = 0;
    player2Score = 0;
    showingWinScreen = false;
  } /*else if (menuOptions == 0){
    if(keyPressedIs == 49){
    menuOptions = 1;
    }

  }*/
}


window.onload = function(){
  canvas = document.getElementById('gameCanvas')
  canvasContext = canvas.getContext('2d');
  var framesPerSecond = 60;
  setInterval(callBoth, 1000 / framesPerSecond);

  canvas.addEventListener('mousedown', handleMouseClick);
  //canvas.addEventListener("keydown", back2Menu());
  // this is not working
  canvas.addEventListener('mousemove',
                          function(evt){
    var mousePos = calculateMousePos(evt);
    paddle1Y = mousePos.y - (PADDLE_HEIGHT / 2);

  })
}

function callBoth(){
  moveEverything();
  drawEverything();
}

function ballReset(){
  if (player1Score >= WINNING_SCORE ||
      player2Score >= WINNING_SCORE){
    showingWinScreen = true;

  }

  ballSpeedX = -1 * ballSpeedX;
  ballSpeedY = 0;
  ballX = canvas.width / 2;
  ballY = canvas.height / 2;
}

function computerMovment(){
  var paddle2YCenter = paddle2Y + (PADDLE_HEIGHT / 2);
  if (paddle2YCenter < ballY - 30){
    paddle2Y += computerSpeed;
  } else if (paddle2YCenter > ballY + 30){
    paddle2Y -= computerSpeed;
  }

}


function moveEverything(){
  if (showingWinScreen || menuOptions == 0){
    return;
  }
  computerMovment();

  ballX = ballX + ballSpeedX;
  ballY = ballY + ballSpeedY;

  if (ballX < (distanceFromEdge + PADDLE_THICKNESS*2 + 4)
  && ballX > 0){ // player1 side
    if(ballY > paddle1Y &&
       ballY < paddle1Y + PADDLE_HEIGHT){
      ballSpeedX = - ballSpeedX;

      deltaY = ballY - (paddle1Y + (PADDLE_HEIGHT/2));
      ballSpeedY = deltaY * 0.3;
    }
  } else if (ballX > (canvas.width - PADDLE_THICKNESS*2 - 4) && ballX < canvas.width ){ /* player2 side */
    if (ballY > paddle2Y &&
        ballY < paddle2Y + PADDLE_HEIGHT){
      ballSpeedX = - ballSpeedX;

      deltaY = ballY - (paddle2Y + (PADDLE_HEIGHT/2));
      ballSpeedY = deltaY * 0.3;
    }
  } else if(ballX < 0){ //out in player1side, player2 win
      player2Score++;
      ballReset();
  } else if (ballX > canvas.width + 0){
    player1Score++;
    ballReset();
  }

  if (ballY < 0){
    ballSpeedY = - ballSpeedY;

  } else if (ballY > canvas.height){
    ballSpeedY = - ballSpeedY;
  }


}

function drawNet(){
  for (var i = 5; i < canvas.height; i += 38){
    colorRect(canvas.width/2 - 1, i, 2, 20, 'white');
  }
}

function drawEverything(){

  colorRect(0, 0, canvas.width, canvas.height, '#242424'); // ^--Canvas--^
  if (showingWinScreen){
    canvasContext.fillStyle = 'white';
    if (player1Score > player2Score){
      canvasContext.fillText('You won! ' + player1Score +" : " +player2Score, (canvas.width/2 - 50), canvas.height/2.5)

    } else if (player2Score > player1Score){
      canvasContext.fillText('You lost! ' + player1Score +" : " +player2Score, (canvas.width/2 - 50), canvas.height/2.5)
    }

    canvasContext.fillText("click to play again", (canvas.width/2 - 50), canvas.height/1.5);
    return;
  }
  if (menuOptions == 0){

    canvasContext.font = "20px Merriweather"
    canvasContext.fillStyle = '#8be30c';
    canvasContext.fillText("Easy Mode", canvas.width/2 -40, canvas.height/3 + 35);
    canvasContext.strokeStyle = '#14b5fd';
    canvasContext.strokeRect(canvas.width/2 - 120, canvas.height/3, 250, 50);
    canvasContext.rect(canvas.width/2 - 120,                 canvas.height/3, 250, 50);
    // ^--- This is the Upper button ---^
    canvasContext.font = "20px Merriweather"
    canvasContext.fillStyle = '#930fc8';
    canvasContext.fillText("Normal Mode", canvas.width/2 -40, canvas.height/2 + 35);
    canvasContext.strokeStyle = '#14b5fd';
    canvasContext.strokeRect(canvas.width/2 - 120, canvas.height/2, 250, 50);
    canvasContext.rect(canvas.width/2 - 120,                 canvas.height/2, 250, 50);
    // ^--- this is the middle button --- ^
    canvasContext.font = "20px Merriweather"
    canvasContext.fillStyle = 'rgb(174, 0, 0)';
    canvasContext.fillText("Hard Mode", canvas.width/2 -40, canvas.height/1.5 + 35);
    canvasContext.strokeStyle = '#14b5fd';
    canvasContext.strokeRect(canvas.width/2 - 120, canvas.height/1.5, 250, 50);
    canvasContext.rect(canvas.width/2 - 120,                 canvas.height/1.5, 250, 50);
        /*###################################################################################YOU WERE HERE ####################################################*/

      return;
      }
  drawNet();

  colorRect(distanceFromEdge, paddle1Y, PADDLE_THICKNESS, PADDLE_HEIGHT, '#295ec6'); //Left player Paddel ^--Human(?)--^

  colorRect(canvas.width - PADDLE_THICKNESS - distanceFromEdge, paddle2Y, PADDLE_THICKNESS, PADDLE_HEIGHT, '#db3500');// right player Paddle Computer -- ^

  colorCircle(ballX, ballY, 10, 'white'); // Ball
  canvasContext.font = "20px Merriweather"
  canvasContext.fillText(player1Score, 100, 100);
  canvasContext.fillText(player2Score, canvas.width - 100, 100);

}
function drawButton(leftX, topY, width, height, frameColor, text1, textColor){
  canvasContext.font = "20px Merriweather"
  canvasContext.fillStyle = textColor;
  canvasContext.fillText(text1, leftX, topY + 35);
  canvasContext.strokeStyle = 'green';
  canvasContext.strokeRect(leftX, topY, height, width);
  canvasContext.rect(leftX - 120, topY, width, height);
}


function colorRect(leftX, topY, width, height, drawColor){
  canvasContext.fillStyle = drawColor;
  canvasContext.fillRect(leftX, topY, width, height);

}

function colorCircle(centerX, centerY, radius, drawColor,){
  canvasContext.fillStyle = drawColor;
  canvasContext.beginPath();        canvasContext.arc(centerX, centerY, radius, 0, Math.PI*2, true);
  canvasContext.fill();
}
