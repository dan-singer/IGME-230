/**
 * Player class for Space Voyager
 * @author Dan Singer
 */
class Player extends GameObject{
    constructor(name, app){
        super(name, app);
        this.attachMotor();
        this.attachCollider();

        this.thrustMagnitude = 250;
        this.radiansPerSecond = 1.5;
        this.health = 3;

        this.keyMapping = {
            "ArrowLeft": "left",
            "a": "left",
            "ArrowRight": "right",
            "d": "right",
            "ArrowUp": "up",
            "w": "up",
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
    }

    onCollisionBegin(){
        this.setActiveSprite("media/player-hit.png");
    }
    onCollisionEnd(){
        this.setActiveSprite("media/player.png");
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
    }


}