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
var playerObject = new Player(0, 30, 0, 1, true, 150);

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

warlockMarkSpriteObject = new warlockMarkSpriteHandler();

//audio assets
var gameAudio = new Audio("static/resources/sounds/game_music.mp3");
var playerDiedAudio = new Audio("static/resources/sounds/died.mp3");
var explosionAudio = new Audio("static/resources/sounds/explosion.wav");

//looping audio
gameAudio.loop = true;
playerDiedAudio.loop = true;

//play game audio
gameAudio.play();
var musicEnabled = true;

//--------------------
var enemyUno = new fireElemental(0,21,150,10,2);
var enemyDos = new fireElemental(0,21,-150,10,2);
enemyUno.startingLocation();
enemyDos.startingLocation();
//--------------------

//render loop 60 fps, render the scene
engine.runRenderLoop(function(){
	background.render();
	
	if (playerObject.health > 0){
		playerObject.move();
		playerObject.playerOnGrid();
		playerObject.castFireball();
		playerObject.castFrostbolt();
		playerObject.castSplitter();
		playerObject.castRecharger();
		playerObject.castMoltonBoulder();
		playerObject.castWarlockMark();
		playerObject.castDeflectionShield();
		playerObject.castCauterize();
		playerSpriteObject.move();
		fireSpriteObject.move();
		frostSpriteObject.move();
		splitterSpriteObject.move();
		fireballSpriteObject.move();
		warlockMarkSpriteObject.movePlane();
		UI.move();
		UI.updateHealth(playerObject.health);;
		enemyUno.move();
		enemyDos.move();
		enemyUno.playerCollision();
		enemyDos.playerCollision();
	}//if
	else {
		playerDied();
	}//else
	
	fpsLabel.innerHTML = engine.getFps().toFixed() + " FPS";
});

//run this function when the player dies:
//we terminate the existing engine loop and start up a new one while
//the player is dead which runs fewer functions and limits what the player can do i.e.
//we don't want the player moving or casting spells while dead - in order to exit this loop
//the player can quit to the main menu or click on restart and both options are available through
//the gameOver menu
playerDied = function(){
	engine.stopRenderLoop();
	gameOver(); //display the gameOver menu
	
	//start the loop
	engine.runRenderLoop(function(){
		playerSpriteObject.dead(); //death animation loop
		background.render(); //continue running the scene
	});
}//playerDied

//run this function when the player hits the restart button on the game over menu
playerRestarted = function(){
	player.position.x = 0;
	player.position.y = 80;
	player.position.z = 0;
	playerObject.health = 150;
	//reset: UI, cooldowns, starting positions of every mesh, sprites etc.
	
	//start up a new engine loop
	engine.runRenderLoop(function(){
		background.render();
		
		if (playerObject.health > 0){
			playerObject.move();
			playerObject.playerOnGrid();
			playerObject.castFireball();
			playerObject.castFrostbolt();
			playerObject.castSplitter();
			playerObject.castRecharger();
			playerObject.castMoltonBoulder();
			playerObject.castWarlockMark();
			playerObject.castDeflectionShield();
			playerObject.castCauterize();
			playerSpriteObject.move();
			fireSpriteObject.move();
			frostSpriteObject.move();
			splitterSpriteObject.move();
			fireballSpriteObject.move();
			warlockMarkSpriteObject.movePlane();
			UI.move();
			UI.updateHealth(playerObject.health);	
		}//if
		else {
			playerDied();
		}//else
		
		fpsLabel.innerHTML = engine.getFps().toFixed() + " FPS";
	});
}//playerRestarted

//resumes the game from paused state
resumeGame = function(){
	engine.runRenderLoop(function(){
		background.render();
		
		if (playerObject.health > 0){
			playerObject.move();
			playerObject.playerOnGrid();
			playerObject.castFireball();
			playerObject.castFrostbolt();
			playerObject.castSplitter();
			playerObject.castRecharger();
			playerObject.castMoltonBoulder();
			playerObject.castWarlockMark();
			playerObject.castDeflectionShield();
			playerObject.castCauterize();
			playerSpriteObject.move();
			fireSpriteObject.move();
			frostSpriteObject.move();
			splitterSpriteObject.move();
			fireballSpriteObject.move();
			warlockMarkSpriteObject.movePlane();
			UI.move();
			UI.updateHealth(playerObject.health);	
		}//if
		else {
			playerDied();
		}//else
		
		fpsLabel.innerHTML = engine.getFps().toFixed() + " FPS";
	});
}//resumeGame

//run this function every 3 seconds
setInterval(function(){ 
	//if the player is alive increment gold
	if (playerObject.health > 0){
		gold++;
		UI.updateGold(gold);
	} //if
}, 3000);