let gameArea = null;
const gameAreaWidth = 400;
const gameAreaHeight = 2*gameAreaWidth

function setUpGameWorld() {
    gameArea = document.createElement("div");
    gameArea.id = "gameArea";
    gameArea.style.width = `${gameAreaWidth}px`
    gameArea.style.height = `${gameAreaHeight}px`
}