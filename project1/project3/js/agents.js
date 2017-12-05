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
        this.mass = 5;
    }

    onCollisionBegin(other){
        if (other.gameObject instanceof Player){
            other.gameObject.adjustHealth(this.strength);
            
            //Conservation of momentum
            //https://en.wikipedia.org/wiki/Elastic_collision#One-dimensional_Newtonian
            let dM = this.mass - other.gameObject.mass;
            let myFinalVel = Vector2.scale(this.motor.velocity, dm).add(Vector2.scale(other.gameObject.motor.velocity, other.gameObject.mass));
            

            //other.gameObject.motor.applyForce()
        }
    }

    update(){
        this.motor.applyForce(
            this.seek(this.player.posVector)
        );
    }
}