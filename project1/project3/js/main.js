"use strict";


const gameManager = {
    app: null,
    camera: null,
    dragSettings: {
        airDensity: 0.3,
        drag: .14,
        areaDivisor: 8000
    },
    /**
     * Called when window has loaded.
     */
    windowLoaded(){
        
        let gameContainer = document.querySelector("#game");
        this.app = new PIXI.Application(gameContainer.clientWidth, gameContainer.clientHeight);
        gameContainer.appendChild(this.app.view);

        PIXI.loader
            .add("media/player.png")
            .add("media/player-hit.png")
            .add("media/enemy.png")
            .add("media/bullet.png")
            .load(()=>{
                this.assetsLoaded();
            });
    },

    assetsLoaded(){
        let resources = PIXI.loader.resources;
        
        this.app.ticker.add(()=>{CollisionManager.update()});

        let player = new Player("player", this.app);
        player.position = {x: this.app.screen.width/2, y: this.app.screen.height/2};

        let enemy = new SeekEnemy("enemy", this.app, player);
        enemy.position = {x: this.app.screen.width, y: this.app.screen.height/2};

        let mainScene = new PIXI.Container();
        mainScene.addChild(player);
        mainScene.addChild(enemy);
        

        this.app.stage.addChild(mainScene);
        this.camera = new FollowCam(this.app.stage, this.app, player);

    }




};

//Use arrow function to avoid wrong this being referenced in window callback
window.onload = ()=>{
    gameManager.windowLoaded();
};
