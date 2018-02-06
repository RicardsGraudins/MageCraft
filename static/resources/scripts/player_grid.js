console.log("Player Grid Ready!");

//max number of plane rows
const MAX_ROWS = 10;
//planes parameter array
var planes = [];

//images for testing
var planeTop = "static/resources/images/testing_images/top.png";
var planeBottom = "static/resources/images/testing_images/bottom.png";
var planeRight = "static/resources/images/testing_images/right.png";
var planeLeft = "static/resources/images/testing_images/left.png";

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
			z = (z - planeHeight) + 1; //change z position
		}//for
		
		//adjust position
		b = a;
		z = z - 1;
		
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
			z = (z + planeHeight) - 1; //change z position
			planes[c].rotation.x = -300; //rotate the plane
			planes[c].material = left; //set material
			c++; //increment c index
		}//for
		
		//log to console
		console.log(planes);
		console.log(planes.length);
	}//draw
	
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
}//playerGrid