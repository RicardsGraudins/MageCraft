console.log("Player Ready!");

//sprites
//load sprites & textures
redMage = "static/resources/images/sprites/mage.png";
fireParticle = "static/resources/images/textures/fireParticle.png";
fireEffect = "static/resources/images/sprites/fire.png";
frostEffect = "static/resources/images/sprites/frost.png";
splitterEffect = "static/resources/images/textures/splitter.png";
splitterProjectileEffect = "static/resources/images/sprites/frost2.png";

//create sprite managers - new BABYLON.SpriteManager(name, imageURL, capacity, cellSize, scene)
//name - name for manager
//imageURL - path to png/jpg
//capacity - maximum number of instances in this manager e.g. could create 100 instances of player
//cellSize - corresponds to size of images, typically square size with same width and height, can also be different {width:x, height:y} but generally ends in awkward transitions
//scene - which scene, in this case we're only using 1 scene for the entire game
var spriteManagerPlayerRed = new BABYLON.SpriteManager("playerManager", redMage, 1, 114, scene); //player
var spriteManagerFire = new BABYLON.SpriteManager("fireManager", fireEffect, 1, 190, scene); //fire
var spriteManagerFrost = new BABYLON.SpriteManager("frostManager", frostEffect, 1, 192, scene); //frost
var spriteManagerSplitter = new BABYLON.SpriteManager("splitterManager", splitterProjectileEffect, 8, 192, scene); //splitter projectiles

//create the sprites - new BABYLON.Sprite(name, spriteManager)
var playerSprite = new BABYLON.Sprite("player", spriteManagerPlayerRed);
var fireSprite = new BABYLON.Sprite("fire", spriteManagerFire);
var frostSprite = new BABYLON.Sprite("frost", spriteManagerFrost);
var splitterSprite0 = new BABYLON.Sprite("splitter", spriteManagerSplitter);
var splitterSprite1 = new BABYLON.Sprite("splitter", spriteManagerSplitter);
var splitterSprite2 = new BABYLON.Sprite("splitter", spriteManagerSplitter);
var splitterSprite3 = new BABYLON.Sprite("splitter", spriteManagerSplitter);
var splitterSprite4 = new BABYLON.Sprite("splitter", spriteManagerSplitter);
var splitterSprite5 = new BABYLON.Sprite("splitter", spriteManagerSplitter);
var splitterSprite6 = new BABYLON.Sprite("splitter", spriteManagerSplitter);
var splitterSprite7 = new BABYLON.Sprite("splitter", spriteManagerSplitter);

//increase the size of the sprites
playerSprite.size = 20;
fireSprite.size = 28;
frostSprite.size = 28;
splitterSprite0.size = 24;
splitterSprite1.size = 24;
splitterSprite2.size = 24;
splitterSprite3.size = 24;
splitterSprite4.size = 24;
splitterSprite5.size = 24;
splitterSprite6.size = 24;
splitterSprite7.size = 24;

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
			playerObject.health--;
		}//if
		
		//if the player is on the grid and the size of the fire sprite isn't 0, change it to 0
		//since we can't change alpha of a sprite, the size becomes 0 in order to hide it
		else if(playerObject.onGrid == true && fireSprite.size != 0){
			fireSprite.size = 0;
		}//else if
	}//move
}//fireSpriteHandler

//handles frostbolt animations + frozen status for player
frostSpriteHandler = function(){
	//frostbolt rotating animation
	this.rotate = function(){
		frostSprite.playAnimation(11, 18, true, 50);
	}//rotate
	
	//rotate the sprite towards the direction it is flying
	this.rotateSprite = function(angle){
		frostSprite.angle = angle;
	}//rotateSprite
	
	//move the sprite with the frostbolt hitbox
	this.move = function(){
		frostSprite.position.x = frostbolt.position.x;
		frostSprite.position.y = frostbolt.position.y;
		frostSprite.position.z = frostbolt.position.z;
	}//move
}//frostSpriteHandler

//handles splitter animations
splitterSpriteHandler = function(){
	//set the correct sprite cell
	splitterSprite0.cellIndex = 14;
	splitterSprite1.cellIndex = 14;
	splitterSprite2.cellIndex = 14;
	splitterSprite3.cellIndex = 14;
	splitterSprite4.cellIndex = 14;
	splitterSprite5.cellIndex = 14;
	splitterSprite6.cellIndex = 14;
	splitterSprite7.cellIndex = 14;
	
	//rotate the sprite towards the direction it is flying
	this.rotateSprite = function(angle){
		splitterSprite0.angle = angle;
		splitterSprite1.angle = angle;
		splitterSprite2.angle = angle;
		splitterSprite3.angle = angle;
		splitterSprite4.angle = angle;
		splitterSprite5.angle = angle;
		splitterSprite6.angle = angle;
		splitterSprite7.angle = angle;
	}//rotateSprite
	
	//move the sprites with their respective splitter projectile hitbox
	this.move = function(){
		splitterSprite0.position.x = splitterProjectile0.position.x;
		splitterSprite1.position.x = splitterProjectile1.position.x;
		splitterSprite2.position.x = splitterProjectile2.position.x;
		splitterSprite3.position.x = splitterProjectile3.position.x;
		splitterSprite4.position.x = splitterProjectile4.position.x;
		splitterSprite5.position.x = splitterProjectile5.position.x;
		splitterSprite6.position.x = splitterProjectile6.position.x;
		splitterSprite7.position.x = splitterProjectile7.position.x;
		
		splitterSprite0.position.y = splitterProjectile0.position.y;
		splitterSprite1.position.y = splitterProjectile1.position.y;
		splitterSprite2.position.y = splitterProjectile2.position.y;
		splitterSprite3.position.y = splitterProjectile3.position.y;
		splitterSprite4.position.y = splitterProjectile4.position.y;
		splitterSprite5.position.y = splitterProjectile5.position.y;
		splitterSprite6.position.y = splitterProjectile6.position.y;
		splitterSprite7.position.y = splitterProjectile7.position.y;
		
		splitterSprite0.position.z = splitterProjectile0.position.z;
		splitterSprite1.position.z = splitterProjectile1.position.z;
		splitterSprite2.position.z = splitterProjectile2.position.z;
		splitterSprite3.position.z = splitterProjectile3.position.z;
		splitterSprite4.position.z = splitterProjectile4.position.z;
		splitterSprite5.position.z = splitterProjectile5.position.z;
		splitterSprite6.position.z = splitterProjectile6.position.z;
		splitterSprite7.position.z = splitterProjectile7.position.z;
	}//move
}//splitterSpriteHandler

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
var frostbolt = BABYLON.MeshBuilder.CreateSphere("spell", {diameter: 20, diameterX: 20}, scene);
var splitter = BABYLON.MeshBuilder.CreateSphere("spell", {diameter: 10, diameterX: 10}, scene);

//splitter projectiles
var splitterProjectile0 = BABYLON.MeshBuilder.CreateSphere("spell", {diameter: 5, diameterX: 5}, scene);
var splitterProjectile1 = BABYLON.MeshBuilder.CreateSphere("spell", {diameter: 5, diameterX: 5}, scene);
var splitterProjectile2 = BABYLON.MeshBuilder.CreateSphere("spell", {diameter: 5, diameterX: 5}, scene);
var splitterProjectile3 = BABYLON.MeshBuilder.CreateSphere("spell", {diameter: 5, diameterX: 5}, scene);
var splitterProjectile4 = BABYLON.MeshBuilder.CreateSphere("spell", {diameter: 5, diameterX: 5}, scene);
var splitterProjectile5 = BABYLON.MeshBuilder.CreateSphere("spell", {diameter: 5, diameterX: 5}, scene);
var splitterProjectile6 = BABYLON.MeshBuilder.CreateSphere("spell", {diameter: 5, diameterX: 5}, scene);
var splitterProjectile7 = BABYLON.MeshBuilder.CreateSphere("spell", {diameter: 5, diameterX: 5}, scene);

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
splitterMaterial.emissiveTexture = new BABYLON.Texture(splitterEffect, scene);
splitterMaterial.hasAlpha = true;
splitterMaterial.alpha = 0;
splitter.material = splitterMaterial;

//splitterProjectile material
var splitterProjectileMaterial = new BABYLON.StandardMaterial("splitterProjectileMaterial", scene);
splitterProjectileMaterial.emissiveTexture = new BABYLON.Texture(splitterEffect, scene);
splitterProjectileMaterial.hasAlpha = true;
splitterProjectileMaterial.alpha = 0;

//asign material to splitter projectiles, could reuse splitterMaterial however need to access alpha
//of projectiles seperately from splitter
splitterProjectile0.material = splitterProjectileMaterial;
splitterProjectile1.material = splitterProjectileMaterial;
splitterProjectile2.material = splitterProjectileMaterial;
splitterProjectile3.material = splitterProjectileMaterial;
splitterProjectile4.material = splitterProjectileMaterial;
splitterProjectile5.material = splitterProjectileMaterial;
splitterProjectile6.material = splitterProjectileMaterial;
splitterProjectile7.material = splitterProjectileMaterial;

//splitter highlight
var splitterHighLight = new BABYLON.HighlightLayer("Red-Highlight", scene);

//asign highlight to splitter projectiles
/*
splitterHighLight.addMesh(splitterProjectile0, BABYLON.Color3.White());
splitterHighLight.addMesh(splitterProjectile1, BABYLON.Color3.White());
splitterHighLight.addMesh(splitterProjectile2, BABYLON.Color3.White());
splitterHighLight.addMesh(splitterProjectile3, BABYLON.Color3.White());
splitterHighLight.addMesh(splitterProjectile4, BABYLON.Color3.White());
splitterHighLight.addMesh(splitterProjectile5, BABYLON.Color3.White());
splitterHighLight.addMesh(splitterProjectile6, BABYLON.Color3.White());
splitterHighLight.addMesh(splitterProjectile7, BABYLON.Color3.White());
*/

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

Player = function(x, y, z, speed, onGrid, health){
	this.x = x;
	this.y = y;
	this.z = z;
	this.speed = speed;
	this.onGrid = onGrid;
	this.health = health;
	
	//var player = BABYLON.MeshBuilder.CreateSphere("sphere", {diameter: 20, diameterX: 20}, scene);
	
	//spawning position
	player.setPositionWithLocalVector(new BABYLON.Vector3(x, y, z));
	//fireball.setPositionWithLocalVector(new BABYLON.Vector3(x, y, z));
	//frostbolt.setPositionWithLocalVector(new BABYLON.Vector3(x, y, z));
	//splitter.setPositionWithLocalVector(new BABYLON.Vector3(x, y, z));
	
	//set them off the map instead
	fireball.setPositionWithLocalVector(new BABYLON.Vector3(1000, y, z));
	frostbolt.setPositionWithLocalVector(new BABYLON.Vector3(1000, y, z));
	splitter.setPositionWithLocalVector(new BABYLON.Vector3(1000, y, z));
	
	splitterProjectile0.setPositionWithLocalVector(new BABYLON.Vector3(1000, y, z));
	splitterProjectile1.setPositionWithLocalVector(new BABYLON.Vector3(1000, y, z));
	splitterProjectile2.setPositionWithLocalVector(new BABYLON.Vector3(1000, y, z));
	splitterProjectile3.setPositionWithLocalVector(new BABYLON.Vector3(1000, y, z));
	splitterProjectile4.setPositionWithLocalVector(new BABYLON.Vector3(1000, y, z));
	splitterProjectile5.setPositionWithLocalVector(new BABYLON.Vector3(1000, y, z));
	splitterProjectile6.setPositionWithLocalVector(new BABYLON.Vector3(1000, y, z));
	splitterProjectile7.setPositionWithLocalVector(new BABYLON.Vector3(1000, y, z));
	
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
						
						//once i reaches 150, translation stops
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
					// if the click hits the ground plane
					if (ground.hit) {
						//set spell location to player location - player casting the spell
						frostbolt.position.x = player.position.x;
						frostbolt.position.z = player.position.z;
						frostbolt.position.y = player.position.y;
						
						//x and z cords of mouse click @ ground plane
						gx = ground.pickedPoint.x;
						gz = ground.pickedPoint.z;
						
						//change the angle of the frostSprite depending on which
						//quadrant is clicked
						
						//Upper right quadrant
						if (gz > 0 && gx > 0){
							//console.log("Upper right quadrant")]
							frostSprite.angle = 5.6;
						}//if
						//Upper left quadrant
						else if (gz > 0 && gx < 0){
							//console.log("Upper left quadrant");
							frostSprite.angle = 1.1;
						}//else if
						//Lower right quadrant
						else if (gz < 0 && gx > 0){
							//console.log("Lower right quadrant");
							frostSprite.angle = 3.8;
						}//else
						//Lower left quadrant
						else if (gz < 0 && gx < 0){
							//console.log("Lower left quadrant");
							frostSprite.angle = 2.1;
						}//else if
						
						var direction = new BABYLON.Vector3(gx,21,gz);
						direction.normalize(); //direction now a unit vector
						distance = 2;
						
						var i = 0;
						
						//set frostboltMaterial back to visible
						frostSprite.size = 28;
						
						//once i reaches 150, translation stops
						scene.registerBeforeRender(function () {
							if(i++ < 150){
								//mesh.translate(vector, distance, space)
								//vector = direction the mesh should travel towards
								//distance = speed of the mesh moving
								//space = BABYLON.Space.WORLD / BABYLON.Space.LOCAL - no difference
								frostbolt.translate(direction, distance, BABYLON.Space.WORLD);
								
								//once i reaches 149 make the splitter transparent,
								//move it off the map so it doesn't collide with anyone
								if(i == 149){
									//once the frostbolt changes to this position the frostSprite becomes invisible
									frostbolt.position.x = 1000;
									frostSprite.size = 0;
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
					//set these variables back to false
					movingRight = false;
					movingLeft = false;
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
						
						//switch to true depending on where clicked
						if (splitter.position.x > gx){
							movingLeft = true;
						}//if
						else {
							movingRight = true;
						}//else
						
						//set splitterMaterial to visible and splitterProjectileMaterial to invisable
						splitterMaterial.alpha = 1;
						splitterProjectileMaterial.alpha = 0;
						
						//reset projectile sprites size to 0 - increases to proper size in splitterProjectileAnimation
						splitterSprite0.size = 0;
						splitterSprite1.size = 0;
						splitterSprite2.size = 0;
						splitterSprite3.size = 0;
						splitterSprite4.size = 0;
						splitterSprite5.size = 0;
						splitterSprite6.size = 0;
						splitterSprite7.size = 0;
						
						//once i reaches 50, splitter translation stops and projectile translation begins in the direction of the inital splitter click
						scene.registerBeforeRender(function () {
							if(i++ < 50){
								//mesh.translate(vector, distance, space)
								//vector = direction the mesh should travel towards
								//distance = speed of the mesh moving
								//space = BABYLON.Space.WORLD / BABYLON.Space.LOCAL - no difference
								splitter.translate(direction, distance, BABYLON.Space.WORLD);
								splitter.rotation.y += 0.1;
								
								//once i reaches 49 splitter stops moving and
								//splitter projectiles begin to spawn
								if(i == 49){
									splitterHighLight.addMesh(splitter, BABYLON.Color3.White());
									
									//spawn the projectiles in a particular direction
									//right
									if (movingRight == true){
										splitterProjectile0.position.x = splitter.position.x + 10;
										splitterProjectile1.position.x = splitter.position.x + 10;
										splitterProjectile2.position.x = splitter.position.x + 10;
										splitterProjectile3.position.x = splitter.position.x + 10;
										splitterProjectile4.position.x = splitter.position.x + 10;
										splitterProjectile5.position.x = splitter.position.x + 10;
										splitterProjectile6.position.x = splitter.position.x + 10;
										splitterProjectile7.position.x = splitter.position.x + 10;
										
										splitterProjectile0.position.y = splitter.position.y;
										splitterProjectile1.position.y = splitter.position.y;
										splitterProjectile2.position.y = splitter.position.y;
										splitterProjectile3.position.y = splitter.position.y;
										splitterProjectile4.position.y = splitter.position.y;
										splitterProjectile5.position.y = splitter.position.y;
										splitterProjectile6.position.y = splitter.position.y;
										splitterProjectile7.position.y = splitter.position.y;
										
										splitterProjectile0.position.z = splitter.position.z + 8;
										splitterProjectile1.position.z = splitter.position.z + 16;
										splitterProjectile2.position.z = splitter.position.z + 24;
										splitterProjectile3.position.z = splitter.position.z + 32;
										splitterProjectile4.position.z = splitter.position.z - 8;
										splitterProjectile5.position.z = splitter.position.z - 16;
										splitterProjectile6.position.z = splitter.position.z - 24;
										splitterProjectile7.position.z = splitter.position.z - 32;
										
										//rotate all the sprites
										splitterSpriteObject.rotateSprite(4.75);
									}//if
									//left
									else {
										splitterProjectile0.position.x = splitter.position.x - 8;
										splitterProjectile1.position.x = splitter.position.x - 8;
										splitterProjectile2.position.x = splitter.position.x - 8;
										splitterProjectile3.position.x = splitter.position.x - 8;
										splitterProjectile4.position.x = splitter.position.x - 8;
										splitterProjectile5.position.x = splitter.position.x - 8;
										splitterProjectile6.position.x = splitter.position.x - 8;
										splitterProjectile7.position.x = splitter.position.x - 8;
										
										splitterProjectile0.position.y = splitter.position.y;
										splitterProjectile1.position.y = splitter.position.y;
										splitterProjectile2.position.y = splitter.position.y;
										splitterProjectile3.position.y = splitter.position.y;
										splitterProjectile4.position.y = splitter.position.y;
										splitterProjectile5.position.y = splitter.position.y;
										splitterProjectile6.position.y = splitter.position.y;
										splitterProjectile7.position.y = splitter.position.y;
										
										splitterProjectile0.position.z = splitter.position.z + 8;
										splitterProjectile1.position.z = splitter.position.z + 16;
										splitterProjectile2.position.z = splitter.position.z + 24;
										splitterProjectile3.position.z = splitter.position.z + 32;
										splitterProjectile4.position.z = splitter.position.z - 8;
										splitterProjectile5.position.z = splitter.position.z - 16;
										splitterProjectile6.position.z = splitter.position.z - 24;
										splitterProjectile7.position.z = splitter.position.z - 32;
										
										//rotate all the sprites
										splitterSpriteObject.rotateSprite(1.55);
									}//else
									//start projectile animation
									playerObject.splitterProjectilesAnimation(direction,distance);
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
	
	//handles animation for splitter projectiles
	this.splitterProjectilesAnimation = function(direction, distance){
		//animation control
		var x = 0;
		var z = 0;
		
		//once z reaches 100 splitter projectiles should be fully visible
		scene.registerBeforeRender(function () {
			if (z++ < 100){
				splitter.rotation.y += 0.5;
				
				//every tenth of z
				if (z % 10 == 0){
					//increase alpha by 0.1
					//splitterProjectileMaterial.alpha = splitterProjectileMaterial.alpha + 0.1;
					
					//increase sprite size - ends up as 24
					splitterSprite0.size += 2.4;
					splitterSprite1.size += 2.4;
					splitterSprite2.size += 2.4;
					splitterSprite3.size += 2.4;
					splitterSprite4.size += 2.4;
					splitterSprite5.size += 2.4;
					splitterSprite6.size += 2.4;
					splitterSprite7.size += 2.4;
				}//if
			}//if
		});
		
		//wait 2 seconds
		setTimeout(function() {
			//keep the translation going until x is 49
			scene.registerBeforeRender(function () {
				if (x++ < 50){
					splitterProjectile0.translate(direction, distance, BABYLON.Space.WORLD);
					splitterProjectile1.translate(direction, distance, BABYLON.Space.WORLD);
					splitterProjectile2.translate(direction, distance, BABYLON.Space.WORLD);
					splitterProjectile3.translate(direction, distance, BABYLON.Space.WORLD);
					splitterProjectile4.translate(direction, distance, BABYLON.Space.WORLD);
					splitterProjectile5.translate(direction, distance, BABYLON.Space.WORLD);
					splitterProjectile6.translate(direction, distance, BABYLON.Space.WORLD);
					splitterProjectile7.translate(direction, distance, BABYLON.Space.WORLD);
					splitter.rotation.y += 0.1;
				}//if
				
				//when x is 49 remove the highlight, hide the splitter and move it off the map along with the projectiles
				if (x == 49){
					splitterHighLight.removeMesh(splitter);
					splitterMaterial.alpha = 0;
					splitter.position.x = 1000;
					splitterProjectile0.position.x = 1000;
					splitterProjectile1.position.x = 1000;
					splitterProjectile2.position.x = 1000;
					splitterProjectile3.position.x = 1000;
					splitterProjectile4.position.x = 1000;
					splitterProjectile5.position.x = 1000;
					splitterProjectile6.position.x = 1000;
					splitterProjectile7.position.x = 1000;
					//reset splitter projectile sprites
					splitterSprite0.size = 0;
					splitterSprite1.size = 0;
					splitterSprite2.size = 0;
					splitterSprite3.size = 0;
					splitterSprite4.size = 0;
					splitterSprite5.size = 0;
					splitterSprite6.size = 0;
					splitterSprite7.size = 0;
				}//if
			});//registerBeforeRender
		}, 2000);
	}//splitterProjectilesAnimation
}//Player

//handles cooldowns for spells
spellManager = function(){
	//handles cooldown for fireball
	this.fireballTimer = function(){
		UI.cooldownOn("fireball"); //change spell border to red
		setTimeout(function() {
			fireballCooldown = false;
			console.log(fireballCooldown);
			UI.cooldownOff("fireball"); //change spell border to green
		}, 5000); //cooldown 5 seconds	
	}//fireballTimer
	
	//handles cooldown for frostbolt
	this.frostboltTimer = function(){
		UI.cooldownOn("frostbolt"); //change spell border to red
		setTimeout(function() {
			frostboltCooldown = false;
			console.log(frostboltCooldown);
			UI.cooldownOff("frostbolt"); //change spell border to green
		}, 30000); //cooldown 30 seconds	
	}//frostboltTimer
	
	//handles cooldown for splitter
	this.splitterTimer = function(){
		UI.cooldownOn("splitter"); //change spell border to red
		setTimeout(function() {
			splitterCooldown = false;
			console.log(splitterCooldown);
			UI.cooldownOff("splitter"); //change spell border to green
		}, 25000); //cooldown 25 seconds	
	}//splitterTimer
}//spellManager