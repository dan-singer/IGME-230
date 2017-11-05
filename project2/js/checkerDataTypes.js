
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
        //Select the specified checker
        selectChecker: function(checker){
            if (this.selectedChecker != null)
                this.deselectChecker(this.selectedChecker);

            this.selectedChecker = checker;
            //TODO make this prettier
            this.selectedChecker.style.border = "1px solid white";

            //Increase z-index so it's visible if we jump
            this.selectedChecker.style.zIndex = "2";

        },
        //Deselects the current checker
        deselectChecker: function(visualDelay=0){

            setTimeout((previouslySelectedChecker) => {
                //TODO make this prettier
                previouslySelectedChecker.style.border = "none";          
                //Reset z-index back to normal
                previouslySelectedChecker.style.zIndex = "1";
            }, visualDelay, this.selectedChecker);


            this.selectedChecker = null;  
            

        },
        //Move the specified checker to targetCell
        moveSelectedChecker: function(targetCell){
            this.selectedChecker.style.top =  parseInt(targetCell.style.top)  + targetCell.offsetWidth/2  - this.selectedChecker.offsetWidth/2 ;
            this.selectedChecker.style.left = parseInt(targetCell.style.left) + targetCell.offsetHeight/2 - this.selectedChecker.offsetHeight/2; 
        },
        removeChecker: function(checker, visualDelay=0){
            //Remove from set
            this.checkers.delete(checker); 
            //Remove from dom after visualDelay - this way we can immediately update map, but wait for a jump to occur to visually see something
            setTimeout(()=>{checker.remove();}, visualDelay); 
        }
    }
    Object.seal(player);
    return player;
}

