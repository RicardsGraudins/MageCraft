console.log("Player Ready!");

//sprite 1 - red mage
//load sprites
redMage = "static/resources/images/sprites/mage.png";
//create sprite manager
var spriteManagerPlayerRed = new BABYLON.SpriteManager("playerManager", redMage, 1, 114, scene);
//create the sprite
var playerSprite = new BABYLON.Sprite("player", spriteManagerPlayerRed);
//increase the size of the sprite
playerSprite.size = 20;

//boolean to control moving animation
var moving = false;

sprite = function(){
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
	
	//have the sprite move with the player hitbox at all times
	this.move = function(){
		playerSprite.position.x = player.position.x;
		playerSprite.position.y = player.position.y;
		playerSprite.position.z = player.position.z;
		
		//have the camera move with the player hitbox at all times
		//this elimates the awkward rotations & acceleration using the follow camera
		camera.position.x = player.position.x;
		//camera.position.y = player.position.y;
	}//move
}//redMage

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
scene.actionManager.registerAction(
    new BABYLON.ExecuteCodeAction(
        {
            trigger: BABYLON.ActionManager.OnKeyUpTrigger,
            parameter: '1'
        },
        function () {
			console.log("spell 1 is selected!");
		}//function
    )//ExecuteCodeAction
);

//track cords - player.getPositionExpressedInLocalSpace();
var player = BABYLON.MeshBuilder.CreateSphere("sphere", {diameter: 20, diameterX: 20}, scene);
var fireball = BABYLON.MeshBuilder.CreateSphere("spell", {diameter: 20, diameterX: 20}, scene);

//assign transparent material to the player sphere - acts as hitbox
//playerSprite moves with the hitbox - same (x,y,z) at all times
//note that the hitbox is currently larger than the sprite for testing ***
var playerMaterial = new BABYLON.StandardMaterial("playerMaterial", scene);
playerMaterial.wireframe = true;
playerMaterial.alpha = 0.01;
player.material = playerMaterial;

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
					spriteObject.faceLeft();
					spriteObject.run();
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
					spriteObject.faceRight();
					spriteObject.run();
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
					//spriteObject.faceLeft();
					spriteObject.run();
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
					//spriteObject.faceLeft();
					spriteObject.run();
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
		
	this.castFireball = function(){
		
		//once we click on the ground - cast the spell
		scene.onPointerDown = function (evt, ground) {
			// if the click hits the ground plane
			if (ground.hit) {
				//fireball.position.x = ground.pickedPoint.x;
				//fireball.position.z = ground.pickedPoint.z;
				
				//set spell location to player location - player casting the spell
				fireball.position.x = player.position.x;
				fireball.position.z = player.position.z;
				fireball.position.y = player.position.y;
				
				//x and z cords of mouse click @ ground plane
				gx = ground.pickedPoint.x;
				gz = ground.pickedPoint.z;
				
				//x and z cords of fireball position
				spellX = fireball.position.x;
				spellZ = fireball.position.z;
				
				//animate the fireball movement
				playerObject.moveFireball(gx,gz,spellX,spellZ);
				
			} else {
				console.log("Clicked outside the map!");
			}
		};
	}//castFireball
	
	//animate the fireball movement
	this.moveFireball = function(gx,gz,spellX,spellZ){
		this.gx = gx;
		this.gz = gz;
		this.spellX = spellX;
		this.spellZ = spellZ;
		
		//console.log("Player cast fireball!");
		var spellSpeed = 5;
		
		//movement animation
		scene.registerBeforeRender(function () {
			fireball.position.x += spellSpeed;
			
			//if the spell goes off the map stop moving it by setting spellSpeed to 0
			if(fireball.position.x <= -1000 || fireball.position.x >= 1000){
				spellSpeed = 0;
			}//if
		});
	}//moveFireball
}//Player