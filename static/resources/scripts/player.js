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

Player = function(x, y, z, speed, onGrid){
	this.x = x;
	this.y = y;
	this.z = z;
	this.speed = speed;
	this.onGrid = onGrid;
	
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
				if (player.position.x < boundaryLeft){
					console.log("over left!")
					if (playerObject.onGrid == true){
						playerObject.onGrid = false;
						console.log("no longer on grid!")
					}//inner inner if
				}//inner if
			}//if
			
			//move right
			if (KEY_STATUS.right) {
				console.log("right");
				player.position.x += speed;
				if (player.position.x > boundaryRight){
					console.log("over right!")
					if (playerObject.onGrid == true){
						playerObject.onGrid = false;
						console.log("no longer on grid!")
					}//inner inner if
				}//inner if
			}//if	
			
			//move up
			if (KEY_STATUS.up) {
				console.log("up");
				player.position.z += speed;
				if (player.position.z > boundaryTop){
					console.log("over top!")
					if (playerObject.onGrid == true){
						playerObject.onGrid = false;
						console.log("no longer on grid!")
					}//inner inner if
				}//inner if
			}//if
			
			//move down
			if (KEY_STATUS.down) {
				console.log("down");
				player.position.z -= speed;
				if (player.position.z < boundaryBottom){
					console.log("over bottom!")
					if (playerObject.onGrid == true){
						playerObject.onGrid = false;
						console.log("no longer on grid!")
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
}//Player