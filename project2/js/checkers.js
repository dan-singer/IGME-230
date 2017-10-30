

//Script-scope variables
let cells = [];
let players = [];
let activePlayer = 0;

let board; 
let bWidth;
let bHeight;

const ROW_SIZE = 8;
const COL_SIZE = 8;

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
    popup.style.zIndex = "-1"; //So we don't select this
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

    let curPlayerIndex = 0;

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
    

    for (let i=0; i<ROW_SIZE; i++)
    {

        if (i == midPt + 1)
            curPlayerIndex++;

        for (let j=0; j<COL_SIZE; j++)
        {
            //Create a cell
            let newCell = baseCell.cloneNode();
            newCell.style.backgroundColor = curColor;
            newCell.style.top = `${tileHeight*i}px`;
            newCell.style.left = `${tileWidth*j}px`;
            board.appendChild(newCell);
                
            //Create a checker when necessary
            if (createChecker && inCheckerRow(i)){
                let newChecker = baseChecker.cloneNode();
                //Use player index to get the svg file. For ex, could be "p1-checker.svg"
                newChecker.src = `media/p${curPlayerIndex+1}-checker.svg`;

                newChecker.style.top = parseInt(newCell.style.top) + checkerOffsetY;
                newChecker.style.left = parseInt(newCell.style.left) + checkerOffsetX;
                board.appendChild(newChecker);
                players[curPlayerIndex].checkers.add(newChecker);
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



window.onload = (e) => {



    board = document.querySelector("#board");
    bWidth = board.offsetWidth;
    bHeight = board.offsetHeight;

    //Comment this out later!
    players.push(makePlayer("P1", 0), makePlayer("P2", 1));    
    generateBoard();



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

        if (e.target.className == "checker"){
            //Does this checker belong to the active player?
            if (players[activePlayer].checkers.has(e.target))
            {
                //select it
                players[activePlayer].selectChecker(e.target);
            }
        }
        if (e.target.className == "cell"){
            //Has the active player selected a cell?
            if (players[activePlayer].selectedChecker != null){
                //move the checker there
                players[activePlayer].moveSelectedChecker(e.target);
                players[activePlayer].deselectChecker();

            }
        }

    };


};