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
    scenes: {
        title: null,
        main: null,
        death: null,
        win: null
    },
    pickups: [],
    enemies: [], 
    boundaries: [], 
    player: null,
    score: 0,
    cellSize: null,
    /**
     * Called when window has loaded.
     */
    windowLoaded(){
        
        let gameContainer = document.querySelector("#game");
        this.app = new PIXI.Application(gameContainer.clientWidth, gameContainer.clientHeight);
        gameContainer.appendChild(this.app.view);
        this.cellSize = new Vector2(this.app.screen.width, this.app.screen.height);

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

    /**
     * Callback when assets have been loaded
     */
    assetsLoaded(){
        let resources = PIXI.loader.resources;
        this.app.ticker.add(()=>{CollisionManager.update()});
        this.scenes.main = this.generateLevel();
        this.app.stage.addChild(this.scenes.main);
    },

    /**
     * Generate the main level
     * @return {PIXI.Container} container with level
     */
    generateLevel(){
        let mainScene = new PIXI.Container();
        this.spawnPlayer(mainScene);
        this.spawnCamera();
        this.spawnEnemies(mainScene);
        this.spawnPickups(mainScene);
        return mainScene;
    },

    /**
     * Spawn player in the scene
     * @param {PIXI.Container} scene 
     */
    spawnPlayer(scene){
        this.player = new Player("player", this.app, {x: this.app.screen.width/2, y:this.app.screen.height/2});
        scene.addChild(this.player);
    },

    spawnCamera(){
        this.camera = new FollowCam(this.app.stage, this.app, this.player); 
    },

    /**
     * Spawn enemies in the scene
     * @param {PIXI.Container} scene 
     */
    spawnEnemies(scene){
        this.enemies = [new SeekEnemy("seek1", this.app, this.player, {x:-this.cellSize.x/2, y:-this.cellSize.y/2}),
                       new SeekEnemy("seek2", this.app, this.player, {x:this.cellSize.x*1.5, y:this.cellSize.y*1.5}),
                       new WanderFireEnemy("wander1", this.app, this.player, {x:-this.cellSize.x/2, y:this.cellSize.y*1.5}),
                       new WanderFireEnemy("wander2", this.app, this.player, {x:this.cellSize.x*1.5, y:-this.cellSize.y/2}),
                       new Boss("boss", this.app, this.player, {x:this.cellSize.x/2 + 50, y:this.cellSize.y/2})]
        this.enemies.forEach((enemy) => scene.addChild(enemy));
        //debugger;
    },

    /**
     * Spawn pickups in the scene
     * @param {PIXI.Container} scene 
     */
    spawnPickups(scene){

    }
};

//Use arrow function to avoid wrong this being referenced in window callback
window.onload = ()=>{
    gameManager.windowLoaded();
};

