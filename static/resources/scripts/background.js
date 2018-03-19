/* this script is responsible for getting a handle on BABYLON JS, HTML5 Canvas and Cannon JS physics
* it also sets up the BABYLON JS scene in which everything relating to BABYLON JS occurs, it is possible
* to create more than one scene however for this project we will simply be using one scene, this script is also
* responsible for creating the background lava effect
*/

//gets a handle to the element with id myCanvas
var canvas = document.getElementById("myCanvas");
//gets a handle on BABYLON JS
//var engine = new BABYLON.Engine(canvas,true);
//using stencil to enable highlights
var engine = new BABYLON.Engine(canvas, true, { stencil: true })
//creates a basic babylon scene object (non-mesh)
var scene = new BABYLON.Scene(engine);
//enable physics - cannon_min.js
scene.enablePhysics();
//changing gravity from default - otherwise objects go up instead of down -9.82 m/s^2
var gravity = new BABYLON.Vector3(0, -9.82, 0);
scene.getPhysicsEngine().setGravity(gravity);

//hide the default menu that appears when you right click in a browser
//disabling this allows me to use right click as a keybind for casting spells
canvas.oncontextmenu = function (e) {
	e.preventDefault();
};

//wait until document is ready
$(document).ready(function() {
	//resize the canvas
	canvas.width = window.innerWidth;
	canvas.height = window.innerHeight;
	console.log("Background Ready!")
});

//creates the lava background layer
var lavaBackground = function() {
	/* in the early stages of the project created the scene here and tested various cameras throughout the project
	* to ensure everything is working as intended, eventually needed to make the scene and camera global in order to
	* use them throughout the scripts and modify when needed
	*/
	//creates a basic babylon scene object (non-mesh)
	//var scene = new BABYLON.Scene(engine);

	//creates and positions a free camera (non-mesh)
	//var camera = new BABYLON.FreeCamera("camera1", new BABYLON.Vector3(0, 300, -250), scene);
	//var camera = new BABYLON.FreeCamera("camera1", new BABYLON.Vector3(0, 350, -300), scene);
	//creates and positions an arc rotate camera (non-mesh)
	//var camera = new BABYLON.ArcRotateCamera("Camera", -Math.PI / 2, Math.PI / 2, 4, BABYLON.Vector3.Zero(), scene);
	
	//targets the camera to scene origin
	//camera.setTarget(BABYLON.Vector3.Zero());

	//camera for testing only -- actual camera should follow the player
	//attaches the camera to the canvas
	//camera.attachControl(canvas, true);

	//creates a light, aiming 0,1,0 - to the sky (non-mesh)
	var light = new BABYLON.HemisphericLight("light1", new BABYLON.Vector3(0, 1, 0), scene);

	//var sphere = BABYLON.Mesh.CreateGround("ground", 500, 500, 100, scene);
	var sphere = BABYLON.Mesh.CreateGround("ground", 2000, 2000, 150, scene);
	
	//lava material creation
	var lavaMaterial = new BABYLON.LavaMaterial("lava", scene);	
	lavaMaterial.noiseTexture = new BABYLON.Texture("static/resources/images/textures/lava.png", scene); //set the bump texture
	lavaMaterial.diffuseTexture = new BABYLON.Texture("static/resources/images/textures/lava.png", scene); //set the diffuse texture
	lavaMaterial.speed = 1.5;
	lavaMaterial.fogColor = new BABYLON.Color3(1, 0, 0);

	sphere.material = lavaMaterial;
	
	//show debug layer -- babylon_inspector_bundle.js
	//debug layer gives a different perspective on the project which makes it easier to spot abnormalities and bugs
	//scene.debugLayer.show();
	
	//render the scene
	return scene;
}//lavaBackground

//creating transparent ground layer since lava layer moves(unstable), this layer sits on top of the lavaBackground layer
//2000x2000 same as lavaBackground - covers the entire game, player can move on this layer but takes damage
var ground = BABYLON.MeshBuilder.CreateGround("myGround", {width: 2000, height: 2000}, scene); //clickable @ player.js
var createLavaGround = function() {
		//var ground = BABYLON.MeshBuilder.CreateGround("myGround", {width: 2000, height: 2000}, scene);
		ground.physicsImpostor = new BABYLON.PhysicsImpostor(ground, BABYLON.PhysicsImpostor.BoxImpostor, { mass: 0, restitution: 0 }, scene);
		ground.position.y = 11; //elevate ground to player grid level - stays above the lava texture, prevents textures intesecting
		
		//apply transparent material to ground
		var mat = new BABYLON.StandardMaterial("mat", scene);
		mat.alpha = 0;
		mat.diffuseColor = new BABYLON.Color3(198,226,255); //slate
		ground.material = mat;
}//createLavaGround

//assign both functions to a different variable which is used later in game.js
var background = lavaBackground();
var backGroundGround = createLavaGround();
var fpsLabel = document.getElementById("fpsLabel");

//sceneOptimiser code should be placed here if frame issues arise for low end devices..
//ref -- https://doc.babylonjs.com/how_to/how_to_use_sceneoptimizer