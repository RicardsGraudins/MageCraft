console.log("Game Ready!")

//init player grid
//4 player map
var grid = new playerGrid(-200, 10, 250, 25, 25, 16);
//example of 8 player map
//var grid = new playerGrid(-200,10,250, 25,25,32);

//draw the grid
grid.drawParameter();
grid.drawGrid();
//grid.testingMaterial();
grid.setTextures();
grid.fadeOutAnimation();
//grid.boundaryTest();
grid.createGround();

//player object
var playerObject = new Player(0, 80, 0, 1, true, 150);

//handles spell cooldowns for player
var spellManagerPlayer = new spellManager();

//sprites
var playerSpriteObject = new playerSpriteHandler(); //dont forget to adjust hitbox size
var fireSpriteObject = new fireSpriteHandler();

fireSpriteObject.onLava(); //start the animation and just have it going endlessly

//parameters: name, position, scene  
var camera = new BABYLON.FollowCamera("followPlayerCam", new BABYLON.Vector3(0, 350, -300), scene);
//lockedTarget must be a mesh and its .lockedTarget for version 2.5 onwards not .target
camera.lockedTarget = player;
//the goal distance of camera from target
camera.radius = 350;
//the goal height of camera above local origin (centre) of target
camera.heightOffset = 350;
//acceleration of camera in moving from current to goal position
camera.cameraAcceleration = 0;

//the speed at which acceleration is halted 
camera.maxCameraSpeed = 0;
//the goal rotation of camera around local origin (centre) of target in x y plane
camera.rotationOffset = 0;
//dont allow the player to move the camera
//camera.attachControl(canvas,true);

//test
//camera.noRotationConstraint=true;
//camera.upVector = new BABYLON.Vector3(0, 3, 3);

var UI = new playerUI();
UI.startingPosition();
UI.testingMaterial();
UI.setTextures();
UI.setHeartTextures();
UI.setBorders();

var gold = 0;

//engine.resize();
//UI.updateStatus("Frozen!", "blue");

frostSpriteObject = new frostSpriteHandler();

//start the animation
frostSpriteObject.rotate();

splitterSpriteObject = new splitterSpriteHandler();

fireballSpriteObject = new fireballSpriteHandler();

//render loop 60 fps, render the scene
engine.runRenderLoop(function(){
	background.render();
	
	if (playerObject.health != 200){
		playerObject.move();
		playerObject.playerOnGrid();
		playerObject.castFireball();
		playerObject.castFrostbolt();
		playerObject.castSplitter();
		playerObject.castRecharger();
		playerObject.castMoltonBoulder();
		playerSpriteObject.move();
		fireSpriteObject.move();
		frostSpriteObject.move();
		splitterSpriteObject.move();
		fireballSpriteObject.move();
		UI.move();
		UI.updateHealth(playerObject.health);	
	}//if
	else {
		playerSpriteObject.dead();
	}//else
	
	fpsLabel.innerHTML = engine.getFps().toFixed() + " FPS";
});

//run this function every 3 seconds
setInterval(function(){ 
	//if the player is alive increment gold
	if (playerObject.health != 0){
		gold++;
		UI.updateGold(gold);
	} //if
}, 3000);