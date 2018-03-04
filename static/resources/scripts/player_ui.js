//load textures for UI
overlayTexture = "static/resources/images/textures/overlay.png";
fireballIcon = "static/resources/images/textures/fireball_icon.png"
frostboltIcon = "static/resources/images/textures/frostbolt_icon.png"

//6 basic spells & 2 defensives
playerUI = function(){
	//overlay plane that holds all the spells
	var overlay = BABYLON.MeshBuilder.CreatePlane("UI-Overlay", {width: 210, height: 40}, scene);
	//spell planes, 1-6 offensive 7-8 defensive
	var spell1 = BABYLON.MeshBuilder.CreatePlane("UI-Spell", {width: 20, height: 20}, scene);
	var spell2 = BABYLON.MeshBuilder.CreatePlane("UI-Spell", {width: 20, height: 20}, scene);
	var spell3 = BABYLON.MeshBuilder.CreatePlane("UI-Spell", {width: 20, height: 20}, scene);
	var spell4 = BABYLON.MeshBuilder.CreatePlane("UI-Spell", {width: 20, height: 20}, scene);
	var spell5 = BABYLON.MeshBuilder.CreatePlane("UI-Spell", {width: 20, height: 20}, scene);
	var spell6 = BABYLON.MeshBuilder.CreatePlane("UI-Spell", {width: 20, height: 20}, scene);
	var spell7 = BABYLON.MeshBuilder.CreatePlane("UI-Spell", {width: 20, height: 20}, scene);
	var spell8 = BABYLON.MeshBuilder.CreatePlane("UI-Spell", {width: 20, height: 20}, scene);
	
	//control variables for UI movement
	//these 2 store the x and z position of the previous frame @ this.move
	//starts off as (0,0) same as playerObject, if playerObject starting position changes these values should be adjusted also
	var xMove = 0;
	var zMove = 0;
	
	//adjusting position of overlay at start of game
	this.startingPosition = function(){
		//setting the starting position of the UI
		overlay.setPositionWithLocalVector(new BABYLON.Vector3(0, 21, -150));
		spell1.setPositionWithLocalVector(new BABYLON.Vector3(-90, 21.1, -157));
		spell2.setPositionWithLocalVector(new BABYLON.Vector3(-65, 21.1, -157));
		spell3.setPositionWithLocalVector(new BABYLON.Vector3(-40, 21.1, -157));
		spell4.setPositionWithLocalVector(new BABYLON.Vector3(-15, 21.1, -157));
		spell5.setPositionWithLocalVector(new BABYLON.Vector3(15, 21.1, -157));
		spell6.setPositionWithLocalVector(new BABYLON.Vector3(40, 21.1, -157));
		spell7.setPositionWithLocalVector(new BABYLON.Vector3(65, 21.1, -157));
		spell8.setPositionWithLocalVector(new BABYLON.Vector3(90, 21.1, -157));	
		
		//rotate the UI towards the camera, otherwise all the planes are on their side
		//and cannot be seen
		overlay.rotation.x = -200;
		spell1.rotation.x = -200;
		spell2.rotation.x = -200;
		spell3.rotation.x = -200;
		spell4.rotation.x = -200;
		spell5.rotation.x = -200;
		spell6.rotation.x = -200;
		spell7.rotation.x = -200;
		spell8.rotation.x = -200;
	}//startingPosition
	
	//apply testing material to spell1-8
	this.testingMaterial = function(){
		//defining materials
		var materialA = new BABYLON.StandardMaterial("A", scene);		
		var materialB = new BABYLON.StandardMaterial("B", scene);	
		var materialC = new BABYLON.StandardMaterial("C", scene);		
		var materialD = new BABYLON.StandardMaterial("D", scene);		
		var materialE = new BABYLON.StandardMaterial("E", scene);		
		var materialF = new BABYLON.StandardMaterial("F", scene);		
		var materialG = new BABYLON.StandardMaterial("G", scene);		
		var materialH = new BABYLON.StandardMaterial("H", scene);

		//setting material textures, reusing planeA-H texture paths declared in player_grid.js
		materialA.diffuseTexture = new BABYLON.Texture(planeA, scene);
		materialB.diffuseTexture = new BABYLON.Texture(planeB, scene);
		materialC.diffuseTexture = new BABYLON.Texture(planeC, scene);
		materialD.diffuseTexture = new BABYLON.Texture(planeD, scene);
		materialE.diffuseTexture = new BABYLON.Texture(planeE, scene);
		materialF.diffuseTexture = new BABYLON.Texture(planeF, scene);
		materialG.diffuseTexture = new BABYLON.Texture(planeG, scene);
		materialH.diffuseTexture = new BABYLON.Texture(planeH, scene);
		
		//applying material to spell1-8 meshes
		spell1.material = materialA;
		spell2.material = materialB;
		spell3.material = materialC;
		spell4.material = materialD;
		spell5.material = materialE;
		spell6.material = materialF;
		spell7.material = materialG;
		spell8.material = materialH;		
	}//testingMaterial
	
	//set the actual textures for the spell icons
	this.setTextures = function(){
		//assign material to overlay
		var overlayMaterial = new BABYLON.StandardMaterial("overlayMaterial", scene);
		overlayMaterial.diffuseTexture = new BABYLON.Texture(overlayTexture, scene);
		overlay.material = overlayMaterial;
		
		//assign material to spells
		//fireball
		var fireballMaterial = new BABYLON.StandardMaterial("fireballMaterial", scene);
		fireballMaterial.diffuseTexture = new BABYLON.Texture(fireballIcon, scene);
		spell1.material = fireballMaterial;
		
		//frostbolt
		var frostboltMaterial = new BABYLON.StandardMaterial("frostboltMaterial", scene); 
		frostboltMaterial.diffuseTexture = new BABYLON.Texture(frostboltIcon, scene);
		spell2.material = frostboltMaterial;	
	}//setTextures
	
	//move the entire UI with the player
	//the following code keeps track of which way the player moves
	//and then moves the UI in the appropriate direction
	//note the "1" should be equal to playerObject speed
	this.move = function(){
		//move the UI left
		if(xMove > player.position.x){
			overlay.position.x = overlay.position.x - 1;
			spell1.position.x = spell1.position.x - 1;
			spell2.position.x = spell2.position.x - 1;
			spell3.position.x = spell3.position.x - 1;
			spell4.position.x = spell4.position.x - 1;
			spell5.position.x = spell5.position.x - 1;
			spell6.position.x = spell6.position.x - 1;
			spell7.position.x = spell7.position.x - 1;
			spell8.position.x = spell8.position.x - 1;
		}//if
		
		//move the UI right
		if(xMove < player.position.x){
			overlay.position.x = overlay.position.x + 1;
			spell1.position.x = spell1.position.x + 1;
			spell2.position.x = spell2.position.x + 1;
			spell3.position.x = spell3.position.x + 1;
			spell4.position.x = spell4.position.x + 1;
			spell5.position.x = spell5.position.x + 1;
			spell6.position.x = spell6.position.x + 1;
			spell7.position.x = spell7.position.x + 1;
			spell8.position.x = spell8.position.x + 1;
		}//if
		
		//move the UI downwards
		if(zMove > player.position.z){
			overlay.position.z = overlay.position.z - 1;
			spell1.position.z = spell1.position.z - 1;
			spell2.position.z = spell2.position.z - 1;
			spell3.position.z = spell3.position.z - 1;
			spell4.position.z = spell4.position.z - 1;
			spell5.position.z = spell5.position.z - 1;
			spell6.position.z = spell6.position.z - 1;
			spell7.position.z = spell7.position.z - 1;
			spell8.position.z = spell8.position.z - 1;
		}//if
		
		//move the UI upwards
		if(zMove < player.position.z){
			overlay.position.z = overlay.position.z + 1;
			spell1.position.z = spell1.position.z + 1;
			spell2.position.z = spell2.position.z + 1;
			spell3.position.z = spell3.position.z + 1;
			spell4.position.z = spell4.position.z + 1;
			spell5.position.z = spell5.position.z + 1;
			spell6.position.z = spell6.position.z + 1;
			spell7.position.z = spell7.position.z + 1;
			spell8.position.z = spell8.position.z + 1;
		}//if
		
		//update xMove and zMove every frame
		xMove = player.position.x;
		zMove = player.position.z;
	}//move
}//playerUI