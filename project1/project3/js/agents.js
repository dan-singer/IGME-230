/**
 * Vehicle class based on Craig Reynolds's steering algorithms
 * @see https://www.red3d.com/cwr/papers/1999/gdc99steer.pdf
 * @author Dan Singer
 */
class Vehicle extends GameObject{
    constructor(name, app, position=null){
        super(name, app, position);
        this.maxSpeed = 500;
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

    wander(lookAhead, radius){   
        let center = Vector2.scale(this.forward, lookAhead).add(this.posVector); 
        let angleVariation = 2 * Math.PI;
        let angle = Math.random() * angleVariation;
        let displacementVector = Vector2.rotate(this.forward, angle).scale(radius);
        let seekLoc = center.add(displacementVector);
        return this.seek(seekLoc);
    }

    constrain(rectangle){
        let w2 = this.width/2;
        let h2 = this.height/2;
        let extents = new Vector2(w2, -h2);
        let min = Vector2.subtract(this.posVector, extents);
        let max = Vector2.add(this.posVector, extents);

        let rMax = new Vector2(rectangle.x + rectangle.width, rectangle.y + rectangle.height);
        let rMin = new Vector2(rectangle.x, rectangle.y);

        let test = min.x < rMax.x && max.x > rMin.x && min.y < rMax.y && max.y > rMin.y;
        if (!test)
        {
            let center = new Vector2(rectangle.x + rectangle.width/2, rectangle.y + rectangle.height/2);
            return this.seek(center);
        }
        else{
            return new Vector2(0,0);
        }

    }
}

/**
 * Base enemy class
 * @author Dan Singer
 */
class Enemy extends Vehicle{
    constructor(name, app, player, position=null){
        super(name, app, position);
        this.player = player;
        this.health = 3;
        this.strength = 1;
        this.motor.mass = 4; 
        //In milliseconds
        this.cooldownDuration = 1000;
        this.stunned = false;


        this.constrainRect = new PIXI.Rectangle(this.position.x - this.app.screen.width/2, this.position.y - this.app.screen.height/2, this.app.screen.width, this.app.screen.height);
        //debugger;
        this.fireInfo = {
            canFire: false,
            msBetweenShots: 1000,
            lastFireTime: 0
        };
    }

    onCollisionBegin(other){
        if (other.gameObject instanceof Player){
            other.gameObject.adjustHealth(this.strength);
            Motor.resolveElasticCollision(this.motor, other.gameObject.motor);   

            //Stop seeking for a second to give player a change to escape
            this.stunned = true;
            setTimeout(()=>this.stunned=false, this.cooldownDuration);

        }
    }

    decrementHealth(amount){
        this.health -= amount;
        if (this.health <= 0){
            this.destroy();
        }
    }

    fire(direction){
        if (new Date().getTime() - this.fireInfo.lastFireTime  > this.fireInfo.msBetweenShots)
        {
            let bullet = new EnemyBullet("eb", this.app, this, direction);
            this.parent.addChild(bullet);
            this.fireInfo.lastFireTime = new Date().getTime();
        }
    }

    update(){
        this.motor.applyDrag(gameManager.dragSettings);
        //Face in direction of velocity 
        //TODO make this smoother with collisions
        this.forward = this.motor.velocity.normalized;

        //If I'm not in the camera's view, set stunned to true
        this.canUpdate = gameManager.camera.rect.contains(this.position.x, this.position.y);
        if (!this.canUpdate)
            this.motor.stop();


    }
}

class SeekEnemy extends Enemy{
    constructor(name, app, player, position=null){
        super(name, app, player, position);
        this.addSprite("media/enemy.png");
    }

    update(){
        super.update();
        if (this.stunned || !this.canUpdate) return;
        this.motor.applyForce(this.seek(this.player));   
    }
}

class SeekFireEnemy extends Enemy{
    constructor(name, app, player, position=null){
        super(name, app, player, position);
        this.addSprite("media/enemy.png");        
    }

    update(){
        super.update();
        if (this.stunned || !this.canUpdate) return;
        this.motor.applyForce(this.seek(this.player));   
        this.fire(this.forward);
    }
}

class WanderFireEnemy extends Enemy{
    constructor(name, app, player, position=null){
        super(name, app, player, position);
        this.addSprite("media/enemy.png");        
        
    }

    update(){
        super.update();
        if (this.stunned || !this.canUpdate) return;

        let netForce = new Vector2(0,0);


        netForce.add(this.wander(200, 400));
        netForce.add(this.constrain(this.constrainRect));
        this.fire(Vector2.subtract(this.player.posVector, this.posVector).normalized);
        this.motor.applyForce(netForce);

    }
}