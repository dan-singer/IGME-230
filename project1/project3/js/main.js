"use strict";


const gameManager = {
    app: null,
    camera: null,
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

        let player = new Player("player", this.app);
        player.addSprite("media/player.png");
        player.position = {x: this.app.screen.width/2, y: this.app.screen.height/2};
        let mainScene = new PIXI.Container();
        mainScene.addChild(player);

        this.app.stage.addChild(player);
        //this.camera = new FollowCam(this.app.stage, this.app, player);

    }




};

//Use arrow function to avoid wrong this being referenced in window callback
window.onload = ()=>{
    gameManager.windowLoaded();
};
