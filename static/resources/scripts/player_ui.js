//load textures for UI
overlayTexture = "static/resources/images/textures/overlay.png";
fireballIcon = "static/resources/images/textures/fireball_icon.png";
frostboltIcon = "static/resources/images/textures/frostbolt_icon.png";
splitterIcon = "static/resources/images/textures/splitter.png";
rechargerIcon = "static/resources/images/textures/recharger.png";
heartIcon = "static/resources/images/textures/heart_icon.png";
goldIcon = "static/resources/images/textures/gold_coin_icon.png";
moltonBoulderIcon = "static/resources/images/textures/moltonBoulder_icon.png";

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
	
	//spell borders
	var spell1Border = BABYLON.MeshBuilder.CreatePlane("UI-Border", {width: 21, height: 21}, scene);
	var spell2Border = BABYLON.MeshBuilder.CreatePlane("UI-Border", {width: 21, height: 21}, scene);
	var spell3Border = BABYLON.MeshBuilder.CreatePlane("UI-Border", {width: 21, height: 21}, scene);
	var spell4Border = BABYLON.MeshBuilder.CreatePlane("UI-Border", {width: 21, height: 21}, scene);
	var spell5Border = BABYLON.MeshBuilder.CreatePlane("UI-Border", {width: 21, height: 21}, scene);
	var spell6Border = BABYLON.MeshBuilder.CreatePlane("UI-Border", {width: 21, height: 21}, scene);
	var spell7Border = BABYLON.MeshBuilder.CreatePlane("UI-Border", {width: 21, height: 21}, scene);
	var spell8Border = BABYLON.MeshBuilder.CreatePlane("UI-Border", {width: 21, height: 21}, scene);
	
	//player health
	var heart1 = BABYLON.MeshBuilder.CreatePlane("UI-Border", {width: 10, height: 10}, scene);
	var heart2 = BABYLON.MeshBuilder.CreatePlane("UI-Border", {width: 10, height: 10}, scene);
	var heart3 = BABYLON.MeshBuilder.CreatePlane("UI-Border", {width: 10, height: 10}, scene);
	
	//gold text using AdvancedDynamicTexture - babylon_gui_min.js
	var goldPlane = BABYLON.MeshBuilder.CreatePlane("UI-Gold-Plane", {width: 20, height: 20}, scene);
	//BABYLON.GUI.AdvancedDynamicTexture.CreateForMesh(mesh, width, height, pointerEvents);
	//setting the width and height higher than the goldPlane to achieve a crispier text otherwise if
	//the width and height are the same as the goldPlane the text is blurry, setting pointerEvents to false
	//since tracking that is costly and unnecessary in this case
	var goldTexture = BABYLON.GUI.AdvancedDynamicTexture.CreateForMesh(goldPlane, 120, 120, false);
	//adding a control(text) to the AdvancedDynamicTexture with various settings,
	//can also add buttons, sliders, checkboxes, virtualKeyboard etc - will add some of these to a different menu
	var goldText = new BABYLON.GUI.TextBlock();
	goldText.fontFamily = "Comic Sans MS";
	goldText.text = "0";
	goldText.color = "yellow";
	goldText.fontSize = 40;
	goldTexture.addControl(goldText);
	
	//gold coin
	var goldCoin = BABYLON.MeshBuilder.CreatePlane("UI-Gold-Coin", {width: 11, height: 11}, scene);
	
	//player status - collsion/on fire/frozen etc.
	var status = BABYLON.MeshBuilder.CreatePlane("UI-Gold-Coin", {width: 60, height: 20}, scene);
	//same approach as gold text - bigger text @ center of UI
	var statusTexture = BABYLON.GUI.AdvancedDynamicTexture.CreateForMesh(status, 160, 120, false);
	var statusText = new BABYLON.GUI.TextBlock();
	statusText.fontFamily = "Comic Sans MS";
	statusText.text = "Status";
	statusText.color = "white";
	statusText.fontSize = 50;
	statusTexture.addControl(statusText);
	
	//control variables for UI movement
	//these 2 store the x and z position of the previous frame @ this.move
	//starts off as (0,0) same as playerObject, if playerObject starting position changes these values should be adjusted also
	var xMove = 0;
	var zMove = 0;
	
	//adjusting position of overlay at start of game
	this.startingPosition = function(){
		//setting the starting position of the UI
		overlay.setPositionWithLocalVector(new BABYLON.Vector3(0, 21, -150));
		spell1.setPositionWithLocalVector(new BABYLON.Vector3(-90, 21.2, -157));
		spell2.setPositionWithLocalVector(new BABYLON.Vector3(-65, 21.2, -157));
		spell3.setPositionWithLocalVector(new BABYLON.Vector3(-40, 21.2, -157));
		spell4.setPositionWithLocalVector(new BABYLON.Vector3(-15, 21.2, -157));
		spell5.setPositionWithLocalVector(new BABYLON.Vector3(15, 21.2, -157));
		spell6.setPositionWithLocalVector(new BABYLON.Vector3(40, 21.2, -157));
		spell7.setPositionWithLocalVector(new BABYLON.Vector3(65, 21.2, -157));
		spell8.setPositionWithLocalVector(new BABYLON.Vector3(90, 21.2, -157));

		//setting the starting position of the spell borders:
		//borders are planes placed behind the spell planes with a bit more
		//width and height that gives an outline of a border, easier to use
		//than lines which involves declaring 5 vectors for each spell and
		//then translating those 5 vectors everytime the player moves
		spell1Border.setPositionWithLocalVector(new BABYLON.Vector3(-90, 21.1, -157));
		spell2Border.setPositionWithLocalVector(new BABYLON.Vector3(-65, 21.1, -157));
		spell3Border.setPositionWithLocalVector(new BABYLON.Vector3(-40, 21.1, -157));
		spell4Border.setPositionWithLocalVector(new BABYLON.Vector3(-15, 21.1, -157));
		spell5Border.setPositionWithLocalVector(new BABYLON.Vector3(15, 21.1, -157));
		spell6Border.setPositionWithLocalVector(new BABYLON.Vector3(40, 21.1, -157));
		spell7Border.setPositionWithLocalVector(new BABYLON.Vector3(65, 21.1, -157));
		spell8Border.setPositionWithLocalVector(new BABYLON.Vector3(90, 21.1, -157));
		
		//setting the starting position of the hearts
		heart1.setPositionWithLocalVector(new BABYLON.Vector3(-96, 28, -140));
		heart2.setPositionWithLocalVector(new BABYLON.Vector3(-83, 28, -140));	
		heart3.setPositionWithLocalVector(new BABYLON.Vector3(-70, 28, -140));
		
		//setting the starting position of gold text
		goldPlane.setPositionWithLocalVector(new BABYLON.Vector3(82, 28, -140));
		
		//setting the starting position of the gold coin
		goldCoin.setPositionWithLocalVector(new BABYLON.Vector3(96, 28, -141));
		
		//setting the starting position of status text
		status.setPositionWithLocalVector(new BABYLON.Vector3(0, 28, -140));
		
		//rotate the UI towards the camera,
		//otherwise all the planes are on their side and cannot be seen
		overlay.rotation.x = -200;
		spell1.rotation.x = -200;
		spell2.rotation.x = -200;
		spell3.rotation.x = -200;
		spell4.rotation.x = -200;
		spell5.rotation.x = -200;
		spell6.rotation.x = -200;
		spell7.rotation.x = -200;
		spell8.rotation.x = -200;
		
		//rotate borders
		spell1Border.rotation.x = -200;
		spell2Border.rotation.x = -200;
		spell3Border.rotation.x = -200;
		spell4Border.rotation.x = -200;
		spell5Border.rotation.x = -200;
		spell6Border.rotation.x = -200;
		spell7Border.rotation.x = -200;
		spell8Border.rotation.x = -200;
		
		//rotate hearts
		heart1.rotation.x = -200;
		heart2.rotation.x = -200;
		heart3.rotation.x = -200;
		
		//rotate gold
		goldPlane.rotation.x = -200;
		goldCoin.rotation.x = -200;
		
		//rotate status
		status.rotation.x = - 200;
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
		
		//assign material to gold coin
		var goldCoinMaterial = new BABYLON.StandardMaterial("goldCoinMaterial", scene);
		goldCoinMaterial.diffuseTexture = new BABYLON.Texture(goldIcon, scene);
		goldCoinMaterial.opacityTexture = new BABYLON.Texture(goldIcon, scene);
		goldCoin.material = goldCoinMaterial;
		
		//hide the plane and only display the texture
		goldCoinMaterial.diffuseTexture.hasAlpha = true;
		
		//assign material to spells
		//fireball
		var fireballMaterial = new BABYLON.StandardMaterial("fireballMaterial", scene);
		fireballMaterial.diffuseTexture = new BABYLON.Texture(fireballIcon, scene);
		spell1.material = fireballMaterial;
		
		//frostbolt
		var frostboltMaterial = new BABYLON.StandardMaterial("frostboltMaterial", scene); 
		frostboltMaterial.diffuseTexture = new BABYLON.Texture(frostboltIcon, scene);
		spell2.material = frostboltMaterial;
		
		//splitter
		var splitterMaterial = new BABYLON.StandardMaterial("splitterMaterial", scene);
		splitterMaterial.diffuseTexture = new BABYLON.Texture(splitterIcon, scene);
		spell3.material = splitterMaterial;
		
		//recharger
		var rechargerMaterial = new BABYLON.StandardMaterial("rechargerMaterial", scene);
		rechargerMaterial.diffuseTexture = new BABYLON.Texture(rechargerIcon, scene);
		spell4.material = rechargerMaterial;
		
		//molton boulder
		var moltonBoulderMaterial = new BABYLON.StandardMaterial("moltonBoulderMaterial", scene);
		moltonBoulderMaterial.diffuseTexture = new BABYLON.Texture(moltonBoulderIcon, scene);
		spell5.material = moltonBoulderMaterial;
	}//setTextures
	
	//each spell border has their own material in order to change color red/green
	//to indicate that the spell is on or off cooldown
	var borderMaterial1 = new BABYLON.StandardMaterial("UI-Border-Material", scene);
	var borderMaterial2 = new BABYLON.StandardMaterial("UI-Border-Material", scene);
	var borderMaterial3 = new BABYLON.StandardMaterial("UI-Border-Material", scene);
	var borderMaterial4 = new BABYLON.StandardMaterial("UI-Border-Material", scene);
	var borderMaterial5 = new BABYLON.StandardMaterial("UI-Border-Material", scene);
	var borderMaterial6 = new BABYLON.StandardMaterial("UI-Border-Material", scene);
	var borderMaterial7 = new BABYLON.StandardMaterial("UI-Border-Material", scene);
	var borderMaterial8 = new BABYLON.StandardMaterial("UI-Border-Material", scene);
	
	//apply material to the borders
	this.setBorders = function(){
		//set color of material to green
		borderMaterial1.diffuseColor = new BABYLON.Color3(0, 255, 0);
		borderMaterial2.diffuseColor = new BABYLON.Color3(0, 255, 0);
		borderMaterial3.diffuseColor = new BABYLON.Color3(0, 255, 0);
		borderMaterial4.diffuseColor = new BABYLON.Color3(0, 255, 0);
		borderMaterial5.diffuseColor = new BABYLON.Color3(0, 255, 0);
		borderMaterial6.diffuseColor = new BABYLON.Color3(0, 255, 0);
		borderMaterial7.diffuseColor = new BABYLON.Color3(0, 255, 0);
		borderMaterial8.diffuseColor = new BABYLON.Color3(0, 255, 0);
		
		//assign material to spell borders
		spell1Border.material = borderMaterial1;
		spell2Border.material = borderMaterial2;
		spell3Border.material = borderMaterial3;
		spell4Border.material = borderMaterial4;
		spell5Border.material = borderMaterial5;
		spell6Border.material = borderMaterial6;
		spell7Border.material = borderMaterial7;
		spell8Border.material = borderMaterial8;
	}//setBorders
	
	//changes the spell border to green to indicate that the spell
	//is off cooldown and the player can cast it
	this.cooldownOff = function(spellId){
		if (spellId == "fireball"){
			borderMaterial1.diffuseColor = new BABYLON.Color3(0, 255, 0);
		}//if
		else if (spellId == "frostbolt"){
			borderMaterial2.diffuseColor = new BABYLON.Color3(0, 255, 0);
		}//else if
		else if (spellId == "splitter"){
			borderMaterial3.diffuseColor = new BABYLON.Color3(0, 255, 0);
		}//else if
		else if (spellId == "recharger"){
			borderMaterial4.diffuseColor = new BABYLON.Color3(0, 255, 0);
		}//else if
		else if (spellId == "moltonBoulder"){
			borderMaterial5.diffuseColor = new BABYLON.Color3(0, 255, 0);
		}//else if
		else {
			console.log("Player cast an unidentified spell!")
		}//else
	}//cooldownOff
	
	//changes the spell border to red to indicate that the spell
	//is on cooldown and the player can't cast it
	this.cooldownOn = function(spellId){
		if (spellId == "fireball"){
			borderMaterial1.diffuseColor = new BABYLON.Color3(255, 0, 0);
		}//if
		else if (spellId == "frostbolt"){
			borderMaterial2.diffuseColor = new BABYLON.Color3(255, 0, 0);
		}//else if
		else if (spellId == "splitter"){
			borderMaterial3.diffuseColor = new BABYLON.Color3(255, 0, 0);
		}//else if
		else if (spellId == "recharger"){
			borderMaterial4.diffuseColor = new BABYLON.Color3(255, 0, 0);
		}//else if
		else if (spellId == "moltonBoulder"){
			borderMaterial5.diffuseColor = new BABYLON.Color3(255, 0, 0);
		}//else if
		else {
			console.log("Player cast an unidentified spell!")
		}//else
	}//cooldownOn

	//declaring material for each heart
	var heartMat1 = new BABYLON.StandardMaterial("UI-Heart-Material", scene);
	var heartMat2 = new BABYLON.StandardMaterial("UI-Heart-Material", scene);
	var heartMat3 = new BABYLON.StandardMaterial("UI-Heart-Material", scene);
	
	//set the textures for the hearts:
	//textures are set to hide the plane and only display the texture
	//opacity in this case affects the texture itself and not the plane
	this.setHeartTextures = function(){
		//heart 1
		heartMat1.diffuseTexture = new BABYLON.Texture(heartIcon, scene);
		heartMat1.opacityTexture = new BABYLON.Texture(heartIcon, scene);
		heart1.material = heartMat1;
		
		//heart 2
		heartMat2.diffuseTexture = new BABYLON.Texture(heartIcon, scene);
		heartMat2.opacityTexture = new BABYLON.Texture(heartIcon, scene);
		heart2.material = heartMat2;
		
		//heart 3
		heartMat3.diffuseTexture = new BABYLON.Texture(heartIcon, scene);
		heartMat3.opacityTexture = new BABYLON.Texture(heartIcon, scene);
		heart3.material = heartMat3;
		
		//hide the plane and only display the texture
		heartMat1.diffuseTexture.hasAlpha = true;
		heartMat2.diffuseTexture.hasAlpha = true;
		heartMat3.diffuseTexture.hasAlpha = true;
	}//setHeartTextures

	//decrease or increase the visibility of the hearts
	//when the player health changes
	this.updateHealth = function(health){
		if (health == 150){
			heartMat1.alpha = 1;
			heartMat2.alpha = 1;
			heartMat3.alpha = 1;
		}//if
		else if (health == 140){
			heartMat3.alpha = 0.8;
		}//else if
		else if (health == 130){
			heartMat3.alpha = 0.6;
		}//else if
		else if (health == 120){
			heartMat3.alpha = 0.4;
		}//else if
		else if (health == 110){
			heartMat3.alpha = 0.2;
		}//else if
		else if (health == 100){
			heartMat1.alpha = 1;
			heartMat2.alpha = 1;
			heartMat3.alpha = 0;
		}//else if
		else if (health == 90){
			heartMat2.alpha = 0.8;
		}//else if
		else if (health == 80){
			heartMat2.alpha = 0.6;
		}//else if
		else if (health == 70){
			heartMat2.alpha = 0.4;
		}//else if
		else if (health == 60){
			heartMat2.alpha = 0.2;
		}//else if
		else if (health == 50){
			heartMat1.alpha = 1;
			heartMat2.alpha = 0;
			heartMat3.alpha = 0;
		}//else if
		else if (health == 40){
			heartMat1.alpha = 0.8;
		}//else if
		else if (health == 30){
			heartMat1.alpha = 0.6;
		}//else if
		else if (health == 20){
			heartMat1.alpha = 0.4;
		}//else if
		else if (health == 10){
			heartMat1.alpha = 0.2;
		}//else if
		else if (health == 0){
			heartMat1.alpha = 0;
			heartMat2.alpha = 0;
			heartMat3.alpha = 0;
		}//else if 
	}//updateHealth
	
	//update the amount of gold displayed
	this.updateGold = function(gold){
		//GUI textblock only accepts string
		var goldString = gold.toString();
		goldText.text = goldString;
	}//updateGold
	
	//update the status text displayed
	this.updateStatus = function(status, color){
		statusText.text = status;
		statusText.color = color;
	}//updateGold
	
	//move the entire UI with the player
	//the following code keeps track of which way the player moves
	//and then moves the UI in the appropriate direction
	//note the "1" should be equal to playerObject speed
	this.move = function(){
		//move the UI left
		if(xMove > player.position.x){
			overlay.position.x = overlay.position.x - 1; //overlay position
			//spell1-8 position
			spell1.position.x = spell1.position.x - 1;
			spell2.position.x = spell2.position.x - 1;
			spell3.position.x = spell3.position.x - 1;
			spell4.position.x = spell4.position.x - 1;
			spell5.position.x = spell5.position.x - 1;
			spell6.position.x = spell6.position.x - 1;
			spell7.position.x = spell7.position.x - 1;
			spell8.position.x = spell8.position.x - 1;
			//spell1-8 border position
			spell1Border.position.x = spell1Border.position.x - 1;
			spell2Border.position.x = spell2Border.position.x - 1;
			spell3Border.position.x = spell3Border.position.x - 1;
			spell4Border.position.x = spell4Border.position.x - 1;
			spell5Border.position.x = spell5Border.position.x - 1;
			spell6Border.position.x = spell6Border.position.x - 1;
			spell7Border.position.x = spell7Border.position.x - 1;
			spell8Border.position.x = spell8Border.position.x - 1;
			//heart1-3 position
			heart1.position.x = heart1.position.x - 1;
			heart2.position.x = heart2.position.x - 1;
			heart3.position.x = heart3.position.x - 1;
			//gold text position
			goldPlane.position.x = goldPlane.position.x - 1; 
			//gold coin position
			goldCoin.position.x = goldCoin.position.x - 1;
			//status text position
			status.position.x = status.position.x - 1;
		}//if
		
		//move the UI right
		if(xMove < player.position.x){
			overlay.position.x = overlay.position.x + 1; //overlay position
			//spell1-8 position
			spell1.position.x = spell1.position.x + 1;
			spell2.position.x = spell2.position.x + 1;
			spell3.position.x = spell3.position.x + 1;
			spell4.position.x = spell4.position.x + 1;
			spell5.position.x = spell5.position.x + 1;
			spell6.position.x = spell6.position.x + 1;
			spell7.position.x = spell7.position.x + 1;
			spell8.position.x = spell8.position.x + 1;
			//spell1-8 border position
			spell1Border.position.x = spell1Border.position.x + 1;
			spell2Border.position.x = spell2Border.position.x + 1;
			spell3Border.position.x = spell3Border.position.x + 1;
			spell4Border.position.x = spell4Border.position.x + 1;
			spell5Border.position.x = spell5Border.position.x + 1;
			spell6Border.position.x = spell6Border.position.x + 1;
			spell7Border.position.x = spell7Border.position.x + 1;
			spell8Border.position.x = spell8Border.position.x + 1;
			//heart1-3 position
			heart1.position.x = heart1.position.x + 1;
			heart2.position.x = heart2.position.x + 1;
			heart3.position.x = heart3.position.x + 1;
			//gold text position
			goldPlane.position.x = goldPlane.position.x + 1;
			//gold coin position
			goldCoin.position.x = goldCoin.position.x + 1;
			//status text position
			status.position.x = status.position.x + 1;
		}//if
		
		//move the UI downwards
		if(zMove > player.position.z){
			overlay.position.z = overlay.position.z - 1; //overlay position
			//spell1-8 position
			spell1.position.z = spell1.position.z - 1;
			spell2.position.z = spell2.position.z - 1;
			spell3.position.z = spell3.position.z - 1;
			spell4.position.z = spell4.position.z - 1;
			spell5.position.z = spell5.position.z - 1;
			spell6.position.z = spell6.position.z - 1;
			spell7.position.z = spell7.position.z - 1;
			spell8.position.z = spell8.position.z - 1;
			//spell1-8 border position
			spell1Border.position.z = spell1Border.position.z - 1;
			spell2Border.position.z = spell2Border.position.z - 1;
			spell3Border.position.z = spell3Border.position.z - 1;
			spell4Border.position.z = spell4Border.position.z - 1;
			spell5Border.position.z = spell5Border.position.z - 1;
			spell6Border.position.z = spell6Border.position.z - 1;
			spell7Border.position.z = spell7Border.position.z - 1;
			spell8Border.position.z = spell8Border.position.z - 1;
			//heart1-3 position
			heart1.position.z = heart1.position.z - 1;
			heart2.position.z = heart2.position.z - 1;
			heart3.position.z = heart3.position.z - 1;
			//gold text position
			goldPlane.position.z = goldPlane.position.z - 1;
			//gold coin position
			goldCoin.position.z = goldCoin.position.z - 1;
			//status text position
			status.position.z = status.position.z - 1;
		}//if
		
		//move the UI upwards
		if(zMove < player.position.z){
			overlay.position.z = overlay.position.z + 1; //overlay position
			//spell1-8 position
			spell1.position.z = spell1.position.z + 1;
			spell2.position.z = spell2.position.z + 1;
			spell3.position.z = spell3.position.z + 1;
			spell4.position.z = spell4.position.z + 1;
			spell5.position.z = spell5.position.z + 1;
			spell6.position.z = spell6.position.z + 1;
			spell7.position.z = spell7.position.z + 1;
			spell8.position.z = spell8.position.z + 1;
			//spell1-8 border position
			spell1Border.position.z = spell1Border.position.z + 1;
			spell2Border.position.z = spell2Border.position.z + 1;
			spell3Border.position.z = spell3Border.position.z + 1;
			spell4Border.position.z = spell4Border.position.z + 1;
			spell5Border.position.z = spell5Border.position.z + 1;
			spell6Border.position.z = spell6Border.position.z + 1;
			spell7Border.position.z = spell7Border.position.z + 1;
			spell8Border.position.z = spell8Border.position.z + 1;
			//heart1-3 position
			heart1.position.z = heart1.position.z + 1;
			heart2.position.z = heart2.position.z + 1;
			heart3.position.z = heart3.position.z + 1;
			//gold text position
			goldPlane.position.z = goldPlane.position.z + 1;
			//gold coin position
			goldCoin.position.z = goldCoin.position.z + 1;
			//status text position
			status.position.z = status.position.z + 1;
		}//if
		
		//update xMove and zMove every frame
		xMove = player.position.x;
		zMove = player.position.z;
	}//move
}//playerUI