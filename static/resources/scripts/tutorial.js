//tutorial AI
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

//load enemy sprites
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
	this.warlockMarkCollision = function(){};
	this.deflectionShieldCollision = function(){};
}//enemy

//sprite handler for frozen animation - when the dragon gets hit by frostbolt
var spriteManagerFrozen = new BABYLON.SpriteManager("frostManager", frostEffect, 1, 192, scene);
var frozenSprite = new BABYLON.Sprite("spell", spriteManagerFrozen);
//adjust sprite settings
frozenSprite.cellIndex = 20;
frozenSprite.size = 40;
frozenSprite.position.x = 1000;
frozenSprite.position.y = YLIMIT;
frozenSprite.position.z = 0;

//dragon enemy
//spriteId = variable name for sprite, must be a unique string for every dragon
function dragon(x, y, z, health, speed, sprite, spriteId, frozen){
	this.x = x;
	this.y = y;
	this.z = z;
	this.health = health;
	this.speed = speed;
	this.sprite = sprite;
	this.spriteId = spriteId;
	this.frozen = frozen;
	
	//create dragon hitbox
	var dragon = BABYLON.MeshBuilder.CreateSphere("enemy", {diameter: 30, diameterX: 30}, scene);
	
	//create and set the material for the dragon hitbox
	var dragonMaterial = new BABYLON.StandardMaterial("dragonMaterial", scene);
	dragonMaterial.alpha = 0.3;
	dragon.material = dragonMaterial;
	
	//stores the x position(dragon) of the previous frame, used for changing the way the sprite is facing
	var xMove = this.x;
	
	//determines whether the dragon is within the warlock mark's zone
	var zoned = false;
	
	//when set to true unfreeze the dragon
	var unfreeze = false;
	
	//create sprite manager based on sprite parameter passed
	if (sprite == "red"){
		var spriteManagerRedDragon = new BABYLON.SpriteManager("red dragon", redDragonSprite, 1, {width:191.5, height:125}, scene);
		//create the sprite itself
		this.spriteId = new BABYLON.Sprite("red dragon", spriteManagerRedDragon);
		//adjust sprite settings
		this.spriteId.size = 35;
		this.spriteId.cellIndex = 11;
		this.spriteId.playAnimation(9, 11, true, 150);
	}//if
	else if (sprite == "black"){
		console.log("add sprite");
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
		
		//if the dragons health is greater than 0 and the dragon is outside the warlock's mark zone
		//move towards the player
		if (this.health > 0 && zoned == false && this.frozen == false){
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
			this.spriteId.stopAnimation();
		}//else if
		  
		//make the sprite face right
		if (xMove > dragon.position.x){
		  this.spriteId.invertU = 1;
		}//if
		//otherwise face left
		else {
		  this.spriteId.invertU = 0;
		}//else
			
		//restart the animations if unfreeze is set to true
		if (unfreeze == true){
			this.frozen = false;
			this.spriteId.playAnimation(9, 11, true, 150)
			unfreeze = false; //set unfreeze back to false
		}//if
		  
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
			}//if
		}//if
	}//playerCollision
	
	//move the red dragon sprite
	this.moveRed = function(){
		this.spriteId.position.x = dragon.position.x;
		this.spriteId.position.y = dragon.position.y;
		this.spriteId.position.z = dragon.position.z;
	}//moveRed
	
	//reset the dragon
	this.reset = function(){
		dragonMaterial.alpha = 0.3;
		this.spriteId.size = 35;
		this.startingLocation();
	}//reset
	
	//check if the dragon health is 0, if it is make it invisable and move it off the map
	this.dead = function(){
		if (this.health <= 0){
			dragonMaterial.alpha = 0;
			this.spriteId.size = 0;
			dragon.setPositionWithLocalVector(new BABYLON.Vector3(1000, 21, 0));
		}//if
	}//dead
	
	//collision between player fireball and the dragon
	this.fireballCollision = function(){
		if(this.health > 0){
			if (fireball.intersectsMesh(dragon, false)) {
				//dragon takes damage
				this.health -= 2;
				//make the fireball invisable and move it off the map
				fireball.position.x = 1000;
				fireballMaterial.alpha = 0;
				smokeSystem.stop();
				fireSystem.stop();
			}//if
		}//if
	}//fireballCollision
	
	//collision between player frostbolt and the dragon
	this.frostboltCollision = function(){
		if(this.health > 0){
			if (frostbolt.intersectsMesh(dragon, false)) {
				//dragon takes damage
				this.health -= 5;
				//make the frostbolt invisable and move it off the map
				frostbolt.position.x = 1000;
				frostSprite.size = 0;
				this.frozen = true;
				this.frozenDragon();
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
			
			//after 5 seconds unfreeze the dragon
			setTimeout(function() {
				frozenSprite.position.x = 1000;
				frozenSprite.position.y = YLIMIT;
				frozenSprite.position.z = 0;
				//this.frozen = false; //cannot unfreeze within this function
				unfreeze = true; //set unfreeze to true from false
			}, 5000); //wait 5 seconds
		}//if
	}//frozenDragon

	//collision between player splitter and the dragon
	this.splitterCollision = function(){
		if(this.health > 0){
			if (splitter.intersectsMesh(dragon, false)) {
				//dragon takes damage
				this.health -= 10;
				//make the splitter invisable and move it off the map
				//all the splitter projectiles are naturally affected also since they
				//spawn off of splitter and the player should aim such that the splitter doesn't
				//get hit before the projectiles spawn
				splitter.position.x = 1000;
			}//if
		}//if
	}//splitterCollision	

	//collision between player splitterProjectile0 and the dragon
	this.splitterProjectile0Collision = function(){
		if(this.health > 0){
			if (splitterProjectile0.intersectsMesh(dragon, false)) {
				//dragon takes damage
				this.health -= 10;
				//make the projectile invisable and move it off the map
				splitterProjectile0.position.x = 1000;
			}//if
		}//if
	}//splitterProjectile0Collision

	//collision between player splitterProjectile1 and the dragon
	this.splitterProjectile1Collision = function(){
		if(this.health > 0){
			if (splitterProjectile1.intersectsMesh(dragon, false)) {
				//dragon takes damage
				this.health -= 10;
				//make the projectile invisable and move it off the map
				splitterProjectile1.position.x = 1000;
			}//if
		}//if
	}//splitterProjectile1Collision

	//collision between player splitterProjectile2 and the dragon
	this.splitterProjectile2Collision = function(){
		if(this.health > 0){
			if (splitterProjectile2.intersectsMesh(dragon, false)) {
				//dragon takes damage
				this.health -= 10;
				//make the projectile invisable and move it off the map
				splitterProjectile2.position.x = 1000;
			}//if
		}//if
	}//splitterProjectile2Collision

	//collision between player splitterProjectile3 and the dragon
	this.splitterProjectile3Collision = function(){
		if(this.health > 0){
			if (splitterProjectile3.intersectsMesh(dragon, false)) {
				//dragon takes damage
				this.health -= 10;
				//make the projectile invisable and move it off the map
				splitterProjectile3.position.x = 1000;
			}//if
		}//if
	}//splitterProjectile3Collision

	//collision between player splitterProjectile4 and the dragon
	this.splitterProjectile4Collision = function(){
		if(this.health > 0){
			if (splitterProjectile4.intersectsMesh(dragon, false)) {
				//dragon takes damage
				this.health -= 10;
				//make the projectile invisable and move it off the map
				splitterProjectile4.position.x = 1000;
			}//if
		}//if
	}//splitterProjectile4Collision

	//collision between player splitterProjectile5 and the dragon
	this.splitterProjectile5Collision = function(){
		if(this.health > 0){
			if (splitterProjectile5.intersectsMesh(dragon, false)) {
				//dragon takes damage
				this.health -= 10;
				//make the projectile invisable and move it off the map
				splitterProjectile5.position.x = 1000;
			}//if
		}//if
	}//splitterProjectile5Collision

	//collision between player splitterProjectile6 and the dragon
	this.splitterProjectile6Collision = function(){
		if(this.health > 0){
			if (splitterProjectile6.intersectsMesh(dragon, false)) {
				//dragon takes damage
				this.health -= 10;
				//make the projectile invisable and move it off the map
				splitterProjectile6.position.x = 1000;
			}//if
		}//if
	}//splitterProjectile6Collision

	//collision between player splitterProjectile7 and the dragon
	this.splitterProjectile7Collision = function(){
		if(this.health > 0){
			if (splitterProjectile7.intersectsMesh(dragon, false)) {
				//dragon takes damage
				this.health -= 10;
				//make the projectile invisable and move it off the map
				splitterProjectile7.position.x = 1000;
			}//if
		}//if
	}//splitterProjectile7Collision	
	
	//collision between player recharger and the dragon
	this.rechargerCollision = function(){
		if(this.health > 0){
			if (recharger.intersectsMesh(dragon, false)) {
				//dragon takes damage
				this.health -= 10;
				//make the projectile invisable and move it off the map
				recharger.position.x = 1000;
				//reset the cooldown
				rechargerCooldown = false;
				UI.cooldownOff("recharger");
			}//if
		}//if
	}//rechargerCollision

	//collision between player molten boulder and the dragon
	this.moltonBoulderCollision = function(){
		if(this.health > 0){
			if (moltonBoulder.intersectsMesh(dragon, false)) {
				//dragon takes damage
				this.health -= 10;
				//once the boulder hits it doesn't reset it's location like the other spells
				//instead it keeps going, effective way to take out multiple enemies that are lined up
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
				this.startingLocation();
			}//if
		}//if
	}//deflectionShieldCollision
}//dragon

//dragon inherits the functions of enemy
dragon.prototype = enemy;