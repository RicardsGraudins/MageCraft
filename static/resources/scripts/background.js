//gets a handle to the element with id myCanvas
var canvas = document.getElementById("myCanvas");
//gets a handle on BABYLON JS
var engine = new BABYLON.Engine(canvas,true);

var lavaBackground = function() {
	//creates a basic Babylon Scene object (non-mesh)
	var scene = new BABYLON.Scene(engine);

	//creates and positions a free camera (non-mesh)
	var camera = new BABYLON.FreeCamera("camera1", new BABYLON.Vector3(0, 50, -300), scene);

	//targets the camera to scene origin
	camera.setTarget(BABYLON.Vector3.Zero());

	//attaches the camera to the canvas
	camera.attachControl(canvas, true);

	//creates a light, aiming 0,1,0 - to the sky (non-mesh)
	var light = new BABYLON.HemisphericLight("light1", new BABYLON.Vector3(0, 1, 0), scene);

	var sphere = BABYLON.Mesh.CreateGround("ground", 500, 500, 100, scene);

	//lava Material creation
	var lavaMaterial = new BABYLON.LavaMaterial("lava", scene);	
	lavaMaterial.noiseTexture = new BABYLON.Texture("lava.png", scene); //set the bump texture
	lavaMaterial.diffuseTexture = new BABYLON.Texture("lava.png", scene); //set the diffuse texture
	lavaMaterial.speed = 1.5;
	lavaMaterial.fogColor = new BABYLON.Color3(1, 0, 0);

	sphere.material = lavaMaterial;


	return scene;
}

var background = lavaBackground();

//render loop 60 fps, just render the scene
engine.runRenderLoop(function(){
	background.render();
});