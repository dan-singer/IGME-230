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

class DynamicLabel extends Label{
    constructor(textGetter, app){
        super(textGetter());        
        this.style.fontSize = 24;
        this.textGetter = textGetter;
        this.app = app;        
        this.app.ticker.add(()=>this.update());
    }
    update(){
        this.text = this.textGetter();
    }
}


class HUDLabel extends DynamicLabel{
    constructor(textGetter, app, camera){
        super(textGetter, app);        
        this.camera = camera;
        this.positionOffset = {x:0, y:0};
    }

    update(){
        super.update();
        this.position = {x:this.camera.position.x+this.positionOffset.x, y:this.camera.position.y+this.positionOffset.y};
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
            fontSize: 72,
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
    /**
     * Construct a new button
     * @param {String} text 
     * @param {Function} pressFunc function called when pressed
     */
    constructor(text, pressFunc){
        let style = new PIXI.TextStyle({
            fontFamily: "Verdana",
            fontSize: 32,
            fill: 0x747272
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
}

