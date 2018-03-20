/* this script handles the player user interface essentially we build up the UI here
* which displays the various spells the player can cast, their cooldowns, keybinds,
* player's health, gold earned and player status - unlike the menus the UI is created
* within the scene using BABYLON JS and the GUI extension, naturally the GUI extension
* offers a variety of features and the UI here can be built further upon by using those 
* features to create an interactive system that allows spells to be upgraded using gold earned
* and to display what the spells do and their damage numbers when hovered over for example
*/

//load textures for UI, these icons represent the various spells the player can cast
overlayTexture = "static/resources/images/textures/overlay.png";
fireballIcon = "static/resources/images/textures/fireball_icon.png";
frostboltIcon = "static/resources/images/textures/frostbolt_icon.png";
splitterIcon = "static/resources/images/textures/splitter.png";
rechargerIcon = "static/resources/images/textures/recharger.png";
heartIcon = "static/resources/images/textures/heart_icon.png";
goldIcon = "static/resources/images/textures/gold_coin_icon.png";
moltonBoulderIcon = "static/resources/images/textures/moltonBoulder_icon.png";
warlockMarkIcon = "static/resources/images/textures/warlock_mark_icon.png";
deflectionShieldIcon = "static/resources/images/textures/deflection_shield_icon.png";
cauterizeIcon = "static/resources/images/textures/cauterize_icon.png";

//controls the UI move speed, this value should always be the same as player speed
//otherwise the UI would get mispositioned when the player moves
const TRANSITION_SPEED = 1;

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
	//can also add buttons, sliders, checkboxes, virtualKeyboard etc.
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
	statusText.text = "";
	statusText.color = "white";
	statusText.fontSize = 40;
	statusTexture.addControl(statusText);
	
	//cauterize spell, displays amount healed for above the player
	var healthRestored = BABYLON.MeshBuilder.CreatePlane("Health_Restored", {width: 20, height: 20}, scene);
	var healthRestoredTexture = BABYLON.GUI.AdvancedDynamicTexture.CreateForMesh(healthRestored, 120, 120, false);
	var healthText = new BABYLON.GUI.TextBlock();
	healthText.fontFamily = "Comic Sans MS";
	healthText.text = "";
	healthText.color = "lime";
	healthText.fontSize = 40;
	healthRestoredTexture.addControl(healthText);
	
	//-------------------------------------------------------------------------------------------------------------
	//keybinds text on all the spells
	//spell 1 - fireball
	var spellPlane1 = BABYLON.MeshBuilder.CreatePlane("Keybind", {width: 20, height: 20}, scene);
	var spellTexture1 = BABYLON.GUI.AdvancedDynamicTexture.CreateForMesh(spellPlane1, 120, 120, false);
	var spellText1 = new BABYLON.GUI.TextBlock();
	spellText1.fontFamily = "Comic Sans MS";
	spellText1.text = "1";
	spellText1.color = "white";
	spellText1.fontSize = 30;
	spellTexture1.addControl(spellText1);
	
	//spell 2 - frostbolt
	var spellPlane2 = BABYLON.MeshBuilder.CreatePlane("Keybind", {width: 20, height: 20}, scene);
	var spellTexture2 = BABYLON.GUI.AdvancedDynamicTexture.CreateForMesh(spellPlane2, 120, 120, false);
	var spellText2 = new BABYLON.GUI.TextBlock();
	spellText2.fontFamily = "Comic Sans MS";
	spellText2.text = "2";
	spellText2.color = "white";
	spellText2.fontSize = 30;
	spellTexture2.addControl(spellText2);
	
	//spell 3 - splitter
	var spellPlane3 = BABYLON.MeshBuilder.CreatePlane("Keybind", {width: 20, height: 20}, scene);
	var spellTexture3 = BABYLON.GUI.AdvancedDynamicTexture.CreateForMesh(spellPlane3, 120, 120, false);
	var spellText3 = new BABYLON.GUI.TextBlock();
	spellText3.fontFamily = "Comic Sans MS";
	spellText3.text = "3";
	spellText3.color = "white";
	spellText3.fontSize = 30;
	spellTexture3.addControl(spellText3);
	
	//spell 4 - recharger
	var spellPlane4 = BABYLON.MeshBuilder.CreatePlane("Keybind", {width: 20, height: 20}, scene);
	var spellTexture4 = BABYLON.GUI.AdvancedDynamicTexture.CreateForMesh(spellPlane4, 120, 120, false);
	var spellText4 = new BABYLON.GUI.TextBlock();
	spellText4.fontFamily = "Comic Sans MS";
	spellText4.text = "4";
	spellText4.color = "white";
	spellText4.fontSize = 30;
	spellTexture4.addControl(spellText4);
	
	//spell 5 - molten boulder
	var spellPlane5 = BABYLON.MeshBuilder.CreatePlane("Keybind", {width: 20, height: 20}, scene);
	var spellTexture5 = BABYLON.GUI.AdvancedDynamicTexture.CreateForMesh(spellPlane5, 120, 120, false);
	var spellText5 = new BABYLON.GUI.TextBlock();
	spellText5.fontFamily = "Comic Sans MS";
	spellText5.text = "5";
	spellText5.color = "white";
	spellText5.fontSize = 30;
	spellTexture5.addControl(spellText5);
	
	//spell 6 - warlock's mark
	var spellPlane6 = BABYLON.MeshBuilder.CreatePlane("Keybind", {width: 20, height: 20}, scene);
	var spellTexture6 = BABYLON.GUI.AdvancedDynamicTexture.CreateForMesh(spellPlane6, 120, 120, false);
	var spellText6 = new BABYLON.GUI.TextBlock();
	spellText6.fontFamily = "Comic Sans MS";
	spellText6.text = "6";
	spellText6.color = "white";
	spellText6.fontSize = 30;
	spellTexture6.addControl(spellText6);
	
	//spell 7(G) - deflection shield
	var spellPlane7 = BABYLON.MeshBuilder.CreatePlane("Keybind", {width: 20, height: 20}, scene);
	var spellTexture7 = BABYLON.GUI.AdvancedDynamicTexture.CreateForMesh(spellPlane7, 120, 120, false);
	var spellText7 = new BABYLON.GUI.TextBlock();
	spellText7.fontFamily = "Comic Sans MS";
	spellText7.text = "G";
	spellText7.color = "white";
	spellText7.fontSize = 30;
	spellTexture7.addControl(spellText7);
	
	//spell 8(H) - cauterize
	var spellPlane8 = BABYLON.MeshBuilder.CreatePlane("Keybind", {width: 20, height: 20}, scene);
	var spellTexture8 = BABYLON.GUI.AdvancedDynamicTexture.CreateForMesh(spellPlane8, 120, 120, false);
	var spellText8 = new BABYLON.GUI.TextBlock();
	spellText8.fontFamily = "Comic Sans MS";
	spellText8.text = "H";
	spellText8.color = "white";
	spellText8.fontSize = 30;
	spellTexture8.addControl(spellText8);
	//-------------------------------------------------------------------------------------------------------------
	
	//control variables for UI movement
	//these 2 store the x and z position of the previous frame @ this.move
	//starts off as (0,0) same as playerObject, if playerObject starting position changes these values should be adjusted also
	var xMove = 0;
	var zMove = 0;
	
	//adjusting position of overlay at start of game
	this.startingPosition = function(){
		//setting the starting position of the UI
		overlay.setPositionWithLocalVector(new BABYLON.Vector3(0, 21, -183));
		spell1.setPositionWithLocalVector(new BABYLON.Vector3(-90, 21.2, -190));
		spell2.setPositionWithLocalVector(new BABYLON.Vector3(-65, 21.2, -190));
		spell3.setPositionWithLocalVector(new BABYLON.Vector3(-40, 21.2, -190));
		spell4.setPositionWithLocalVector(new BABYLON.Vector3(-15, 21.2, -190));
		spell5.setPositionWithLocalVector(new BABYLON.Vector3(15, 21.2, -190));
		spell6.setPositionWithLocalVector(new BABYLON.Vector3(40, 21.2, -190));
		spell7.setPositionWithLocalVector(new BABYLON.Vector3(65, 21.2, -190));
		spell8.setPositionWithLocalVector(new BABYLON.Vector3(90, 21.2, -190));

		//setting the starting position of the spell borders:
		//borders are planes placed behind the spell planes with a bit more
		//width and height that gives an outline of a border, easier to use
		//than lines which involves declaring 5 vectors for each spell and
		//then translating those 5 vectors everytime the player moves
		spell1Border.setPositionWithLocalVector(new BABYLON.Vector3(-90, 21.1, -190));
		spell2Border.setPositionWithLocalVector(new BABYLON.Vector3(-65, 21.1, -190));
		spell3Border.setPositionWithLocalVector(new BABYLON.Vector3(-40, 21.1, -190));
		spell4Border.setPositionWithLocalVector(new BABYLON.Vector3(-15, 21.1, -190));
		spell5Border.setPositionWithLocalVector(new BABYLON.Vector3(15, 21.1, -190));
		spell6Border.setPositionWithLocalVector(new BABYLON.Vector3(40, 21.1, -190));
		spell7Border.setPositionWithLocalVector(new BABYLON.Vector3(65, 21.1, -190));
		spell8Border.setPositionWithLocalVector(new BABYLON.Vector3(90, 21.1, -190));
		
		//setting the starting position of the hearts
		heart1.setPositionWithLocalVector(new BABYLON.Vector3(-96, 28, -173));
		heart2.setPositionWithLocalVector(new BABYLON.Vector3(-83, 28, -173));	
		heart3.setPositionWithLocalVector(new BABYLON.Vector3(-70, 28, -173));
		
		//setting the starting position of gold text
		goldPlane.setPositionWithLocalVector(new BABYLON.Vector3(82, 28, -173));
		
		//setting the starting position of the gold coin
		goldCoin.setPositionWithLocalVector(new BABYLON.Vector3(96, 28, -174));
		
		//setting the starting position of status text
		status.setPositionWithLocalVector(new BABYLON.Vector3(0, 28, -173));
		
		//setting the starting position of health restored text
		healthRestored.setPositionWithLocalVector(new BABYLON.Vector3(player.position.x, 35, player.position.z));
		
		//setting the starting positon of each spell keybind (text)
		spellPlane1.setPositionWithLocalVector(new BABYLON.Vector3(-97, 28, -185));
		spellPlane2.setPositionWithLocalVector(new BABYLON.Vector3(-72, 28, -185));
		spellPlane3.setPositionWithLocalVector(new BABYLON.Vector3(-47, 28, -185));
		spellPlane4.setPositionWithLocalVector(new BABYLON.Vector3(-22, 28, -185));
		spellPlane5.setPositionWithLocalVector(new BABYLON.Vector3(7, 28, -185));
		spellPlane6.setPositionWithLocalVector(new BABYLON.Vector3(32, 28, -185));
		spellPlane7.setPositionWithLocalVector(new BABYLON.Vector3(57, 28, -185));
		spellPlane8.setPositionWithLocalVector(new BABYLON.Vector3(82, 28, -185));
		
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
		
		//rotate health restored
		healthRestored.rotation.x = -200;
		
		//rotate keybind text
		spellPlane1.rotation.x = -200;
		spellPlane2.rotation.x = -200;
		spellPlane3.rotation.x = -200;
		spellPlane4.rotation.x = -200;
		spellPlane5.rotation.x = -200;
		spellPlane6.rotation.x = -200;
		spellPlane7.rotation.x = -200;
		spellPlane8.rotation.x = -200;
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
		
		//molton boulder
		var moltonBoulderMaterial = new BABYLON.StandardMaterial("moltonBoulderMaterial", scene);
		moltonBoulderMaterial.diffuseTexture = new BABYLON.Texture(moltonBoulderIcon, scene);
		spell5.material = moltonBoulderMaterial;
		
		//warlock's mark
		var warlockMarkMaterial = new BABYLON.StandardMaterial("warlockMarkMaterial", scene);
		warlockMarkMaterial.diffuseTexture = new BABYLON.Texture(warlockMarkIcon, scene);
		spell6.material = warlockMarkMaterial;		
		
		//deflection shield
		var deflectionShieldMaterial = new BABYLON.StandardMaterial("deflectionShieldMaterial", scene);
		deflectionShieldMaterial.diffuseTexture = new BABYLON.Texture(deflectionShieldIcon, scene);
		spell7.material = deflectionShieldMaterial;
		
		//cauterize
		var cauterizeMaterial = new BABYLON.StandardMaterial("cauterizeMaterial", scene);
		cauterizeMaterial.diffuseTexture = new BABYLON.Texture(cauterizeIcon, scene);
		spell8.material = cauterizeMaterial;
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
		else if (spellId == "warlockMark"){
			borderMaterial6.diffuseColor = new BABYLON.Color3(0, 255, 0);
		}//else if
		else if (spellId == "deflectionShield"){
			borderMaterial7.diffuseColor = new BABYLON.Color3(0, 255, 0);
		}//else if
		else if (spellId == "cauterize"){
			borderMaterial8.diffuseColor = new BABYLON.Color3(0, 255, 0);
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
		else if (spellId == "warlockMark"){
			borderMaterial6.diffuseColor = new BABYLON.Color3(255, 0, 0);
		}//else if
		else if (spellId == "deflectionShield"){
			borderMaterial7.diffuseColor = new BABYLON.Color3(255, 0, 0);
		}//else if
		else if (spellId == "cauterize"){
			borderMaterial8.diffuseColor = new BABYLON.Color3(255, 0, 0);
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
	
	//update the health restored text displayed
	this.updateHealthRestored = function(healthRestored){
		var healthString = healthRestored.toString();
		healthText.text = "+" + healthString;
		
		//only display health restored for 4 seconds then hide it
		setTimeout(function() {
			healthText.text = "";
		}, 4000);
	}//updatedHealthRestored
	
	//move the entire UI with the player
	//the following code keeps track of which way the player moves
	//and then moves the UI in the appropriate direction
	//note the TRANSITION_SPEED should be equal to playerObject speed
	this.move = function(){
		//move the UI left
		if(xMove > player.position.x){
			overlay.position.x = overlay.position.x - TRANSITION_SPEED; //overlay position
			//spell1-8 position
			spell1.position.x = spell1.position.x - TRANSITION_SPEED;
			spell2.position.x = spell2.position.x - TRANSITION_SPEED;
			spell3.position.x = spell3.position.x - TRANSITION_SPEED;
			spell4.position.x = spell4.position.x - TRANSITION_SPEED;
			spell5.position.x = spell5.position.x - TRANSITION_SPEED;
			spell6.position.x = spell6.position.x - TRANSITION_SPEED;
			spell7.position.x = spell7.position.x - TRANSITION_SPEED;
			spell8.position.x = spell8.position.x - TRANSITION_SPEED;
			//spell1-8 border position
			spell1Border.position.x = spell1Border.position.x - TRANSITION_SPEED;
			spell2Border.position.x = spell2Border.position.x - TRANSITION_SPEED;
			spell3Border.position.x = spell3Border.position.x - TRANSITION_SPEED;
			spell4Border.position.x = spell4Border.position.x - TRANSITION_SPEED;
			spell5Border.position.x = spell5Border.position.x - TRANSITION_SPEED;
			spell6Border.position.x = spell6Border.position.x - TRANSITION_SPEED;
			spell7Border.position.x = spell7Border.position.x - TRANSITION_SPEED;
			spell8Border.position.x = spell8Border.position.x - TRANSITION_SPEED;
			//heart1-3 position
			heart1.position.x = heart1.position.x - TRANSITION_SPEED;
			heart2.position.x = heart2.position.x - TRANSITION_SPEED;
			heart3.position.x = heart3.position.x - TRANSITION_SPEED;
			//gold text position
			goldPlane.position.x = goldPlane.position.x - TRANSITION_SPEED; 
			//gold coin position
			goldCoin.position.x = goldCoin.position.x - TRANSITION_SPEED;
			//status text position
			status.position.x = status.position.x - TRANSITION_SPEED;
			//health restored text position
			healthRestored.position.x = healthRestored.position.x - TRANSITION_SPEED;
			//keybinds text position
			spellPlane1.position.x = spellPlane1.position.x - TRANSITION_SPEED;
			spellPlane2.position.x = spellPlane2.position.x - TRANSITION_SPEED;
			spellPlane3.position.x = spellPlane3.position.x - TRANSITION_SPEED;
			spellPlane4.position.x = spellPlane4.position.x - TRANSITION_SPEED;
			spellPlane5.position.x = spellPlane5.position.x - TRANSITION_SPEED;
			spellPlane6.position.x = spellPlane6.position.x - TRANSITION_SPEED;
			spellPlane7.position.x = spellPlane7.position.x - TRANSITION_SPEED;
			spellPlane8.position.x = spellPlane8.position.x - TRANSITION_SPEED;
		}//if
		
		//move the UI right
		if(xMove < player.position.x){
			overlay.position.x = overlay.position.x + TRANSITION_SPEED; //overlay position
			//spell1-8 position
			spell1.position.x = spell1.position.x + TRANSITION_SPEED;
			spell2.position.x = spell2.position.x + TRANSITION_SPEED;
			spell3.position.x = spell3.position.x + TRANSITION_SPEED;
			spell4.position.x = spell4.position.x + TRANSITION_SPEED;
			spell5.position.x = spell5.position.x + TRANSITION_SPEED;
			spell6.position.x = spell6.position.x + TRANSITION_SPEED;
			spell7.position.x = spell7.position.x + TRANSITION_SPEED;
			spell8.position.x = spell8.position.x + TRANSITION_SPEED;
			//spell1-8 border position
			spell1Border.position.x = spell1Border.position.x + TRANSITION_SPEED;
			spell2Border.position.x = spell2Border.position.x + TRANSITION_SPEED;
			spell3Border.position.x = spell3Border.position.x + TRANSITION_SPEED;
			spell4Border.position.x = spell4Border.position.x + TRANSITION_SPEED;
			spell5Border.position.x = spell5Border.position.x + TRANSITION_SPEED;
			spell6Border.position.x = spell6Border.position.x + TRANSITION_SPEED;
			spell7Border.position.x = spell7Border.position.x + TRANSITION_SPEED;
			spell8Border.position.x = spell8Border.position.x + TRANSITION_SPEED;
			//heart1-3 position
			heart1.position.x = heart1.position.x + TRANSITION_SPEED;
			heart2.position.x = heart2.position.x + TRANSITION_SPEED;
			heart3.position.x = heart3.position.x + TRANSITION_SPEED;
			//gold text position
			goldPlane.position.x = goldPlane.position.x + TRANSITION_SPEED;
			//gold coin position
			goldCoin.position.x = goldCoin.position.x + TRANSITION_SPEED;
			//status text position
			status.position.x = status.position.x + TRANSITION_SPEED;
			//health restored text position
			healthRestored.position.x = healthRestored.position.x + TRANSITION_SPEED;
			//keybinds text position
			spellPlane1.position.x = spellPlane1.position.x + TRANSITION_SPEED;
			spellPlane2.position.x = spellPlane2.position.x + TRANSITION_SPEED;
			spellPlane3.position.x = spellPlane3.position.x + TRANSITION_SPEED;
			spellPlane4.position.x = spellPlane4.position.x + TRANSITION_SPEED;
			spellPlane5.position.x = spellPlane5.position.x + TRANSITION_SPEED;
			spellPlane6.position.x = spellPlane6.position.x + TRANSITION_SPEED;
			spellPlane7.position.x = spellPlane7.position.x + TRANSITION_SPEED;
			spellPlane8.position.x = spellPlane8.position.x + TRANSITION_SPEED;
		}//if
		
		//move the UI downwards
		if(zMove > player.position.z){
			overlay.position.z = overlay.position.z - TRANSITION_SPEED; //overlay position
			//spell1-8 position
			spell1.position.z = spell1.position.z - TRANSITION_SPEED;
			spell2.position.z = spell2.position.z - TRANSITION_SPEED;
			spell3.position.z = spell3.position.z - TRANSITION_SPEED;
			spell4.position.z = spell4.position.z - TRANSITION_SPEED;
			spell5.position.z = spell5.position.z - TRANSITION_SPEED;
			spell6.position.z = spell6.position.z - TRANSITION_SPEED;
			spell7.position.z = spell7.position.z - TRANSITION_SPEED;
			spell8.position.z = spell8.position.z - TRANSITION_SPEED;
			//spell1-8 border position
			spell1Border.position.z = spell1Border.position.z - TRANSITION_SPEED;
			spell2Border.position.z = spell2Border.position.z - TRANSITION_SPEED;
			spell3Border.position.z = spell3Border.position.z - TRANSITION_SPEED;
			spell4Border.position.z = spell4Border.position.z - TRANSITION_SPEED;
			spell5Border.position.z = spell5Border.position.z - TRANSITION_SPEED;
			spell6Border.position.z = spell6Border.position.z - TRANSITION_SPEED;
			spell7Border.position.z = spell7Border.position.z - TRANSITION_SPEED;
			spell8Border.position.z = spell8Border.position.z - TRANSITION_SPEED;
			//heart1-3 position
			heart1.position.z = heart1.position.z - TRANSITION_SPEED;
			heart2.position.z = heart2.position.z - TRANSITION_SPEED;
			heart3.position.z = heart3.position.z - TRANSITION_SPEED;
			//gold text position
			goldPlane.position.z = goldPlane.position.z - TRANSITION_SPEED;
			//gold coin position
			goldCoin.position.z = goldCoin.position.z - TRANSITION_SPEED;
			//status text position
			status.position.z = status.position.z - TRANSITION_SPEED;
			//health restored text position
			healthRestored.position.z = healthRestored.position.z - TRANSITION_SPEED;
			//keybinds text position
			spellPlane1.position.z = spellPlane1.position.z - TRANSITION_SPEED;
			spellPlane2.position.z = spellPlane2.position.z - TRANSITION_SPEED;
			spellPlane3.position.z = spellPlane3.position.z - TRANSITION_SPEED;
			spellPlane4.position.z = spellPlane4.position.z - TRANSITION_SPEED;
			spellPlane5.position.z = spellPlane5.position.z - TRANSITION_SPEED;
			spellPlane6.position.z = spellPlane6.position.z - TRANSITION_SPEED;
			spellPlane7.position.z = spellPlane7.position.z - TRANSITION_SPEED;
			spellPlane8.position.z = spellPlane8.position.z - TRANSITION_SPEED;
		}//if
		
		//move the UI upwards
		if(zMove < player.position.z){
			overlay.position.z = overlay.position.z + TRANSITION_SPEED; //overlay position
			//spell1-8 position
			spell1.position.z = spell1.position.z + TRANSITION_SPEED;
			spell2.position.z = spell2.position.z + TRANSITION_SPEED;
			spell3.position.z = spell3.position.z + TRANSITION_SPEED;
			spell4.position.z = spell4.position.z + TRANSITION_SPEED;
			spell5.position.z = spell5.position.z + TRANSITION_SPEED;
			spell6.position.z = spell6.position.z + TRANSITION_SPEED;
			spell7.position.z = spell7.position.z + TRANSITION_SPEED;
			spell8.position.z = spell8.position.z + TRANSITION_SPEED;
			//spell1-8 border position
			spell1Border.position.z = spell1Border.position.z + TRANSITION_SPEED;
			spell2Border.position.z = spell2Border.position.z + TRANSITION_SPEED;
			spell3Border.position.z = spell3Border.position.z + TRANSITION_SPEED;
			spell4Border.position.z = spell4Border.position.z + TRANSITION_SPEED;
			spell5Border.position.z = spell5Border.position.z + TRANSITION_SPEED;
			spell6Border.position.z = spell6Border.position.z + TRANSITION_SPEED;
			spell7Border.position.z = spell7Border.position.z + TRANSITION_SPEED;
			spell8Border.position.z = spell8Border.position.z + TRANSITION_SPEED;
			//heart1-3 position
			heart1.position.z = heart1.position.z + TRANSITION_SPEED;
			heart2.position.z = heart2.position.z + TRANSITION_SPEED;
			heart3.position.z = heart3.position.z + TRANSITION_SPEED;
			//gold text position
			goldPlane.position.z = goldPlane.position.z + TRANSITION_SPEED;
			//gold coin position
			goldCoin.position.z = goldCoin.position.z + TRANSITION_SPEED;
			//status text position
			status.position.z = status.position.z + TRANSITION_SPEED;
			//health restored text position
			healthRestored.position.z = healthRestored.position.z + TRANSITION_SPEED;
			//keybinds text position
			spellPlane1.position.z = spellPlane1.position.z + TRANSITION_SPEED;
			spellPlane2.position.z = spellPlane2.position.z + TRANSITION_SPEED;
			spellPlane3.position.z = spellPlane3.position.z + TRANSITION_SPEED;
			spellPlane4.position.z = spellPlane4.position.z + TRANSITION_SPEED;
			spellPlane5.position.z = spellPlane5.position.z + TRANSITION_SPEED;
			spellPlane6.position.z = spellPlane6.position.z + TRANSITION_SPEED;
			spellPlane7.position.z = spellPlane7.position.z + TRANSITION_SPEED;
			spellPlane8.position.z = spellPlane8.position.z + TRANSITION_SPEED;
		}//if
		
		//update xMove and zMove every frame
		xMove = player.position.x;
		zMove = player.position.z;
	}//move
}//playerUI