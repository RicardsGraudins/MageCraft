console.log("Game Ready!")

//init player grid
//4 player map
var grid = new playerGrid(-200, 10, 250, 25, 25, 16);
//example of 8 player map
//var grid = new playerGrid(-200,10,250, 25,25,32);

//draw the grid
grid.drawParameter();
grid.drawGrid();
//grid.testingMaterial();
grid.setTextures();
grid.fadeOutAnimation();
//grid.boundaryTest();
grid.createGround();

//player object
var playerObject = new Player(0, 80, 0, 5, true);

//render loop 60 fps, render the scene
engine.runRenderLoop(function(){
	background.render();
	playerObject.move();
	playerObject.playerOnGrid();
	fpsLabel.innerHTML = engine.getFps().toFixed() + " FPS";
});