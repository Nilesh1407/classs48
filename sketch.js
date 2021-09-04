var PLAY = 1;
var END = 0;
var gameState = PLAY;

var girl, girl_running, girl_collided;
var ground, invisibleGround, groundImage;
var background,backgroundImage;

var coinsGroup, coinImage;
var obstaclesGroup, obstacle1, obstacle2, obstacle3, obstacle4, obstacle5, obstacle6;

var score;
var gameOverImg,restartImg
var jumpSound , checkPointSound, dieSound

function preload(){
  girl_running = loadAnimation("girl1.png","girl2.png","girl5.png","girl4.png","girl3.png");
  //trex_collided = loadAnimation("trex_collided.png");
  
  groundImage = loadImage("Brick.png");
  backgroundImage = loadImage("background.png");
  coinImage = loadImage("coin.png");
  
  obstacle1 = loadImage("pipe1.png");
  obstacle2 = loadImage("pipe2.png");
  obstacle3 = loadImage("pipe3.png");
  obstacle4 = loadImage("pipe4.png");
  //obstacle5 = loadImage("obstacle5.png");
  //obstacle6 = loadImage("obstacle6.png");
  
  restartImg = loadImage("restart.png")
  gameOverImg = loadImage("gameOver.png")
  
  jumpSound = loadSound("jump.mp3")
  dieSound = loadSound("die.mp3")
  //checkPointSound = loadSound("checkPoint.mp3")
}

function setup() {
  createCanvas(1000, 400);

  var message = "This is a message";
 console.log(message)
  
  girl = createSprite(254,285,20,50);
  girl.addAnimation("running", girl_running);
  //trex.addAnimation("collided", trex_collided);
  

  girl.scale = 0.5;
  
  ground = createSprite(0,380,2000,5);
  ground.addImage("ground",groundImage);
  ground.x = ground.width /2;


  gameOver = createSprite(500,70);
  gameOver.addImage(gameOverImg);
  
  restart = createSprite(500,170);
  restart.addImage(restartImg);
  
 
  gameOver.scale = 0.5;
  restart.scale = 0.5;
  
  invisibleGround = createSprite(254,300,400,10);
  invisibleGround.visible = false;

  
  //create Obstacle and Cloud Groups
  obstaclesGroup = createGroup();
  coinsGroup = createGroup();

  
  girl.setCollider("rectangle",0,0,girl.width,girl.height);
  //girl.debug = true
  
  score = 0;
  
}

function draw() {
  
  background(backgroundImage);
  //displaying score
  textSize(30)
  fill("red")
  text("Score: "+ score, 850,50);
  

  text(mouseX+","+mouseY,mouseX,mouseY)
  
  
  if(gameState === PLAY){

    gameOver.visible = false;
    restart.visible = false;
    
    ground.velocityX = -(4 + 3* score/100)
    //scoring
    //score = score + Math.round(getFrameRate()/60);
    
   
    
    if (ground.x < 0){
      ground.x = ground.width/2;
    }
    if(coinsGroup.isTouching(girl)){
      score=score+1;
      coinsGroup[0].destroy();

    }
    
    //jump when the space key is pressed
    if(keyDown("space") && girl.collide(invisibleGround)) {
        girl.velocityY = -20;
        jumpSound.play();
    }
    
    //add gravity
    girl.velocityY = girl.velocityY + 0.8
  
    //spawn the clouds
    spawnCoins();
  
    //spawn obstacles on the ground
    spawnObstacles();
    
    if(obstaclesGroup.isTouching(girl)){
        //trex.velocityY = -12;
        jumpSound.play();
        gameState = END;
        dieSound.play()
      
    }
  }
   else if (gameState === END) {
      gameOver.visible = true;
      restart.visible = true;
     
     
    if(mousePressedOver(restart)) {
      reset();
    }
     //change the trex animation
     //trex.changeAnimation("collided", girl_collided);
     
      ground.velocityX = 0;
      girl.velocityY = 0
      
     
      //set lifetime of the game objects so that they are never destroyed
    obstaclesGroup.setLifetimeEach(-1);
    coinsGroup.setLifetimeEach(-1);
     
     obstaclesGroup.setVelocityXEach(0);
     coinsGroup.setVelocityXEach(0);    
   }
  
 
  //stop trex from falling down
  girl.collide(invisibleGround);
  
  
    


  drawSprites();
}

function reset(){
  gameState=PLAY;
  gameOver.visible=false
  restart.visible=false
  obstaclesGroup.destroyEach();
  coinsGroup.destroyEach();
  girl.changeAnimation("running", girl_running);
  score=0

}


function spawnObstacles(){
 if (frameCount % 60 === 0){
   var obstacle = createSprite(1050,250,10,40);
   obstacle.velocityX = -(6 + score/100);
   
   
    //generate random obstacles
    var rand = Math.round(random(1,4));
    switch(rand) {
     case 1: obstacle.addImage(obstacle1);
              break;
      case 2: obstacle.addImage(obstacle2);
              break;
      case 3: obstacle.addImage(obstacle3);
              break;
      case 4: obstacle.addImage(obstacle4);
              break;
     //case 5: obstacle.addImage(obstacle5);
              break;
      //case 6: obstacle.addImage(obstacle6);
              break;
     default: break;
    }
   
    //assign scale and lifetime to the obstacle           
    obstacle.scale = 1;
    obstacle.lifetime = 300;
   
   //add each obstacle to the group
    obstaclesGroup.add(obstacle);
    obstacle.depth = ground.depth;
    ground.depth = ground.depth + 1;
 }
}

function spawnCoins() {
  //write code here to spawn the clouds
  if (frameCount % 60 === 0) {
    var coin = createSprite(600,120,40,10);
    coin.y = Math.round(random(90,150));
    coin.addImage(coinImage);
    coin.scale = 0.1;
    coin.velocityX = -3;
    
     //assign lifetime to the variable
     coin.lifetime = 200;
    
    //adjust the depth
    coin.depth = girl.depth;
    girl.depth = girl.depth + 1;
    
    //add each cloud to the group
    coinsGroup.add(coin);
  }
  
}

