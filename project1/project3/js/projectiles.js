/**
 * Bullet class.
 * @author Dan Singer
 */
class Bullet extends GameObject{
    /**
     * Construct a new Bullet
     * @param {String} name 
     * @param {PIXI.Application} app 
     * @param {Vector2} direction 
     * @param {Number} launchForceMagnitude 
     */
    constructor(name, app, source, direction, launchForceMagnitude){
        super(name, app);
        this.attachCollider();
        this.attachMotor();
        this.forward = direction;
        this.position = {x: source.x, y: source.y};
        this.motor.applyForce(Vector2.scale(direction, launchForceMagnitude));
    }

    update(){

    }
}