/* this script contains code for creating the player grid which as the game progresses reduces in size
* and this limits the area the players can stand on without taking damage which makes the battle more difficult
* the longer the game goes on, there is a bit of testing code in this script which allows us to experiment with
* various grid sizes and different looking grids by switching textures which can be useful for creating seasonal
* events i.e during a holiday season some of the textures can be switched to represent the season, changing the grid
* size is also beneficial for finding the right grid size depending on the number of players in the game to keep it balanced
*/

console.log("Player Grid Ready!");

//max number of plane rows
const MAX_ROWS = 16;
//material switch timers control when grid material switches to a different material
//fade out timers control when grid planes fade out and boundaries increase
//each grid plane parameter "rectangle" is assigned a different timer starting from the outer rectangle
const MATERIAL_SWITCH_TIMER_0 = 20000;
const FADE_OUT_TIMER_0 = 22000;

const MATERIAL_SWITCH_TIMER_1 = 32000; 
const FADE_OUT_TIMER_1 = 34000;

const MATERIAL_SWITCH_TIMER_2 = 44000; 
const FADE_OUT_TIMER_2 = 46000;

const MATERIAL_SWITCH_TIMER_3 = 56000; 
const FADE_OUT_TIMER_3 = 58000;

const MATERIAL_SWITCH_TIMER_4 = 68000; 
const FADE_OUT_TIMER_4 = 70000;

const MATERIAL_SWITCH_TIMER_5 = 80000;
const FADE_OUT_TIMER_5 = 82000;

const MATERIAL_SWITCH_TIMER_6 = 92000; 
const FADE_OUT_TIMER_6 = 94000;
//planes parameter array
var planes = [];
//several small arrays for grid planes
//16 small arrays instead of 1 large for easier animation control
var planesA = [], planesB = [], planesC = [], planesD = [], planesE = [], planesF = [], planesG = [], planesH = [],
    planesI = [], planesJ = [], planesK = [], planesL = [], planesM = [], planesN = [], planesO = [], planesP = [];

//images for testing
var planeTop = "static/resources/images/testing_images/top.png";
var planeBottom = "static/resources/images/testing_images/bottom.png";
var planeRight = "static/resources/images/testing_images/right.png";
var planeLeft = "static/resources/images/testing_images/left.png";
var planeA = "static/resources/images/testing_images/a.png";
var planeB = "static/resources/images/testing_images/b.png";
var planeC = "static/resources/images/testing_images/c.png";
var planeD = "static/resources/images/testing_images/d.png";
var planeE = "static/resources/images/testing_images/e.png";
var planeF = "static/resources/images/testing_images/f.png";
var planeG = "static/resources/images/testing_images/g.png";
var planeH = "static/resources/images/testing_images/h.png";
var planeI = "static/resources/images/testing_images/i.png";
var planeJ = "static/resources/images/testing_images/j.png";
var planeK = "static/resources/images/testing_images/k.png";
var planeL = "static/resources/images/testing_images/l.png";
var planeM = "static/resources/images/testing_images/m.png";
var planeN = "static/resources/images/testing_images/n.png";
var planeO = "static/resources/images/testing_images/o.png";
var planeP = "static/resources/images/testing_images/p.png";

//textures for plane tiles
var customTile0 = "static/resources/images/textures/customTile0.png";
var customTile1 = "static/resources/images/textures/customTile1.png";

//boundaries @ Player move() - if the player goes beyond the boundaries onGrid = false
//then take damage from lava, boundaries are increased the longer the game goes on @ playerGrid fadeOutAnimation()
var boundaryLeft = -212.5; //if x < player.position.x....
var boundaryRight = 187; //if x > player.position.x....
var boundaryTop = 262.5; //if z > player.position.z....
var boundaryBottom = -187.5; //if z < player.position.z....
//everytime a layer fades out:
//								boundaryLeft + width
//								boundaryRight - width
//								boundaryTop - height
//								boundaryBottom + height
//currently hardcoded values for boundaries - if size of grid changes must adjust these values

//player grid object
var playerGrid = function(x, y, z, planeHeight, planeWidth, planeNum) {
	this.x = x;
	this.y = y;
	this.z = z;
	this.planeHeight = planeHeight;
	this.planeWidth = planeWidth;
	this.planeNum = planeNum;
	
	//draw the parameter - very flexible, can change any property...
	//e.g. max rows, (x,y,z), number of planes, width/height, textures etc.
	//grid adapts to all changes and fits into place - can easily create n player map where n is the number of players
	this.drawParameter = function(){
		var a,b,c; //array indexing
		
		//initialize materials for testing
		var top = new BABYLON.StandardMaterial("top", scene);
		var bottom = new BABYLON.StandardMaterial("bottom", scene);
		var right = new BABYLON.StandardMaterial("right", scene);
		var left = new BABYLON.StandardMaterial("left", scene);
		
		//assign textures to materials
		top.diffuseTexture = new BABYLON.Texture(planeTop, scene);
		bottom.diffuseTexture = new BABYLON.Texture(planeBottom, scene);
		right.diffuseTexture = new BABYLON.Texture(planeRight, scene);
		left.diffuseTexture = new BABYLON.Texture(planeLeft, scene);
		
		//top planes -->
		for (i = 0; i < planeNum; i++){
			planes[i] = BABYLON.MeshBuilder.CreatePlane("plane", {height: planeHeight, width: planeWidth}, scene); //create plane
			planes[i].setPositionWithLocalVector(new BABYLON.Vector3(x, y, z)); //set plane position
			planes[i].material = top; //set material
			x = x + planeWidth; //increment x position
			planes[i].rotation.x = -300; //rotate the plane
		}//for
		
		//adjust position
		x = x - planeWidth;
		z = z - planeHeight;
		a = planeNum;
		
		//right planes decending
		for (i = 0; i < MAX_ROWS; i++) {
			planes[a] = BABYLON.MeshBuilder.CreatePlane("plane", {height: planeHeight, width: planeWidth}, scene); //create plane
			planes[a].setPositionWithLocalVector(new BABYLON.Vector3(x, y, z)); //set plane position
			planes[a].rotation.x = -300; //rotate the plane
			planes[a].material = right; //set material
			a++; //increment a index
			z = z - planeHeight; //change z position
		}//for
		
		//adjust position
		b = a;
		//z = z - 1;
		
		//bottom planes <--
		for (i = 0; i < planeNum; i++) {
			planes[b] = BABYLON.MeshBuilder.CreatePlane("plane", {height: planeHeight, width: planeWidth}, scene); //create plane
			planes[b].setPositionWithLocalVector(new BABYLON.Vector3(x, y, z)); //set plane position
			x = x - planeWidth; //decrement x position
			planes[b].rotation.x = -300; //rotate the plane
			planes[b].material = bottom; //set material
			b++; //increment b index
		}//for
		
		//adjust position
		c = b;
		x = x + planeWidth;
		z = z + planeHeight;
		
		//left planes ascending
		for (i = 0; i < MAX_ROWS; i++) {
			planes[c] = BABYLON.MeshBuilder.CreatePlane("plane", {height: planeHeight, width: planeWidth}, scene); //create plane
			planes[c].setPositionWithLocalVector(new BABYLON.Vector3(x, y, z)); //set plane position
			z = z + planeHeight; //change z position
			planes[c].rotation.x = -300; //rotate the plane
			planes[c].material = left; //set material
			c++; //increment c index
		}//for
		
		//log to console
		console.log(planes);
		console.log(planes.length);
	}//drawParameter
	
	//hide the parameter by changing material
	this.hideParameter = function(){
		//invisable material
		var hide = new BABYLON.StandardMaterial("hidden", scene);
		hide.alpha = 0;
		
		//loop over planes array and change material of each element
		for (i = 0; i < planes.length; i++){
			planes[i].material = hide;
		}//for
	}//hideParameter
	
	//using drawParameter() and hideParameter()
	//we can find the optimal position/size etc. for the grid
	//and it is simple to test via console
	
	//draw the grid inside the parameter:
	//16x16 (excluding parameter) grid for players <= 4 
	//8 player map - 16 rows but more planeNum
	//using drawParameter and drawGrid - can draw any map size.
	this.drawGrid = function(){
		//adjust position
		x = x + planeWidth;
		z = z - planeHeight;
		var xPos = x;
		
		//planesA
		for (i = 0; i < planeNum - 2; i++){
			planesA[i] = BABYLON.MeshBuilder.CreatePlane("plane", {height: planeHeight, width: planeWidth}, scene); //create plane
			planesA[i].setPositionWithLocalVector(new BABYLON.Vector3(x, y, z)); //set plane position
			planesA[i].rotation.x = -300; //rotate the plane
			x = x + planeWidth; //increment x
		}//for
		
		//adjust position
		z = z - planeHeight;
		x = xPos;
		
		//planesB
		for (i = 0; i < planeNum - 2; i++){
			planesB[i] = BABYLON.MeshBuilder.CreatePlane("plane", {height: planeHeight, width: planeWidth}, scene); //create plane
			planesB[i].setPositionWithLocalVector(new BABYLON.Vector3(x, y, z)); //set plane position
			planesB[i].rotation.x = -300; //rotate the plane
			x = x + planeWidth; //increment x
		}//for
		
		//adjust position
		z = z - planeHeight;
		x = xPos;
		
		//planesC
		for (i = 0; i < planeNum - 2; i++){
			planesC[i] = BABYLON.MeshBuilder.CreatePlane("plane", {height: planeHeight, width: planeWidth}, scene); //create plane
			planesC[i].setPositionWithLocalVector(new BABYLON.Vector3(x, y, z)); //set plane position
			planesC[i].rotation.x = -300; //rotate the plane
			x = x + planeWidth; //increment x
		}//for
		
		//adjust position
		z = z - planeHeight;
		x = xPos;
		
		//planesD
		for (i = 0; i < planeNum - 2; i++){
			planesD[i] = BABYLON.MeshBuilder.CreatePlane("plane", {height: planeHeight, width: planeWidth}, scene); //create plane
			planesD[i].setPositionWithLocalVector(new BABYLON.Vector3(x, y, z)); //set plane position
			planesD[i].rotation.x = -300; //rotate the plane
			x = x + planeWidth; //increment x
		}//for
		
		//adjust position
		z = z - planeHeight;
		x = xPos;
		
		//planesE
		for (i = 0; i < planeNum - 2; i++){
			planesE[i] = BABYLON.MeshBuilder.CreatePlane("plane", {height: planeHeight, width: planeWidth}, scene); //create plane
			planesE[i].setPositionWithLocalVector(new BABYLON.Vector3(x, y, z)); //set plane position
			planesE[i].rotation.x = -300; //rotate the plane
			x = x + planeWidth; //increment x
		}//for
		
		//adjust position
		z = z - planeHeight;
		x = xPos;
		
		//planesF
		for (i = 0; i < planeNum - 2; i++){
			planesF[i] = BABYLON.MeshBuilder.CreatePlane("plane", {height: planeHeight, width: planeWidth}, scene); //create plane
			planesF[i].setPositionWithLocalVector(new BABYLON.Vector3(x, y, z)); //set plane position
			planesF[i].rotation.x = -300; //rotate the plane
			x = x + planeWidth; //increment x
		}//for
		
		//adjust position
		z = z - planeHeight;
		x = xPos;
		
		//planesG
		for (i = 0; i < planeNum - 2; i++){
			planesG[i] = BABYLON.MeshBuilder.CreatePlane("plane", {height: planeHeight, width: planeWidth}, scene); //create plane
			planesG[i].setPositionWithLocalVector(new BABYLON.Vector3(x, y, z)); //set plane position
			planesG[i].rotation.x = -300; //rotate the plane
			x = x + planeWidth; //increment x
		}//for
		
		//adjust position
		z = z - planeHeight;
		x = xPos;
		
		//planesH
		for (i = 0; i < planeNum - 2; i++){
			planesH[i] = BABYLON.MeshBuilder.CreatePlane("plane", {height: planeHeight, width: planeWidth}, scene); //create plane
			planesH[i].setPositionWithLocalVector(new BABYLON.Vector3(x, y, z)); //set plane position
			planesH[i].rotation.x = -300; //rotate the plane
			x = x + planeWidth; //increment x
		}//for
		
		//adjust position
		z = z - planeHeight;
		x = xPos;
		
		//planesI
		for (i = 0; i < planeNum - 2; i++){
			planesI[i] = BABYLON.MeshBuilder.CreatePlane("plane", {height: planeHeight, width: planeWidth}, scene); //create plane
			planesI[i].setPositionWithLocalVector(new BABYLON.Vector3(x, y, z)); //set plane position
			planesI[i].rotation.x = -300; //rotate the plane
			x = x + planeWidth; //increment x
		}//for
		
		//adjust position
		z = z - planeHeight;
		x = xPos;
		
		//planesJ
		for (i = 0; i < planeNum - 2; i++){
			planesJ[i] = BABYLON.MeshBuilder.CreatePlane("plane", {height: planeHeight, width: planeWidth}, scene); //create plane
			planesJ[i].setPositionWithLocalVector(new BABYLON.Vector3(x, y, z)); //set plane position
			planesJ[i].rotation.x = -300; //rotate the plane
			x = x + planeWidth; //increment x
		}//for
		
		//adjust position
		z = z - planeHeight;
		x = xPos;
		
		//planesK
		for (i = 0; i < planeNum - 2; i++){
			planesK[i] = BABYLON.MeshBuilder.CreatePlane("plane", {height: planeHeight, width: planeWidth}, scene); //create plane
			planesK[i].setPositionWithLocalVector(new BABYLON.Vector3(x, y, z)); //set plane position
			planesK[i].rotation.x = -300; //rotate the plane
			x = x + planeWidth; //increment x
		}//for
		
		//adjust position
		z = z - planeHeight;
		x = xPos;
		
		//planesL
		for (i = 0; i < planeNum - 2; i++){
			planesL[i] = BABYLON.MeshBuilder.CreatePlane("plane", {height: planeHeight, width: planeWidth}, scene); //create plane
			planesL[i].setPositionWithLocalVector(new BABYLON.Vector3(x, y, z)); //set plane position
			planesL[i].rotation.x = -300; //rotate the plane
			x = x + planeWidth; //increment x
		}//for
		
		//adjust position
		z = z - planeHeight;
		x = xPos;
		
		//planesM
		for (i = 0; i < planeNum - 2; i++){
			planesM[i] = BABYLON.MeshBuilder.CreatePlane("plane", {height: planeHeight, width: planeWidth}, scene); //create plane
			planesM[i].setPositionWithLocalVector(new BABYLON.Vector3(x, y, z)); //set plane position
			planesM[i].rotation.x = -300; //rotate the plane
			x = x + planeWidth; //increment x
		}//for
		
		//adjust position
		z = z - planeHeight;
		x = xPos;
		
		//planesN
		for (i = 0; i < planeNum - 2; i++){
			planesN[i] = BABYLON.MeshBuilder.CreatePlane("plane", {height: planeHeight, width: planeWidth}, scene); //create plane
			planesN[i].setPositionWithLocalVector(new BABYLON.Vector3(x, y, z)); //set plane position
			planesN[i].rotation.x = -300; //rotate the plane
			x = x + planeWidth; //increment x
		}//for
		
		//adjust position
		z = z - planeHeight;
		x = xPos;
		
		//planesO
		for (i = 0; i < planeNum - 2; i++){
			planesO[i] = BABYLON.MeshBuilder.CreatePlane("plane", {height: planeHeight, width: planeWidth}, scene); //create plane
			planesO[i].setPositionWithLocalVector(new BABYLON.Vector3(x, y, z)); //set plane position
			planesO[i].rotation.x = -300; //rotate the plane
			x = x + planeWidth; //increment x
		}//for
		
		//adjust position
		z = z - planeHeight;
		x = xPos;
		
		//planesP
		for (i = 0; i < planeNum - 2; i++){
			planesP[i] = BABYLON.MeshBuilder.CreatePlane("plane", {height: planeHeight, width: planeWidth}, scene); //create plane
			planesP[i].setPositionWithLocalVector(new BABYLON.Vector3(x, y, z)); //set plane position
			planesP[i].rotation.x = -300; //rotate the plane
			x = x + planeWidth; //increment x
		}//for
	}//drawGrid
	
	//apply testing material to grid planesA-P
	this.testingMaterial = function(){
		var materialA = new BABYLON.StandardMaterial("A", scene);		
		var materialB = new BABYLON.StandardMaterial("B", scene);		
		var materialC = new BABYLON.StandardMaterial("C", scene);		
		var materialD = new BABYLON.StandardMaterial("D", scene);		
		var materialE = new BABYLON.StandardMaterial("E", scene);		
		var materialF = new BABYLON.StandardMaterial("F", scene);		
		var materialG = new BABYLON.StandardMaterial("G", scene);		
		var materialH = new BABYLON.StandardMaterial("H", scene);		
		var materialI = new BABYLON.StandardMaterial("I", scene);
		var materialJ = new BABYLON.StandardMaterial("J", scene);	
		var materialK = new BABYLON.StandardMaterial("K", scene);
		var materialL = new BABYLON.StandardMaterial("L", scene);
		var materialM = new BABYLON.StandardMaterial("M", scene);
		var materialN = new BABYLON.StandardMaterial("N", scene);
		var materialO = new BABYLON.StandardMaterial("O", scene);
		var materialP = new BABYLON.StandardMaterial("P", scene);

		materialA.diffuseTexture = new BABYLON.Texture(planeA, scene);
		materialB.diffuseTexture = new BABYLON.Texture(planeB, scene);
		materialC.diffuseTexture = new BABYLON.Texture(planeC, scene);
		materialD.diffuseTexture = new BABYLON.Texture(planeD, scene);
		materialE.diffuseTexture = new BABYLON.Texture(planeE, scene);
		materialF.diffuseTexture = new BABYLON.Texture(planeF, scene);
		materialG.diffuseTexture = new BABYLON.Texture(planeG, scene);
		materialH.diffuseTexture = new BABYLON.Texture(planeH, scene);
		materialI.diffuseTexture = new BABYLON.Texture(planeI, scene);
		materialJ.diffuseTexture = new BABYLON.Texture(planeJ, scene);
		materialK.diffuseTexture = new BABYLON.Texture(planeK, scene);
		materialL.diffuseTexture = new BABYLON.Texture(planeL, scene);
		materialM.diffuseTexture = new BABYLON.Texture(planeM, scene);
		materialN.diffuseTexture = new BABYLON.Texture(planeN, scene);
		materialO.diffuseTexture = new BABYLON.Texture(planeO, scene);
		materialP.diffuseTexture = new BABYLON.Texture(planeP, scene);
		
		for(i = 0; i < planeNum - 2; i++){
			planesA[i].material = materialA;
			planesB[i].material = materialB;
			planesC[i].material = materialC;
			planesD[i].material = materialD;
			planesE[i].material = materialE;
			planesF[i].material = materialF;
			planesG[i].material = materialG;
			planesH[i].material = materialH;
			planesI[i].material = materialI;
			planesJ[i].material = materialJ;
			planesK[i].material = materialK;
			planesL[i].material = materialL;
			planesM[i].material = materialM;
			planesN[i].material = materialN;
			planesO[i].material = materialO;
			planesP[i].material = materialP;
		}//for
	}//testingMaterial
	
	//hide the grid by changing material
	this.hideGrid = function(){
		//invisable material
		var hide = new BABYLON.StandardMaterial("hidden", scene);
		hide.alpha = 0;
		
		//loop over planesA-P arrays and change material of each element
		for(i = 0; i < planeNum - 2; i++){
			planesA[i].material = hide;
			planesB[i].material = hide;
			planesC[i].material = hide;
			planesD[i].material = hide;
			planesE[i].material = hide;
			planesF[i].material = hide;
			planesG[i].material = hide;
			planesH[i].material = hide;
			planesI[i].material = hide;
			planesJ[i].material = hide;
			planesK[i].material = hide;
			planesL[i].material = hide;
			planesM[i].material = hide;
			planesN[i].material = hide;
			planesO[i].material = hide;
			planesP[i].material = hide;
		}//for
	}//hideGrid
	
	//set the actual textures for the grid
	//currently only using 1 texture - customTile0
	this.setTextures = function(){
		var gridMaterial0 = new BABYLON.StandardMaterial("gridMaterial0", scene);
		gridMaterial0.diffuseTexture = new BABYLON.Texture(customTile0, scene);
		
		//loop over planes array and change material of each element
		for (i = 0; i < planes.length; i++){
			planes[i].material = gridMaterial0;
		}//for
		
		//loop over planesA-P arrays and change material of each element
		for(i = 0; i < planeNum - 2; i++){
			planesA[i].material = gridMaterial0;
			planesB[i].material = gridMaterial0;
			planesC[i].material = gridMaterial0;
			planesD[i].material = gridMaterial0;
			planesE[i].material = gridMaterial0;
			planesF[i].material = gridMaterial0;
			planesG[i].material = gridMaterial0;
			planesH[i].material = gridMaterial0;
			planesI[i].material = gridMaterial0;
			planesJ[i].material = gridMaterial0;
			planesK[i].material = gridMaterial0;
			planesL[i].material = gridMaterial0;
			planesM[i].material = gridMaterial0;
			planesN[i].material = gridMaterial0;
			planesO[i].material = gridMaterial0;
			planesP[i].material = gridMaterial0;
		}//for
	}//setTextures
	
	//decrease size of grid over time:
	//the following function reduces the size of the grid using a sort of rectangle shape i.e
	//using the various arrays we take elements off the top,bottom,right and left planes,
	//each plane "rectangle" turns red before fading and reduces the area where the player can move without taking damage.
	//left some obsolete commented code that should not be touched and only exists as a recap for myself in case
	//I decide to change it a bit
	this.fadeOutAnimation = function(){
		//change to a different material:
		//using a different material for each array despite them all using the same texture (customTile1),
		//easier to change texture for specific array later and need material.alpha = 1 for each array in any case
		var gridMaterial1 = new BABYLON.StandardMaterial("gridMaterial1", scene);
		gridMaterial1.diffuseTexture = new BABYLON.Texture(customTile1, scene);
		gridMaterial1.alpha = 1;
		
		//there are quite a lot of number of bugs with babylonjs to do with materials and textures
		//when using firefox version 58. Ref github readme, will demonstrate a few bugs @ bugs folder
		//gridMaterial1.diffuseTexture.hasAlpha = true; //not working as intended for firefox
		planes[0].material.diffuseTexture.hasAlpha = true; //allows alpha for all materials and planes array in firefox...(and other browsers)
		
		//wait...
		setTimeout(function() {
			//change planes[] elements to gridMaterial1
			//console.log("Changing planes[] to red texture...");
			for (i = 0; i < planes.length; i++){
				planes[i].material = gridMaterial1;
			}//for
		}, MATERIAL_SWITCH_TIMER_0);
		
		
		//wait...
		setTimeout(function() {
			//decrease opacity of gridMaterial1, smooth animation
			for (var i = 0; i < 10; i++) {
			  (function (i) {
				setTimeout(function () {
				  gridMaterial1.alpha = gridMaterial1.alpha - 0.1;
				}, 35*i);
			  })(i);
			};
			//increase boundaries
			boundaryLeft = boundaryLeft + planeWidth;
			boundaryRight = boundaryRight - planeWidth;
			boundaryTop = boundaryTop - planeHeight;
			boundaryBottom = boundaryBottom + planeHeight;
		}, FADE_OUT_TIMER_0);		
		
		//---------------------------------------------------------
		//change to a different material
		var gridMaterial2 = new BABYLON.StandardMaterial("gridMaterial2", scene);
		gridMaterial2.diffuseTexture = new BABYLON.Texture(customTile1, scene);
		gridMaterial2.alpha = 1;
		
		//change elements...
		setTimeout(function() {
			for (i = 0; i < 1; i++){
				planesA[i].material = gridMaterial2;
				planesB[i].material = gridMaterial2;
				planesC[i].material = gridMaterial2;
				planesD[i].material = gridMaterial2;
				planesE[i].material = gridMaterial2;
				planesF[i].material = gridMaterial2;
				planesG[i].material = gridMaterial2;
				planesH[i].material = gridMaterial2;
				planesI[i].material = gridMaterial2;
				planesJ[i].material = gridMaterial2;
				planesK[i].material = gridMaterial2;
				planesL[i].material = gridMaterial2;
				planesM[i].material = gridMaterial2;
				planesN[i].material = gridMaterial2;
				planesO[i].material = gridMaterial2;
				planesP[i].material = gridMaterial2;
			}//for
			
			//change elements...
			//used planesNum - 2 for setting materials for these arrays in setTextures so to select last element planesNum - 3
			//using planesNum over a specific number since may alter elements of that array in the future however planeNum - 3 will always be the last element..
			for (i = 0; i < 1; i++){
				planesA[planeNum - 3].material = gridMaterial2;
				planesB[planeNum - 3].material = gridMaterial2;
				planesC[planeNum - 3].material = gridMaterial2;
				planesD[planeNum - 3].material = gridMaterial2;
				planesE[planeNum - 3].material = gridMaterial2;
				planesF[planeNum - 3].material = gridMaterial2;
				planesG[planeNum - 3].material = gridMaterial2;
				planesH[planeNum - 3].material = gridMaterial2;
				planesI[planeNum - 3].material = gridMaterial2;
				planesJ[planeNum - 3].material = gridMaterial2;
				planesK[planeNum - 3].material = gridMaterial2;
				planesL[planeNum - 3].material = gridMaterial2;
				planesM[planeNum - 3].material = gridMaterial2;
				planesN[planeNum - 3].material = gridMaterial2;
				planesO[planeNum - 3].material = gridMaterial2;
				planesP[planeNum - 3].material = gridMaterial2;
			}//for
			
			//change elements...
			for (i = 1; i < planeNum - 3 ; i++){
				planesA[i].material = gridMaterial2;
				planesP[i].material = gridMaterial2;
			}//for
		}, MATERIAL_SWITCH_TIMER_1);
		
		//wait...
		setTimeout(function() {
			//decrease opacity of gridMaterial2
			for (var i = 0; i < 10; i++) {
			  (function (i) {
				setTimeout(function () {
				  gridMaterial2.alpha = gridMaterial2.alpha - 0.1;
				}, 35*i);
			  })(i);
			};
			//increase boundaries
			boundaryLeft = boundaryLeft + planeWidth;
			boundaryRight = boundaryRight - planeWidth;
			boundaryTop = boundaryTop - planeHeight;
			boundaryBottom = boundaryBottom + planeHeight;
		}, FADE_OUT_TIMER_1);
		//---------------------------------------------------------
		//change to a different material
		var gridMaterial3 = new BABYLON.StandardMaterial("gridMaterial3", scene);
		gridMaterial3.diffuseTexture = new BABYLON.Texture(customTile1, scene);
		gridMaterial3.alpha = 1;
		
		//change elements...
		setTimeout(function() {
			for (i = 1; i < 2; i++){
				//planesA[i].material = gridMaterial2;
				planesB[i].material = gridMaterial3;
				planesC[i].material = gridMaterial3;
				planesD[i].material = gridMaterial3;
				planesE[i].material = gridMaterial3;
				planesF[i].material = gridMaterial3;
				planesG[i].material = gridMaterial3;
				planesH[i].material = gridMaterial3;
				planesI[i].material = gridMaterial3;
				planesJ[i].material = gridMaterial3;
				planesK[i].material = gridMaterial3;
				planesL[i].material = gridMaterial3;
				planesM[i].material = gridMaterial3;
				planesN[i].material = gridMaterial3;
				planesO[i].material = gridMaterial3;
				//planesP[i].material = gridMaterial2;
			}//for
			
			//change elements...
			//used planesNum - 2 for setting materials for these arrays in setTextures...
			//planesNum - 4 is 2nd last
			for (i = 0; i < 1; i++){
				//planesA[planeNum - 3].material = gridMaterial2;
				planesB[planeNum - 4].material = gridMaterial3;
				planesC[planeNum - 4].material = gridMaterial3;
				planesD[planeNum - 4].material = gridMaterial3;
				planesE[planeNum - 4].material = gridMaterial3;
				planesF[planeNum - 4].material = gridMaterial3;
				planesG[planeNum - 4].material = gridMaterial3;
				planesH[planeNum - 4].material = gridMaterial3;
				planesI[planeNum - 4].material = gridMaterial3;
				planesJ[planeNum - 4].material = gridMaterial3;
				planesK[planeNum - 4].material = gridMaterial3;
				planesL[planeNum - 4].material = gridMaterial3;
				planesM[planeNum - 4].material = gridMaterial3;
				planesN[planeNum - 4].material = gridMaterial3;
				planesO[planeNum - 4].material = gridMaterial3;
				//planesP[planeNum - 3].material = gridMaterial2;
			}//for
			
			//change elements...
			for (i = 1; i < planeNum - 3 ; i++){
				planesB[i].material = gridMaterial3;
				planesO[i].material = gridMaterial3;
			}//for
		}, MATERIAL_SWITCH_TIMER_2);
		
		//wait...
		setTimeout(function() {
			//decrease opacity of gridMaterial3
			for (var i = 0; i < 10; i++) {
			  (function (i) {
				setTimeout(function () {
				  gridMaterial3.alpha = gridMaterial3.alpha - 0.1;
				}, 35*i);
			  })(i);
			};
			//increase boundaries
			boundaryLeft = boundaryLeft + planeWidth;
			boundaryRight = boundaryRight - planeWidth;
			boundaryTop = boundaryTop - planeHeight;
			boundaryBottom = boundaryBottom + planeHeight;
		}, FADE_OUT_TIMER_2);
		//---------------------------------------------------------
		//change to a different material
		var gridMaterial4 = new BABYLON.StandardMaterial("gridMaterial4", scene);
		gridMaterial4.diffuseTexture = new BABYLON.Texture(customTile1, scene);
		gridMaterial4.alpha = 1;
		
		//change elements...
		setTimeout(function() {
			for (i = 2; i < 3; i++){
				//planesA[i].material = gridMaterial2;
				//planesB[i].material = gridMaterial3;
				planesC[i].material = gridMaterial4;
				planesD[i].material = gridMaterial4;
				planesE[i].material = gridMaterial4;
				planesF[i].material = gridMaterial4;
				planesG[i].material = gridMaterial4;
				planesH[i].material = gridMaterial4;
				planesI[i].material = gridMaterial4;
				planesJ[i].material = gridMaterial4;
				planesK[i].material = gridMaterial4;
				planesL[i].material = gridMaterial4;
				planesM[i].material = gridMaterial4;
				planesN[i].material = gridMaterial4;
				//planesO[i].material = gridMaterial3;
				//planesP[i].material = gridMaterial2;
			}//for
			
			//change elements...
			for (i = 0; i < 1; i++){
				//planesA[planeNum - 3].material = gridMaterial2;
				//planesB[planeNum - 4].material = gridMaterial3;
				planesC[planeNum - 5].material = gridMaterial4;
				planesD[planeNum - 5].material = gridMaterial4;
				planesE[planeNum - 5].material = gridMaterial4;
				planesF[planeNum - 5].material = gridMaterial4;
				planesG[planeNum - 5].material = gridMaterial4;
				planesH[planeNum - 5].material = gridMaterial4;
				planesI[planeNum - 5].material = gridMaterial4;
				planesJ[planeNum - 5].material = gridMaterial4;
				planesK[planeNum - 5].material = gridMaterial4;
				planesL[planeNum - 5].material = gridMaterial4;
				planesM[planeNum - 5].material = gridMaterial4;
				planesN[planeNum - 5].material = gridMaterial4;
				//planesO[planeNum - 4].material = gridMaterial3;
				//planesP[planeNum - 3].material = gridMaterial2;
			}//for
			
			//change elements...
			for (i = 2; i < planeNum - 4 ; i++){
				planesC[i].material = gridMaterial4;
				planesN[i].material = gridMaterial4;
			}//for
		}, MATERIAL_SWITCH_TIMER_3);
		
		//wait...
		setTimeout(function() {
			//decrease opacity of gridMaterial4
			for (var i = 0; i < 10; i++) {
			  (function (i) {
				setTimeout(function () {
				  gridMaterial4.alpha = gridMaterial4.alpha - 0.1;
				}, 35*i);
			  })(i);
			};
			//increase boundaries
			boundaryLeft = boundaryLeft + planeWidth;
			boundaryRight = boundaryRight - planeWidth;
			boundaryTop = boundaryTop - planeHeight;
			boundaryBottom = boundaryBottom + planeHeight;
		}, FADE_OUT_TIMER_3);
		//---------------------------------------------------------
		//change to a different material
		var gridMaterial5 = new BABYLON.StandardMaterial("gridMaterial5", scene);
		gridMaterial5.diffuseTexture = new BABYLON.Texture(customTile1, scene);
		gridMaterial5.alpha = 1;
		
		//change elements...
		setTimeout(function() {
			for (i = 3; i < 4; i++){
				//planesA[i].material = gridMaterial2;
				//planesB[i].material = gridMaterial3;
				//planesC[i].material = gridMaterial4;
				planesD[i].material = gridMaterial5;
				planesE[i].material = gridMaterial5;
				planesF[i].material = gridMaterial5;
				planesG[i].material = gridMaterial5;
				planesH[i].material = gridMaterial5;
				planesI[i].material = gridMaterial5;
				planesJ[i].material = gridMaterial5;
				planesK[i].material = gridMaterial5;
				planesL[i].material = gridMaterial5;
				planesM[i].material = gridMaterial5;
				//planesN[i].material = gridMaterial4;
				//planesO[i].material = gridMaterial3;
				//planesP[i].material = gridMaterial2;
			}//for
			
			//change elements...
			for (i = 0; i < 1; i++){
				//planesA[planeNum - 3].material = gridMaterial2;
				//planesB[planeNum - 4].material = gridMaterial3;
				//planesC[planeNum - 5].material = gridMaterial4;
				planesD[planeNum - 6].material = gridMaterial5;
				planesE[planeNum - 6].material = gridMaterial5;
				planesF[planeNum - 6].material = gridMaterial5;
				planesG[planeNum - 6].material = gridMaterial5;
				planesH[planeNum - 6].material = gridMaterial5;
				planesI[planeNum - 6].material = gridMaterial5;
				planesJ[planeNum - 6].material = gridMaterial5;
				planesK[planeNum - 6].material = gridMaterial5;
				planesL[planeNum - 6].material = gridMaterial5;
				planesM[planeNum - 6].material = gridMaterial5;
				//planesN[planeNum - 5].material = gridMaterial4;
				//planesO[planeNum - 4].material = gridMaterial3;
				//planesP[planeNum - 3].material = gridMaterial2;
			}//for
			
			//change elements...
			for (i = 3; i < planeNum - 5 ; i++){
				planesD[i].material = gridMaterial5;
				planesM[i].material = gridMaterial5;
			}//for
		}, MATERIAL_SWITCH_TIMER_4);
		
		//wait...
		setTimeout(function() {
			//decrease opacity of gridMaterial5
			for (var i = 0; i < 10; i++) {
			  (function (i) {
				setTimeout(function () {
				  gridMaterial5.alpha = gridMaterial5.alpha - 0.1;
				}, 35*i);
			  })(i);
			};
			//increase boundaries
			boundaryLeft = boundaryLeft + planeWidth;
			boundaryRight = boundaryRight - planeWidth;
			boundaryTop = boundaryTop - planeHeight;
			boundaryBottom = boundaryBottom + planeHeight;
		}, FADE_OUT_TIMER_4);
		//---------------------------------------------------------
		//change to a different material
		var gridMaterial6 = new BABYLON.StandardMaterial("gridMaterial6", scene);
		gridMaterial6.diffuseTexture = new BABYLON.Texture(customTile1, scene);
		gridMaterial6.alpha = 1;
		
		//change elements...
		setTimeout(function() {
			for (i = 4; i < 5; i++){
				//planesA[i].material = gridMaterial2;
				//planesB[i].material = gridMaterial3;
				//planesC[i].material = gridMaterial4;
				//planesD[i].material = gridMaterial5;
				planesE[i].material = gridMaterial6;
				planesF[i].material = gridMaterial6;
				planesG[i].material = gridMaterial6;
				planesH[i].material = gridMaterial6;
				planesI[i].material = gridMaterial6;
				planesJ[i].material = gridMaterial6;
				planesK[i].material = gridMaterial6;
				planesL[i].material = gridMaterial6;
				//planesM[i].material = gridMaterial5;
				//planesN[i].material = gridMaterial4;
				//planesO[i].material = gridMaterial3;
				//planesP[i].material = gridMaterial2;
			}//for
			
			//change elements...
			for (i = 0; i < 1; i++){
				//planesA[planeNum - 3].material = gridMaterial2;
				//planesB[planeNum - 4].material = gridMaterial3;
				//planesC[planeNum - 5].material = gridMaterial4;
				//planesD[planeNum - 6].material = gridMaterial5;
				planesE[planeNum - 7].material = gridMaterial6;
				planesF[planeNum - 7].material = gridMaterial6;
				planesG[planeNum - 7].material = gridMaterial6;
				planesH[planeNum - 7].material = gridMaterial6;
				planesI[planeNum - 7].material = gridMaterial6;
				planesJ[planeNum - 7].material = gridMaterial6;
				planesK[planeNum - 7].material = gridMaterial6;
				planesL[planeNum - 7].material = gridMaterial6;
				//planesM[planeNum - 6].material = gridMaterial5;
				//planesN[planeNum - 5].material = gridMaterial4;
				//planesO[planeNum - 4].material = gridMaterial3;
				//planesP[planeNum - 3].material = gridMaterial2;
			}//for
			
			//change elements...
			for (i = 4; i < planeNum - 6; i++){
				planesE[i].material = gridMaterial6;
				planesL[i].material = gridMaterial6;
			}//for
		}, MATERIAL_SWITCH_TIMER_5);
		
		//wait...
		setTimeout(function() {
			//decrease opacity of gridMaterial6
			for (var i = 0; i < 10; i++) {
			  (function (i) {
				setTimeout(function () {
				  gridMaterial6.alpha = gridMaterial6.alpha - 0.1;
				}, 35*i);
			  })(i);
			};
			//increase boundaries
			boundaryLeft = boundaryLeft + planeWidth;
			boundaryRight = boundaryRight - planeWidth;
			boundaryTop = boundaryTop - planeHeight;
			boundaryBottom = boundaryBottom + planeHeight;
		}, FADE_OUT_TIMER_5);
		//---------------------------------------------------------
		//change to a different material
		var gridMaterial7 = new BABYLON.StandardMaterial("gridMaterial7", scene);
		gridMaterial7.diffuseTexture = new BABYLON.Texture(customTile1, scene);
		gridMaterial7.alpha = 1;
		
		//change elements...
		setTimeout(function() {
			for (i = 5; i < 6; i++){
				//planesA[i].material = gridMaterial2;
				//planesB[i].material = gridMaterial3;
				//planesC[i].material = gridMaterial4;
				//planesD[i].material = gridMaterial5;
				//planesE[i].material = gridMaterial6;
				planesF[i].material = gridMaterial7;
				planesG[i].material = gridMaterial7;
				planesH[i].material = gridMaterial7;
				planesI[i].material = gridMaterial7;
				planesJ[i].material = gridMaterial7;
				planesK[i].material = gridMaterial7;
				//planesL[i].material = gridMaterial6;
				//planesM[i].material = gridMaterial5;
				//planesN[i].material = gridMaterial4;
				//planesO[i].material = gridMaterial3;
				//planesP[i].material = gridMaterial2;
			}//for
			
			//change elements...
			for (i = 0; i < 1; i++){
				//planesA[planeNum - 3].material = gridMaterial2;
				//planesB[planeNum - 4].material = gridMaterial3;
				//planesC[planeNum - 5].material = gridMaterial4;
				//planesD[planeNum - 6].material = gridMaterial5;
				//planesE[planeNum - 7].material = gridMaterial7;
				planesF[planeNum - 8].material = gridMaterial7;
				planesG[planeNum - 8].material = gridMaterial7;
				planesH[planeNum - 8].material = gridMaterial7;
				planesI[planeNum - 8].material = gridMaterial7;
				planesJ[planeNum - 8].material = gridMaterial7;
				planesK[planeNum - 8].material = gridMaterial7;
				//planesL[planeNum - 7].material = gridMaterial7;
				//planesM[planeNum - 6].material = gridMaterial5;
				//planesN[planeNum - 5].material = gridMaterial4;
				//planesO[planeNum - 4].material = gridMaterial3;
				//planesP[planeNum - 3].material = gridMaterial2;
			}//for
			
			//change elements...
			for (i = 5; i < planeNum - 7; i++){
				planesF[i].material = gridMaterial7;
				planesK[i].material = gridMaterial7;
			}//for
		}, MATERIAL_SWITCH_TIMER_6);
		
		//wait...
		setTimeout(function() {
			//decrease opacity of gridMaterial7
			for (var i = 0; i < 10; i++) {
			  (function (i) {
				setTimeout(function () {
				  gridMaterial7.alpha = gridMaterial7.alpha - 0.1;
				}, 35*i);
			  })(i);
			};
			//increase boundaries
			boundaryLeft = boundaryLeft + planeWidth;
			boundaryRight = boundaryRight - planeWidth;
			boundaryTop = boundaryTop - planeHeight;
			boundaryBottom = boundaryBottom + planeHeight;
		}, FADE_OUT_TIMER_6);
		//leave the rest of the planes untouched as the final stand area
		//setTimeouts will be adjusted later and other terrain will be most likely added here.
	}//fadeOutAnimation
	
	//quick test to see where the boundaries are by drawing a few lines
	//hardcoded values adjust if grid size changes...
	this.boundaryTest = function(){
		var myPoints = [
			new BABYLON.Vector3(-212.5, 10, 262.5),
			new BABYLON.Vector3(187, 10, 262.5),
			new BABYLON.Vector3(187, 10, -187.5),
			new BABYLON.Vector3(-212.5, 10, -187.5),
			new BABYLON.Vector3(-212.5, 10, 262.5)
		];
		
		var myPoints1= [
			new BABYLON.Vector3(-187.5, 10, 237.5),
			new BABYLON.Vector3(162, 10, 237.5),
			new BABYLON.Vector3(162, 10, -162.5),
			new BABYLON.Vector3(-187.5, 10, -162.5),
			new BABYLON.Vector3(-187.5, 10, 237.5)
		];
		
		var myPoints2= [
			new BABYLON.Vector3(-162.5, 10, 212.5),
			new BABYLON.Vector3(137, 10, 212.5),
			new BABYLON.Vector3(137, 10, -137.5),
			new BABYLON.Vector3(-162.5, 10, -137.5),
			new BABYLON.Vector3(-162.5, 10, 212.5)
		];
		
		var lines = BABYLON.MeshBuilder.CreateLines("lines", {points: myPoints}, scene); 
		var lines1 = BABYLON.MeshBuilder.CreateLines("lines1", {points: myPoints1}, scene);
		var lines2 = BABYLON.MeshBuilder.CreateLines("lines2", {points: myPoints2}, scene); 		
	}//boundaryTest
	
	//creating transparent ground layer since lava layer moves(unstable) and the
	//player grid is composed of many smaller planes that fade out, the player moves on this layer
	//hardcoded values to be adjusted if grid size changes
	this.createGround = function(){
		var ground = BABYLON.MeshBuilder.CreateGround("ground", {width: 400, height: 450}, scene);
		ground.physicsImpostor = new BABYLON.PhysicsImpostor(ground, BABYLON.PhysicsImpostor.BoxImpostor, { mass: 0, restitution: 0 }, scene);
		ground.setPositionWithLocalVector(new BABYLON.Vector3(-12, 11, 37)); //-200,10,250
		
		//apply transparent material to ground
		var mat = new BABYLON.StandardMaterial("mat", scene);
		mat.diffuseColor = new BABYLON.Color3(0,0,1); //blue
		mat.alpha = 0;
		ground.material = mat;
	}//createGround
}//playerGrid