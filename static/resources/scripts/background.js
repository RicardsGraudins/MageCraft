//gets a handle to the element with id myCanvas
var canvas = document.getElementById("myCanvas");
//gets a handle on BABYLON JS
var engine = new BABYLON.Engine(canvas,true);
//creates a basic babylon scene object (non-mesh)
var scene = new BABYLON.Scene(engine);

//hide the default menu that appears when you right click in a browser
//disabling this allows me to use right click as a keybind for player movement
canvas.oncontextmenu = function (e) {
	e.preventDefault();
};

//wait until document is ready
//$(document).ready(function() {
	//resize the canvas
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
console.log("Background Ready!")
//});

var lavaBackground = function() {
	//creates a basic babylon scene object (non-mesh)
	//var scene = new BABYLON.Scene(engine);

	//creates and positions a free camera (non-mesh)
	//var camera = new BABYLON.FreeCamera("camera1", new BABYLON.Vector3(0, 300, -250), scene);
	var camera = new BABYLON.FreeCamera("camera1", new BABYLON.Vector3(0, 350, -300), scene);
	//var camera = new BABYLON.ArcRotateCamera("Camera", -Math.PI / 2, Math.PI / 2, 4, BABYLON.Vector3.Zero(), scene);
	
	//targets the camera to scene origin
	camera.setTarget(BABYLON.Vector3.Zero());

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
	
	//show debug layer
	//scene.debugLayer.show();
	
	return scene;
}//lavaBackground

var background = lavaBackground();
var fpsLabel = document.getElementById("fpsLabel");

//render loop 60 fps, just render the scene
//engine.runRenderLoop(function(){
//	background.render();
//	fpsLabel.innerHTML = engine.getFps().toFixed() + " FPS";
//});

//use sceneOptimiser later if frame issues for low end devices..