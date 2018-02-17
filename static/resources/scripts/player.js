console.log("Player Ready!");

//the keycodes that will be mapped when a user presses a button
KEY_CODES = {
  32: 'space',
  37: 'left',
  38: 'up',
  39: 'right',
  40: 'down'
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

//track cords - player.getPositionExpressedInLocalSpace();
var player = BABYLON.MeshBuilder.CreateSphere("sphere", {diameter: 20, diameterX: 20}, scene);

Player = function(x,y,z,speed){
	this.x = x;
	this.y = y;
	this.z = z;
	this.speed = speed;
	
	//var player = BABYLON.MeshBuilder.CreateSphere("sphere", {diameter: 20, diameterX: 20}, scene);
	
	//spawning position
	player.setPositionWithLocalVector(new BABYLON.Vector3(x, y, z));
	
	//apply physics - giving it a mass so that drops to the ground, restitution = 0 meaning no bounce
	player.physicsImpostor = new BABYLON.PhysicsImpostor(player, BABYLON.PhysicsImpostor.SphereImpostor, { mass: 1, restitution: 0 }, scene);
	
	//change player position on button press, note: using z for up/down instead of y
	this.move = function(){
		if (KEY_STATUS.left || KEY_STATUS.right ||
			KEY_STATUS.down || KEY_STATUS.up) {
			
			//move left
			if (KEY_STATUS.left) {
				console.log("left");
				player.position.x -= speed;
			}//if
			
			//move right
			if (KEY_STATUS.right) {
				console.log("right");
				player.position.x += speed;
			}//if	
			
			//move up
			if (KEY_STATUS.up) {
				console.log("up");
				player.position.z += speed;
			}//if
			
			//move down
			if (KEY_STATUS.down) {
				console.log("down");
				player.position.z -= speed;
			}//if
		}//if
	}//move
	
	//create a new ground mesh since lava background moves(unstable) and player grid is composed of many smaller planes that fade out...
	//this mesh will be set to transparent later for either the area covering the player grid or the entire "ground" i.e move across the lava
	this.createGround = function(){
		var ground = BABYLON.MeshBuilder.CreateGround("myGround", {width: 100, height: 100}, scene);
		ground.physicsImpostor = new BABYLON.PhysicsImpostor(ground, BABYLON.PhysicsImpostor.BoxImpostor, { mass: 0, restitution: 0 }, scene);
		ground.setPositionWithLocalVector(new BABYLON.Vector3(0, 25, 0));
	}//createGround
}//Player