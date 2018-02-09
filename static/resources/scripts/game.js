console.log("Game Ready!")

//init player grid
//4 player map
var grid = new playerGrid(-200,10,250, 25,25,16);
//example of 8 player map
//var grid = new playerGrid(-200,10,250, 25,25,32);

//draw the grid
grid.drawParameter();
grid.drawGrid();
grid.testingMaterial();

//render loop 60 fps, render the scene
engine.runRenderLoop(function(){
	background.render();
	fpsLabel.innerHTML = engine.getFps().toFixed() + " FPS";
});