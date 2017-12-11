/**
 * Player class for Space Voyager
 * @author Dan Singer
 */
class Player extends GameObject{
    constructor(name, app, position=null){
        super(name, app, position);
        this.attachMotor();
        this.attachCollider();

        this.thrustMagnitude = 250;
        this.radiansPerSecond = 1.5;
        this.health = 6;
        this.wasFiring = false;
        this.wasUp = false;

        //Attach sprites and animations
        this.addSprite("idle", new PIXI.Sprite(gameManager.textures["player-idle_000.png"]));
        let animStartTravel = this.addAnimation("player-start-traveling", 0, 3);
            animStartTravel.animationSpeed = 0.2;
            animStartTravel.loop = false;
            animStartTravel.onComplete = () => {this.playAnimation("player-travel"); }
        this.addAnimation("player-travel", 0, 9).animationSpeed = -.2;

        let animEndTravel = new PIXI.extras.AnimatedSprite(animStartTravel.textures.slice().reverse());
            animEndTravel.speed = 0.2;
            animEndTravel.loop = false;
            animEndTravel.onComplete = () => this.setActiveSprite("idle");
        this.addSprite("player-end-traveling", animEndTravel);


        this.addAnimation("player-die", 0, 12).animationSpeed = .2;
        
        

        let travel = [];

        this.keyMapping = {
            "ArrowLeft": "left",
            "a": "left",
            "ArrowRight": "right",
            "d": "right",
            "ArrowUp": "up",
            "w": "up",
            " ": "fire" //space
        };

        this.keysDown = new Set();

        //Setup keyboard event handlers
        document.onkeydown = (e) => {
            if (e.key in this.keyMapping)
            {
                this.keysDown.add(this.keyMapping[e.key]);
            }
        };
        document.onkeyup = (e) =>{
            if (e.key in this.keyMapping)
            {
                this.keysDown.delete(this.keyMapping[e.key]);
            }
        }

        //Mouse Event handlers
        document.onmousedown = (e) => {this.keysDown.add("fire")};
        document.onmouseup = (e) => {this.keysDown.delete("fire")};
    }

    onCollisionBegin(other){

    }
    onCollisionEnd(other){

    }

    adjustHealth(amount){
        this.health += amount;
        if (this.health <= 0){
            gameManager.playerDied();
            this.destroy();
        }
    }

    update(){

        let dt = 1 / this.app.ticker.FPS;

        //Apply drag
        this.motor.applyDrag(gameManager.dragSettings);

        //Check if I'm out of bounds
        if (!Collider.AABB(this.rect, gameManager.bounds)){
            //We can "fake" an elastic collision by just supplying an object literal with mass and velocity to the Motor method.
            Motor.resolveElasticCollision(this.motor, {mass: 10, velocity: new Vector2(0,0)});
        }

        //Thrust
        if (this.keysDown.has("up")){

            if (!this.wasUp)
            {
                this.playAnimation("player-start-traveling");
            }
            let force = this.forward.scale(this.thrustMagnitude);
            this.motor.applyForce(force);
        }
        else if (this.wasUp)
            this.playAnimation("player-end-traveling");

        //Rotation
        if (this.keysDown.has("left")){
            this.rotation -= this.radiansPerSecond * dt;
        }
        if (this.keysDown.has("right")){
            this.rotation += this.radiansPerSecond * dt;            
        }

        //Fire
        if (this.keysDown.has("fire") && !this.wasFiring){
            //Spawn a bullet
            let bullet = new PlayerBullet("b", this.app, this, this.forward);
            this.parent.addChild(bullet);
        }
        

        this.wasFiring = this.keysDown.has("fire");
        this.wasUp = this.keysDown.has("up");
    }


}