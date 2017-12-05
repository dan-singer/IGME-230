class Camera{

    constructor(container){
        this.container = container;
    }


    set position(newPos){
        this.container.position = Vector2.scale(newPos, -1);
    }

    //TODO position getter and zoom


}