/* this script contains the tutorial AI for the game which includes code for creating the AI, all the collision detection associated with
* the AI and the player, AI movement and various AI sprite animations
* note that the tutorial AI is not meant to be difficult to beat or be actively trying to murder the player, it is simply here as a replacement
* for multiplayer which demonstrates the various concepts that would be used in multiplayer i.e. collision detection, animations etc. 
*/

/*
* y axis limitation, meshes/objects shouldn't go above or below this value:
* the ideal way of enforcing objects to stay grounded is to use cannon.js physics i.e.
* mesh.physicsImpostor = new BABYLON.PhysicsImpostor(mesh, BABYLON.PhysicsImpostor.SphereImpostor, { mass: 1, restitution: 0 }, scene);
* add a mass to each object and let gravity do the rest which works fine for the player
* however the difference between the player and everything else is that the player moves using
* user input whereas everything else (spells, enemies) use translation which ignores mass and makes the objects fly to the destination
* and then drop down due to gravity on top of that point which isn't optimal for tracking collision therefore YLIMIT is enforced on all moving objects
*/
var YLIMIT = 21;

//damage dealt to enemy on hit
var FIREBALL_DAMAGE = 5;
var FROSTBOLT_DAMAGE = 5;
var SPLITTER_DAMAGE = 5;
var SPLITTER_PROJECTILE_DAMAGE = 3;
var RECHARGER_DAMAGE = 5;
var MOLTON_BOULDER_DAMAGE = 10;

//load enemy sprites
//intended to use more than one dragon sprite and have an attack animation however due to poorly spaced sprite sheets and the amount of time it takes to edit
//these sprite sheets we will simply be using the red dragon sprite however the dragon function is coded up in such a way that it isn't difficult to add a different
//sprite for the dragon that functions properly, all it takes is having the proper sprite sheet and creating a sprite manager for the sprite within the dragon function
redDragonSprite = "static/resources/images/sprites/red_dragon.png";

//abstract enemy - not used to its fullest extent but does provide an idea of the functions each enemy should possess
//if there was another enemy other than dragon type e.g. a zombie - both the dragon and the zombie enemies could inherit certain
//functions from enemy (dragon.prototype = enemy; zombie.prototype = enemy;) i.e. both the zombie and the dragon need to track
//fireball collision (among other things) - if the fireball hits the enemy take damage
function enemy(){
	this.startingLocation = function(){}
	this.move = function(){}
	this.playerCollision = function(){}
	this.fireballCollision = function(){}
	this.frostboltCollision = function(){}
	this.splitterCollision = function(){};
	this.splitterProjectile0Collision = function(){};
	this.splitterProjectile1Collision = function(){};
	this.splitterProjectile2Collision = function(){};
	this.splitterProjectile3Collision = function(){};
	this.splitterProjectile4Collision = function(){};
	this.splitterProjectile5Collision = function(){};
	this.splitterProjectile6Collision = function(){};
	this.splitterProjectile7Collision = function(){};
	this.rechargerCollision = function(){};
	this.moltonBoulderCollision  = function(){};
	this.warlockMarkCollision = function(){};
	this.deflectionShieldCollision = function(){};
}//enemy

//sprite manager for frozen animation - when the dragon gets hit by frostbolt
//only need 1 sprite for this animation since only 1 dragon can be frozen at a time
var spriteManagerFrozen = new BABYLON.SpriteManager("frostManager", frostEffect, 1, 192, scene);
var frozenSprite = new BABYLON.Sprite("spell", spriteManagerFrozen);
//adjust sprite settings
frozenSprite.cellIndex = 20;
frozenSprite.size = 40;
frozenSprite.position.x = 1000;
frozenSprite.position.y = YLIMIT;
frozenSprite.position.z = 0;

//using a different sprite manager for the dragon burning the frost animation since the sprite sheet is poorly spaced - need
//different width & height for several frames, only need 1 sprite for this animation since only 1 dragon can be frozen at a time
//and only 1 dragon can burn the frost away at a time
var spriteManagerRedDragonBurn = new BABYLON.SpriteManager("red dragon", redDragonSprite, 1, {width:191.1, height:118}, scene);
//create the sprite itself
var spriteBurn = new BABYLON.Sprite("red dragon", spriteManagerRedDragonBurn);
//adjust sprite settings
spriteBurn.size = 35;
spriteBurn.playAnimation(28, 31, true, 150);
spriteBurn.position.x = 1000;
spriteBurn.position.y = YLIMIT;
spriteBurn.position.z = 0;

//sprite manager for dragon death animation, once again using a different sprite manager since the sprite sheet is poorly spaced and
//requires different width & height for several frames
var spriteManagerRedDragonDeath = new BABYLON.SpriteManager("red dragon", redDragonSprite, 10, {width:119.33, height:123}, scene);
//create the sprite itself
var spriteDeath = new BABYLON.Sprite("red dragon", spriteManagerRedDragonDeath);
//adjust sprite settings
spriteDeath.size = 35;
spriteDeath.cellIndex = 64;
//spriteDeath.playAnimation(64, 69, false, 150);
spriteDeath.position.x = 1000;
spriteDeath.position.y = YLIMIT;
spriteDeath.position.z = 0;

//spriteDeath 1-10
var spriteDeath1 = new BABYLON.Sprite("red dragon", spriteManagerRedDragonDeath);
spriteDeath1.size = 35;
spriteDeath1.cellIndex = 64;
spriteDeath1.position.x = 1000;
spriteDeath1.position.y = YLIMIT;
spriteDeath1.position.z = 0;

var spriteDeath2 = new BABYLON.Sprite("red dragon", spriteManagerRedDragonDeath);
spriteDeath2.size = 35;
spriteDeath2.cellIndex = 64;
spriteDeath2.position.x = 1000;
spriteDeath2.position.y = YLIMIT;
spriteDeath2.position.z = 0;

var spriteDeath3 = new BABYLON.Sprite("red dragon", spriteManagerRedDragonDeath);
spriteDeath3.size = 35;
spriteDeath3.cellIndex = 64;
spriteDeath3.position.x = 1000;
spriteDeath3.position.y = YLIMIT;
spriteDeath3.position.z = 0;

var spriteDeath4 = new BABYLON.Sprite("red dragon", spriteManagerRedDragonDeath);
spriteDeath4.size = 35;
spriteDeath4.cellIndex = 64;
spriteDeath4.position.x = 1000;
spriteDeath4.position.y = YLIMIT;
spriteDeath4.position.z = 0;

var spriteDeath5 = new BABYLON.Sprite("red dragon", spriteManagerRedDragonDeath);
spriteDeath5.size = 35;
spriteDeath5.cellIndex = 64;
spriteDeath5.position.x = 1000;
spriteDeath5.position.y = YLIMIT;
spriteDeath5.position.z = 0;

var spriteDeath6 = new BABYLON.Sprite("red dragon", spriteManagerRedDragonDeath);
spriteDeath6.size = 35;
spriteDeath6.cellIndex = 64;
spriteDeath6.position.x = 1000;
spriteDeath6.position.y = YLIMIT;
spriteDeath6.position.z = 0;

var spriteDeath7 = new BABYLON.Sprite("red dragon", spriteManagerRedDragonDeath);
spriteDeath7.size = 35;
spriteDeath7.cellIndex = 64;
spriteDeath7.position.x = 1000;
spriteDeath7.position.y = YLIMIT;
spriteDeath7.position.z = 0;

var spriteDeath8 = new BABYLON.Sprite("red dragon", spriteManagerRedDragonDeath);
spriteDeath8.size = 35;
spriteDeath8.cellIndex = 64;
spriteDeath8.position.x = 1000;
spriteDeath8.position.y = YLIMIT;
spriteDeath8.position.z = 0;

var spriteDeath9 = new BABYLON.Sprite("red dragon", spriteManagerRedDragonDeath);
spriteDeath9.size = 35;
spriteDeath9.cellIndex = 64;
spriteDeath9.position.x = 1000;
spriteDeath9.position.y = YLIMIT;
spriteDeath9.position.z = 0;

//reposition the spriteBurn sprite to the passed cordinates and after 2 second
//move the sprite off the map
function burnFrost(x,y,z){
	spriteBurn.position.x = x;
	spriteBurn.position.y = y;
	spriteBurn.position.z = z + 3;
	
	//after 2 second move the animation away
	setTimeout(function() {
		spriteBurn.position.x = 1000;
		spriteBurn.position.y = YLIMIT;
		spriteBurn.position.z = 0;
	}, 2000); //wait 2 second
}//burnFrost

//reposition a spriteDeathX sprite to the passed cordinates
//unlike the other sprite managers spriteManagerRedDragonDeath allows up to 10 sprites to be used at once meaning
//up to 10 dragons can be dying at the same time and using one of these sprites for that animation, we determine which
//sprite is available for use simply by checking if its x position is at 1000, if it is then it is available to use
function dragonDeath(x,y,z){
	if (spriteDeath.position.x == 1000){
		spriteDeath.position.x = x;
		spriteDeath.position.y = y + 3;
		spriteDeath.position.z = z;
		
		//play the death animation
		spriteDeath.playAnimation(64, 69, false, 150);
		//wait 2 seconds then begin decreasing y, dragon begins to sink into the lava
		setTimeout(function() {
			for (var i = 0; i < 30; i++) {
			  (function (i) {
				setTimeout(function () {
				  spriteDeath.position.y -= .8;
				}, 100*i);
			  })(i);
			};
		}, 2000);
		//wait 6 seconds then move the spriteDeath sprite off the map
		setTimeout(function() {
			spriteDeath.position.x = 1000;
			spriteDeath.position.y = YLIMIT;
			spriteDeath.position.z = 0;
		}, 6000);
	}
	
	else if (spriteDeath1.position.x == 1000) {
		spriteDeath1.position.x = x;
		spriteDeath1.position.y = y + 3;
		spriteDeath1.position.z = z;
		
		spriteDeath1.playAnimation(64, 69, false, 150);
		setTimeout(function() {
			for (var i = 0; i < 30; i++) {
			  (function (i) {
				setTimeout(function () {
				  spriteDeath1.position.y -= .8;
				}, 100*i);
			  })(i);
			};
		}, 2000);
		setTimeout(function() {
			spriteDeath1.position.x = 1000;
			spriteDeath1.position.y = YLIMIT;
			spriteDeath1.position.z = 0;
		}, 6000);
	}
	
	else if (spriteDeath2.position.x == 1000) {
		spriteDeath2.position.x = x;
		spriteDeath2.position.y = y + 3;
		spriteDeath2.position.z = z;
		
		spriteDeath2.playAnimation(64, 69, false, 150);
		setTimeout(function() {
			for (var i = 0; i < 30; i++) {
			  (function (i) {
				setTimeout(function () {
				  spriteDeath2.position.y -= .8;
				}, 100*i);
			  })(i);
			};
		}, 2000);
		setTimeout(function() {
			spriteDeath2.position.x = 1000;
			spriteDeath2.position.y = YLIMIT;
			spriteDeath2.position.z = 0;
		}, 6000);
	}
	
	else if (spriteDeath3.position.x == 1000) {
		spriteDeath3.position.x = x;
		spriteDeath3.position.y = y + 3;
		spriteDeath3.position.z = z;
		
		spriteDeath3.playAnimation(64, 69, false, 150);
		setTimeout(function() {
			for (var i = 0; i < 30; i++) {
			  (function (i) {
				setTimeout(function () {
				  spriteDeath3.position.y -= .8;
				}, 100*i);
			  })(i);
			};
		}, 2000);
		setTimeout(function() {
			spriteDeath3.position.x = 1000;
			spriteDeath3.position.y = YLIMIT;
			spriteDeath3.position.z = 0;
		}, 6000);
	}
	
	else if (spriteDeath4.position.x == 1000) {
		spriteDeath4.position.x = x;
		spriteDeath4.position.y = y + 3;
		spriteDeath4.position.z = z;
		
		spriteDeath4.playAnimation(64, 69, false, 150);
		setTimeout(function() {
			for (var i = 0; i < 30; i++) {
			  (function (i) {
				setTimeout(function () {
				  spriteDeath4.position.y -= .8;
				}, 100*i);
			  })(i);
			};
		}, 2000);
		setTimeout(function() {
			spriteDeath4.position.x = 1000;
			spriteDeath4.position.y = YLIMIT;
			spriteDeath4.position.z = 0;
		}, 6000);
	}
	
	else if (spriteDeath5.position.x == 1000) {
		spriteDeath5.position.x = x;
		spriteDeath5.position.y = y + 3;
		spriteDeath5.position.z = z;
		
		spriteDeath5.playAnimation(64, 69, false, 150);
		setTimeout(function() {
			for (var i = 0; i < 30; i++) {
			  (function (i) {
				setTimeout(function () {
				  spriteDeath5.position.y -= .8;
				}, 100*i);
			  })(i);
			};
		}, 2000);
		setTimeout(function() {
			spriteDeath5.position.x = 1000;
			spriteDeath5.position.y = YLIMIT;
			spriteDeath5.position.z = 0;
		}, 6000);
	}
	
	else if (spriteDeath6.position.x == 1000) {
		spriteDeath6.position.x = x;
		spriteDeath6.position.y = y + 3;
		spriteDeath6.position.z = z;
		
		spriteDeath6.playAnimation(64, 69, false, 150);
		setTimeout(function() {
			for (var i = 0; i < 30; i++) {
			  (function (i) {
				setTimeout(function () {
				  spriteDeath6.position.y -= .8;
				}, 100*i);
			  })(i);
			};
		}, 2000);
		setTimeout(function() {
			spriteDeath6.position.x = 1000;
			spriteDeath6.position.y = YLIMIT;
			spriteDeath6.position.z = 0;
		}, 6000);
	}
	
	else if (spriteDeath7.position.x == 1000) {
		spriteDeath7.position.x = x;
		spriteDeath7.position.y = y + 3;
		spriteDeath7.position.z = z;
		
		spriteDeath7.playAnimation(64, 69, false, 150);
		setTimeout(function() {
			for (var i = 0; i < 30; i++) {
			  (function (i) {
				setTimeout(function () {
				  spriteDeath7.position.y -= .8;
				}, 100*i);
			  })(i);
			};
		}, 2000);
		setTimeout(function() {
			spriteDeath7.position.x = 1000;
			spriteDeath7.position.y = YLIMIT;
			spriteDeath7.position.z = 0;
		}, 6000);
	}
	
	else if (spriteDeath8.position.x == 1000) {
		spriteDeath8.position.x = x;
		spriteDeath8.position.y = y + 3;
		spriteDeath8.position.z = z;
		
		spriteDeath8.playAnimation(64, 69, false, 150);
		setTimeout(function() {
			for (var i = 0; i < 30; i++) {
			  (function (i) {
				setTimeout(function () {
				  spriteDeath8.position.y -= .8;
				}, 100*i);
			  })(i);
			};
		}, 2000);
		setTimeout(function() {
			spriteDeath8.position.x = 1000;
			spriteDeath8.position.y = YLIMIT;
			spriteDeath8.position.z = 0;
		}, 6000);
	}
	
	else if (spriteDeath9.position.x == 1000) {
		spriteDeath9.position.x = x;
		spriteDeath9.position.y = y + 3;
		spriteDeath9.position.z = z;
		
		spriteDeath9.playAnimation(64, 69, false, 150);
		setTimeout(function() {
			for (var i = 0; i < 30; i++) {
			  (function (i) {
				setTimeout(function () {
				  spriteDeath9.position.y -= .8;
				}, 100*i);
			  })(i);
			};
		}, 2000);
		setTimeout(function() {
			spriteDeath9.position.x = 1000;
			spriteDeath9.position.y = YLIMIT;
			spriteDeath9.position.z = 0;
		}, 6000);
	}
	
	//if all the other spriteDeath are occupied simply end the animation on the first spriteDeath and use it here
	else {
		spriteDeath.position.x = x;
		spriteDeath.position.y = y + 3;
		spriteDeath.position.z = z;
		
		//play the death animation
		spriteDeath.playAnimation(64, 69, false, 150);
		//wait 2 seconds then begin decreasing y, dragon begins to sink into the lava
		setTimeout(function() {
			for (var i = 0; i < 30; i++) {
			  (function (i) {
				setTimeout(function () {
				  spriteDeath.position.y -= .8;
				}, 100*i);
			  })(i);
			};
		}, 2000);
		//wait 6 seconds then move the spriteDeath sprite off the map
		setTimeout(function() {
			spriteDeath.position.x = 1000;
			spriteDeath.position.y = YLIMIT;
			spriteDeath.position.z = 0;
		}, 6000);
	}//else
}//dragonDeath

//dragon enemy
//x, y, z = cordinates
//health = the health of the dragon
//speed = speed of the dragon
//sprite = creates a sprite manager depending on the variable passed e.g. "Red" - create a red dragon sprite
//spriteMove = variable name for sprite, must be a unique string for every dragon
//frozen = is the dragon frozen in place - frostbolt
function dragon(x, y, z, health, speed, sprite, spriteMove, frozen){
	this.x = x;
	this.y = y;
	this.z = z;
	this.health = health;
	this.speed = speed;
	this.sprite = sprite;
	this.spriteMove = spriteMove;
	this.frozen = frozen;
	
	//create dragon hitbox
	var dragon = BABYLON.MeshBuilder.CreateSphere("enemy", {diameter: 30, diameterX: 30}, scene);
	
	//create and set the material for the dragon hitbox
	var dragonMaterial = new BABYLON.StandardMaterial("dragonMaterial", scene);
	dragonMaterial.alpha = 0;
	dragon.material = dragonMaterial;
	
	//stores the x position(dragon) of the previous frame, used for changing the way the sprite is facing
	var xMove = this.x;
	
	//determines whether the dragon is within the warlock mark's zone
	var zoned = false;
	
	//when set to true unfreeze the dragon
	var unfreeze = false;
	
	//controls when to play the animation
	var burnFrostAnimation = false;
	
	//controls when to hide the moveSprite in order to display other sprite animations
	var hideSprite = false;
	
	//controls when to display death animation
	var deathAnimation = false;
	//only display death animation if deathAnimated = 0, otherwise we would have this animation
	//loop endlessly while the dragon health is <= 0, this way we free up the sprite such that it
	//can be used if another dragon dies
	var deathAnimated = 0;
	
	//controls when to respawn the dragon
	var respawnTimer = 0;
	
	//controls whether respawning for each dragon is enabled
	var endlessMode = true;
	
	//create sprite manager based on sprite parameter passed
	if (sprite == "red"){
		var spriteManagerRedDragon = new BABYLON.SpriteManager("red dragon", redDragonSprite, 1, {width:191.5, height:125}, scene);
		//create the sprite itself
		this.spriteMove = new BABYLON.Sprite("red dragon", spriteManagerRedDragon);
		//adjust sprite settings
		this.spriteMove.size = 35;
		this.spriteMove.cellIndex = 11;
		this.spriteMove.playAnimation(9, 11, true, 150);
	}//if
	//can easily add a variety of different dragon sprites here and the dragon will function as intended with a different sprite
	else if (sprite == "black"){
		console.log("add sprite for black dragon");
	}//else if
	else {
		console.log("Undefined Sprite!");
	}//else
	
	//set the starting location of the dragon
	this.startingLocation = function(){
		dragon.setPositionWithLocalVector(new BABYLON.Vector3(this.x, this.y, this.z));
	}//spawn
	
	//move the dragon towards the player
	this.move = function(){
		var direction = new BABYLON.Vector3(player.position.x, YLIMIT, player.position.z);
		direction.normalize();
		distance = this.speed;
		
		//if the dragons health is greater than 0, the dragon is outside the warlock's mark zone
		//the dragon is not frozen and hideSprite is false move towards the player
		if (this.health > 0 && zoned == false && this.frozen == false && hideSprite == false){
		  dragon.translate(direction, distance, BABYLON.Space.WORLD);
		  if (dragon.position.y != YLIMIT){
				dragon.position.y = YLIMIT;
		  }//if
		}//if
		
		//if the dragons health is greater than 0 and the dragon is inside the warlock's mark zone
		//then reduce the speed at which the dragon travels towards the player while in the zone,
		//intended to have the dragon be pulled towards the center of the mark slowly however the
		//dragon hitbox simply refuses to go past the intersection point towards the center
		else if (this.health > 0 && zoned == true){
			//direction = new BABYLON.Vector3(warlockMark.position.x, YLIMIT, warlockMark.position.z);
			direction = new BABYLON.Vector3(player.position.x, YLIMIT, player.position.z);
			direction.normalize();
			distance = 0.1;
			dragon.translate(direction, distance, BABYLON.Space.WORLD);
		}//else if
		
		//if the dragon is frozen, stop animations and don't move
		else if (this.health > 0 && this.frozen == true){
			this.spriteMove.stopAnimation();
		}//else if
		  
		//make the sprite face right
		if (xMove > dragon.position.x){
		  this.spriteMove.invertU = 1;
		}//if
		//otherwise face left
		else {
		  this.spriteMove.invertU = 0;
		}//else
			
		//restart the animations if unfreeze is set to true
		if (unfreeze == true){
			this.frozen = false;
			this.spriteMove.playAnimation(9, 11, true, 150)
			unfreeze = false; //set unfreeze back to false
			this.spriteMove.size = 35; //set the size back to 35
		}//if
		
		//if the burnFrostAnimation is set to true and hideSprite is set to true
		//then pass the cordinates of this dragon to burnFrost to make the burnFrost sprite animation appear
		//at this dragon's cordinates while it stays hidden (size = 0) for 2 seconds
		if (burnFrostAnimation == true && hideSprite == true){
			burnFrost(dragon.position.x, dragon.position.y, dragon.position.z);
			this.spriteMove.size = 0;
		}//if
		
		//when deathAnimation is set to true pass dragon cordinates to dragonDeath to begin the death animation
		//once death animation has begun resposition the dragon off the map
		if (deathAnimation == true){
			dragonDeath(dragon.position.x, dragon.position.y, dragon.position.z); //begin death animation
			deathAnimation = false; //set deathAnimation back to false
			deathAnimated = 1; //change deathAnimated from 0 to 1, no longer loops
			
			//reposition the dragon off the map after 1 second
			setTimeout(function() {
				dragon.setPositionWithLocalVector(new BABYLON.Vector3(1100, 21, 0)); //repositon dragon
			}, 1000); //wait 1 second
		}//if
		
		//if the dragon is dead and endless is true
		//start incrementing the timer
		if (this.health <= 0 && endlessMode == true){
			respawnTimer++;
		}//if
		
		//if the dragon is dead and respawnTimer hits 600
		//respawn the dragon and reset the timer
		if (this.health <= 0 && respawnTimer == 600){
			console.log(respawnTimer);
			this.reset();
			respawnTimer = 0;
		}
		//update xMove every frame
		xMove = dragon.position.x;
	}//move
	
	//collision between player and the dragon
	this.playerCollision = function(){
		if (this.health > 0){
			if (player.intersectsMesh(dragon, false)) {
				//player takes damage
				playerObject.health -= 50;
				//reposition the dragon to its original starting location
				this.startingLocation();
				//update status text
				UI.updateStatus("Hit! -50", "Red");
			}//if
		}//if
	}//playerCollision
	
	//move the red dragon sprite
	this.moveRed = function(){
		this.spriteMove.position.x = dragon.position.x;
		this.spriteMove.position.y = dragon.position.y;
		this.spriteMove.position.z = dragon.position.z;
	}//moveRed
	
	//reset the dragon
	this.reset = function(){
		dragonMaterial.alpha = 0.3;
		this.spriteMove.size = 35;
		this.health = 10;
		deathAnimated = 0;
		this.startingLocation();
	}//reset
	
	//check if the dragon health is 0, if it is make it invisable and begin the death animation
	this.dead = function(){
		if (this.health <= 0){
			dragonMaterial.alpha = 0;
			this.spriteMove.size = 0;
			if (deathAnimated == 0){
				deathAnimation = true; //set to true to start the death animation
			}//if
		}//if
	}//dead
	
	//check if the dragon is within the map boundaries, if the dragon position
	//exceeds a limit then reset it to its starting location
	this.onMap = function(){
		//if the dragon goes off the right edge of the map
		if (dragon.position.x > 1300){
			this.startingLocation();
		}//if
		
		//if the dragon goes off the left edge of the map
		if (dragon.position.x < -1300){
			this.startingLocation();
		}//if
		
		//if the dragon goes off the top edge of the map
		if (dragon.position.z > 1300){
			this.startingLocation();
		}//if
		
		//if the dragon goes off the bottom edge of the map
		if (dragon.position.z < - 1300){
			this.startingLocation();
		}//if
	}//onMap
	
	//collision detection is made very very simple using BABYLON JS
	//when compared to using standalone HTML5 Canvas 2D Context or other libraries
	//i.e. one would have to code various algorithms to detect collisions between
	//shapes whereas using BABYLON JS the math is already done for you using intersectsMesh()
	
	//collision between player fireball and the dragon
	this.fireballCollision = function(){
		if(this.health > 0){
			if (fireball.intersectsMesh(dragon, false)) {
				//dragon takes damage
				this.health -= FIREBALL_DAMAGE;
				//make the fireball invisable and move it off the map
				fireball.position.x = 1000;
				fireballMaterial.alpha = 0;
				smokeSystem.stop();
				fireSystem.stop();
				//update status
				UI.updateStatus("HIT! -" + FIREBALL_DAMAGE, "White");
			}//if
		}//if
	}//fireballCollision
	
	//collision between player frostbolt and the dragon
	this.frostboltCollision = function(){
		if(this.health > 0){
			if (frostbolt.intersectsMesh(dragon, false)) {
				//dragon takes damage
				this.health -= FROSTBOLT_DAMAGE;
				//make the frostbolt invisable and move it off the map
				frostbolt.position.x = 1000;
				frostSprite.size = 0;
				this.frozen = true;
				this.frozenDragon();
				//update status
				UI.updateStatus("HIT! -" + FROSTBOLT_DAMAGE, "White");
			}//if
		}//if
	}//frostboltCollision
	
	//handles animations if the dragon is frozen
	this.frozenDragon = function(){
		if (this.frozen == true){
			//move the frozen sprite to the dragon location
			frozenSprite.position.x = dragon.position.x;
			frozenSprite.position.y = dragon.position.y;
			frozenSprite.position.z = dragon.position.z;
			
			//animation before unfreeze
			setTimeout(function() {
				burnFrostAnimation = true;
				hideSprite = true;
			}, 4000);//wait 4 seconds
			
			//after 6 seconds unfreeze the dragon
			setTimeout(function() {
				frozenSprite.position.x = 1000;
				frozenSprite.position.y = YLIMIT;
				frozenSprite.position.z = 0;
				//this.frozen = false; //cannot unfreeze within this function
				burnFrostAnimation = false; //set burnFrostAnimation back to false
				hideSprite = false; //set hideSprite back to false
				unfreeze = true; //set unfreeze to true from false
			}, 6000); //wait 6 seconds
		}//if
	}//frozenDragon

	//collision between player splitter and the dragon
	this.splitterCollision = function(){
		if(this.health > 0){
			if (splitter.intersectsMesh(dragon, false)) {
				//dragon takes damage
				this.health -= SPLITTER_DAMAGE;
				//make the splitter invisable and move it off the map
				//all the splitter projectiles are naturally affected also since they
				//spawn off of splitter and the player should aim such that the splitter doesn't
				//get hit before the projectiles spawn
				splitter.position.x = 1000;
				//update status
				UI.updateStatus("HIT! -" + SPLITTER_DAMAGE, "White");
			}//if
		}//if
	}//splitterCollision	

	//collision between player splitterProjectile0 and the dragon
	this.splitterProjectile0Collision = function(){
		if(this.health > 0){
			if (splitterProjectile0.intersectsMesh(dragon, false)) {
				//dragon takes damage
				this.health -= SPLITTER_PROJECTILE_DAMAGE;
				//make the projectile invisable and move it off the map
				splitterProjectile0.position.x = 1000;
				//update status
				UI.updateStatus("HIT! -" + SPLITTER_PROJECTILE_DAMAGE, "White");
			}//if
		}//if
	}//splitterProjectile0Collision

	//collision between player splitterProjectile1 and the dragon
	this.splitterProjectile1Collision = function(){
		if(this.health > 0){
			if (splitterProjectile1.intersectsMesh(dragon, false)) {
				//dragon takes damage
				this.health -= SPLITTER_PROJECTILE_DAMAGE;
				//make the projectile invisable and move it off the map
				splitterProjectile1.position.x = 1000;
				//update status
				UI.updateStatus("HIT! -" + SPLITTER_PROJECTILE_DAMAGE, "White");
			}//if
		}//if
	}//splitterProjectile1Collision

	//collision between player splitterProjectile2 and the dragon
	this.splitterProjectile2Collision = function(){
		if(this.health > 0){
			if (splitterProjectile2.intersectsMesh(dragon, false)) {
				//dragon takes damage
				this.health -= SPLITTER_PROJECTILE_DAMAGE;
				//make the projectile invisable and move it off the map
				splitterProjectile2.position.x = 1000;
				//update status
				UI.updateStatus("HIT! -" + SPLITTER_PROJECTILE_DAMAGE, "White");
			}//if
		}//if
	}//splitterProjectile2Collision

	//collision between player splitterProjectile3 and the dragon
	this.splitterProjectile3Collision = function(){
		if(this.health > 0){
			if (splitterProjectile3.intersectsMesh(dragon, false)) {
				//dragon takes damage
				this.health -= SPLITTER_PROJECTILE_DAMAGE;
				//make the projectile invisable and move it off the map
				splitterProjectile3.position.x = 1000;
				//update status
				UI.updateStatus("HIT! -" + SPLITTER_PROJECTILE_DAMAGE, "White");
			}//if
		}//if
	}//splitterProjectile3Collision

	//collision between player splitterProjectile4 and the dragon
	this.splitterProjectile4Collision = function(){
		if(this.health > 0){
			if (splitterProjectile4.intersectsMesh(dragon, false)) {
				//dragon takes damage
				this.health -= SPLITTER_PROJECTILE_DAMAGE;
				//make the projectile invisable and move it off the map
				splitterProjectile4.position.x = 1000;
				//update status
				UI.updateStatus("HIT! -" + SPLITTER_PROJECTILE_DAMAGE, "White");
			}//if
		}//if
	}//splitterProjectile4Collision

	//collision between player splitterProjectile5 and the dragon
	this.splitterProjectile5Collision = function(){
		if(this.health > 0){
			if (splitterProjectile5.intersectsMesh(dragon, false)) {
				//dragon takes damage
				this.health -= SPLITTER_PROJECTILE_DAMAGE;
				//make the projectile invisable and move it off the map
				splitterProjectile5.position.x = 1000;
				//update status
				UI.updateStatus("HIT! -" + SPLITTER_PROJECTILE_DAMAGE, "White");
			}//if
		}//if
	}//splitterProjectile5Collision

	//collision between player splitterProjectile6 and the dragon
	this.splitterProjectile6Collision = function(){
		if(this.health > 0){
			if (splitterProjectile6.intersectsMesh(dragon, false)) {
				//dragon takes damage
				this.health -= SPLITTER_PROJECTILE_DAMAGE;
				//make the projectile invisable and move it off the map
				splitterProjectile6.position.x = 1000;
				//update status
				UI.updateStatus("HIT! -" + SPLITTER_PROJECTILE_DAMAGE, "White");
			}//if
		}//if
	}//splitterProjectile6Collision

	//collision between player splitterProjectile7 and the dragon
	this.splitterProjectile7Collision = function(){
		if(this.health > 0){
			if (splitterProjectile7.intersectsMesh(dragon, false)) {
				//dragon takes damage
				this.health -= SPLITTER_PROJECTILE_DAMAGE;
				//make the projectile invisable and move it off the map
				splitterProjectile7.position.x = 1000;
				//update status
				UI.updateStatus("HIT! -" + SPLITTER_PROJECTILE_DAMAGE, "White");
			}//if
		}//if
	}//splitterProjectile7Collision	
	
	//collision between player recharger and the dragon
	this.rechargerCollision = function(){
		if(this.health > 0){
			if (recharger.intersectsMesh(dragon, false)) {
				//dragon takes damage
				this.health -= RECHARGER_DAMAGE;
				//make the projectile invisable and move it off the map
				recharger.position.x = 1000;
				//reset the cooldown
				rechargerCooldown = false;
				UI.cooldownOff("recharger");
				//update status
				UI.updateStatus("HIT! -" + RECHARGER_DAMAGE, "White");
			}//if
		}//if
	}//rechargerCollision

	//collision between player molten boulder and the dragon
	this.moltonBoulderCollision = function(){
		if(this.health > 0){
			if (moltonBoulder.intersectsMesh(dragon, false)) {
				//dragon takes damage
				this.health -= MOLTON_BOULDER_DAMAGE;
				//once the boulder hits it doesn't reset it's location like the other spells
				//instead it keeps going, effective way to take out multiple enemies that are lined up
				//update status
				UI.updateStatus("HIT! -" + MOLTON_BOULDER_DAMAGE, "White");
			}//if
		}//if
	}//moltonBoulderCollision
	
	//collision between player warlock's mark and the dragon
	this.warlockMarkCollision = function(){
		if(this.health > 0){
			if (warlockMark.intersectsMesh(dragon, true)) {		
				zoned = true;
			}//if
			else {
				zoned = false
			}//else
		}//if
	}//warlockMarkCollision
	
	//collision between player deflection shield and the dragon
	//hitbox on deflection shield is bigger than the player hitbox therefore if
	//the dragon intersects with the player while the shield is up, it respawns at it's
	//starting location without the player taking damage
	this.deflectionShieldCollision = function(){
		if(this.health > 0){
			if (deflectionShield.intersectsMesh(dragon, true)) {
				//update status
				UI.updateStatus("Blocked", "White");
				this.startingLocation();
			}//if
		}//if
	}//deflectionShieldCollision
}//dragon

//dragon inherits the functions of enemy
dragon.prototype = enemy;