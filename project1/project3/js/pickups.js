class Pickup extends GameObject{
    constructor(name, app, position=null){
        super(name, app, position);
        this.attachCollider();
    }
}
class HealthPickup extends Pickup{
    constructor(name, app, position=null){
        super(name, app, position);
    }

    onCollisionBegin(other){
        if (other.gameObject instanceof Player){

        }
    }
}