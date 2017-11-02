
/**
 * Create a new player
 * @param {*String} name - name of player
 * @param {*Number} index - player index starting from zero
 */
function makePlayer(name, index){
    let player = {
        name: name,        
        index: index,
        checkers: new Set(),         
        jumpMap: new Map(),
        selectedChecker: null,
        justJumped: false,
        multiJumping: false,
        //Get available moves as an array of numbers
        getAvailableMoves: function(checker){
            return [];
        },
        //Select the specified checker
        selectChecker: function(checker){
            if (this.selectedChecker != null)
                this.deselectChecker(this.selectedChecker);

            this.selectedChecker = checker;
            //TODO make this prettier
            this.selectedChecker.style.border = "1px solid white";

        },
        //Deselects the current checker
        deselectChecker: function(){
            //TODO make this prettier
            this.selectedChecker.style.border = "none";          
            this.selectedChecker = null;  
        },
        //Move the specified checker to targetCell
        moveSelectedChecker: function(targetCell){
            this.selectedChecker.style.top =  parseInt(targetCell.style.top)  + targetCell.offsetWidth/2  - this.selectedChecker.offsetWidth/2 ;
            this.selectedChecker.style.left = parseInt(targetCell.style.left) + targetCell.offsetHeight/2 - this.selectedChecker.offsetHeight/2; 
        },
        removeChecker: function(checker){
            this.checkers.delete(checker);
            checker.remove();
        },
        //Determine if this player won
        hasWon: function(){

        }
    }
    Object.seal(player);
    return player;
}

