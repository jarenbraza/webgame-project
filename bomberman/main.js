/*** GAME INSTANTIATION ***/
/* (15 x 11) = (750 by 550) */

const KEY_LEFT = 37, KEY_UP = 38, KEY_RIGHT = 39, KEY_DOWN = 40;
const SCALE = 50;
const GAME_RATE = 25;

class Hero {
	constructor(x, y, leftKey, upKey, rightKey, downKey, bombKey, color) {
		this.origX = x, this.origY = y, this.x = x, this.y = y;
		this.leftKey = leftKey, this.upKey = upKey, this.rightKey = rightKey, this.downKey = downKey;
		this.bombKey = bombKey;
		this.color = color;
		this.maxBombs = 1;
		this.numBombs = 1;
		this.expLength = 1;
		this.alive = true;
	}
}

var boardWidth = 750, boardHeight = 550;
var gameInterval;
var gameCanvas;
var eventCatcherDiv;

// Walls: 0 = Vacant, 1 = Weak Wall, 2 = Strong (Indestructable) Wall
// Bombs: 0 = Vacant, >0 = Timer Before Explosion
// Bomb Type: 0 = Vacant, 1 = Player 1's Bomb, 2 = Player 2's Bomb, etc.
// Explosions: 0 = Vacant, >0 = Explosion Duration Left
// Player: Unimplemented
var wallArr = [], bombArr = [], bombType = [], expArr =  [], playerArr = [], upgradeArr = [];

var hero = [];

var newHero = new Hero(0, 0, 37, 38, 39, 40, 13, "red");
hero.push(newHero);
var newHero = new Hero(boardWidth - SCALE, boardHeight - SCALE, 65, 87, 68, 83, 32, "green");
hero.push(newHero);


/* Loads event listeners and begins start up game */
function startLoading() {
	eventCatcherDiv = document.getElementById("EventCatcher");
	eventCatcherDiv.addEventListener("keydown", heroMove);	// Arrow Key Handling
	eventCatcherDiv.addEventListener("keydown", setBomb);	// Spacebar Handling
	eventCatcherDiv.addEventListener("keydown", resetGame);	// Reset Button (R) Handling
	
	gameCanvas = document.getElementById("GraphicsBox");
	gameInterval = setInterval(function hasLoaded() {
		clearInterval(gameInterval);
		startGame();}, 250);
}



/*** FUNCTIONALITY ***/

/* Checks validity of move */
function validMove(E, i) {
	// Input: Keypress Event, Player #
	// Result: Return false if cannot move into spot; Return true if valid 
	
	row = hero[i].y / SCALE;
	col = hero[i].x / SCALE;
	
	if (E.keyCode == hero[i].leftKey)
		if (wallArr[row][col - 1] || bombArr[row][col - 1])	// If obj on left side
			return false;

	if (E.keyCode == hero[i].upKey)
		if (wallArr[row - 1][col] || bombArr[row - 1][col])	// If obj above
			return false;

	if (E.keyCode == hero[i].rightKey)
		if (wallArr[row][col + 1] || bombArr[row][col + 1])	// If obj on right side
			return false;

	if (E.keyCode == hero[i].downKey)
		if (wallArr[row + 1][col] || bombArr[row + 1][col])	// If obj below
			return false;
	
	return true;	// No wall
}

/* Updates the coordinates of each hero after a Keypress Event */
function heroMove(E) {
	// Input: Keypress Event
	// Result: Changes x and y values of a hero based on Keypress and adjacent tile
	
	for (i = 0; i < hero.length; i++) {
		if (E.keyCode == hero[i].leftKey)
			if (hero[i].x >= SCALE && validMove(E, i))
				if (playerArr[hero[i].y / 50][hero[i].x / 50 - 1] == 0)
					hero[i].x -= SCALE;

		if (E.keyCode == hero[i].upKey)
			if (hero[i].y >= SCALE && validMove(E, i))
				if (playerArr[hero[i].y / 50 - 1][hero[i].x / 50] == 0)
					hero[i].y -= SCALE;

		if (E.keyCode == hero[i].rightKey)
			if (hero[i].x <= boardWidth - SCALE * 2 && validMove(E, i))
				if (playerArr[hero[i].y / 50][hero[i].x / 50 + 1] == 0)
					hero[i].x += SCALE;

		if (E.keyCode == hero[i].downKey)
			if (hero[i].y <= boardHeight - SCALE * 2 && validMove(E, i))
				if (playerArr[hero[i].y / 50 + 1][hero[i].x / 50] == 0)
					hero[i].y += SCALE;
	}
}

/* Checks each hero if in explosion and draws heroes onto canvas if alive */
function updateHeroes(g) {
	// Input: Canvas
	// Result: Update player location array; Hero set dead if on explosion; Upgrades if on upgrade; If alive, draws heroes
	
	for (i = 0; i < boardHeight / SCALE; i++) {
		for (j = 0; j < boardWidth / SCALE; j++) {
			playerArr[i][j] = 0;
		}
	}
	
	for (i = 0; i < hero.length; i++) {
		var x = hero[i].x;
		var y = hero[i].y;
		playerArr[y / SCALE][x / SCALE] = i + 1;
		if (expArr[y / SCALE][x / SCALE] != 0) hero[i].alive = false;
		if (hero[i].alive) {
			g.fillStyle = hero[i].color;
			g.fillRect(x, y, SCALE, SCALE);
		}
		if (upgradeArr[y / SCALE][x / SCALE] != 0) {
			if (upgradeArr[y / SCALE][x / SCALE] == 1) hero[i].expLength++;
			if (upgradeArr[y / SCALE][x / SCALE] == 2) {
				hero[i].numBombs++;
				hero[i].maxBombs++;
			}
			// if (upgradeArr[y / SCALE][x / SCALE] == 3)	UNUSED UPGRADE
			upgradeArr[y / SCALE][x / SCALE] = 0;	// Get rid of upgrade
		}
	}
}

/* Draw walls */
function drawWalls(g) {
	// Input: Canvas
	// Result: Draws indestructable walls (black) and destructable walls (grey)
	
	for (i = 0; i < boardHeight / SCALE; i++)
		for (j = 0; j < boardWidth / SCALE; j++)
			if (wallArr[i][j] != 0) {
				if (wallArr[i][j] == 2) g.fillStyle = "black";
				if (wallArr[i][j] == 1) g.fillStyle = "#404040";
				g.fillRect(j * SCALE, i * SCALE, SCALE, SCALE);
			}
}

/* Draws upgrades */
function drawUpgrades(g) {
	// Input: Canvas
	// Result: Draws upgrades if it exists and there is no wall there
	
	for (i = 0; i < boardHeight / SCALE; i++) {
		for (j = 0; j < boardWidth / SCALE; j++) {
				if (upgradeArr[i][j] != 0 && wallArr[i][j] == 0) {
					if (upgradeArr[i][j] == 1) g.fillStyle = "#00CED1";
					if (upgradeArr[i][j] == 2) g.fillStyle = "#B22222";
					if (upgradeArr[i][j] == 3) g.fillStyle = "#FFD700";
					g.fillRect(j * SCALE, i * SCALE, SCALE, SCALE);
				}
		}
	}
}

/* Sets bomb array (timer) at hero location and deletes a bomb from user */
function setBomb(E) {
	// Input: Keypress Event
	// Result: Sets bomb timer before explosion; Sets which player placed bomb; Deletes one bomb from user
	
	for (i = 0; i < hero.length; i++)
		if (E.keyCode == hero[i].bombKey && hero[i].alive)	// If key to place bomb is pressed, and that player is alive
			if (bombArr[hero[i].y / SCALE][hero[i].x / SCALE] == 0 && hero[i].numBombs != 0) {	// if vacant spot and hero has a bomb
				bombArr[hero[i].y / SCALE][hero[i].x / SCALE] = 80;	// Set timer
				bombType[hero[i].y / SCALE][hero[i].x / SCALE] = i + 1;	// 1 = P1's Bomb, 2 = P2's Bomb, etc.
				hero[i].numBombs--;
			}
}

/* Updates bomb array (timer) and draws bomb onto canvas if exists */
function updateBombs(g) {
	// Input: Canvas
	// Result: If bomb exists, draw it and decrease its timer to explode
	
	for (i = 0; i < boardHeight / SCALE; i++) {
		for (j = 0; j < boardWidth / SCALE; j++) {
			if (bombArr[i][j] != 0) {
				g.fillStyle = "grey";
				g.beginPath();
				g.arc(j * SCALE + SCALE / 2, i * SCALE + SCALE / 2, SCALE / 2, 0, 2 * Math.PI);
				g.fill();
			} 
			else continue;
			
			if (--bombArr[i][j] == 1) explode(i, j, bombType[i][j]);
		}
	}
}

/* Sets explosion array (timer) spreading out from (i, j) and restores bomb to user */
function explode(i, j, type) {
	// Input: Coordinates (i, j), Number of the hero who placed currently exploding bomb (type)
	// Result: Explosions (game-over tiles) spread based on player's stats; Chains explodes if explosion hits a bomb; Destroys weak walls in path
	
	bombArr[i][j] = 0;	// Destroy bomb
	
	// Checking from the ranges i-2 to i+2, and, j-2 to j+2
	// Cuts range short if reaches edge of graph
	var xMin = Math.max(0, j - hero[type - 1].expLength);
	var xMax = Math.min(boardWidth / SCALE - 1, j + hero[type - 1].expLength);	// Width - 1
	var yMin = Math.max(0, i - hero[type - 1].expLength);
	var yMax = Math.min(boardHeight / SCALE - 1, i + hero[type - 1].expLength); // Height - 1
	
	for (u = i + 1; u <= yMax; u++) {
		if (bombArr[u][j] != 0) {
			explode(u, j, bombType[u][j]);
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
			explode(u, j, bombType[u][j]);
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
			explode(i, v, bombType[i][v]);
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
			explode(i, v, bombType[i][v]);
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
	hero[type - 1].numBombs++;	// Restore bomb to hero
	type = 0;	// Bombs completely restored
}

/* Updates explosion array (timer) and draws explosion onto canvas if exists */
function updateExp(g) {
	// Input: Canvas
	// Result: If explosion tile exists, draw it and decrease its duration
	
	for (i = 0; i < boardHeight / SCALE; i++) {
		for (j = 0; j < boardWidth / SCALE; j++) {
			if (expArr[i][j] != 0) {
				g.fillStyle = "#8B008B";
				g.fillRect(j * SCALE, i * SCALE, SCALE, SCALE);
				expArr[i][j]--;
			}
		}
	}
}



/*** GAME LOOP ***/

/* Sets objects and gets ready for the game (25ms) */
function startGame() {
	
	playerArr.length = 0, expArr.length = 0, bombArr.length = 0, bombType.length = 0, wallArr.length = 0, upgradeArr.length = 0;
	
	// Generate arrays
	for (i = 0; i < boardHeight / SCALE; i++) {
		// Insert rows
		playerArr.push([]);
		expArr.push([]);
		bombArr.push([]);
		bombType.push([]);
		upgradeArr.push([]);
		wallArr.push([]);
		for (j = 0; j < boardWidth / SCALE; j++) {
			// Insert columns
			playerArr[i].push(0);
			expArr[i].push(0);
			bombArr[i].push(0);
			bombType[i].push(0);
			upgradeArr[i].push(0);
			if ((i % 2 == 1) && (j % 2 == 1))
				wallArr[i].push(2);
			else
				wallArr[i].push(0);
		}
	}
	
	// Randomly generate destructable walls
	for (i = 0; i < boardHeight / SCALE; i++)
		for (j = 0; j < boardWidth / SCALE; j++) {
			if (((i == 0) && (j == 0 || j == 1 || j == boardWidth / SCALE - 2 || j == boardWidth / SCALE - 1)) ||
				 	((i == 1) && (j == 0 || j == boardWidth / SCALE - 1)) ||
				 	((i == boardHeight / SCALE - 2) && (j == 0 || j == boardWidth / SCALE - 1)) ||
					((i == boardHeight / SCALE - 1) && (j == 0 || j == 1 || j == boardWidth / SCALE - 2 || j == boardWidth / SCALE - 1))) {
				continue;	// Skip if corner location
			}
			
			if (Math.random() <= 0.8)
				if (wallArr[i][j] != 2)
					wallArr[i][j] = 1;
		}
	
	// Random generate upgrades inside destructable walls
	for (i = 0; i < boardHeight / SCALE; i++)
		for (j = 0; j < boardWidth / SCALE; j++)
			if (wallArr[i][j] == 1)
				if (Math.random() <= 0.2)
					upgradeArr[i][j] = Math.floor(Math.random() * 2) + 1;	// Random number from 1 to 2
	
	// Clear bombs and explosions
	for (i = 0; i < boardHeight / SCALE; i++)
			for (j = 0; j < boardWidth / SCALE; j++) {
				bombArr[i][j] = 0;
				bombType[i][j] = 0;
				expArr[i][j] = 0;
			}
	
	// Reset heroes
	for (i = 0; i < hero.length; i++) {
		hero[i].x = hero[i].origX;
		hero[i].y = hero[i].origY;
		hero[i].maxBombs = 1;
		hero[i].expLength = 1;
		hero[i].alive = true;
	}
	
	// Starts up the game
	gameInterval = setInterval(drawGame, GAME_RATE);
}

/* Reset board, and redraw game objects */
function drawGame() {
	var g = gameCanvas.getContext("2d");	// Access canvas
	
	g.clearRect(0, 0, gameCanvas.width, gameCanvas.height);
	updateHeroes(g);
	updateBombs(g);
	drawUpgrades(g);
	drawWalls(g);
	updateExp(g);
	displayStats();
}

/* Clear game and start game up again */
function resetGame(E) {
	if (E.keyCode == 82) {	// R
		clearInterval(gameInterval);
		document.getElementById("WinnerText").innerHTML = "";
		startGame();
	}
}

function displayStats() {
	document.getElementById("P1S1").innerHTML = "Exp Length = " + hero[0].expLength;
	document.getElementById("P1S2").innerHTML = "Number of Bombs = " + hero[0].maxBombs;
	document.getElementById("P2S1").innerHTML = "Exp Length = " + hero[1].expLength;
	document.getElementById("P2S2").innerHTML = "Number of Bombs = " + hero[1].maxBombs;
	
	if (hero[0].alive && !(hero[1].alive)) {
		document.getElementById("WinnerText").innerHTML = "Player 1 wins!";
	}
	if (hero[1].alive && !(hero[0].alive)) {
		document.getElementById("WinnerText").innerHTML = "Player 2 wins!";
	}
	if (!(hero[0].alive || hero[1].alive)) {
		document.getElementById("WinnerText").innerHTML = "Oh haha um";
	}
}