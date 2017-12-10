"use strict";

let enemy;
const gameManager = {
    app: null,
    camera: null,
    dragSettings: {
        airDensity: 0.3,
        drag: .14,
        areaDivisor: 8000
    },
    score: 0,
    /**
     * Called when window has loaded.
     */
    windowLoaded(){
        
        let gameContainer = document.querySelector("#game");
        this.app = new PIXI.Application(gameContainer.clientWidth, gameContainer.clientHeight);
        gameContainer.appendChild(this.app.view);

        this.app.view.onclick = (e) => {
            console.log("clicked canvas");
            e.preventDefault();
        }

        PIXI.loader
            .add("media/player.png")
            .add("media/player-hit.png")
            .add("media/enemy.png")
            .add("media/bullet.png")
            .add("media/pickup-health.png")
            .add("media/pickup-score.png")
            .load(()=>{
                this.assetsLoaded();
            });
    },

    assetsLoaded(){
        let resources = PIXI.loader.resources;
        
        this.app.ticker.add(()=>{CollisionManager.update()});

        let player = new Player("player", this.app);
        player.position = {x: this.app.screen.width/2, y: this.app.screen.height/2};
        enemy = new WanderFireEnemy("enemy", this.app, player, {x: this.app.screen.width, y: this.app.screen.height/2});

        let p1 = new HealthPickup("health", this.app, {x: 50, y:50});
        let mainScene = new PIXI.Container();
        mainScene.addChild(player);
        mainScene.addChild(enemy);
        mainScene.addChild(p1);
        

        this.app.stage.addChild(mainScene);
        this.camera = new FollowCam(this.app.stage, this.app, player);

    }




};

//Use arrow function to avoid wrong this being referenced in window callback
window.onload = ()=>{
    gameManager.windowLoaded();
};

