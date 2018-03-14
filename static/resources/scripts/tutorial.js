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

//abstract enemy
function enemy(){
	this.startingLocation = function(){}
	this.move = function(){}
	this.enemySpriteHandler = function(){}
	this.playerCollision = function(){}
	this.fireballCollision = function(){}
	//rest of the spell collision...
}//enemy

function fireElemental(x, y, z, health, speed){
	this.x = x;
	this.y = y;
	this.z = z;
	this.health = health;
	this.speed = speed;
	
	var fireElemental = BABYLON.MeshBuilder.CreateSphere("enemy", {diameter: 20, diameterX: 20}, scene);
	
	//set the starting location of the fireElemental
	this.startingLocation = function(){
		fireElemental.setPositionWithLocalVector(new BABYLON.Vector3(this.x, this.y, this.z));
	}//spawn
	
	//move the fireElemental towards the player
	this.move = function(){
		var direction = new BABYLON.Vector3(player.position.x, YLIMIT, player.position.z);
		direction.normalize();
		distance = this.speed;
		
		  if(this.health != 0){
			  fireElemental.translate(direction, distance, BABYLON.Space.WORLD);
			  if (fireElemental.position.y != YLIMIT){
				  fireElemental.position.y = YLIMIT;
			  }//if
		  }//if
	}//move
	
	//collision between player and the enemy
	this.playerCollision = function(){
		if(this.health != 0){
			if (player.intersectsMesh(fireElemental, false)) {
				//player takes damage
				playerObject.health -= 50;
				//reposition the enemy to its original starting location
				this.startingLocation();
			}//if
		}//if
	}//playerCollision
}//fireElemental

//fireElemental inherits the functions of enemy
fireElemental.prototype = enemy;