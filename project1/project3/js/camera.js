/**
 * Simulate a camera by adjusting a container.
 * @author Dan Singer
 */
class Camera{

    constructor(container, app){
        this.container = container;
        this.app = app;
        this.app.ticker.add(()=>this.update());
    }
    /**
     * Set the upper left corner of the camera viewing rectangle.
     */
    set position(newPos){
        this.container.position = Vector2.scale(newPos, -1);
    }

    get position(){
        return Vector2.scale(this.container.position, -1);
    }

    set zoom(newZoom){
        this.container.scale = new Vector2(newZoom, newZoom);
    }

    get rect(){
        let pos = this.position;
        return new PIXI.Rectangle(pos.x, pos.y, this.app.screen.width, this.app.screen.height);
    }

    update(){ }
}

class FollowCam extends Camera{
    /**
     * Make a follow camera
     * @param {PIXI.Container} target 
     */
    constructor(container, app, target, speed=3){
        super(container, app);
        this.target = target;
        this.speed = speed;
        this.following = true;
    }

    update(){
        if (this.following){        
            let dt = 1 / this.app.ticker.FPS;
            let desiredPosition = new Vector2(this.target.x - this.app.screen.width/2, this.target.y - this.app.screen.height/2 );
            this.position = Vector2.lerp(this.position, desiredPosition, this.speed * dt);
        }
    }


}