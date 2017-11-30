window.onload = windowLoaded;


/**
 * Called when window has loaded.
 */
function windowLoaded(){

    let gameContainer = document.querySelector("#game");
    const app = new PIXI.Application(gameContainer.clientWidth, gameContainer.clientHeight);
    gameContainer.appendChild(app.view);

}