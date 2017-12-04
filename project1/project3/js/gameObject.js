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
    update(){ 
        let dt = 1 / this.app.ticker.FPS;
        this.x += 100 * dt;
        this.y += 100 * dt;
    }
}
