/*** GAME INSTANTIATION ***/

var gameInterval;
var gameCanvas;
var eventCatcherDiv;
var hero = [0, 0, 50, 50];		// (top left x-loc, top left y-loc, width, height)
var wall = [100, 100, 50, 50];

/* When page has loaded, this function sets up and loads additional events */
function startLoading() {
    eventCatcherDiv = document.getElementById("EventCatcher");
	eventCatcherDiv.addEventListener("keydown", heroMove, false);
	
    gameCanvas = document.getElementById("GraphicsBox");
    gameInterval = setInterval(hasLoaded, 250);
}

/* If all info is loaded, call to start up the game */
function hasLoaded() {
    if (true) {		//Passes once everything is loaded
        clearInterval(gameInterval);
        startGame();
    }
}



/*** OBJECTS ***/

/* Update hero coordinates based on key press */
var heroMove = function (E) {
	/* Left Up Right Down */
	switch (E.keyCode) {
		case 37:
			if (hero[0] >= hero[2])
				hero[0] -= hero[2];
			break;
		case 38:
			if (hero[1] >= hero[3])
				hero[1] -= hero[3];
			break;
		case 39:
			if (hero[0] <= 600 - hero[2] * 2) // CANVAS WIDTH - HERO WIDTH
				hero[0] += hero[2];
			break;
		case 40:
			if (hero[1] <= 400 - hero[3] * 2) // CANVAS HEIGHT - HERO HEIGHT
				hero[1] += hero[3];
			break;
		default:
			break;
	}
	return false;
}

/* Draw the hero (50 x 50) */
function drawHero(g) {
	g.fillStyle = "red";
	g.fillRect(hero[0], hero[1], hero[2], hero[3]); // (x, y, width, height)
}

/* Draw walls (50 x 50) */
function drawWall(g) {
	g.fillStyle = "black";
	g.fillRect(wall[0], wall[1], wall[2], wall[3]);	// (x, y, width, height)
}

/*** GAME ***/

/* Sets objects and gets ready for the game (25ms) */
function startGame() {
    drawHero(gameCanvas.getContext("2d"));
    gameInterval = setInterval(drawGame, 25);
}

/* Reset board, and redraw game objects */
function drawGame() {
    gameCanvas.getContext("2d").clearRect(0, 0, gameCanvas.width, gameCanvas.height);
	drawHero(gameCanvas.getContext("2d"));
	drawWall(gameCanvas.getContext("2d"));
}
