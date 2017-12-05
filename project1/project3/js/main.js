"use strict";


const gameManager = {
    app: null,

    /**
     * Called when window has loaded.
     */
    windowLoaded(){
        
        let gameContainer = document.querySelector("#game");
        this.app = new PIXI.Application(gameContainer.clientWidth, gameContainer.clientHeight);
        gameContainer.appendChild(this.app.view);

        PIXI.loader
            .add("media/player.png")
            .load(()=>{
                this.assetsLoaded();
            });
    },

    assetsLoaded(){
        let resources = PIXI.loader.resources;
        let go = new GameObject("player", this.app);
        go.addSprite("media/player.png");
        this.app.stage.addChild(go);


        let mainScene = new PIXI.Container();
        

    }




};

//Use arrow function to avoid wrong this being referenced in window callback
window.onload = ()=>{
    gameManager.windowLoaded();
};
