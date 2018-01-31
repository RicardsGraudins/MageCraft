//gets a handle to the element with id myCanvas
var canvas = document.getElementById("myCanvas");
//get a 2D context for the canvas
var ctx = canvas.getContext("2d");

//hide the default menu that appears when you right click in a browser
//disabling this allows me to use right click as a keybind for player movement
canvas.oncontextmenu = function (e) {
	e.preventDefault();
};

//wait until document is ready
$(document).ready(function() {
	//resize the canvas
	canvas.width = window.innerWidth;
	canvas.height = window.innerHeight;
	console.log("Ready!")
});