// Some useful navigation code taken from spaceArcade JavaScript code
// The rest is a modification of routines provided in "Foundation Game Design" by Rex van der Spuy

// All new (additional) code written by Doug Cottrill, PROG 209, 03-20-18

// Change in movement:
//		Player can move to:
    //  cells containing EMPTY (asphalt parking lot), or GOAL,
    //  or entering House, Hotel, Office from the south (row below the object),
//	Monster can move to all cells except the Hospital, by same rules as Player


// Arrow key codes
var UP = 38,
    DOWN = 40,
    RIGHT = 39,
    LEFT = 37;

var grid   = document.querySelector("#grid");
var output = document.querySelector("#output");
var gameMessage = "";
var SIZE = 64;

//	An 8x8 2D map/array of non-moving objects
var map = [
		[0, 0, 0, 1, 0, 0, 0, 0],
		[0, 4, 0, 0, 2, 0, 0, 0],
		[0, 0, 0, 0, 0, 0, 0, 0],
		[1, 0, 0, 3, 0, 0, 0, 0],
		[0, 0, 0, 0, 0, 0, 1, 0],
		[0, 0, 2, 0, 0, 0, 0, 0],
		[0, 3, 0, 0, 0, 1, 0, 0],
		[0, 0, 0, 0, 0, 0, 0, 5]
		]		
// key:
var EMPTY = 0; 	// Asphalt parking lot
var HOUSE = 1;
var HOTEL = 2;
var OFFICE = 3;
var HOSPITAL = 4;
var GOAL	= 5;
var PLAYER	= 6;
var MONSTER = 7;
//		(start is at 0,0)

//	An 8x8 2D map/array of objects that move
var gameObj = [
		[6, 0, 0, 0, 0, 0, 0, 0],		// Start Player in top-left, diagonal to goal;  Monster in [6,6] near goal
		[0, 0, 0, 0, 0, 0, 0, 0],
		[0, 0, 0, 0, 0, 0, 0, 0],
		[0, 0, 0, 0, 0, 0, 0, 0],
		[0, 0, 0, 0, 0, 0, 0, 0],
		[0, 0, 0, 0, 0, 0, 0, 0],
		[0, 0, 0, 0, 0, 0, 7, 0],
		[0, 0, 0, 0, 0, 0, 0, 0]
		]		
// key:

var ROWS = map.length;
var COLS = map[0].length;

// Initialize objects on the screen
render ( );

startBtn.addEventListener("click",startGameHandler,false);
window.addEventListener("keydown",keydownHandler,false);

function startGameHandler( ) {
	// Hide the intro screen, show the game screen
	introScreen.style.display = "none";
	gameScreen.style.display = "block";
}

function keydownHandler(event) {
	// handle user keyboard input

	if (event.keyCode == UP) {
//		rocket.y -= velocity;
	}
	if (event.keyCode == LEFT) {
//		rocket.x -= velocity;
	}
	if (event.keyCode === DOWN) {
//		rocket.y += velocity;
	}
	if (event.keyCode == RIGHT) {
//		rocket.x += velocity;
	}

	moveMonster();		//	Move monster after player chooses move

//Find out if the ship is touching the monster
if(gameObj[playerRow][playerColumn] === MONSTER)
{
  endGame();
}
	render( );

}

function endGame() {
	if(map[playerRow][playerColumn] === GOAL)
	{
    	gameMessage = "You have reached the goal without being attacked by the mutant teddy bear!";
   		//... Figure out the score
	}
  	else if(gameObjects[playerRow][playerColumn] === MONSTER)
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

function render()
{
  // Clear the grid of img tag cells previously created

  if(grid.hasChildNodes())		// remove 64 entries (8x8 grid)
  {
    for(var i = 1; i <= ROWS * COLS; i++)	// mod from book example
    {
      grid.removeChild(grid.firstChild);
    }
  }
	var playerRow;
	var playerColumn;
	var monsterRow;
	var monsterColumn;
	
	for(var row = 0; row < ROWS; row++) {
	  for(var column = 0; column < COLUMNS; column++) {
	    if(gameObj[row][column] === PLAYER)
	    {
	      playerRow = row;
	      playerColumn = column;
	    }
	    if(gameObj[row][column] === MONSTER) {
	      monsterRow = row;
	      monsterColumn = column;
	    }
	  }
	}

  // Render the game by looping through the map arrays (0-based)
  // Most code from book example
  for(var row = 0; row < ROWS; row++)
  {
    for(var column = 0; column < COLS; column++)
    {
      //Create an img tag called cell
      var cell = document.createElement("img");

      //Set its CSS class to "cell"
      cell.setAttribute("class", "cell");

      //Add the img tag to the <div id="grid"> tag
      grid.appendChild(cell);

      //Find the correct image for this map cell
      switch(map[row][column])
      {
        case EMPTY:
          cell.src = "../images/empty.png";
          break;

        case HOUSE:
          cell.src = "../images/House-icon_BW_ArtDesigner.lv.png";
          break;

        case HOTEL:
          cell.src = "../images/Hotel-icon_BW_ArtDesigner.lv.png";
          break;

        case OFFICE:
          cell.src = "../images/office-building-icon_LokasSoftware.png";
          break;

        case HOSPITAL:
          cell.src = "../images/Hospital-icon.png";
          break;

        case GOAL:
          cell.src = "../images/Flag3RightBlue-2-icon.png";
          break;
      }
      
      //		After drawing non-moving map, overlay the Player and Monster icons from gameObj array
      switch(gameObj[row][column])
      {
        case PLAYER:
        cell.src = "../images/orange-person-icon.png";
        break;

        case MONSTER:
        cell.src = "../images/teddy-monster-viewer-icon.png";
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
	var UP = 1;
	var DOWN = 2;
	var LEFT = 3;
	var RIGHT = 4;
	// (not stored in same way)	var TOPLAYER = 5;		// the valid direction that will minimize the distance to player
	//						 							(distance = Math.sqrt((x_2 - x_1)^2 + (y_2 - y_1)^2) 

    //An array to store the valid direction that the monster is allowed to move in
    var validDirections = [];
    var minDistance = 0.0;
    var minDistDirection = [];

    //The final direction that the monster will move in
    var direction = undefined;

	//	Monster can move to all cells except the Hospital, by same rules as Player:
    //  If the cells contain EMPTY,
    //  or if entering House, Hotel, Office from the south (row below the object),
    // push the corresponding direction (UP, DOWN, LEFT, or RIGHT) into the validDirections array
    if(monsterRow > 0)
    {
     var thingAbove = map[monsterRow - 1][monsterColumn];

      if(thingAbove >= EMPTY  &&
      	thingAbove <= OFFICE)		// all except Hospital and Goal
      )
      {
        validDirections.push(UP)
		minDistance = Math.sqrt(Math.power(monsterRow -1 - playerRow, 2) + Math.power(monsterColumn - playerColumn, 2));
    	minDistDirection.push(UP);
      }
    }
    if(monsterRow < ROWS - 1)
    {
      var thingBelow = map[monsterRow + 1][monsterColumn];
      if(thingBelow === EMPTY)
      {
        validDirections.push(DOWN)
		possDistance = Math.sqrt(Math.power(monsterRow +1 - playerRow, 2) + Math.power(monsterColumn - playerColumn, 2));
		if (possDistance < minDistance) {
			minDistance = possDistance;
	    	minDistDirection.clear();
        	minDistDirection.push(DOWN);				// replace list of min-distance moves
        } else if (possDistance == minDistance) {
        	minDistDirection.push(DOWN);				// add to list of min-distance moves
        }
      }
    }
    if(monsterColumn > 0)
    {
      var thingToTheLeft = map[monsterRow][monsterColumn - 1];
      if(thingToTheLeft === EMPTY)
      {
        validDirections.push(LEFT)
		possDistance = Math.sqrt(Math.power(monsterRow - playerRow, 2) + Math.power(monsterColumn -1 - playerColumn, 2));
		if (possDistance < minDistance) {
			minDistance = possDistance;
	    	minDistDirection.clear();
        	minDistDirection.push(LEFT);				// replace list of min-distance moves
        } else if (possDistance == minDistance) {
        	minDistDirection.push(LEFT);				// add to list of min-distance moves
        }
      }
    }
    if(monsterColumn < COLUMNS - 1)
    {
      var thingToTheRight = map[monsterRow][monsterColumn + 1];
      if(thingToTheRight === EMPTY)
      {
        validDirections.push(RIGHT)
		possDistance = Math.sqrt(Math.power(monsterRow - playerRow, 2) + Math.power(monsterColumn -1 - playerColumn, 2));
		if (possDistance < minDistance) {
			minDistance = possDistance;
	    	minDistDirection.clear();
        	minDistDirection.push(RIGHT);				// replace list of min-distance moves
        } else if (possDistance == minDistance) {
        	minDistDirection.push(RIGHT);				// add to list of min-distance moves
        }
      }
    }

      // The validDirections array now contains 0 to 4 directions that
      // contain Monster-permissible-move cells, and the separately-stored min-Distance direction(s). 
      // Which of those directions will the monster
      // choose to move in?
      //	Added: an additional possibility to move in a direction that minimizes distance to the player.
      //		   This is weighted as 1/2 the random chance of the other possibilities.
      //			Works even if 0 to 4 valid directions found.

      // If a valid direction was found, choose one of the
      // possible directions, or a minimize-distance move, and assign it to the direction variable
      if(validDirections.length !== 0)
      {
        var randomNumber = Math.floor(Math.random() * (validDirections.length + 0.5)); // extra half-weighted choice
        if (randomNumber <= validDirections.length) {
        	direction = validDirections[randomNumber];	// equal-weighted valid moves
        }
        else {		//	The half-weighted chance of random selection of moving to minimize distance to player (usually 1 or 2 choices)
        	direction = minDistDirection[Math.floor(Math.random() * (minDistDirection.length))];
        }
      }

      //Move the monster in the chosen random direction
      switch(direction)
      {
        case UP:
          //Clear the monster's current cell
          gameObj[monsterRow][monsterColumn] = 0;
          //Subtract 1 from the monster's row
          monsterRow--;

          //Apply the monster's new updated position to the array
          gameObj[monsterRow][monsterColumn] = MONSTER;
          break;

	    case DOWN:
	      gameObj[monsterRow][monsterColumn] = 0;
	      monsterRow++;
	      gameObj[monsterRow][monsterColumn] = MONSTER;
	      break;
	
	    case LEFT:
	      gameObj[monsterRow][monsterColumn] = 0;
	      monsterColumn--;
	      gameObj[monsterRow][monsterColumn] = MONSTER;
	      break;
	
	    case RIGHT:
	      gameObj[monsterRow][monsterColumn] = 0;
	      monsterColumn++;
	      gameObj[monsterRow][monsterColumn] = MONSTER;
	  }
}