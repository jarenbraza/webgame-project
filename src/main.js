/*** GAME INSTANTIATION ***/

var gameInterval;
var gameCanvas;
var eventCatcherDiv;
var hero = [10, 10, 20, 20]; // (x, y, width, length)
var coin = [100, 100, 10]; // (x, y, radius)
var startButton = [150, 150, 300, 100];
var score = 0;
var inMenu = true;

/* When page has loaded, this function sets up and loads additional events */
function startLoading() {
    eventCatcherDiv = document.getElementById("EventCatcher");
	eventCatcherDiv.addEventListener("mousemove", heroMove);	// Event to listen: Mouse location => Hero location
	
	
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

/* Update hero coordinates based on mouse coordinates */
function heroMove(E) {
    E = E || window.event;
    hero[0] = E.pageX - hero[2] / 2;	// Mouse is on middle of hero
    hero[1] = E.pageY - hero[3] / 2;
}

function touchingCoin() {
	if ((hero[0] + hero[2] > coin[0] - coin[2]) && (hero[0] < coin[0] + coin[2]) &&
	    (hero[1] + hero[3] > coin[1] - coin[2]) && (hero[1] < coin[1] + coin[2]))
		return true;
}

/* Draw the hero (20 x 20) */
function drawHero(g) {
	g.fillStyle = "red";
	g.fillRect(hero[0], hero[1], hero[2], hero[3]); // (x, y, width, length)
}

/* Draw the coin */
function drawCoin(g) {
	g.fillStyle = "black";
	g.beginPath();
	g.arc(coin[0], coin[1], coin[2], 0, 2 * Math.PI);
	g.fill();
}

/* Draw the start button */
function drawStartButton(g) {
	g.fillStyle = "white";
	g.fillRect(startButton[0], startButton[1], startButton[2], startButton[3]);
	g.fillStyle = "red";
	g.font = "20pt sans-serif";
	g.fillText("I watch anime!", 215, 200);
}

function drawScore(g) {
    g.font = "16px Arial";
    g.fillStyle = "#0095DD";
    g.fillText("Score: "+score, 8, 20);
}

/* Sets position of coin to random position */
function moveCoin() {
	coin[0] = Math.random() * 500 + 50;	// 50 to 550 (of 600)
	coin[1] = Math.random() * 300 + 50; // 50 to 350 (of 400)
}



/*** GAME ***/

/* Sets objects and gets ready for the game (25ms) */
function startGame() {
	/* Checks if menu button was clicked */
	eventCatcherDiv.addEventListener("click", function canvasClicked(E) {
		var x = E.pageX - hero[2] / 2, y = E.pageY - hero[3] / 2;	// Mouse is on middle of hero

		if (x >= startButton[0] && x <= startButton[0] + startButton[2] &&
			y >= startButton[1] && y <= startButton[1] + startButton[3])
			inMenu = false;
		else
			inMenu = true;
	});	// To check if menu button is clicked
    drawHero(gameCanvas.getContext("2d"));
    gameInterval = setInterval(drawScreen, 25);
}

/* Reset board, and redraw game objects */
function drawGame() {
	if (touchingCoin()) { 
		moveCoin();
		score += 1;
	}
    gameCanvas.getContext("2d").clearRect(0, 0, gameCanvas.width, gameCanvas.height);
	drawScore(gameCanvas.getContext("2d"));
    drawCoin(gameCanvas.getContext("2d"));
	drawHero(gameCanvas.getContext("2d"));
}

function drawMenu() {
	gameCanvas.getContext("2d").clearRect(0, 0, gameCanvas.width, gameCanvas.height);
	drawStartButton(gameCanvas.getContext("2d"));
	drawHero(gameCanvas.getContext("2d"));
}

function drawScreen() {
	if (inMenu) {
		drawMenu();
	} else {
		drawGame();
	}
}
