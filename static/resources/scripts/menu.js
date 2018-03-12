//menu that pops up when the player dies
gameOver = function(){
	//make the gameOver menu visible
	document.getElementById("game-over").style.display = "block";
	//make the game darker
	document.getElementById("myCanvas").setAttribute("class", "fade");
	//display gold earned on the menu
	displayGold();
}//gameOver

//change the gold earned value displayed
displayGold = function(){
	document.getElementById('goldEarned').innerHTML = gold;
}//passScore

//restart the tutorial
restart = function(){
	//hide the game over menu
	document.getElementById("game-over").style.display = "none";
	//increase the visibility of the game from dark
	document.getElementById("myCanvas").setAttribute("class", "reset");
	
	/*
	//stop running the engine loop - this is the loop that only runs
	//the background render and the death animation loop
	engine.stopRenderLoop();
	playerSprite.stopAnimation(); //stop the death animation
	
	//start up a new engine loop
	playerRestarted();
	*/
	
	//alternatively simply reload the page
	location.reload();
	//the logic behind restarting the game using engine loops works fine however
	//in the interest of getting onto other parts of this project we will be simply
	//reloading the page - in order to fully reset the game using playerRestarted()
	//the UI, cooldowns, starting positions of every mesh, sprites etc. should be reset
	//fully to their starting positions and values which is quite tedious
}//restart

//navigate back to the main menu
menu = function(){
	window.location.replace('http://127.0.0.1:5000/');
}//menu