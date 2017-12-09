/**
 * Bullet class.
 * @author Dan Singer
 */
class Bullet extends GameObject{
    /**
     * Construct a new Bullet
     * @param {String} name 
     * @param {PIXI.Application} app 
     * @param {GameObject} source
     * @param {Vector2} direction 
     * @param {Number} launchForceMagnitude 
     */
    constructor(name, app, source, direction, launchForceMagnitude){
        super(name, app);
        this.attachCollider();
        this.attachMotor();
        this.position = {x: source.x, y: source.y};        
        this.forward = direction;
        this.motor.applyForce(Vector2.scale(direction, launchForceMagnitude));        

        this.strength = 1;
        this.motor.mass = 0.2;
    }

    onCollisionBegin(other){
        super.onCollisionBegin(other);
        this.destroy();
    }

    update(){

    }
}

class PlayerBullet extends Bullet{
    constructor(name, app, source, direction, launchForceMagnitude){
        super(name, app, source, direction, launchForceMagnitude);
        this.addSprite("media/bullet.png");
    }

    onCollisionBegin(other){
        //Player bullet should damage the enemy
        if (other.gameObject instanceof Enemy){
            other.gameObject.decrementHealth(this.strength);
            Motor.resolveElasticCollision(this.motor, other.gameObject.motor);
        }
        if (!(other.gameObject instanceof Player))
            super.onCollisionBegin(other);
    }
}

class EnemyBullet extends Bullet{
    constructor(name, app, source, direction, launchForceMagnitude){
        super(name, app, source, direction, launchForceMagnitude);
        this.addSprite("media/bullet.png");
    }
}