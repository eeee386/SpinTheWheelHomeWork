// Constants
const gameAreaWidth = 400;
const gameAreaHeight = 1.5*gameAreaWidth
const wheelDiameter = 0.5*gameAreaWidth;

// DOM elements
let body = null;
let gameArea = null;
let wheel = null;
let gate = null;

// Gamehelper variables
let activeColor = null;
let difficulty = null;


function setUpGameWorld(pDifficulty, numberOfColors, keybindings) {
    difficulty = pDifficulty;
    body = document.getElementsByTagName("body")[0];
    createGameArea();
    createWheel(numberOfColors);
    createGate();
}

function createGameArea() {
    gameArea = document.createElement("div");
    gameArea.id = "gameArea";
    body.appendChild(gameArea)
}

function createWheel(numberOfColors){
    wheel = document.createElement("div");
    wheel.id = "wheel";
    gameArea.appendChild(wheel);
    for(let i = 0; i < numberOfColors; i++){
        const color = validColors[i]
        const slice = document.createElement("div");
        slice.id = `${color}Slice`;
        slice.classList.add("slice");
        slice.style.backgroundColor = color;
        wheel.appendChild(slice);
    }
}

function createGate(){
    gate = document.createElement("div");
    gate.id = "gate";
    gate.style.width = "100%";
    gate.style.top = `${gameAreaHeight-wheelDiameter}px`;
    gameArea.appendChild(gate);
}

