console.log("Player Ready!");

//sprites
//load sprites & textures
redMage = "static/resources/images/sprites/mage.png";
fireParticle = "static/resources/images/textures/fireParticle.png";
fireEffect = "static/resources/images/sprites/fire.png";

//create sprite managers - new BABYLON.SpriteManager(name, imageURL, capacity, cellSize, scene)
//name - name for manager
//imageURL - path to png/jpg
//capacity - maximum number of instances in this manager e.g. could create 100 instances of player
//cellSize - corresponds to size of images, typically square size with same width and height, can also be different {width:x, height:y} but generally ends in awkward transitions
//scene - which scene, in this case we're only using 1 scene for the entire game
var spriteManagerPlayerRed = new BABYLON.SpriteManager("playerManager", redMage, 1, 114, scene); //player
var spriteManagerFire = new BABYLON.SpriteManager("fireManager", fireEffect, 1, 190, scene); //fire

//create the sprites - new BABYLON.Sprite(name, spriteManager)
var playerSprite = new BABYLON.Sprite("player", spriteManagerPlayerRed);
var fireSprite = new BABYLON.Sprite("fire", spriteManagerFire);

//increase the size of the sprites
playerSprite.size = 20;
fireSprite.size = 28;

//boolean to control moving animation
var moving = false;
//boolean to control fireball cooldown - can only cast once every 5 seconds
var fireballCooldown = false;
//boolean to control frostbolt cooldown - can only cast once every 30 seconds
var frostboltCooldown = false;
//boolean to control splitter cooldown - can only cast once every 25 seconds
var splitterCooldown = false;

//booleans to track if a certain spell is selected
//false until a spell is selected by keybind - once selected can cast by clicking
var fireballSelected = false;
var frostboltSelected = false;
var splitterSelected = false;

//handles sprite animations for the player
playerSpriteHandler = function(){
	//play this animation when the player is dead
	this.dead = function(){
		playerSprite.stopAnimation();
		playerSprite.playAnimation(51, 53, true, 150);
	}//dead
	
	//play this animation when the character is moving
	this.run = function(){
			playerSprite.playAnimation(0, 5, true, 80);
			moving = true;
			setTimeout(function() {
				playerSprite.stopAnimation();
				moving = false;
			}, 500); //bit of a moonwalk if switching from left to right mid animation and vice versa
	}//run
	
	//play this animation when taking damage
	this.damage = function(){
		playerSprite.stopAnimation();
		playerSprite.playAnimation(35, 38, true, 150);
	}//damage
	
	//play this animation during spawn
	this.landing = function(){
		playerSprite.playAnimation(24, 26, true, 150);
	}//landing
	
	//play this animation when casting a spell
	this.spell1 = function(){
		playerSprite.stopAnimation();
		playerSprite.playAnimation(15, 17, true, 150);
	}//spell1
	
	//play this animation when casting a different spell
	this.spell2 = function(){
		playerSprite.stopAnimation();
		playerSprite.playAnimation(47, 50, true, 150);
	}//spell2
	
	//make the sprite face left
	this.faceLeft = function(){
		playerSprite.invertU = 0;
	}//faceLeft
	
	//make the sprite face right
	this.faceRight = function(){
		playerSprite.invertU = 1;
	}//faceRight
	
	//have the sprite move with the player at all times
	this.move = function(){
		playerSprite.position.x = player.position.x;
		playerSprite.position.y = player.position.y;
		playerSprite.position.z = player.position.z;
		
		//have the camera move with the player hitbox at all times
		//this elimates the awkward rotations & acceleration using the follow camera
		camera.position.x = player.position.x;
		camera.position.z = player.position.z - 350;
		//note: to have an actual follow camera on a moving mesh the camera position must be the same as
		//the mesh it is following e.g. camera.position.x = player.position.x would place the camera directly
		//above the player and follow the player, in this case we take away a value from camera.position.z
		//to have the camera follow the player at an angle, if the camera position is only set to a vector
		//the camera will sit at that location and rotate its view towards its locked target(mesh)
	}//move
}//playerSpriteHandler

//handles fire animations for player
fireSpriteHandler = function(){
	//player steps on lava animation
	this.onLava = function(){
		fireSprite.playAnimation(3, 4, true, 140);
	}//onLava
	
	//have the sprite move with the player
	this.move = function(){
		//only move the fireSprite with the player if the player is off the grid
		if (playerObject.onGrid == false){
			//if the size of the fire sprite is 0 change it to its original size
			if(fireSprite.size == 0){
				fireSprite.size = 28;
			}//if
			fireSprite.position.x = player.position.x - 1; // - 1 to have it more centered
			fireSprite.position.y = player.position.y - 1; // - 1 to have it a bit behind the player sprite
			fireSprite.position.z = player.position.z;
		}//if
		
		//if the player is on the grid and the size of the fire sprite isn't 0, change it to 0
		//since we can't change alpha of a sprite, the size becomes 0 in order to hide it
		else if(playerObject.onGrid == true && fireSprite.size != 0){
			fireSprite.size = 0;
		}//else if
	}//move
}//fireSpriteHandler

//the keycodes that will be mapped when a user presses a button
KEY_CODES = {
  65: 'left',
  87: 'up',
  68: 'right',
  83: 'down'
}//KEY_CODES

//creates the array to hold the KEY_CODES and sets all their values to false 
//checking true/flase is the quickest way to check status
//of a key press and which one was pressed when determining
//when to move and which direction
KEY_STATUS = {};
for (code in KEY_CODES) {
  KEY_STATUS[ KEY_CODES[ code ]] = false;
}//for

//sets up the document to listen to onkeydown events (fired when
//any key on the keyboard is pressed down) when a key is pressed,
//it sets the appropriate direction to true to let us know which key it was
 
document.onkeydown = function(e) {
  //firefox and opera use charCode instead of keyCode to return which key was pressed
  var keyCode = (e.keyCode) ? e.keyCode : e.charCode;
  if (KEY_CODES[keyCode]) {
	e.preventDefault();
	KEY_STATUS[KEY_CODES[keyCode]] = true;
  }//if
}//onkeydown

//sets up the document to listen to ownkeyup events (fired when
//any key on the keyboard is released). When a key is released,
//it sets the appropriate direction to false to let us know which key it was
document.onkeyup = function(e) {
  var keyCode = (e.keyCode) ? e.keyCode : e.charCode;
  if (KEY_CODES[keyCode]) {
	e.preventDefault();
	KEY_STATUS[KEY_CODES[keyCode]] = false;
  }//if
}//onkeyup

//the idea was to cast spells @ players mouse location however with the way the game view is set up
//the mouse trackers are way off the mark and are in fact more suited to 2D games, to get around the issue
//but still have the spells be aimed using mouse location we set up the ground (transparent plane 2000x2000 - sits on top of lava)
//to be clickable - once clicked we get (x,y,z) cords of the mouse and fire the spell towards that location

//left the mouse tracking code - may still be used later

//0 and 0 since width and height are both 100%
//var topPos = canvas.offsetTop;
//var leftPos = canvas.offsetLeft;

//track the player's mouse location using jQuery
/*
$( 'canvas' ).mousemove(function( event ) {
  clientCoords = "( " + event.clientX + ", " + event.clientY + " )";
  mouseX = event.clientX;
  mouseY = event.clientY;
  $( "#playerCords" ).text(clientCoords);
});
*/

//track the player's mouse location using DOM with babylonjs scene pointers
/*
window.addEventListener("mousemove", function (event) {
	clientCoords = "( " + scene.pointerX + ", " + scene.pointerY + " )";
	mouseX = scene.pointerX;
	mouseY = scene.pointerY;	
	$( "#playerCords" ).text(clientCoords);
});
*/

//DOM listen to event click on canvas
/*
document.getElementById("myCanvas").addEventListener("click", function (event) {
	console.log("click on canvas at position " + (event.clientX) + ", " + (event.clientY));
}, false);
*/

//set up an action manager
scene.actionManager = new BABYLON.ActionManager(scene);
//register a few actions (keybinds) and execute functions using a trigger - acts as a spell cycle i.e. select the spell to cast and then click where to fire
//register action to select fireball
scene.actionManager.registerAction(
    new BABYLON.ExecuteCodeAction(
        {
            trigger: BABYLON.ActionManager.OnKeyUpTrigger,
            parameter: '1'
        },
        function () {
			console.log("Fireball is selected!");
			frostboltSelected = false;
			splitterSelected = false;
			fireballSelected = true;
		}//function
    )//ExecuteCodeAction - 1
);//registerAction

//register action to select frostbolt
scene.actionManager.registerAction(
    new BABYLON.ExecuteCodeAction(
        {
            trigger: BABYLON.ActionManager.OnKeyUpTrigger,
            parameter: '2'
        },
        function () {
			console.log("Frostbolt is selected!");
			fireballSelected = false;
			splitterSelected = false;
			frostboltSelected = true;
		}//function
    )//ExecuteCodeAction - 2
);//registerAction

//register action to select splitter
scene.actionManager.registerAction(
    new BABYLON.ExecuteCodeAction(
        {
            trigger: BABYLON.ActionManager.OnKeyUpTrigger,
            parameter: '3'
        },
        function () {
			console.log("Splitter is selected!");
			fireballSelected = false;
			frostboltSelected = false;
			splitterSelected = true;
		}//function
    )//ExecuteCodeAction - 3
);//registerAction

//track cords - player.getPositionExpressedInLocalSpace();
var player = BABYLON.MeshBuilder.CreateSphere("sphere", {diameter: 20, diameterX: 20}, scene);
var fireball = BABYLON.MeshBuilder.CreateSphere("spell", {diameter: 10, diameterX: 10}, scene);
var frostbolt = BABYLON.MeshBuilder.CreateSphere("spell", {diameter: 10, diameterX: 10}, scene);
var splitter = BABYLON.MeshBuilder.CreateSphere("spell", {diameter: 10, diameterX: 10}, scene);

//assign transparent material to the player sphere - acts as hitbox
//playerSprite moves with the hitbox - same (x,y,z) at all times
//note that the hitbox is currently larger than the sprite for testing ***
var playerMaterial = new BABYLON.StandardMaterial("playerMaterial", scene);
playerMaterial.wireframe = true;
playerMaterial.alpha = 0.01;
player.material = playerMaterial;

//asign material to fireball with fire texture - fire_procedural_texture.js
var fireballMaterial = new BABYLON.StandardMaterial("fireballMaterial", scene);
var fireTexture = new BABYLON.FireProceduralTexture("fireTexture", 256, scene);
fireballMaterial.diffuseTexture = fireTexture;
fireballMaterial.opacityTexture = fireTexture;
fireballMaterial.hasAlpha = true;
fireballMaterial.alpha = 0;
fireball.material = fireballMaterial;

//asign material to frostbolt
var frostboltMaterial = new BABYLON.StandardMaterial("frostboltMaterial", scene);
frostboltMaterial.hasAlpha = true;
frostboltMaterial.alpha = 0;
frostbolt.material = frostboltMaterial;

//asign material to splitter
var splitterMaterial = new BABYLON.StandardMaterial("splitterMaterial", scene);
splitterMaterial.hasAlpha = true;
splitterMaterial.alpha = 0;
splitter.material = splitterMaterial;

//particles for fireball using 2 ParticleSystems
//---------------------------------------------------------------------------------------------
//smoke particles

//particle system for smoke particles
var smokeSystem = new BABYLON.ParticleSystem("fireParticles", 1000, scene);

//assign texture to each particle
smokeSystem.particleTexture = new BABYLON.Texture(fireParticle, scene);

//the object from which particles spawn from
smokeSystem.emitter = fireball;

//all particles starting from vector...to vector
smokeSystem.minEmitBox = new BABYLON.Vector3(-0.5, 1, -0.5);
smokeSystem.maxEmitBox = new BABYLON.Vector3(0.5, 1, 0.5);

//colors of all particles (split into 2 specific colors before dispose)
smokeSystem.color1 = new BABYLON.Color4(0.1, 0.1, 0.1, 1.0);
smokeSystem.color2 = new BABYLON.Color4(0.1, 0.1, 0.1, 1.0);
smokeSystem.colorDead = new BABYLON.Color4(0, 0, 0, 0.0);

//size of each particles - random
smokeSystem.minSize = 5;
smokeSystem.maxSize = 8;

//life time of each particle - random
smokeSystem.minLifeTime = 0.3;
smokeSystem.maxLifeTime = 1.5;

//emite rate
smokeSystem.emitRate = 350;			

//blend mode : BLENDMODE_ONEONE, or BLENDMODE_STANDARD - to do with source color and alpha
smokeSystem.blendMode = BABYLON.ParticleSystem.BLENDMODE_ONEONE;

//gravity of all particles
smokeSystem.gravity = new BABYLON.Vector3(0, 0, 0);

//direction of each particle after emitted - random
smokeSystem.direction1 = new BABYLON.Vector3(-1.5, 8, -1.5);
smokeSystem.direction2 = new BABYLON.Vector3(1.5, 8, 1.5);

//angular speed, can define z-axis rotation for each particle in radians
smokeSystem.minAngularSpeed = 0;
smokeSystem.maxAngularSpeed = Math.PI;

//speed and strength of emitting particles and the overall motion speed
smokeSystem.minEmitPower = 0.5;
smokeSystem.maxEmitPower = 1.5;
smokeSystem.updateSpeed = 0.005;

//start emitting the particles
//smokeSystem.start();
//---------------------------------------------------------------------------------------------
//fire particles

//particle system for fire particles
var fireSystem = new BABYLON.ParticleSystem("particles", 2000, scene);

//assign texture to each particle
fireSystem.particleTexture = new BABYLON.Texture(fireParticle, scene);

//the object from which particles spawn from
fireSystem.emitter = fireball;

//all particles starting from vector...to vector
fireSystem.minEmitBox = new BABYLON.Vector3(-0.5, 1, -0.5);
fireSystem.maxEmitBox = new BABYLON.Vector3(0.5, 1, 0.5);

//colors of all particles (split into 2 specific colors before dispose)
fireSystem.color1 = new BABYLON.Color4(50, 0.5, 0, 1.0);
fireSystem.color2 = new BABYLON.Color4(50, 0.5, 0, 1.0);
fireSystem.colorDead = new BABYLON.Color4(0, 0, 0, 0.0);

//size of each particles - random
fireSystem.minSize = 5;
fireSystem.maxSize = 8;

//life time of each particle - random
fireSystem.minLifeTime = 0.2;
fireSystem.maxLifeTime = 0.4;

//emite rate
fireSystem.emitRate = 600;

//blend mode : BLENDMODE_ONEONE, or BLENDMODE_STANDARD - to do with source color and alpha
fireSystem.blendMode = BABYLON.ParticleSystem.BLENDMODE_ONEONE;

//gravity of all particles
fireSystem.gravity = new BABYLON.Vector3(0, 0, 0);

//direction of each particle after emitted - random
fireSystem.direction1 = new BABYLON.Vector3(0, 4, 0);
fireSystem.direction2 = new BABYLON.Vector3(0, 4, 0);

//angular speed, can define z-axis rotation for each particle in radians
fireSystem.minAngularSpeed = 0;
fireSystem.maxAngularSpeed = Math.PI;

//speed and strength of emitting particles and the overall motion speed
fireSystem.minEmitPower = 1;
fireSystem.maxEmitPower = 3;
fireSystem.updateSpeed = 0.007;

//start emitting the particles
//fireSystem.start();
//---------------------------------------------------------------------------------------------

Player = function(x, y, z, speed, onGrid){
	this.x = x;
	this.y = y;
	this.z = z;
	this.speed = speed;
	this.onGrid = onGrid;
	
	//var player = BABYLON.MeshBuilder.CreateSphere("sphere", {diameter: 20, diameterX: 20}, scene);
	
	//spawning position
	player.setPositionWithLocalVector(new BABYLON.Vector3(x, y, z));
	fireball.setPositionWithLocalVector(new BABYLON.Vector3(x, y, z));
	frostbolt.setPositionWithLocalVector(new BABYLON.Vector3(x, y, z));
	splitter.setPositionWithLocalVector(new BABYLON.Vector3(x, y, z));
	
	//playerSprite.setPositionWithLocalVector(new BABYLON.Vector3(x, y, z)); //cannot use this function with sprites
	playerSprite.position.x = x;
	playerSprite.position.y = y;
	playerSprite.position.z = z;
	
	//apply physics - giving it a mass so that drops to the ground, restitution = 0 meaning no bounce
	player.physicsImpostor = new BABYLON.PhysicsImpostor(player, BABYLON.PhysicsImpostor.SphereImpostor, { mass: 1, restitution: 0 }, scene);
	
	//change player position on button press, note: using z for up/down instead of y
	this.move = function(){
		if (KEY_STATUS.left || KEY_STATUS.right ||
			KEY_STATUS.down || KEY_STATUS.up) {
			
			//move left
			if (KEY_STATUS.left) {
				//console.log("left");
				player.position.x -= speed;
				if(moving == false){ //make the sprite face left and play the run animation
					playerSpriteObject.faceLeft();
					playerSpriteObject.run();
				}//if
				if (player.position.x < boundaryLeft){
					//console.log("over left!")
					if (playerObject.onGrid == true){
						playerObject.onGrid = false;
						//console.log("no longer on grid!")
					}//inner inner if
				}//inner if
			}//if
			
			//move right
			if (KEY_STATUS.right) {
				//console.log("right");
				player.position.x += speed;
				if(moving == false){ //make the sprite face right and play the run animation
					playerSpriteObject.faceRight();
					playerSpriteObject.run();
				}//if
				if (player.position.x > boundaryRight){
					//console.log("over right!")
					if (playerObject.onGrid == true){
						playerObject.onGrid = false;
						//console.log("no longer on grid!")
					}//inner inner if
				}//inner if
			}//if	
			
			//move up
			if (KEY_STATUS.up) {
				//console.log("up");
				player.position.z += speed;
				if(moving == false){ //play the run animation
					//playerSpriteObject.faceLeft();
					playerSpriteObject.run();
				}//if
				if (player.position.z > boundaryTop){
					//console.log("over top!")
					if (playerObject.onGrid == true){
						playerObject.onGrid = false;
						//console.log("no longer on grid!")
					}//inner inner if
				}//inner if
			}//if
			
			//move down
			if (KEY_STATUS.down) {
				//console.log("down");
				player.position.z -= speed;
				if(moving == false){ //play the run animation
					//playerSpriteObject.faceLeft();
					playerSpriteObject.run();
				}//if
				if (player.position.z < boundaryBottom){
					//console.log("over bottom!")
					if (playerObject.onGrid == true){
						playerObject.onGrid = false;
						//console.log("no longer on grid!")
					}//inner inner if
				}//inner if
			}//if
		}//if
	}//move
	
	//when the player goes off the grid we set onGrid to false in the above move function,
	//here we check if onGrid is == false, if it false - keep checking if the player is within all the set boundaries,
	//once the player is within all boundaries set onGrid to true
	this.playerOnGrid = function(){
		if(playerObject.onGrid == false){
			if(player.position.x > boundaryLeft && player.position.x < boundaryRight && player.position.z < boundaryTop && player.position.z > boundaryBottom){
				playerObject.onGrid = true;
			}//if
		}//if
	}//playerOnGrid
	//create ground functions moved to their proper scripts - background & player_grid
	
	//handles animations for casting fireball
	this.castFireball = function(){
		//if fireball is selected:
		if (fireballSelected == true){
			//once player clicks on the ground - cast the spell
			scene.onPointerDown = function (evt, ground) {
				//if fireballCooldown == false, player can cast fireball
				if (fireballCooldown == false){
					//set fireballCooldown to true
					fireballCooldown = true;
					//start fireballTimer, after 5 seconds set fireballCooldown to false
					spellManagerPlayer.fireballTimer();
					//start particle systems
					smokeSystem.start();
					fireSystem.start();
					// if the click hits the ground plane
					if (ground.hit) {
						//set spell location to player location - player casting the spell
						fireball.position.x = player.position.x;
						fireball.position.z = player.position.z;
						fireball.position.y = player.position.y;
						
						//x and z cords of mouse click @ ground plane
						gx = ground.pickedPoint.x;
						gz = ground.pickedPoint.z;
						
						var direction = new BABYLON.Vector3(gx,21,gz);
						direction.normalize(); //direction now a unit vector
						distance = 2;
						
						var i = 0;
						
						//set fireballMaterial back to visible
						fireballMaterial.alpha = 1;
						
						//once i reaches 150, tranlation stops
						scene.registerBeforeRender(function () {
							if(i++ < 150){
								//mesh.translate(vector, distance, space)
								//vector = direction the mesh should travel towards
								//distance = speed of the mesh moving
								//space = BABYLON.Space.WORLD / BABYLON.Space.LOCAL - no difference
								fireball.translate(direction, distance, BABYLON.Space.WORLD);
								
								//once i reaches 149 make the fireball transparent,
								//move it off the map so it doesn't collide with anyone and switch off particle systems
								if(i == 149){
									fireball.position.x = 1000;
									fireballMaterial.alpha = 0;
									smokeSystem.stop();
									fireSystem.stop();
								}//if
							}//if
						});
						
					}//if
					else {
						console.log("Clicked outside the map!");
					}//else
				}//if - fireballCooldown
				else {
					console.log("Fireball is on cooldown || is not selected!");
				}//else
			};//onPointerDown
		}//if fireball is selected
	}//castFireball
	
	//handles animations for casting frostbolt
	this.castFrostbolt = function(){
		//if frostbolt is selected:
			if (frostboltSelected == true){
			//once player clicks on the ground - cast the spell
			scene.onPointerDown = function (evt, ground) {
				//if frostboltCooldown == false, player can cast frostbolt
				if (frostboltCooldown == false){
					//set frostboltCooldown to true
					frostboltCooldown = true;
					//start frostboltTimer, after 30 seconds set frostboltCooldown to false
					spellManagerPlayer.frostboltTimer();
					//start particle systems here
					//
					//
					// if the click hits the ground plane
					if (ground.hit) {
						//set spell location to player location - player casting the spell
						frostbolt.position.x = player.position.x;
						frostbolt.position.z = player.position.z;
						frostbolt.position.y = player.position.y;
						
						//x and z cords of mouse click @ ground plane
						gx = ground.pickedPoint.x;
						gz = ground.pickedPoint.z;
						
						var direction = new BABYLON.Vector3(gx,21,gz);
						direction.normalize(); //direction now a unit vector
						distance = 2;
						
						var i = 0;
						
						//set frostboltMaterial back to visible
						frostboltMaterial.alpha = 1;
						
						//once i reaches 150, tranlation stops
						scene.registerBeforeRender(function () {
							if(i++ < 150){
								//mesh.translate(vector, distance, space)
								//vector = direction the mesh should travel towards
								//distance = speed of the mesh moving
								//space = BABYLON.Space.WORLD / BABYLON.Space.LOCAL - no difference
								frostbolt.translate(direction, distance, BABYLON.Space.WORLD);
								
								//once i reaches 149 make the splitter transparent,
								//move it off the map so it doesn't collide with anyone and switch off particle systems
								if(i == 149){
									frostbolt.position.x = 1000;
									frostboltMaterial.alpha = 0;
									//smokeSystem.stop();
									//fireSystem.stop();
								}//if
							}//if
						});
						
					}//if
					else {
						console.log("Clicked outside the map!");
					}//else
				}//if - frostboltCooldown
				else {
					console.log("Frostbolt is on cooldown || is not selected!");
				}//else
			};//onPointerDown
		}//if frostbolt is selected
	}//castFrostbolt
	
	//handles animations for casting splitter
	this.castSplitter = function(){
		//if splitter is selected:
			if (splitterSelected == true){
			//once player clicks on the ground - cast the spell
			scene.onPointerDown = function (evt, ground) {
				//if splitterCooldown == false, player can cast splitter
				if (splitterCooldown == false){
					//set splitterCooldown to true
					splitterCooldown = true;
					//start splitterTimer, after 25 seconds set splitterCooldown to false
					spellManagerPlayer.splitterTimer();
					//start particle systems here
					//
					//
					// if the click hits the ground plane
					if (ground.hit) {
						//set spell location to player location - player casting the spell
						splitter.position.x = player.position.x;
						splitter.position.z = player.position.z;
						splitter.position.y = player.position.y;
						
						//x and z cords of mouse click @ ground plane
						gx = ground.pickedPoint.x;
						gz = ground.pickedPoint.z;
						
						var direction = new BABYLON.Vector3(gx,21,gz);
						direction.normalize(); //direction now a unit vector
						distance = 2;
						
						var i = 0;
						
						//set splitterMaterial back to visible
						splitterMaterial.alpha = 1;
						
						//once i reaches 80, tranlation stops
						scene.registerBeforeRender(function () {
							if(i++ < 80){
								//mesh.translate(vector, distance, space)
								//vector = direction the mesh should travel towards
								//distance = speed of the mesh moving
								//space = BABYLON.Space.WORLD / BABYLON.Space.LOCAL - no difference
								splitter.translate(direction, distance, BABYLON.Space.WORLD);
								
								//once i reaches 79 make the splitter transparent,
								//move it off the map so it doesn't collide with anyone and switch off particle systems
								if(i == 79){
									splitter.position.x = 1000;
									splitterMaterial.alpha = 0;
									//smokeSystem.stop();
									//fireSystem.stop();
								}//if
							}//if
						});
						
					}//if
					else {
						console.log("Clicked outside the map!");
					}//else
				}//if - splitterCooldown
				else {
					console.log("Splitter is on cooldown || is not selected!");
				}//else
			};//onPointerDown
		}//if splitter is selected
	}//castSplitter
}//Player

//handles cooldowns for spells
spellManager = function(){
	//handles cooldown for fireball
	this.fireballTimer = function(){
		setTimeout(function() {
			fireballCooldown = false;
			console.log(fireballCooldown);
		}, 5000); //cooldown 5 seconds	
	}//fireballTimer
	
	//handles cooldown for frostbolt
	this.frostboltTimer = function(){
		setTimeout(function() {
			frostboltCooldown = false;
			console.log(frostboltCooldown);
		}, 30000); //cooldown 30 seconds	
	}//frostboltTimer
	
	//handles cooldown for splitter
	this.splitterTimer = function(){
		setTimeout(function() {
			splitterCooldown = false;
			console.log(splitterCooldown);
		}, 25000); //cooldown 25 seconds	
	}//splitterTimer
}//spellManager