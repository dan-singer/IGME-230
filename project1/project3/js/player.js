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
        this.health = 3;
        this.wasFiring = false;

        //Attach sprites
        this.addSprite("media/player.png");
        this.addSprite("media/player-hit.png");

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
    }

    update(){

        let dt = 1 / this.app.ticker.FPS;

        //Apply drag
        this.motor.applyDrag(gameManager.dragSettings);

        //Thrust
        if (this.keysDown.has("up")){
            let force = this.forward.scale(this.thrustMagnitude);
            this.motor.applyForce(force);
        }

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
    }


}