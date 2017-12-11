class Pickup extends GameObject{
    constructor(name, app, position=null){
        super(name, app, position);
        this.worth = 1;
        this.scale = {x:.2, y:.2};
        this.attachCollider();
    }

    onCollisionBegin(other){
        if (other.gameObject instanceof Player){
            this.onPickedUp(other.gameObject);
            this.destroy();
        }
    }

    onPickedUp(player){ }
}
class HealthPickup extends Pickup{
    constructor(name, app, position=null){
        super(name, app, position);
        this.addSprite("pickup-health.png");
    }

    onPickedUp(player){
        player.adjustHealth(this.worth);
    }
}
class ScorePickup extends Pickup{
    constructor(name, app, position=null){
        super(name, app, position);
        this.addSprite("pickup-score.png");        
    }

    onPickedUp(player){
        gameManager.score += this.worth;
    }
}