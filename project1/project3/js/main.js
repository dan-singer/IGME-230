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
    pickupsPerCell: {min: 10, max: 20},
    scenes: {
        title: null,
        main: null,
        death: null,
        win: null
    },
    pickups: [],
    enemies: [], 
    boundaries: [], 
    bounds : null,
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
        this.bounds = new PIXI.Rectangle(-this.cellSize.x, -this.cellSize.y, this.cellSize.x * 3, this.cellSize.y * 3);

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
        //this.spawnBoundaries(mainScene);
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
        this.enemies = [
            new SeekEnemy("seek1", this.app, this.player, {x:-this.cellSize.x/2, y:-this.cellSize.y/2}),
            new SeekEnemy("seek2", this.app, this.player, {x:this.cellSize.x*1.5, y:this.cellSize.y*1.5}),
            new WanderFireEnemy("wander1", this.app, this.player, {x:-this.cellSize.x/2, y:this.cellSize.y*1.5}),
            new WanderFireEnemy("wander2", this.app, this.player, {x:this.cellSize.x*1.5, y:-this.cellSize.y/2}),
            new Boss("boss", this.app, this.player, {x:this.cellSize.x/2 + 50, y:this.cellSize.y/2})
        ];
        this.enemies.forEach((enemy) => scene.addChild(enemy));
    },

    /**
     * Spawn pickups in the scene
     * @param {PIXI.Container} scene 
     */
    spawnPickups(scene){
        //Get the rectangles where pickups will be spawed
        let rects = [
            new PIXI.Rectangle(-this.cellSize.x, 0, this.cellSize.x, this.cellSize.y),
            new PIXI.Rectangle(this.cellSize.x, 0, this.cellSize.x, this.cellSize.y),
            new PIXI.Rectangle(0, -this.cellSize.y, this.cellSize.x, this.cellSize.y),
            new PIXI.Rectangle(0, this.cellSize.y, this.cellSize.x, this.cellSize.y)
        ];
        rects.forEach( (rect) => {
            let pickupsToSpawn = Math.random() * (this.pickupsPerCell.max - this.pickupsPerCell.min) + this.pickupsPerCell.min;
            for (let i=0; i<pickupsToSpawn; i++)
            {            
                let PickupType = Math.random() < .5 ? HealthPickup : ScorePickup;
                let pickup = new PickupType("pickup", this.app); 
                let min = new Vector2(rect.x + pickup.width/2, rect.y + pickup.height/2);
                let max = new Vector2(rect.x + rect.width - pickup.width/2, rect.y + rect.height - pickup.height/2);
                pickup.x = Math.random() * (max.x - min.x) + min.x; 
                pickup.y = Math.random() * (max.y - min.y) + min.y;

                this.pickups.push(pickup);
                scene.addChild(pickup);
            }
        });
    },

    spawnBoundaries(scene){
        let bWid = 1;
        this.boundaries = [
            new Boundary("boundary-left", this.app, new PIXI.Rectangle(-this.cellSize.x-bWid, -this.cellSize.y, bWid, this.cellSize.y * 3)),
            new Boundary("boundary-right", this.app, new PIXI.Rectangle(this.cellSize.x*2, -this.cellSize.y, bWid, this.cellSize.y * 3)),
            new Boundary("boundary-top", this.app, new PIXI.Rectangle(-this.cellSize.x, -this.cellSize.y-bWid, this.cellSize.x * 3, bWid)),
            new Boundary("boundary-bottom", this.app, new PIXI.Rectangle(-this.cellSize.x, this.cellSize.y*2, this.cellSize.x * 3, bWid))
        ];
        
        this.boundaries.forEach((boundary) => scene.addChild(boundary));
    }
};

//Use arrow function to avoid wrong this being referenced in window callback
window.onload = ()=>{
    gameManager.windowLoaded();
};




class Boundary extends GameObject{
    constructor(name, app, rect){
        super(name, app);
        this.x = rect.x; this.y = rect.y;
        this.width = rect.width; this.height = rect.height;

        this.attachMotor();
        this.motor.mass = 10;
        this.attachCollider();
    }

    onCollisionBegin(other){
        Motor.resolveElasticCollision(this.motor, other.gameObject.motor);
    }

    update(){
        this.motor.stop();
    }
}