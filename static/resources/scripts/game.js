console.log("Game Ready!")

//init player grid
var grid = new playerGrid(0,10,0, 15,15,10);

//draw the grid parameter
grid.drawParameter();

//render loop 60 fps, render the scene
engine.runRenderLoop(function(){
	background.render();
	fpsLabel.innerHTML = engine.getFps().toFixed() + " FPS";
});