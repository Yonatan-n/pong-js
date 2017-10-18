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
var WINNING_SCORE = 5; //this shold be 3? anyway more than 1
var showingWinScreen = false;
// my additions
var menuOptions = 0; //var for menu creation
var distanceFromEdge = 12;
var keyPressedIs = 27; // 27 : ESC, 49 : '1', 50 : '2', 51 : '3'
var computerSpeed = 5;
var FPS = 30/60; //original is 30fps, this variable is to help keep the values about the same speed
var level = 0;
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

function rectObstacle(leftX, topY, width, height, color) {
  colorRect(leftX, topY, width, height, color);
  if ((ballX >= leftX && ballX <= leftX + 0 || ballX >= leftX + width - 0 && ballX <= leftX + width)
  && ( ballY >= topY + 0 && ballY <= topY + height )) {
    ballSpeedX = -1 * ballSpeedX;

  } else if (ballY >= topY + 0 && ballY <= topY + height + 0 && (ballX >= leftX -5 && ballX <= leftX +width +5) ) {
    ballSpeedY = -1 * ballSpeedY;

  /*
  if ((ballX > leftX && ballX < leftX +3 || ballX > leftX+width -3 &&  ballX < leftX + width)
  &&( ballY > topY +3 && ballY < topY  || ballY < topY + height -3 && ballY > ballY + height )) {
    ballSpeedX = -1 * ballSpeedX;
  } else if (ballY > topY -3 && ballY < topY + height +3
  && ballX > leftX -3 && ballX < leftX + width +3) {
    ballSpeedY = -1 * ballSpeedY;
    */
  }
}

function showLevel(){
  canvasContext.fillStyle = 'white';
  canvasContext.fillText("Level : " + level, (canvas.width/2 -80), canvas.height/2/3 -75);

}

function levelOne() {
  //colorRect(canvas.height/2 +100 -10,canvas.width/2 - 200,20,200,"red");
  //rectObstacle(canvas.height/2 +100 -10,canvas.width/2 - 200,20,200,"red");
    rectObstacle(canvas.width/2 -10, canvas.height/2 -100, 20, 200, "red")
  }

function levelTwo() {
  //colorRect(canvas.height/2,300,50,400,"green");
  rectObstacle(canvas.height/2,300,50,400,"green");
}

function levelThree() {
  rectObstacle(canvas.width/2 -10, canvas.height/2 -250, 20, 150, "#a25069");
  rectObstacle(canvas.width/2 -10, canvas.height -250, 20, 150, "#a25069");

}
function levelFour(){
  rectObstacle(canvas.width/2 -150, canvas.height/2 -75, 300, 150, "#cdb84a");

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
    level = 0;
  } else if(keyPressedIs == 52) {
    menuOptions = 3;
    ballSpeedX = 20 * FPS;
    ballSpeedY = 11 * FPS;
    computerSpeed = 11 * FPS;
    WINNING_SCORE = 10000;
  } else if(keyPressedIs == 32){
    //spacebar  show help
    menuOptions = 444;
  //  ballSpeedY = 0;
    //ballSpeedX = 0; // this is pretty ugly and not well written...
    //helpMenu();
  } else if (level == 5) {
    //ballSpeedX = 0;
    //ballSpeedY = 0;
  }
  console.log(keyPressedIs);
  event.preventDefault();
});
function handleMouseClick(evt) {
  if (showingWinScreen){
    if(player1Score > player2Score) {level++;} //level up!

    player1Score = 0;
    player2Score = 0;
    showingWinScreen = false;
  }
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

function ballReset(X = -15, Y){
  if (player1Score >= WINNING_SCORE ||
      player2Score >= WINNING_SCORE){
    showingWinScreen = true;

  }
  // X and Y are from center
  X = -150;
  Y = 100;
  ballSpeedX = -1 * ballSpeedX;
  ballSpeedY = 0;
  ballX = canvas.width / 2 + X; //the -15 make sure the ball wont get sutck in the obstecals
  ballY = canvas.height / 2 + Y;
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
  if (showingWinScreen || menuOptions == 0 || level == 5 || menuOptions == 444){
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
      canvasContext.fillText("Click to play the next level!", (canvas.width/2 - 90), canvas.height/1.5);

    } else if (player2Score > player1Score){
      canvasContext.fillText('You lost! ' + player1Score +" : " +player2Score, (canvas.width/2 - 50), canvas.height/2.5)
      canvasContext.fillText("Click to replay the level!", (canvas.width/2 - 90), canvas.height/1.5);

    }
    return;
  }
  if (menuOptions == 0) {

    canvasContext.font = "20px Merriweather"
    canvasContext.fillStyle = '#8be30c';
    canvasContext.fillText("Press 1 - Easy Mode", canvas.width/2 -80, canvas.height/3 + 35);
    canvasContext.strokeStyle = '#14b5fd';
    canvasContext.strokeRect(canvas.width/2 - 120, canvas.height/3, 250, 50);
    canvasContext.rect(canvas.width/2 - 120,                 canvas.height/3, 250, 50);
    // ^--- This is the Upper button ---^
    canvasContext.font = "20px Merriweather"
    canvasContext.fillStyle = '#930fc8';
    canvasContext.fillText("Press 2 -Normal Mode", canvas.width/2 -80, canvas.height/2 + 35);
    canvasContext.strokeStyle = '#14b5fd';
    canvasContext.strokeRect(canvas.width/2 - 120, canvas.height/2, 250, 50);
    canvasContext.rect(canvas.width/2 - 120,                 canvas.height/2, 250, 50);
    // ^--- this is the middle button --- ^
    canvasContext.font = "20px Merriweather"
    canvasContext.fillStyle = 'rgb(174, 0, 0)';
    canvasContext.fillText("Press 3 - Hard Mode", canvas.width/2 -80, canvas.height/1.5 + 35);
    canvasContext.strokeStyle = '#14b5fd';
    canvasContext.strokeRect(canvas.width/2 - 120, canvas.height/1.5, 250, 50);
    canvasContext.rect(canvas.width/2 - 120,                 canvas.height/1.5, 250, 50);
    //#### press 4 for endless 1000; actully//// / / // // /
    canvasContext.font = "20px Merriweather"
    canvasContext.fillStyle = 'rgb(215, 75, 164)';
    canvasContext.fillText("Press Space - Help", canvas.width/2 -80, canvas.height/5 + 35);
    canvasContext.strokeStyle = '#14b5fd';
    canvasContext.strokeRect(canvas.width/2 - 120, canvas.height/5, 250, 50);
    canvasContext.rect(canvas.width/2 - 120, canvas.height/5, 250, 50);


    //// help ///////
        /*###################################################################################YOU WERE HERE ####################################################*/


      return;
    } else if (menuOptions == 444) {
      canvasContext.font = "20px Merriweather";
      canvasContext.fillStyle = 'white';
      canvasContext.fillText("Press 1 for Easy mode", 100, 100);
      canvasContext.fillText("Press 2 for Normal mode", 100, 150);
      canvasContext.fillText("Press 3 for Hard mode", 100, 200);
      canvasContext.fillText("Get 5 points to win a level", 100, 250);
      canvasContext.fillText("Press Escape for main menu", 100, 300);
      return;
    } else if (level == 5){
      canvasContext.font = "20px Merriweather";
      canvasContext.fillStyle = 'white';
      canvasContext.fillText("You won!", 100, 100);
      canvasContext.fillText("Nice job!", 100, 150);
      canvasContext.fillText("Press Escape to go back to the main menu", 100, 200);
      canvasContext.fillText("and to play again", 100, 250);
      canvasContext.fillText("yeah...", 100, 300);
      return;
    }
  drawNet();

  if (level == 1) {
      levelOne();
  } else if (level == 2) {
    levelTwo();
  } else if (level == 3){
    levelThree();
  } else if(level == 4) {
    levelFour();// not working yet dude//
  }

  colorRect(distanceFromEdge, paddle1Y, PADDLE_THICKNESS, PADDLE_HEIGHT, '#295ec6'); //Left player Paddel ^--Human(?)--^

  colorRect(canvas.width - PADDLE_THICKNESS - distanceFromEdge, paddle2Y, PADDLE_THICKNESS, PADDLE_HEIGHT, '#db3500');// right player Paddle Computer -- ^

  colorCircle(ballX, ballY, 10, 'white'); // Ball
  canvasContext.font = "20px Merriweather"
  canvasContext.fillText(player1Score, 100, 100);
  canvasContext.fillText(player2Score, canvas.width - 100, 100);
  showLevel();
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
