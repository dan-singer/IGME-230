/**
 * Class representing a Vector in 2-dimensional space.
 * @author Dan Singer
 */
class Vector2{
    /**
     * Create a new Vector2.
     * @param {*Number} x 
     * @param {*Number} y 
     */
    constructor(x,y){
        this.x = x;
        this.y = y;
    }

    /**
     * Return the magnitude of this vector.
     * @returns {Number}
     */
    get magnitude(){
        return Math.sqrt(Math.pow(this.x, 2) + Math.pow(this.y, 2));
    }
    /**
     * Return the magnitude squared of this vector.
     * @returns {Number}
     */
    get sqrMagnitude(){
        return Math.pow(this.x, 2) + Math.pow(this.y, 2);
    }

    /**
     * Return the normalized vector based on this vector.
     * @returns {Vector2}
     */
    get normalized(){
        let mag = this.magnitude;
        let normalizedVec = new Vector2(this.x/mag, this.y/mag);
        return normalizedVec;
    }

    /**
     * Add the other vector to this one.
     * @param {*Vector2} other 
     */
    add(other){
        this.x += other.x;
        this.y += other.y;
    }

    /**
     * Subtract the other vector from this one.
     * @param {*Number} other 
     */
    subtract(other){
        this.x -= other.x;
        this.y -= other.y;
    }

    /**
     * Scale this vector by the scalar
     * @param {*Number} scalar 
     */
    scale(scalar){
        this.x *= scalar;
        this.y *= scalar;
    }

    /**
     * Make this vector have a magntiude of one
     */
    normalize(){
        let mag = this.magnitude;
        this.x /= mag;
        this.y /= mag;
    }

    /**
     * Return the dot product of this vector and the other one.
     * @param {Vector2} other 
     * @returns {Number}
     */
    dot(other){
        return (this.x * other.x) + (this.y * other.y);
    }

    /**
     * Rotate this vector counterclockwise by the specified amount of radians
     * @param {*Number} radians 
     */
    rotate(radians){
        let newX = this.x * Math.cos(radians) - this.y * Math.sin(radians);
        let newY = this.x * Math.sin(radians) + this.y * Math.cos(radians);
        this.x = newX; this.y = newY;
    }

    /**
     * Make this vector's x and y components be zero.
     */
    clear(){
        this.x = 0; this.y = 0;
    }

    static add(a, b){
        return new Vector2(a.x + b.x, a.y + b.y);
    }
    static subtract(a,b){
        return new Vector2(a.x - b.x, a.y - b.y);
    }
    static scale(a, scalar){
        return new Vector2(a.x * scalar, a.y * scalar);
    }

}

let vec = new Vector2(1,0);
vec.rotate(Math.PI/2);