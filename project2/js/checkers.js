

//Script-scope variables
let cells = [];
let players = [];
let activePlayer = 0;
let checkerMap = new Map();

let board; 
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
    popup.style.zIndex = "1"; //So we can select it    
    document.querySelector("#popup h2").innerHTML = msg;
}

/**
 * Close the popup message
 */
function closeDialog(){
    let popup = document.querySelector("#popup");    
    popup.style.opacity = "0";
    setTimeout(() => {popup.style.zIndex = "-1";}, 100);
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


//Generates a map of checkers to a list of a possible cells they can move to
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


window.onload = (e) => {



    board = document.querySelector("#board");
    bWidth = board.offsetWidth;
    bHeight = board.offsetHeight;

    //Comment this out later!
    players.push(makePlayer("P1", 0), makePlayer("P2", 1));    
    generateBoard();
    createCheckerMap();


    let p1Input = document.querySelector("#p1-name");
    let p2Input = document.querySelector("#p2-name");

    document.querySelector("#popup button").onclick = closeDialog;

    document.querySelector("#btn-names").onclick = (e) => {
        //Validate player names
        if (p1Input.value.trim().length == 0 || p2Input.value.trim().length == 0 )
        {
            showDialog("Player names must not be blank!");
            return;
        }
        else{
            document.querySelector("#name-select").style.display = "none"; 
            generateBoard();           
        }
    };

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
                            players[nextPlayer].removeChecker(cells[i][j].checker);
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

                        //Deselect checker
                        players[activePlayer].deselectChecker();
                        //Update the map
                        createCheckerMap();


                        //If this wasn't a jump, or there are no more jumps available, go ahead and switch players. Otherwise there's another jump available.
                        if (!isJump || !players[activePlayer].jumpMap.has(selChecker.cell))
                            //Switch player
                            activePlayer = nextPlayer;
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