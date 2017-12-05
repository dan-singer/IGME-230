/**
 * Singleton CollisionManager object which cycles through each object registered with it,
 * and notifies them if they collided with each other using their definition of collision check.
 * @author Dan Singer
 */
const CollisionManager = {
    colliders : [], 
    collMap: new Map(),
    register(collider){
      this.colliders.push(collider);  
    },
    update(){
        for (let i=0; i<this.colliders.length-1; i++){
            let colliderA = this.colliders[i];
            
            for (let j=i+1; j<this.colliders.length; j++)
            {
                let colliderB = this.colliders[j];
                if (colliderA.collidingWith(colliderB)){

                    if (!this.collMap.has(colliderA) || !this.collMap.get(colliderA).includes(colliderB))
                    {
                        colliderA.gameObject.onCollisionBegin(colliderB);
                        colliderB.gameObject.onCollisionBegin(colliderA);
                        if (this.collMap.has(colliderA))
                            this.collMap.get(colliderA).push(colliderB);
                        else
                            this.collMap.set(colliderA, [colliderB]);             
                    }
                    colliderA.gameObject.onCollision(colliderB);
                    colliderB.gameObject.onCollision(colliderA);
                }
                else{
                    if (this.collMap.has(colliderA) && this.collMap.get(colliderA).includes(colliderB))
                    {
                        colliderA.gameObject.onCollisionEnded(colliderB);
                        colliderB.gameObject.onCollisionEnded(colliderA);
                        let collisions = this.collMap.get(colliderA);
                        collisions.splice(collisions.indexOf(colliderB), 1);                        
                    }
                }
            }
        }
    }
};



/**
 * Simple circle collider
 * @author Dan Singer
 */
class CircleCollider{

    /**
     * Construct a new Circle Collider attached to a gameObject
     * @param {GameObject} gameObject 
     * @param {Number} radius 
     */
    constructor(gameObject, radius){ 
        this.gameObject = gameObject;
        this.radius = radius;
        CollisionManager.register(this);
    }

    /**
     * Check if there is a collision between this collider and the other one
     * @param {CircleCollider} other 
     * @returns {Boolean}
     */
    collidingWith(other){
        let connectingLine = Vector2.subtract(other.gameObject.posVector, this.gameObject.posVector);
        let radSum = this.radius + other.radius;
        return (connectingLine.sqrMagnitude < Math.pow(radSum, 2));
    }
}