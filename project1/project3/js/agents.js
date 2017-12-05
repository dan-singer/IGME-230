/**
 * Vehicle class based on Craig Reynolds's steering algorithms
 * @author Dan Singer
 */
class Vehicle extends GameObject{
    constructor(name, app){
        super(name, app);
        this.maxSpeed = 500;
        this.attachMotor();
        this.attachCollider();
    }

    seek(target){
        let desired = Vector2.subtract(target, this.posVector); 
        desired.normalized.scale(this.maxSpeed);
        let steerForce = Vector2.subtract(desired, this.motor.velocity);
        return steerForce;
    }

    flee(target){
        let desired = Vector2.subtract(this.posVector, target);
        desired.normalized.scale(this.maxSpeed);
        let steerForce = Vector2.subtract(desired, this.motor.velocity);
        return steerForce;
    }
}

/**
 * Base enemy class
 * @author Dan Singer
 */
class Enemy extends Vehicle{
    constructor(name, app, player){
        super(name, app);
        this.player = player;
        this.strength = 1;
        this.motor.mass = 4;
    }

    onCollisionBegin(other){
        if (other.gameObject instanceof Player){
            other.gameObject.adjustHealth(this.strength);
            Motor.resolveElasticCollision(this.motor, other.gameObject.motor);   
        }
    }

    update(){
        this.motor.applyDrag(gameManager.dragSettings);
        this.motor.applyForce(
            this.seek(this.player.posVector)
        );
    }
}