const pelletSound = new Audio("pellet.wav");
const startSound = new Audio("start.wav");
const bumpSound = new Audio("bump.wav");

pelletSound.volume = 0.4;
bumpSound.volume = 0.3;

let moveInterval = 200; // milliseconds (higher = slower)
let lastMoveTime = 0;

let bumpFlag = 1;
let pelletCount = 0;

let moneyFlag = 0;
let moneyX = 0;
let moneyY = 0;

//load images
pacmanImg = new Image();
pacmanImg.src = "./pacman1.jpg";

moneyImg = new Image();
moneyImg.src = "./moneyBag.jpg";


const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

const tileSize = 40;
const rows = 10;
const cols = 16;

// 0 = empty, 1 = wall, 2 = pellet, 3 = moneybag
const map = [
  [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
  [1,2,2,2,2,2,2,2,2,2,2,2,2,2,2,1],
  [1,2,1,1,2,1,1,1,2,1,2,1,2,1,2,1],
  [1,2,2,2,2,2,2,1,2,2,2,2,2,2,2,1],
  [1,2,1,2,1,1,2,1,2,1,2,1,2,1,2,1],
  [1,2,2,2,2,2,2,2,2,2,2,2,2,2,2,1],
  [1,2,1,1,2,1,1,1,2,1,2,1,2,1,2,1],
  [1,2,1,1,2,1,1,1,2,2,2,2,2,2,2,1],
  [1,2,2,2,2,2,2,2,2,1,2,1,2,1,2,1],
  [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1]
];

let pacman = {
  x: 1,
  y: 1,
  dx: 0,
  dy: 0,
  score: 0
};

let ghost = {x:8, y:8};

function drawMap() {
  pelletCount = 0;
  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < cols; x++) {

      if (map[y][x] === 1) {
        ctx.fillStyle = "blue";
        ctx.fillRect(x * tileSize, y * tileSize, tileSize, tileSize);
      }

      if (map[y][x] === 2) {
        ctx.fillStyle = "black";
        ctx.beginPath();
        ctx.arc(
          x * tileSize + tileSize / 2,
          y * tileSize + tileSize / 2,
          5,
          0,
          Math.PI * 2
        );
        ctx.fill();
        pelletCount += 1;
        console.log("Pellets left:", pelletCount);
      }
    }
  }

  if (pelletCount == 0){
      console.log("Game over:"); ;
      for (let y = 0; y < rows; y++) {
        for (let x = 0; x < cols; x++) {
    
          if (map[y][x] === 0) {
              map[y][x] = 2;
              pacman.x = 1;
              pacman.y = 1;
              pacman.dx = 0;
              pacman.dy = 0;  

          }
          }
        }
      

  }

}

function drawPacman() {
 // ctx.fillStyle = "yellow";
 // ctx.beginPath();
   //ctx.arc(
 //   pacman.x * tileSize + tileSize / 2,
 //   pacman.y * tileSize + tileSize / 2,
 //   tileSize / 2 - 2,
 //   0,
 //   Math.PI * 2
 // );
 // ctx.fill();

 ctx.drawImage(pacmanImg,
               pacman.x * tileSize ,
               pacman.y * tileSize ,
               tileSize, 
               tileSize);
}

function update(currentTime) {

  // Only move if enough time has passed
  if (currentTime - lastMoveTime < moveInterval) {
    return;
  }

  lastMoveTime = currentTime;

  let nextX = pacman.x + pacman.dx;
  let nextY = pacman.y + pacman.dy;

 
  // Wall collision check
 /* if (map[nextY][nextX] !== 1) {
    pacman.x = nextX;
    pacman.y = nextY;
  } else  {
    bumpSound.currentTime = 20000;
    bumpSound.play();
  }
*/

  

   if (map[nextY][nextX] !== 1) {
    pacman.x = nextX;
    pacman.y = nextY;
    bumpFlag = 0;
   }  
   else if((bumpFlag == 0) && (map[nextY][nextX] == 1))  {
    bumpSound.currentTime = 0;
    bumpSound.play();
    bumpFlag = 1;
  }

  // Eat pellet
  if (map[pacman.y][pacman.x] === 2) {
    map[pacman.y][pacman.x] = 0;
    pacman.score += 10;
    console.log("Score:", pacman.score);

    pelletSound.currentTime = 0; // rewind so it can play quickly again
    pelletSound.play();

  }
  
  if (map[pacman.y][pacman.x] === 3){
      pacman.score +=100;
      map[pacman.y][pacman.x] = 0;
      moneyFlag = 0;
  }




}

let gameStarted = false;

function drawIntroScreen() {

  ctx.fillStyle = "white";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Title
  ctx.fillStyle = "red";
  ctx.font = "bold 55px Arial";
  ctx.textAlign = "center";
  ctx.fillText("THIEF 2026", canvas.width / 2, 100);

  // Simple Pac-Man graphic
  /*ctx.beginPath();
  ctx.arc(
    canvas.width / 2,
    180,
    35,
    0.25 * Math.PI,
    1.75 * Math.PI
  );
  ctx.lineTo(canvas.width / 2, 180);
  ctx.fillStyle = "yellow";
  ctx.fill();
  */

  /*ctx.drawImage(pacmanImg,
    pacman.x * tileSize ,
    pacman.y * tileSize ,
    tileSize, 
    tileSize);
    */
    ctx.drawImage(pacmanImg,
      7 * tileSize ,
      4 * tileSize ,
      tileSize, 
      tileSize);

  // Ghost
  /*
  ctx.fillStyle = "red";
  ctx.beginPath();
  ctx.arc(
    canvas.width / 2 + 80,
    180,
    30,
    Math.PI,
    0
  );
  ctx.lineTo(canvas.width / 2 + 110, 210);
  ctx.lineTo(canvas.width / 2 + 95, 195);
  ctx.lineTo(canvas.width / 2 + 80, 210);
  ctx.lineTo(canvas.width / 2 + 65, 195);
  ctx.lineTo(canvas.width / 2 + 50, 210);
  ctx.closePath();
  ctx.fill();
*/
  ctx.drawImage(moneyImg,
    9 * tileSize ,
    4 * tileSize ,
    tileSize, 
    tileSize);


  // Instructions
  ctx.fillStyle = "blue";
  ctx.font = "22px Arial";
  ctx.fillText(
    "USE ARROW KEYS TO MOVE",
    canvas.width / 2,
    280
  );

  // Start message";
  ctx.fillStyle = "red";
  ctx.font = "bold 24px Arial";
  ctx.fillText(
    "PRESS ANY KEY TO START",
    canvas.width / 2,
    330
  );

  ctx.fillStyle = "white";
  ctx.font = "18px Arial";
  ctx.fillText(
    "Collect the pellets and avoid the ghost!",
    canvas.width / 2,
    365
  );

}


function gameLoop(currentTime) {

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  if (!gameStarted) {

    // Show introduction
    drawIntroScreen();

  } else {

    // -----------------------
    // MAIN PAC-MAN GAME
    // -----------------------

    if (Math.random() < 0.04) {
      updateGhost();
    }

    drawMap();
    update(currentTime);
    drawPacman();
    drawGhost();
    drawScore();
    drawMoney();
  }

  requestAnimationFrame(gameLoop);
}

//let gameStarted = false;

document.addEventListener("keydown", (e) => {
  if (!gameStarted) {
    startSound.play();
    gameStarted = true;
  }

  if (e.key === "ArrowUp") { pacman.dx = 0; pacman.dy = -1; }
  if (e.key === "ArrowDown") { pacman.dx = 0; pacman.dy = 1; }
  if (e.key === "ArrowLeft") { pacman.dx = -1; pacman.dy = 0; }
  if (e.key === "ArrowRight") { pacman.dx = 1; pacman.dy = 0; }
});


function drawScore() {
  ctx.fillStyle = "white";
  ctx.font = "20px Arial";
  ctx.textAlign = "left";
  ctx.fillText("Score: " + pacman.score, 10, 25);
  ctx.fillText("Thief   2026", 10, 380);
}

function drawGhost(){

  ctx.fillStyle="red";
  ctx.beginPath();
  ctx.arc(
      ghost.x*tileSize+tileSize/2,
      ghost.y*tileSize+tileSize/2,
      tileSize/3,
      0,Math.PI*2
  );
  ctx.fill();

}

function canMove(x,y){
  return map[y][x] !== 1;
}

function updateGhost(){

  let dx = pacman.x - ghost.x;
  let dy = pacman.y - ghost.y;

  let moveX = Math.sign(dx);
  let moveY = Math.sign(dy);

  if(Math.abs(dx) > Math.abs(dy)){
      if(canMove(ghost.x + moveX, ghost.y)) ghost.x += moveX;
      else if(canMove(ghost.x, ghost.y + moveY)) ghost.y += moveY;
  } else {
      if(canMove(ghost.x, ghost.y + moveY)) ghost.y += moveY;
      else if(canMove(ghost.x + moveX, ghost.y)) ghost.x += moveX;
  }
}

function drawMoney(){
    if(moneyFlag == 0){
      startSound.currentTime = 0; // rewind so it can play quickly again
      startSound.play();
    }
    if(moneyFlag == 0)
      do{
        moneyY = Math.floor(Math.random() * rows);
        moneyX = Math.floor(Math.random() * cols);

    } while (map[moneyY][moneyX] == 1);

    map[moneyY][moneyX] = 3;
    moneyFlag = 1;
    ctx.drawImage(moneyImg,
      moneyX * tileSize ,
      moneyY * tileSize ,
      tileSize, 
      tileSize);

}


gameLoop();