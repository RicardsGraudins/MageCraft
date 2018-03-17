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

//dragon(x, y, z, health, speed, sprite, spriteMove, frozen)
var dragonsLeft = {};
var howManyDragons = 10;
var xPos = -1150;
var zPos = 300;
var spriteId = 0;
var spriteIdToString = spriteId.toString();

//initializing dragonsLeft on the left side of the map
for (i = 0; i < howManyDragons; i++){
	dragonsLeft[i] = new dragon(xPos, YLIMIT, zPos, 10, 2, "red", spriteIdToString, false);
	zPos -= 50;
	xPos = getRandomInt(-1150, -800);
	spriteId++;
	spriteIdToString = spriteId.toString();
	dragonsLeft[i].startingLocation();
}//for

var dragonsRight = {};
xPos = 1150;
zPos = 300;

//initializing dragonsRight on the right side of the map
for (i = 0; i < howManyDragons; i++){
	dragonsRight[i] = new dragon(xPos, YLIMIT, zPos, 10, 2, "red", spriteIdToString, false);
	zPos -= 50;
	xPos = getRandomInt(1150, 800);
	spriteId++;
	spriteIdToString = spriteId.toString();
	dragonsRight[i].startingLocation();
}//for

var dragonsTop = {};
xPos = 0;
zPos = 1050;

//initializing dragonsTop on the top side of the map
for (i = 0; i < howManyDragons; i++){
	dragonsTop[i] = new dragon(xPos, YLIMIT, zPos, 10, 2, "red", spriteIdToString, false);
	zPos -= 50;
	xPos = getRandomInt(-300, 300);
	spriteId++;
	spriteIdToString = spriteId.toString();
	dragonsTop[i].startingLocation();
}//for

var dragonsBottom = {};
xPos = 0;
zPos = -700;

//initializing dragonsBottom on the bottom side of the map
for (i = 0; i < howManyDragons; i++){
	dragonsBottom[i] = new dragon(xPos, YLIMIT, zPos, 10, 2, "red", spriteIdToString, false);
	zPos -= 50;
	xPos = getRandomInt(-300, 300);
	spriteId++;
	spriteIdToString = spriteId.toString();
	dragonsBottom[i].startingLocation();
}//for

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

		//
		for (i = 0; i < howManyDragons; i++){
			dragonsLeft[i].onMap();
			dragonsLeft[i].move();
			dragonsLeft[i].moveRed();
			dragonsLeft[i].playerCollision();
			dragonsLeft[i].fireballCollision();
			dragonsLeft[i].frostboltCollision();
			dragonsLeft[i].splitterCollision();
			dragonsLeft[i].splitterProjectile0Collision();
			dragonsLeft[i].splitterProjectile1Collision();
			dragonsLeft[i].splitterProjectile2Collision();
			dragonsLeft[i].splitterProjectile3Collision();
			dragonsLeft[i].splitterProjectile4Collision();
			dragonsLeft[i].splitterProjectile5Collision();
			dragonsLeft[i].splitterProjectile6Collision();
			dragonsLeft[i].splitterProjectile7Collision();
			dragonsLeft[i].rechargerCollision();
			dragonsLeft[i].moltonBoulderCollision();
			dragonsLeft[i].warlockMarkCollision();
			dragonsLeft[i].deflectionShieldCollision();
			dragonsLeft[i].dead();
			
			dragonsRight[i].onMap();
			dragonsRight[i].move();
			dragonsRight[i].moveRed();
			dragonsRight[i].playerCollision();
			dragonsRight[i].fireballCollision();
			dragonsRight[i].frostboltCollision();
			dragonsRight[i].splitterCollision();
			dragonsRight[i].splitterProjectile0Collision();
			dragonsRight[i].splitterProjectile1Collision();
			dragonsRight[i].splitterProjectile2Collision();
			dragonsRight[i].splitterProjectile3Collision();
			dragonsRight[i].splitterProjectile4Collision();
			dragonsRight[i].splitterProjectile5Collision();
			dragonsRight[i].splitterProjectile6Collision();
			dragonsRight[i].splitterProjectile7Collision();
			dragonsRight[i].rechargerCollision();
			dragonsRight[i].moltonBoulderCollision();
			dragonsRight[i].warlockMarkCollision();
			dragonsRight[i].deflectionShieldCollision();
			dragonsRight[i].dead();
			
			dragonsTop[i].onMap();
			dragonsTop[i].move();
			dragonsTop[i].moveRed();
			dragonsTop[i].playerCollision();
			dragonsTop[i].fireballCollision();
			dragonsTop[i].frostboltCollision();
			dragonsTop[i].splitterCollision();
			dragonsTop[i].splitterProjectile0Collision();
			dragonsTop[i].splitterProjectile1Collision();
			dragonsTop[i].splitterProjectile2Collision();
			dragonsTop[i].splitterProjectile3Collision();
			dragonsTop[i].splitterProjectile4Collision();
			dragonsTop[i].splitterProjectile5Collision();
			dragonsTop[i].splitterProjectile6Collision();
			dragonsTop[i].splitterProjectile7Collision();
			dragonsTop[i].rechargerCollision();
			dragonsTop[i].moltonBoulderCollision();
			dragonsTop[i].warlockMarkCollision();
			dragonsTop[i].deflectionShieldCollision();
			dragonsTop[i].dead();
			
			dragonsBottom[i].onMap();
			dragonsBottom[i].move();
			dragonsBottom[i].moveRed();
			dragonsBottom[i].playerCollision();
			dragonsBottom[i].fireballCollision();
			dragonsBottom[i].frostboltCollision();
			dragonsBottom[i].splitterCollision();
			dragonsBottom[i].splitterProjectile0Collision();
			dragonsBottom[i].splitterProjectile1Collision();
			dragonsBottom[i].splitterProjectile2Collision();
			dragonsBottom[i].splitterProjectile3Collision();
			dragonsBottom[i].splitterProjectile4Collision();
			dragonsBottom[i].splitterProjectile5Collision();
			dragonsBottom[i].splitterProjectile6Collision();
			dragonsBottom[i].splitterProjectile7Collision();
			dragonsBottom[i].rechargerCollision();
			dragonsBottom[i].moltonBoulderCollision();
			dragonsBottom[i].warlockMarkCollision();
			dragonsBottom[i].deflectionShieldCollision();
			dragonsBottom[i].dead();
		}//for
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