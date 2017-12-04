"use strict";

window.onload = windowLoaded;
let app;

/**
 * Called when window has loaded.
 */
function windowLoaded(){

    let gameContainer = document.querySelector("#game");
    app = new PIXI.Application(gameContainer.clientWidth, gameContainer.clientHeight);
    gameContainer.appendChild(app.view);

    PIXI.loader.add(
        ["media/player0.png", "media/player1.png"]
    ).load(onAssetsLoaded);
}


let go;
function onAssetsLoaded(){

    //Testing
    go = new GameObject("Player", app);
    go.addSprite("media/player0.png");
    go.setActiveSprite("media/player0.png");
    app.stage.addChild(go);
    go.addSprite("media/player1.png");
    go.setActiveSprite("media/player1.png");
}