

//Script-scope variables
let cells = [];
let players = [];
let activePlayer = 0;
let checkerMap = new Map();

let board; 
let boardWrapper;
let bWidth;
let bHeight;


const ROW_SIZE = 8;
const COL_SIZE = 8;
const NUM_PLAYERS = 2;

const PRIMARY_COLOR = "black";
const SECONDARY_COLOR = "red";

//Note that files must be named p*-checker[-king]
    // * refers to player index + 1
    // -king is optional

//Script-scope functions


/**
 * Show a popup message
 * @param {*String} msg 
 */
function showDialog(msg){
    let popup = document.querySelector("#popup");
    popup.style.opacity = "1";
    popup.style.zIndex = "3"; //So we can select it    
    popup.children[0].innerHTML = msg;
}

/**
 * Close the popup message
 */
function closeDialog(popupId="popup"){
    let query = `#${popupId}`;
    let popup = document.querySelector(query);    
    popup.style.opacity = "0";
    setTimeout(() => {popup.style.zIndex = "-1";}, 100);
}


function showWinDialog(index){
    let playerName = players[index].name;
    let popup = document.querySelector("#popup-win");
    popup.style.opacity = "1";
    popup.style.zIndex = "3";
    popup.children[0].innerHTML = `${playerName} Won!`;
}

/**
 * Create the board with the cells and checkers
 */
function generateBoard(){
    let curColor = SECONDARY_COLOR; //Start with this because we start from top
    let tileWidth = bWidth / COL_SIZE;
    let tileHeight = bHeight / ROW_SIZE;

    //This will be toggled through the loop
    //Start with false because we begin at the top
    let createChecker = false;

    let curPlayerIndex = 1;

    //Midpoint is (max index - min index) / 2
    //We floor it to convert to an int 
    let midPt = Math.floor((ROW_SIZE-1)/2);


    let baseCell = document.createElement("div");
    baseCell.className = "cell";
    baseCell.style.width = tileWidth;
    baseCell.style.height = tileHeight;

    let baseChecker = document.createElement("img");
    baseChecker.className = "checker";
    let checkerWidth = tileWidth * .75
    let checkerHeight = tileHeight * .75;
    baseChecker.style.width = checkerWidth;
    baseChecker.style.height = checkerHeight;

    let checkerOffsetX = (tileWidth / 2) - (checkerWidth/2);
    let checkerOffsetY = (tileHeight / 2) - (checkerHeight/2);

    //Quick arrow function to determine if this is a checker row
    let inCheckerRow = (i) => i < midPt || i > midPt + 1;

    //Create a cell function    
    let makeCell = (i, j) => {
        let newCell = baseCell.cloneNode();
        newCell.style.backgroundColor = curColor;
        newCell.style.top = `${tileHeight*i}px`;
        newCell.style.left = `${tileWidth*j}px`;
        return newCell;
    }
    //Create a checker function
    let makeChecker = (i, j, newCell) => {

        let newChecker = baseChecker.cloneNode();
        //Use player index to get the svg file. For ex, could be "p1-checker.svg"
        newChecker.src = `media/p${curPlayerIndex+1}-checker.svg`;
        newChecker.style.top = parseInt(newCell.style.top) + checkerOffsetY;
        newChecker.style.left = parseInt(newCell.style.left) + checkerOffsetX;
        //Custom properties for the dom
        newChecker.cell = newCell;
        newCell.checker = newChecker;
        newChecker.isKing = false;
        return newChecker;
    }

    for (let i=0; i<ROW_SIZE; i++)
    {
        cells.push([]);
        if (i == midPt + 1)
            curPlayerIndex--;

        for (let j=0; j<COL_SIZE; j++)
        {
            let newCell = makeCell(i, j);
            board.appendChild(newCell);
            cells[i].push(newCell);
            //Create a checker when necessary
            if (createChecker && inCheckerRow(i)){
                let newChecker = makeChecker(i,j,newCell);
                board.appendChild(newChecker);
                players[curPlayerIndex].checkers.add(newChecker);

            }
            else{
                newCell.checker = null;
            }
            //This is to get the alternating colors in each row
            if (j == COL_SIZE - 1)
                continue;
            if (curColor == PRIMARY_COLOR)
                curColor = SECONDARY_COLOR;
            else
                curColor = PRIMARY_COLOR;
            if (inCheckerRow(i))
                createChecker = !createChecker;
        }
    }
}


/**
 * Generates a map of cells containing checkers to a list of a possible cells those checkers can move to
 */
function createCheckerMap(){

    //TODO possibly optimize this so we don't have to recreate this map entirely each turn
    checkerMap.clear();

    let yDir = -1;
    for (let player of players){
        player.jumpMap.clear();
        for (let checker of player.checkers){
            //1. Convert the checker into an i, j index pair to use for the cells grid
            let i = Math.floor(parseInt(checker.style.top) / checker.cell.offsetHeight);
            let j = Math.floor(parseInt(checker.style.left) / checker.cell.offsetWidth);
            //Process the target cells
            processCell(checker.cell, player, i, j, yDir, -1);
            processCell(checker.cell, player, i, j, yDir,  1);            
            //2. If it's a king, also process bottom
            if (checker.isKing)
            {
                processCell(checker.cell, player, i, j, -yDir, -1);
                processCell(checker.cell, player, i, j, -yDir,  1);
                
            }
        }
        yDir = -yDir;
    }

    //Process the cell and add it to the checkersMap if it's a valid spot
    function processCell(origCell,player, i, j, iOff, jOff){
        if (cells[i+iOff] == null || cells[i+iOff][j+jOff] == null)
            return;

        let cell = cells[i+iOff][j+jOff];
        //If empty, add to map        
        if (cell.checker == null){

            if (checkerMap.has(origCell)){
                checkerMap.get(origCell).push(cell);
            }
            else{
                checkerMap.set(origCell, [cell]);
            }
        }
        else{

            //Make sure we're not trying to jump over ourself!
            if (player.checkers.has(cell.checker)){
                return;
            }

            //In the proposed cell location, check if a spot is free and exists in the current i and j offset from that proposed cell location
            let jumpI = i + 2 * iOff;
            let jumpJ = j + 2 * jOff;
            if (cells[jumpI] == null || cells[jumpI][jumpJ] == null)
                return;
            //if the spot is free, add it to the map AND add it to the player's jumpMap
            let jumpCell = cells[jumpI][jumpJ];
            if (jumpCell.checker == null)
            {
                if (checkerMap.has(origCell))
                    checkerMap.get(origCell).push(jumpCell);
                else
                    checkerMap.set(origCell, [jumpCell]);
                
                if (player.jumpMap.has(origCell))
                    player.jumpMap.get(origCell).push(jumpCell);
                else
                    player.jumpMap.set(origCell, [jumpCell]);
            }
        }
    }
}


/**
 * Set the current player, and check if they lost the game
 * @param {*Number} index 
 */
function setPlayer(index){
    let prevPlayer = activePlayer;
    activePlayer = index;
    let playerDivs = document.querySelectorAll(".player");
    playerDivs[prevPlayer].children[0].style.color = "#353535";
    playerDivs[activePlayer].children[0].style.color = "white";
    //Also check if this player lost
    if (hasPlayerLost(activePlayer)){
        showWinDialog(prevPlayer); //The previous player must have won if the activePlayer lost
    }
}


/**
 * Determine if the player lost. Return true if so, false if not.
 * @param {*Number} index 
 */
function hasPlayerLost(index){

    let lost = true;
    let p = players[activePlayer];
    for (let checker of p.checkers)
    {
        if (checkerMap.has(checker.cell))
        {
            lost = false;
            break;
        }
    }

    return lost;


}


/**
 * Reset the state of the app back to when it was first loaded
 */
function reset(){
    cells = [];
    players = [];
    activePlayer = 0;
    checkerMap = new Map();
    board.innerHTML = "";    
    boardWrapper.style.display = "none";
    document.querySelector("#name-select").style.display = "flex"; 
    document.querySelectorAll("input[type='text']").forEach( (e) => {e.value = "";});
}

/**
 * Setup the game of checkers. Assume that the players array, board reference, and boardWrapper reference are already setup.
 */
function initGameWithPlayers(){

    //Reset player checkers
    for (let player of players){
        player.checkers.clear();
    }
    //Remove the board's children, if any
    board.innerHTML = "";
    //Clear cells
    cells = [];

    
    //Set player names in the dom
    for (let i=0; i<players.length; i++)
        document.querySelectorAll(".player")[i].children[0].textContent = players[i].name;

    //Display board elements
    boardWrapper.style.display = "flex";
    bWidth = board.offsetWidth;
    bHeight = board.offsetHeight;
    //Create the board
    generateBoard();  
    //Generate correct paths      
    createCheckerMap();   
    //Make first player go first
    activePlayer = 1; //So we know the previous player
    setPlayer(0);
}   

/**
 * Setup event handlers for elements on the page, and setup some variables
 */
window.onload = (e) => {
    boardWrapper = document.querySelector("#board-wrapper");
    board = document.querySelector("#board");


    let p1Input = document.querySelector("#p1-name");
    let p2Input = document.querySelector("#p2-name");

    //Close dialog button logic
    document.querySelector("#popup button").onclick = (e) => closeDialog(); //We have to be clear, otherwise it will pass in e as an argument to closeDialog

    //Setup win button event handlers
    document.querySelector("#rematch").onclick = (e) => {
        //Re-initialize the game with same players
        initGameWithPlayers();
        closeDialog("popup-win");
    };
    document.querySelector("#start-over").onclick = (e) => {
        reset();
        closeDialog("popup-win");        
    }

    //Begin the game once player's names are entered
    document.querySelector("#btn-names").onclick = (e) => {
        //Validate player names
        if (p1Input.value.trim().length == 0 || p2Input.value.trim().length == 0 )
        {
            showDialog("Player names must not be blank!");
            return;
        }
        else
        {
            document.querySelector("#name-select").style.display = "none"; 
            players.push(
                makePlayer(p1Input.value.trim(), 0),
                makePlayer(p2Input.value.trim(), 1)
            );
            initGameWithPlayers();
        }
    };

    //Check what was clicked on the board
    document.querySelector("#board").onclick = (e) => {

        //Select a checker to move
        if (e.target.className == "checker"){
            //Does this checker belong to the active player?
            if (players[activePlayer].checkers.has(e.target))
            {
                //select it
                players[activePlayer].selectChecker(e.target);
            }
        }
        //Click on a cell
        if (e.target.className == "cell"){
            //Has the active player selected a checker?
            let selChecker = players[activePlayer].selectedChecker;
            if (selChecker != null){
                //Is this move in the checkersMap? 
                if (checkerMap.has(selChecker.cell) && checkerMap.get(selChecker.cell).includes(e.target))
                {
                    //Does the player have any jumps? If so, is this pairing in the players jumpMap?
                    let jumpMap = players[activePlayer].jumpMap;
                    let isJump = (jumpMap.has(selChecker.cell) && jumpMap.get(selChecker.cell).includes(e.target));
                    if (jumpMap.size == 0 || isJump)
                    {
                        //Determine the next player
                        let nextPlayer = activePlayer+1;
                        if (nextPlayer > NUM_PLAYERS - 1)
                            nextPlayer = 0;


                        //move the checker there
                        players[activePlayer].moveSelectedChecker(e.target);

                        if (isJump){
                            //Figure out what we jumped over

                            //1.Get the two cells in question
                            let cellA = selChecker.cell;
                            let cellB = e.target;
                            //2.Determine their midpoint
                            let midX = (parseInt(cellA.style.left) + cellA.offsetWidth/2 + 
                                        parseInt(cellB.style.left) + cellB.offsetWidth/2) / 2;
                            let midY = (parseInt(cellA.style.top) + cellA.offsetHeight/2 + 
                                        parseInt(cellB.style.top) + cellB.offsetHeight/2) / 2;
                            //3.Convert that to cell index
                            let i = Math.floor(midY / e.target.offsetHeight);
                            let j = Math.floor(midX / e.target.offsetWidth);
                            //4.Remove that cell's checker from the player
                            players[nextPlayer].removeChecker(cells[i][j].checker, 500);
                            //5.Update that cell's connections
                            cells[i][j].checker = null;
                        }

                        //Update connections
                        e.target.checker = selChecker;
                        selChecker.cell.checker = null;
                        selChecker.cell = e.target;

                        //See if this checker should now be a king
                        let row = Math.floor((parseInt(e.target.style.top) + parseInt(e.target.offsetHeight/2)) / e.target.offsetHeight);
                        if ((activePlayer == 0 && row == 0) || (activePlayer == 1 && row == ROW_SIZE-1)){
                            selChecker.isKing = true;
                            selChecker.src = `media/p${activePlayer+1}-checker-king.svg`;
                        }

                        //Deselect checker (don't update visually for a second, however, to preserve z-index and selection border)
                        players[activePlayer].deselectChecker(1000);
                        //Update the map
                        createCheckerMap();


                        //If this wasn't a jump, or there are no more jumps available, go ahead and switch players. Otherwise there's another jump available.
                        if (!isJump || !players[activePlayer].jumpMap.has(selChecker.cell))
                            //Switch player
                            setPlayer(nextPlayer);
                        else
                            showDialog("You can jump again!");
                    }
                    else{
                        showDialog("You must jump!");
                    }             
                }
                else{
                    showDialog("Invalid move!");
                }


            }
        }

    };
};