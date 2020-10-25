var trex, trex_running, trex_collided;
var ground, invisibleGround, groundImage;

var cloud, cloudsGroup, cloudImage;
var PLAY = 1, END = 0;
var gameState = PLAY;
var obstacles, obstaclesGroup;

var newImage, score = 0;

var over,restart
var overimage, restartimage

var checkPoint, jumping, dieSound

var highScore=[0];


function preload(){
  trex_running = loadAnimation("trex1.png","trex3.png","trex4.png");
  trex_collided = loadAnimation("trex_collided.png");
  
  groundImage = loadImage("ground2.png");
  
  cloudImage = loadImage("cloud.png");
  
  obstacle1 = loadImage("obstacle1.png");
  obstacle2 = loadImage("obstacle2.png");
  obstacle3 = loadImage("obstacle3.png");
  obstacle4 = loadImage("obstacle4.png");
  obstacle5 = loadImage("obstacle5.png");
  obstacle6 = loadImage("obstacle6.png");
  
  overimage = loadImage("gameOver.png");
  
  restartimage = loadImage("restart.png");
  
  checkPoint=loadSound("checkPoint.mp3");
  dieSound=loadSound("die.mp3");
  jumping=loadSound("jump.mp3");
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  //windowWidth windowHeight

  console.log(height)
  trex = createSprite(50,height-30,20,50);
  trex.addAnimation("running", trex_running);
  trex.addAnimation("collided",trex_collided)
  trex.scale = 0.5;
  //trex.debug = true
  trex.setCollider("circle",0,0,35);
  //shape, xoffset,yoffset,width, height
  
  ground = createSprite(200,height-20,400,20);
  ground.addImage("ground",groundImage);
  ground.x = ground.width /2;
  ground.velocityX = -4;
  
  invisibleGround = createSprite(200,height-10,400,10);
  invisibleGround.visible = false;
  
  obstaclesGroup = createGroup();

  cloudsGroup = createGroup(); 
  
  over= createSprite(width/2,height/2 - 50,20,20);
  over.addImage("game over",overimage);
  over.scale=0.7;
  
  restart= createSprite(width/2,height/2,20,20);
  restart.addImage("restart game",restartimage);
  restart.scale=0.5;
  
  Cbox = createCheckbox("Activate AI");
  Cbox.position(20,15);
}

function draw() {
  background(180);
  text("score: " + score,width-100,20);
  text("HighScore: " + max(highScore), width-200,20);  
  
  if(gameState === PLAY){
    
    if(Cbox.checked()){
     trex.setCollider("rectangle",20,0,120,100)
    // trex.debug = true;
     if(trex.isTouching(obstaclesGroup)){
        trex.velocityY = -10;
        jumping.play();
        }
  } else{
      trex.setCollider("circle",0,0,40);
       
      if(trex.isTouching(obstaclesGroup)){
        gameState = END;
        dieSound.play();
      }
    
     }
    
    if(frameCount % 3 === 0){
      score = score + 1
    }
    
    restart.visible=false;
    over.visible=false;
    // for touch devices
    if((keyDown("space") || touches.length > 0)&& trex.y >= height-100 ) {
      trex.velocityY = -10;
      touches = []
      jumping.play();
    }
    trex.velocityY = trex.velocityY + 0.8
    
    
    if (ground.x < 0){
      ground.x = ground.width/2;
    }
    
    if(score % 200 === 0){
       
       checkPoint.play();
       }
   
       ground.velocityX = - (4+ score/100)
       
    
    spawnClouds();
  
    SpawnObstacle();
    
  }else if(gameState === END){
    
    ground.velocityX= 0;
    trex.velocityY= 0;
    
    
    obstaclesGroup.setVelocityXEach(0); 
    cloudsGroup.setVelocityXEach(0);
    trex.changeAnimation("collided",trex_collided)
    obstaclesGroup.setLifetimeEach(-1)
    cloudsGroup.setLifetimeEach(-1)
    
    restart.visible=true;
    over.visible=true;
    
    if(mousePressedOver(restart)){
       reset();
       }
  }
  
  
  trex.collide(invisibleGround);
  
  //spawn the clouds
  
  
  drawSprites();
}

function spawnClouds() {
  //write code here to spawn the clouds
  if (frameCount % 60 === 0) {
   var cloud = createSprite(600,100,40,10);
    cloud.addImage(cloudImage)
    cloud.y = Math.round(random(10,60))
    cloud.scale = 0.4;
    cloud.velocityX = -3;
    
    cloudsGroup.add(cloud);
    //assigning lifetime to the variable
    cloud.lifetime = 200
    
    //adjust the depth
    cloud.depth = trex.depth
    trex.depth = trex.depth + 1;
    }
}

function SpawnObstacle(){
 if (frameCount % 60 === 0) {
   var obstacle=createSprite(width,height-30,40,10);
  obstacle.velocityX = - (4+ score/100);
   
  switch(Math.round(random(1,6))){
    case 1:  obstacle.addImage(obstacle1);
      break;
    case 2:  obstacle.addImage(obstacle2);
      break;
    case 3:  obstacle.addImage(obstacle3);
      break;
    case 4:  obstacle.addImage(obstacle4);
      break;
    case 5:  obstacle.addImage(obstacle5);
      break;
    case 6:  obstacle.addImage(obstacle6);
      break;
    default: break;
        }
   obstacle.scale=0.5
   obstaclesGroup.add(obstacle);
   obstacle.lifetime = width/obstacle.velocityX;
 }
}

function reset(){
  gameState = PLAY;
  highScore.push(score);
  score=0;
  trex.changeAnimation("running", trex_running);
  obstaclesGroup.destroyEach();
  cloudsGroup.destroyEach();
  ground.velocityX= -4;
}