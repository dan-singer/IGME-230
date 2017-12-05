/**
 * Player class for Space Voyager
 * @author Dan Singer
 */
class Player extends GameObject{
    constructor(name, app){
        super(name, app);
        this.attachMotor();
        this.attachCollider();

        this.thrustMagnitude = 200;
        this.radiansPerSecond = 1;

        this.keyMapping = {
            "ArrowLeft": "left",
            "a": "left",
            "ArrowRight": "right",
            "d": "right",
            "ArrowUp": "up",
            "w": "up",
            "ArrowDown": "down",
            "d": "down"
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

    update(){

        let dt = 1 / this.app.ticker.FPS;

        //Apply drag
        let airDensity = 0.3;
        let drag = 0.14;
        let area = this.width * this.height / 8000;
        let airResistanceMag = airDensity * drag * area * this.motor.velocity.sqrMagnitude / 2;
        this.motor.applyForce(this.motor.velocity.normalized.scale(-airResistanceMag));


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