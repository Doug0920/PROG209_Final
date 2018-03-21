//Some useful navigation code taken from spaceArcade JavaScript code
//The rest is a modification of routines provided in "Foundation Game Design" by Rex van der Spuy

//All new (additional) code written by Doug Cottrill, PROG 209, 03-20-18

//Change in movement:
//Player can move to:
//  cells containing Empty (asphalt parking lot), or Goal,
//  or entering House, Hotel, Office from the south (row below the object),
//Monster can move to all cells except the Hospital, by same rules as Player

//Non-functions (code to execute on load) are here

//Arrow key codes
var UP = 38,
DOWN = 40,
RIGHT = 39,
LEFT = 37;

var startBtn = document.querySelector("#start");
startBtn.addEventListener("click",startGameHandler,false);
window.addEventListener("keydown",keydownHandler,false);

var grid1   = document.querySelector("#grid");
var output = document.querySelector("#output");
var gameMessage = "";
var SIZE = 64;

//An 8x8 2D map/array of non-moving objects
var map = [
	[0, 0, 0, 1, 0, 0, 0, 0],
	[0, 4, 0, 0, 2, 0, 0, 0],
	[0, 0, 0, 0, 0, 0, 0, 0],
	[1, 0, 0, 3, 0, 0, 0, 0],
	[0, 0, 0, 0, 0, 0, 1, 0],
	[0, 0, 2, 0, 0, 0, 0, 0],
	[0, 3, 0, 0, 0, 1, 0, 0],
	[0, 0, 0, 0, 0, 0, 0, 5]
	];		
//key:
var EMPTY = 0; 	// Asphalt parking lot
var HOUSE = 1;
var HOTEL = 2;
var OFFICE = 3;
var HOSPITAL = 4;
var GOAL	= 5;
//(start is at 0,0)

//An 8x8 2D map/array of objects that move
// Start Player in top-left, diagonal to goal;  Monster in [6,6] near goal
var gameObj = [
	[6, 0, 0, 0, 0, 0, 0, 0],
	[0, 0, 0, 0, 0, 0, 0, 0],
	[0, 0, 0, 0, 0, 0, 0, 0],
	[0, 0, 0, 0, 0, 0, 0, 0],
	[0, 0, 0, 0, 0, 0, 0, 0],
	[0, 0, 0, 0, 0, 0, 0, 0],
	[0, 0, 0, 0, 0, 0, 7, 0],
	[0, 0, 0, 0, 0, 0, 0, 0]
	];		
//key:
var PLAYER	= 6;
var MONSTER = 7;

var ROWS = map.length;
var COLS = map[0].length;

var playerRow;
var playerColumn;
var monsterRow;
var monsterColumn;


//Initialize objects on the screen
render();


//rest is done by event handlers

function startGameHandler() {
	// Hide the intro screen, show the game screen
	firstScreen.style.display = "none";
	gameScreen.style.display = "block";
}

function keydownHandler(event) {
	// handle user keyboard input

	let direction = event.keyCode;
	let squareRequested = -1;

	switch(direction)
	{
	case UP:
		if (playerRow > 0) {
			// 					Player can move to all types of cells from directly below, including Hospital
			//Clear the player's current cell
			gameObj[playerRow][playerColumn] = 0;
			//Subtract 1 from the player's row
			playerRow--;
			//Apply the player's new updated position to the array
			gameObj[playerRow][playerColumn] = PLAYER;
		}
		break;

	case DOWN:
		if (playerRow < ROWS - 1) {
			squareRequested = map[playerRow + 1][playerColumn];
			if(squareRequested === EMPTY    ||
					squareRequested === GOAL ) {
				// only move to empty and goal if not directly below object
				gameObj[playerRow][playerColumn] = 0;
				playerRow++;
				gameObj[playerRow][playerColumn] = PLAYER;
			}
		}
		break;

	case LEFT:
		if (playerColumn > 0) {
			squareRequested = map[playerRow][playerColumn - 1];
			if(squareRequested === EMPTY    ||
					squareRequested === GOAL ) {
				gameObj[playerRow][playerColumn] = 0;
				playerColumn--;
				gameObj[playerRow][playerColumn] = PLAYER;
			}
		}
		break;

	case RIGHT:
		if (playerColumn < COLS - 1) {
			squareRequested = map[playerRow][playerColumn + 1];
			if(squareRequested === EMPTY    ||
					squareRequested === GOAL ) {
				gameObj[playerRow][playerColumn] = 0;
				playerColumn++;
				gameObj[playerRow][playerColumn] = PLAYER;
			}
		}
	}
	if (map[playerRow][playerColumn] == GOAL)
	{
		//		Win game if reached goal before touching monster
		endGame();
	}

	moveMonster();		//	Move monster after player chooses move

	//Find out if the player is touching (overlapping) the monster
	if (gameObj[playerRow][playerColumn] == MONSTER)
	{
		endGame();
	}

	render( );		// display result of player & monster moves
}

//TEST
/*

function moveMonster()
{
	// stub
}

function endGame()
{
	// stub
}
*/


function render()
{
	// Clear the grid of img tag cells previously created

 	if(grid1.hasChildNodes())		// remove 64 entries (8x8 grid)
	{
		for(var i = 1; i <= ROWS * COLS; i++)	// mod from book example
		{
			grid1.removeChild(grid1.firstChild);
		}
	}
	
	// Render the game by looping through the map arrays (0-based)
	// Most code from book example
	for(var row = 0; row < ROWS; row++)
	{
		for(var column = 0; column < COLS; column++)
		{

			// Track current Player and Monster position in parallel array
			if(gameObj[row][column] === PLAYER)
			{
				playerRow = row;
				playerColumn = column;
			}
			if(gameObj[row][column] === MONSTER) {
				monsterRow = row;
				monsterColumn = column;
			}

			//Create an img tag called cell
			var cell = document.createElement("img");

			//Set its CSS class to "cell"
			cell.setAttribute("class", "cell");

			//Add the img tag to the <div id="grid"> tag
			grid1.appendChild(cell);

			//Find the correct image for this map cell
			switch(map[row][column])
			{
			case EMPTY:
				cell.src = "./images/empty.png";
				break;

			case HOUSE:
				cell.src = "./images/House-icon_BW_ArtDesigner.lv.png";
				break;

			case HOTEL:
				cell.src = "./images/Hotel-icon_BW_ArtDesigner.lv.png";
				break;

			case OFFICE:
				cell.src = "./images/office-building-icon_LokasSoftware.png";
				break;

			case HOSPITAL:
				cell.src = "./images/Hospital-icon.png";
				break;

			case GOAL:
				cell.src = "./images/Flag3RightBlue-2-icon.png";
				break;
			}

			//		After drawing non-moving map, overlay the Player and Monster icons from gameObj array
			switch(gameObj[row][column])
			{
			case PLAYER:
				cell.src = "./images/orange-person-icon.png";
				break;

			case MONSTER:
				cell.src = "./images/teddy-monster-viewer-icon.png";
				break;
			}

			//Position the cell
			cell.style.top = row * SIZE + "px";
			cell.style.left = column * SIZE + "px";

		}
	}

	//Display the game message
	output.innerHTML = gameMessage;
}




function moveMonster()
{
	//The 4 + 1 possible directions that the monster can move
	let MOVEUP = 1;
	let MOVEDOWN = 2;
	let MOVELEFT = 3;
	let MOVERIGHT = 4;
	// (not stored in same way)	var TOPLAYER = 5;		// the valid direction that will minimize the distance to player
	//						 							(distance = Math.sqrt((x_2 - x_1)^2 + (y_2 - y_1)^2) 

	//An array to store the valid direction that the monster is allowed to move in
	var validDirections = [];
	var minDistance = 0.0;
	var minDistDirection = [];

	//The final direction that the monster will move in
	var direction = -1;

	//	Monster can move to all cells except the Hospital, by same rules as Player:
	//  If the cells contain EMPTY,
	//  or if entering House, Hotel, Office from the south (row below the object),
	// push the corresponding direction (UP, DOWN, LEFT, or RIGHT) into the validDirections array
	if(monsterRow > 0)
	{
		var thingAbove = map[monsterRow - 1][monsterColumn];

		if((thingAbove >= EMPTY  &&
				thingAbove <= OFFICE)  ||
				thingAbove === GOAL )		// all except Hospital
		{
			validDirections.push(MOVEUP)
			minDistance = Math.sqrt(Math.pow(monsterRow -1 - playerRow, 2) + Math.pow(monsterColumn - playerColumn, 2));
			minDistDirection.push(MOVEUP);
		}
	}
	if(monsterRow < ROWS - 1)
	{
		var thingBelow = map[monsterRow + 1][monsterColumn];
		if(thingBelow === EMPTY)
		{
			validDirections.push(MOVEDOWN)
			possDistance = Math.sqrt(Math.pow(monsterRow +1 - playerRow, 2) + Math.pow(monsterColumn - playerColumn, 2));
			if (possDistance < minDistance) {
				minDistance = possDistance;
				minDistDirection = new Array(1);
				minDistDirection.push(MOVEDOWN);				// replace list of min-distance moves
			} else if (possDistance == minDistance) {
				minDistDirection.push(MOVEDOWN);				// add to list of min-distance moves
			}
		}
	}
	if(monsterColumn > 0)
	{
		var thingToTheLeft = map[monsterRow][monsterColumn - 1];
		if(thingToTheLeft === EMPTY)
		{
			validDirections.push(MOVELEFT)
			possDistance = Math.sqrt(Math.pow(monsterRow - playerRow, 2) + Math.pow(monsterColumn -1 - playerColumn, 2));
			if (possDistance < minDistance) {
				minDistance = possDistance;
				minDistDirection = new Array(1);
				minDistDirection.push(MOVELEFT);				// replace list of min-distance moves
			} else if (possDistance == minDistance) {
				minDistDirection.push(MOVELEFT);				// add to list of min-distance moves
			}
		}	
	}
	if(monsterColumn < COLS - 1)
	{
		var thingToTheRight = map[monsterRow][monsterColumn + 1];
		if(thingToTheRight === EMPTY)
		{
			validDirections.push(MOVERIGHT)
			possDistance = Math.sqrt(Math.pow(monsterRow - playerRow, 2) + Math.pow(monsterColumn -1 - playerColumn, 2));
			if (possDistance < minDistance) {
				minDistance = possDistance;
				minDistDirection = new Array(1);
				minDistDirection.push(MOVERIGHT);				// replace list of min-distance moves
			} else if (possDistance == minDistance) {
				minDistDirection.push(MOVERIGHT);				// add to list of min-distance moves
			}
		}
	}

	// The validDirections array now contains 0 to 4 directions that
	// contain Monster-permissible-move cells, and the separately-stored min-Distance direction(s). 
	// Which of those directions will the monster
	// choose to move in?
	//	Added: an additional possibility to move in a direction that minimizes distance to the player.
	//		   This is weighted as 1/2 the random chance of the other possibilities.
	//			Works even if 1 to 4 valid directions found.

	// If a valid direction was found, choose one of the
	// possible directions, or a minimize-distance move, and assign it to the direction variable
	if(validDirections.length !== 0)
	{
		// Add as last validDirections "toward Player" - the half-weighted duplicate direction 
		// of one random selection of the moves that minimize distance to player (usually 1 or 2 choices)
		validDirections.push(minDistDirection[Math.floor(Math.random() * (minDistDirection.length))])

		var randomNumber = Math.floor(Math.random() * (validDirections.length - 0.5)); // last is half-weighted toward-Player choice
		direction = validDirections[randomNumber];	// choose from valid moves
	}

	//Move the monster in the chosen random direction
	switch(direction)
	{
	case MOVEUP:
		//Clear the monster's current cell
		gameObj[monsterRow][monsterColumn] = 0;
		//Subtract 1 from the monster's row
		monsterRow--;

		//Apply the monster's new updated position to the array
		gameObj[monsterRow][monsterColumn] = MONSTER;
		break;

	case MOVEDOWN:
		gameObj[monsterRow][monsterColumn] = 0;
		monsterRow++;
		gameObj[monsterRow][monsterColumn] = MONSTER;
		break;

	case MOVELEFT:
		gameObj[monsterRow][monsterColumn] = 0;
		monsterColumn--;
		gameObj[monsterRow][monsterColumn] = MONSTER;
		break;

	case MOVERIGHT:
		gameObj[monsterRow][monsterColumn] = 0;
		monsterColumn++;
		gameObj[monsterRow][monsterColumn] = MONSTER;
	}
}

function endGame() {
	if(map[playerRow][playerColumn] === GOAL)
	{
		gameMessage = "You have reached the goal without being attacked by the mutant teddy bear!";
		//... Figure out the score
	}
	else if(gameObj[playerRow][playerColumn] === MONSTER)
	{
		gameMessage = "You have been destroyed by the mutant teddy bear!";
	}
	else
	{
		//		other game-end conditions?
	}

	// Remove the keyboard listener to end the game
	window.removeEventListener("keydown", keydownHandler, false);
}
