/*** ADD JQUERY XD ***/
/*** Unique walls ***/

/*** GAME INSTANTIATION ***/
/* (15 x 11) = (750 by 550) */

const KEY_LEFT = 37, KEY_UP = 38, KEY_RIGHT = 39, KEY_DOWN = 40;
const SCALE = 50;

class Hero {
	constructor(x, y, leftKey, upKey, rightKey, downKey, bombKey) {
		this.x = x;
		this.y = y;
		this.alive = true;
		this.leftKey = leftKey;
		this.upKey = upKey;
		this.rightKey = rightKey;
		this.downKey = downKey;
		this.bombKey = bombKey;
	}
}

var boardWidth = 750, boardHeight = 550;
var gameInterval;
var gameCanvas;
var eventCatcherDiv;
var expLength = 2;
var hero = [];

/* Hard coding first two heroes ^^ */
var newHero = new Hero(0, 0, 37, 38, 39, 40, 32);
hero.push(newHero);
var newHero = new Hero(700, 0, 65, 87, 68, 83, 32);
hero.push(newHero);

// 0 = Vacant, 1 = Weak Wall, 2 = Strong (Indestructable) Wall
var wallArr = [
				[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
			  [0, 2, 0, 2, 0, 2, 0, 2, 0, 2, 0, 2, 0, 2, 0],
			  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
			  [0, 2, 0, 2, 0, 2, 0, 2, 0, 2, 0, 2, 0, 2, 0],
			  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
			  [0, 2, 0, 2, 0, 2, 0, 2, 0, 2, 0, 2, 0, 2, 0],
			  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
			  [0, 2, 0, 2, 0, 2, 0, 2, 0, 2, 0, 2, 0, 2, 0],
			  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
			  [0, 2, 0, 2, 0, 2, 0, 2, 0, 2, 0, 2, 0, 2, 0],
			  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]];

// 0 = Vacant, >0 = Timer Before Explosion
var bombArr = [
				[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
				[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
				[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
				[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
				[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
				[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
				[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
				[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
				[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
				[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
				[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]];

// 0 = Vacant, >0 = Explosion Duration Left
var expArr =  [
				[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
				[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
				[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
				[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
				[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
				[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
				[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
				[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
				[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
				[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
				[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]];

/* When page has loaded, this function sets up and loads event listeners */
function startLoading() {
	eventCatcherDiv = document.getElementById("EventCatcher");
	eventCatcherDiv.addEventListener("keydown", heroMove);	// Arrow Key Handling
	eventCatcherDiv.addEventListener("keydown", setBomb);	// Spacebar Handling
	eventCatcherDiv.addEventListener("keydown", resetGame);	// Reset Button (R) Handling
	
	gameCanvas = document.getElementById("GraphicsBox");
	gameInterval = setInterval(hasLoaded, 250);
}

/* (Runs once loaded) If all info is loaded, call to start up the game */
function hasLoaded() {
	clearInterval(gameInterval);
	startGame();
}



/*** FUNCTIONALITY ***/

/* Returns false if obj in way of movement; true otherwise */
function validMove(E) {
	
	//Left, Up, Right, Down
	if (E.keyCode == hero[0].leftKey)
		if (wallArr[hero[0].y / 50][hero[0].x / 50 - 1] || bombArr[hero[0].y / 50][hero[0].x / 50 - 1])	// If obj on left side
			return false;

	if (E.keyCode == hero[0].upKey)
		if (wallArr[hero[0].y / 50 - 1][hero[0].x / 50] || bombArr[hero[0].y / 50 - 1][hero[0].x / 50])	// If obj above
			return false;

	if (E.keyCode == hero[0].rightKey)
		if (wallArr[hero[0].y / 50][hero[0].x / 50 + 1] || bombArr[hero[0].y / 50][hero[0].x / 50 + 1])	// If obj on right side
			return false;

	if (E.keyCode == hero[0].downKey)
		if (wallArr[hero[0].y / 50 + 1][hero[0].x / 50] || bombArr[hero[0].y / 50 + 1][hero[0].x / 50])	// If obj below
			return false;
	
	return true;	// No wall
}

/* Update hero coordinates based on key press */
function heroMove(E) {
	
	//Left, Up, Right, Down
	if (E.keyCode == hero[0].leftKey)
		if (hero[0].x >= SCALE && validMove(E))
			hero[0].x -= SCALE;
	
	if (E.keyCode == hero[0].upKey)
		if (hero[0].y >= SCALE && validMove(E))
			hero[0].y -= SCALE;
	
	if (E.keyCode == hero[0].rightKey)
		if (hero[0].x <= boardWidth - SCALE * 2 && validMove(E))
			hero[0].x += SCALE;
	
	if (E.keyCode == hero[0].downKey)
		if (hero[0].y <= boardHeight - SCALE * 2 && validMove(E))
			hero[0].y += SCALE;
}

/* Draw the hero (50 x 50) */
function drawHero(g) {
	g.fillStyle = "red";
	g.fillRect(hero[0].x, hero[0].y, SCALE, SCALE); // (x, y, width, height)
}

/* Sets status of hero based on what he's on top of */
function updateHero() {
	if (expArr[hero[0].y / SCALE][hero[0].x / SCALE] != 0) {
		hero[0].alive = false;
	}
}

/* Generate weak walls randomly */
function generateWalls() {
	// Clear weak walls
	for (i = 0; i < boardHeight / 50; i++)
		for (j = 0; j < boardWidth / 50; j++)
			if (wallArr[i][j] != 2)
				wallArr[i][j] = 0;
	
	// Set up weak walls randomly
	for (i = 0; i < boardHeight / 50; i++) {
		for (j = 0; j < boardWidth / 50; j++) {
			if ((i == 0 && (j == 0 || j == 1 || j == 13 || j == 14)) ||
				 	(i == 1 && (j == 0 || j == 14)) ||
				 	(i == 9 && (j == 0 || j == 14)) ||
					(i == 10 && (j == 0 || j == 1 || j == 13 || j == 14))) {
				continue;	// Skip if corner location
			}
			//Otherwise, generate block randomly
			if (Math.random() <= 0.8)
				if (wallArr[i][j] != 2)
					wallArr[i][j] = 1;
		}
	}
}

/* Draw walls (50 x 50) */
function drawWalls(g) {
	for (var i = 0; i < boardHeight / SCALE; i++) {
		for (var j = 0; j < boardWidth / SCALE; j++) {
			if (wallArr[i][j] == 2) {
				g.fillStyle = "black";
				g.fillRect(j * SCALE, i * SCALE, SCALE, SCALE);
			}
			if (wallArr[i][j] == 1) {
				g.fillStyle = "#404040";
				g.fillRect(j * SCALE, i * SCALE, SCALE, SCALE);
			}
		}
	}
}

/* Sets bomb array (timer) at hero location */
function setBomb(E) {
	if (E.keyCode == hero[0].bombKey && hero[0].alive)
		if (bombArr[hero[0].y / SCALE][hero[0].x / SCALE] == 0)
			bombArr[hero[0].y / SCALE][hero[0].x / SCALE] = 80;
}

/* Draws bomb array */
function drawBombs(g) {
	/* If bomb exists, draw it */
	for (var i = 0; i < boardHeight / SCALE; i++) {
		for (var j = 0; j < boardWidth / SCALE; j++) {
			if (bombArr[i][j] != 0) {
				g.fillStyle = "grey";
				g.beginPath();
				g.arc(j * SCALE + SCALE / 2, i * SCALE + SCALE / 2, SCALE / 2, 0, 2*Math.PI);
				g.fill();
			}
		}
	}
}

/* Updates bomb array (timer) */
function updateBombs() {
	for (i = 0; i < boardHeight / SCALE; i++) {
		for (j = 0; j < boardWidth / SCALE; j++) {
			if (bombArr[i][j] == 0) continue;
			if (bombArr[i][j] == 1) {
				explode(i, j);
				continue;
			}
			bombArr[i][j]--;
		}
	}
}

/* Sets explosion array (timer) spreading out from (i, j) */
function explode(i, j) {
	bombArr[i][j] = 0;	// Destroy bomb
	var g = gameCanvas.getContext("2d");
	
	// Checking from the ranges i-2 to i+2, and, j-2 to j+2
	// Cuts range short if reaches edge of graph
	var xMin = Math.max(0, j - expLength);
	var xMax = Math.min(boardWidth / SCALE - 1, j + expLength);	// Width - 1
	var yMin = Math.max(0, i - expLength);
	var yMax = Math.min(boardHeight / SCALE - 1, i + expLength); // Height - 1
	
	// If vacant, fill up with explosion and check next space
	// Else, stop spreading after checking...
	// 	If bomb, blow it up
	// 	If weak wall, break it
	// 	If strong wall, do nothing
	for (u = i + 1; u <= yMax; u++) {
		if (bombArr[u][j] != 0) {
			explode(u,j);
			break;
		}
		else if (wallArr[u][j] == 0) {
			expArr[u][j] = 40;
			continue;
		}
		else if (wallArr[u][j] == 1) {
			wallArr[u][j] = 0;
			expArr[u][j] = 40;
		}
		break;
	}
	for (u = i - 1; u >= yMin ; u--) {
		if (bombArr[u][j] != 0) {
			explode(u, j);
			break;
		}
		else if (wallArr[u][j] == 0) {
			expArr[u][j] = 40;
			continue;
		}
		else if (wallArr[u][j] == 1) {
			wallArr[u][j] = 0;
			expArr[u][j] = 40;
		}
		break;
	}
	for (v = j + 1; v <= xMax; v++) {
		if (bombArr[i][v] != 0) {
			explode(i, v);
			break;
		}
		else if (wallArr[i][v] == 0) {
			expArr[i][v] = 40;
			continue;
		}
		else if (wallArr[i][v] == 1) {
			wallArr[i][v] = 0;
			expArr[i][v] = 40;
		}
		break;
	}
	for (v = j - 1; v >= xMin ; v--) {
		if (bombArr[i][v] != 0) {
			explode(i, v);
			break;
		}
		else if (wallArr[i][v] == 0) {
			expArr[i][v] = 40;
			continue;
		}
		else if (wallArr[i][v] == 1) {
			wallArr[i][v] = 0;
			expArr[i][v] = 40;
		}
		break;
	}
	expArr[i][j] = 40;	// Center guaranteed to be not a wall
}

/* Draws explosion array */
function drawExp(g) {
	for (i = 0; i < boardHeight / SCALE; i++) {
		for (j = 0; j < boardWidth / SCALE; j++) {
			if (expArr[i][j] != 0) {
				g.fillStyle = "green";
				g.fillRect(j * SCALE, i * SCALE, SCALE, SCALE);
			}
		}
	}
}

/* Updates explosion array (timer) */
function updateExp() {
	for (i = 0; i < boardHeight / SCALE; i++) {
		for (j = 0; j < boardWidth / SCALE; j++) {
			if (expArr[i][j] == 0) continue;
			expArr[i][j]--;
		}
	}
}



/*** GAME LOOP ***/

/* Sets objects and gets ready for the game (25ms) */
function startGame() {
	generateWalls();
	gameInterval = setInterval(drawGame, 25);
}

/* Reset board, and redraw game objects */
function drawGame() {
	var g = gameCanvas.getContext("2d");	// Access canvas
	
	g.clearRect(0, 0, gameCanvas.width, gameCanvas.height);
	updateBombs();
	updateExp();
	updateHero();
	if (hero[0].alive)
		drawHero(g);
	drawBombs(g);
	drawExp(g);
	drawWalls(g);
}

/* Resets board from start */
function resetGame(E) {
	// Clear game, reset values, and start game up again
	if (E.keyCode == 82) {	// R
		for (i = 0; i < hero.length; i++) {
			hero[i].alive = true;
		}
		hero[0].x = 0;
		hero[0].y = 0;
		hero[1].x = 700;
		hero[1].y = 0;
		
		clearInterval(gameInterval);
		startGame();
	}
}
