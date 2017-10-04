/*** GAME INSTANTIATION ***/

/*
const KEY_LEFT = 37;
const KEY_UP = 38;
const KEY_RIGHT = 39;
const KEY_DOWN = 40;
*/

var gameInterval;
var gameCanvas;
var eventCatcherDiv;
var hero = [0, 0, 50, 50];		// (nw x-loc, nw y-loc, width, height)
var wall = [50, 50, 50, 50];	// (nw x-loc, nw y-loc, width, height)
var isWall = [[false, false, false, false, false, false, false, false, false, false, false, false, false, false, false],
			  [false, true, false, true, false, true, false, true, false, true, false, true, false, true, false],
			  [false, false, false, false, false, false, false, false, false, false, false, false, false, false, false],
			  [false, true, false, true, false, true, false, true, false, true, false, true, false, true, false],
			  [false, false, false, false, false, false, false, false, false, false, false, false, false, false, false],
			  [false, true, false, true, false, true, false, true, false, true, false, true, false, true, false],
			  [false, false, false, false, false, false, false, false, false, false, false, false, false, false, false],
			  [false, true, false, true, false, true, false, true, false, true, false, true, false, true, false],
			  [false, false, false, false, false, false, false, false, false, false, false, false, false, false, false],
			  [false, true, false, true, false, true, false, true, false, true, false, true, false, true, false],
			  [false, false, false, false, false, false, false, false, false, false, false, false, false, false, false]];

/* When page has loaded, this function sets up and loads event listeners */
function startLoading() {
    eventCatcherDiv = document.getElementById("EventCatcher");
	eventCatcherDiv.addEventListener("keydown", heroMove, false);
	
    gameCanvas = document.getElementById("GraphicsBox");
    gameInterval = setInterval(hasLoaded, 250);
}

/* (Runs once loaded) If all info is loaded, call to start up the game */
function hasLoaded() {
	clearInterval(gameInterval);
	startGame();
}



/*** FUNCTIONALITY ***/

function validMove(heroX, heroY, E) {
	switch (E.keyCode) {
	case 37:
		if (isWall[heroY / 50][heroX / 50 - 1])	{	// If wall on left side
			return false;
		}
		break;
	case 38:
		if (isWall[heroY / 50 - 1][heroX / 50]) {	// If wall above
			return false;
		}
		break;
	case 39:
		if (isWall[heroY / 50][heroX / 50 + 1]) {	// If wall on right side
			return false;
		}
		break;
	case 40:
		if (isWall[heroY / 50 + 1][heroX / 50]) {	// If wall below
			return false;
		}
		break;
	default:
		break;
	}
	
	return true;	// No wall
}

/* Update hero coordinates based on key press */
var heroMove = function (E) {
	/* Left Up Right Down */
	switch (E.keyCode) {
		case 37:
			if (hero[0] >= hero[2] && validMove(hero[0], hero[1], E))
				hero[0] -= hero[2];
			break;
		case 38:
			if (hero[1] >= hero[3] && validMove(hero[0], hero[1], E))
				hero[1] -= hero[3];
			break;
		case 39:
			if (hero[0] <= 750 - hero[2] * 2 && validMove(hero[0], hero[1], E)) // CANVAS WIDTH - HERO WIDTH
				hero[0] += hero[2];
			break;
		case 40:
			if (hero[1] <= 550 - hero[3] * 2 && validMove(hero[0], hero[1], E)) // CANVAS HEIGHT - HERO HEIGHT
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
	for (i = 0; i <= 600; i += 100) {
		for (j = 0; j <= 500; j += 100) {
			g.fillRect(wall[0] + i, wall[1] + j, wall[2], wall[3]);	// (x, y, width, height)
		}
	}
}


/*** GAME LOOP ***/

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
