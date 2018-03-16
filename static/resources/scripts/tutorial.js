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
	//rest of the spell collision...
}//enemy

//dragon enemy
//spriteId = variable name for sprite, must be a unique string for every dragon
function dragon(x, y, z, health, speed, sprite, spriteId){
	this.x = x;
	this.y = y;
	this.z = z;
	this.health = health;
	this.speed = speed;
	this.sprite = sprite;
	this.spriteId = spriteId;
	
	//create dragon hitbox
	var dragon = BABYLON.MeshBuilder.CreateSphere("enemy", {diameter: 30, diameterX: 30}, scene);
	
	//create and set the material for the dragon hitbox
	var dragonMaterial = new BABYLON.StandardMaterial("dragonMaterial", scene);
	dragonMaterial.alpha = 0.3;
	dragon.material = dragonMaterial;
	
	//stores the x position(dragon) of the previous frame, used for changing the way the sprite is facing
	var xMove = this.x;
	
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
		
		  if(this.health != 0){
			  dragon.translate(direction, distance, BABYLON.Space.WORLD);
			  if (dragon.position.y != YLIMIT){
					dragon.position.y = YLIMIT;
			  }//if
		  }//if
		  
		  //make the sprite face right
		  if (xMove > dragon.position.x){
			  this.spriteId.invertU = 1;
		  }//if
		  //otherwise face left
		  else {
			  this.spriteId.invertU = 0;
		  }//else
		  
		  //update xMove every frame
		xMove = dragon.position.x;
	}//move
	
	//collision between player and the dragon
	this.playerCollision = function(){
		if(this.health > 0){
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
	
	//collision between player fireball and the dragon
	this.fireballCollision = function(){
		if(this.health > 0){
			if (fireball.intersectsMesh(dragon, false)) {
				//dragon takes damage
				this.health -= 2;
				//make the dragon invisable and reposition off the map
				dragonMaterial.alpha = 0;
				this.spriteId.size = 0;
				dragon.setPositionWithLocalVector(new BABYLON.Vector3(1000, 21, 0));
			}//if
		}//if
	}//fireballCollision
}//dragon

//dragon inherits the functions of enemy
dragon.prototype = enemy;