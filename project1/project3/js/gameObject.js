/**
 * Base GameObject class capable of holding multiple sprites and swapping between them.
 * @author Dan Singer
 */
class GameObject extends PIXI.Container{

    /**
     * Create a new GameObject
     * @param {String} name 
     */
    constructor(name, app){
        super();
        //Note use of arrow function so this can be used in update method
        app.ticker.add(()=>this.update());
        this.app = app;
        this.name = name;
        this.sprites = new Map();
        this.activeSprite = null;
        this.motor = null;
    }

    /**
     * Add a sprite to the GameObject's list of potential sprites. Note this will not display the Sprite.
     * @param {String} name 
     * @param {PIXI.Sprite} sprite 
     */
    addSprite(name, sprite){
        sprite.visible = false;
        this.sprites.set(name, sprite);        
        this.addChild(sprite);
    }

    /**
     * Add a sprite to the GameObject's list of potential sprites. Only valid for Non-animated sprites.
     * @param {String} path 
     */
    addSprite(path){
        let sprite = new PIXI.Sprite(PIXI.loader.resources[path].texture); 
        sprite.visible = false;
        this.sprites.set(path, sprite);
        this.addChild(sprite);
    }


    /**
     * Set the sprite named name to be active (make it visible!)
     * @param {String} name 
     */
    setActiveSprite(name){
        if (this.activeSprite)
            this.activeSprite.visible = false;
        this.activeSprite = this.sprites.get(name);
        this.activeSprite.visible = true;
    }

    /**
     * Play the specified sprite's animation. Sprite must be an AnimatedSprite for this to work.
     * @param {String} name 
     */
    playAnimation(name){
        this.sprites.get(name).play();
    }

    /**
     * Called each frame. Override this in subclasses.
     */
    update(){ }
}


/**
 * Component class responsible for applying simple physics to gameObjects
 */
class Motor{

    constructor(gameObject){
        this.gameObject = gameObject;
        this.velocity = new Vector2(0,0);
        this.acceleration = new Vector2(0,0);
        this.mass = 1;
        gameObject.app.ticker.add(()=>this.update());
    }

    get posVector(){
        return new Vector2(this.position.x, this.position.y);
    }

    applyForce(force){
        this.acceleration.add(force.scale(1/this.mass));
    }

    update(){
        let dt = 1 / this.gameObject.app.ticker.FPS;
        this.velocity.add(Vector2.scale(this.acceleration, dt));
        let tempPos = this.posVector.add(Vector2.scale(this.velocity, dt));
        this.position.x = tempPos.x; this.position.y = tempPos.y;
        this.acceleration.clear();
    }
}