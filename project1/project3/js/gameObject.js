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
        
        //Components
        this.motor = null;
        this.collider = null;
    }

    get posVector(){
        return new Vector2(this.position.x, this.position.y);
    }
    get radius(){
        if (!this.activeSprite)
            return 0;
        else
            return Math.max(this.width, this.height) / 2;
    }

    get forward(){
        //PIXI considers rotations clockwise, so we need to adjust for this.
        let temp = new Vector2(1,0).rotate(-this.rotation);
        //Also, reflect y axis so up is down and down is up.
        temp.y *= -1;
        return temp;
    }

    /**
     * Add a sprite to the GameObject's list of potential sprites. Note this will not display the Sprite if there is already an active one.
     * @param {String} name name of the sprite, or path to sprite if second argument not supplied
     * @param {PIXI.Sprite} sprite 
     */
    addSprite(name, sprite=null){

        if (sprite == null)
            sprite = new PIXI.Sprite(PIXI.loader.resources[name].texture); 
        sprite.anchor.set(0.5,0.5);
        if (!this.activeSprite){
            sprite.visible = true;
            this.activeSprite = sprite;
        }
        else{
            sprite.visible = false;            
        }
        this.sprites.set(name, sprite);        
        this.addChild(sprite);
    }

    /**
     * Attach a motor component to this GameObject so physics behaviors can be applied. 
     */
    attachMotor(){
        this.motor = new Motor(this);
    }

    attachCollider(){
        this.collider = new CircleCollider(this);
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

    /*Abstract Collision methods. You must attach a collider for these to be called*/
    onCollisionBegin(other){ }
    onCollision(other){ }
    onCollisionEnd(other){ }

    /**
     * Called each frame. Override this in subclasses.
     */
    update(){}
}


/**
 * Component class responsible for applying simple physics to gameObjects
 * @author Dan Singer
 */
class Motor{

    /**
     * Construct a new motor for the GameObject
     * @param {GameObject} gameObject 
     */
    constructor(gameObject){
        this.gameObject = gameObject;
        //Note this is not the same as the gameObject's position!
        this.position = new Vector2(0,0);
        this.velocity = new Vector2(0,0);
        this.acceleration = new Vector2(0,0);
        this.mass = 1;
        this.gameObject.app.ticker.add(()=>this.update());
    }

    /**
     * Apply a force this frame to the GameObject
     * @param {Vector2} force 
     */
    applyForce(force){
        this.acceleration.add(force.scale(1/this.mass));
    }

    /**
     * Resolve a collision between two motors using the conservation of momentum
     * @see https://en.wikipedia.org/wiki/Elastic_collision#One-dimensional_Newtonian
     * @param {Motor} motorA 
     * @param {Motor} motorB 
     */
    static resolveElasticCollision(motorA, motorB){

        let u1 = motorA.velocity;
        let u2 = motorB.velocity;
        let m1 = motorA.mass;
        let m2 = motorB.mass;

        let v1 = Vector2.scale(u1, m1-m2)
                .add(Vector2.scale(u2, 2*m2))
                .scale(1/(m1+m2));
        motorA.velocity = v1;

        let v2 = Vector2.scale(u2, m2-m1)
                        .add(Vector2.scale(u1, 2*m1))
                        .scale(1/(m1+m2));
        motorB.velocity = v2;
    }

    applyDrag(settings){
        let airDensity = settings.airDensity; //0.3;
        let drag = settings.drag; //0.14;
        let areaDivisor = settings.areaDivisor; // 8000
        let area = this.gameObject.width * this.gameObject.height / 8000;
        let airResistanceMag = airDensity * drag * area * this.velocity.sqrMagnitude / 2;
        this.applyForce(this.velocity.normalized.scale(-airResistanceMag));
    }
    

    syncPosition(){
        this.position.x = this.gameObject.position.x; 
        this.position.y = this.gameObject.position.y;        
    }

    /**
     * Called each frame to update velocity and position, and reset acceleration after each frame
     */
    update(){
        this.syncPosition();
        let dt = 1 / this.gameObject.app.ticker.FPS;
        this.velocity.add(Vector2.scale(this.acceleration, dt));
        this.position.add(Vector2.scale(this.velocity, dt));
        this.gameObject.position.x = this.position.x; this.gameObject.position.y = this.position.y;
        this.acceleration.clear();
    }
}