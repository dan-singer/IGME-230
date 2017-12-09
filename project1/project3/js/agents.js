/**
 * Vehicle class based on Craig Reynolds's steering algorithms
 * @author Dan Singer
 */
class Vehicle extends GameObject{
    constructor(name, app){
        super(name, app);
        this.maxSpeed = 600;
        this.attachMotor();
        this.attachCollider();
    }

    seek(target){
        let desired = Vector2.subtract(target, this.posVector); 
        desired.normalize().scale(this.maxSpeed);
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
        this.health = 3;
        this.strength = 1;
        this.motor.mass = 4; 
        //In milliseconds
        this.cooldownDuration = 1000;
        this.seeking = false;
    }

    onCollisionBegin(other){
        if (other.gameObject instanceof Player){
            other.gameObject.adjustHealth(this.strength);
            Motor.resolveElasticCollision(this.motor, other.gameObject.motor);   

            //Stop seeking for a second to give player a change to escape
            this.seeking = false;
            setTimeout(()=>this.seeking=previousSeekValue, this.cooldownDuration);
        }
    }

    decrementHealth(amount){
        this.health -= amount;
        if (this.health <= 0){
            this.destroy();
        }
    }

    update(){
        this.motor.applyDrag(gameManager.dragSettings);
        if (this.seeking){
            this.motor.applyForce(this.seek(this.player));
        }
    }
}

class SeekEnemy extends Enemy{
    constructor(name, app, player){
        super(name, app, player);
        this.seeking = true;
        this.addSprite("media/enemy.png");
    }


}