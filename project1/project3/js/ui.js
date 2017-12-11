/**
 * A generic label
 * @author Dan Singer 
 */
class Label extends PIXI.Text{
    constructor(text){
        let style = new PIXI.TextStyle({
            fontFamily: "Verdana",
            fontSize: 36,
            fill: 0xFFFFFF
        });
        super(text, style);
    }
}

/**
 * Title class
 * @author Dan Singer 
 */
class Title extends PIXI.Text{
    constructor(text){
        let style = new PIXI.TextStyle({
            fontFamily: "Saira",
            fontSize: 48,
            fill: 0xFFFFFF
        });
        super(text, style);
    }
}

/**
 * Button class which abstracts boilerplate PIXI button code
 * @author Dan Singer
 */
class Button extends PIXI.Text{
    constructor(text, pressFunc){
        let style = new PIXI.TextStyle({
            fontFamily: "Verdana",
            fontSize: 32,
            fill: 0xEEEEEE
        });
        super(text, style);
        this.interactive = true;
        this.buttonMode = true;

        this.on("pointerdown", ()=>this.alpha=.25 )
            .on("pointerup", ()=>this.alpha=1 )
            .on("pointerupoutside", ()=>this.alpha=1)
            .on("pointerover", ()=>this.alpha=0.5)
            .on("pointerout", ()=>this.alpha=1)
            .on("pointerdown", ()=>pressFunc());
    }

    onButtonDown(){

    }

}