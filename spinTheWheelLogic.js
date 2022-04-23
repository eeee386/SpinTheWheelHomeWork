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

function setUpGameWorld() {
    body = document.getElementsByTagName("body")[0];
    createGameArea();
    createWheel();
    createGate();
}

function createGameArea() {
    gameArea = document.createElement("div");
    gameArea.id = "gameArea";
    body.appendChild(gameArea)
}

function createWheel(){
    wheel = document.createElement("div");
    wheel.id = "wheel";
    gameArea.appendChild(wheel);
}

function createGate(){
    gate = document.createElement("div");
    gate.id = "gate";
    gate.style.width = "100%";
    gate.style.top = `${gameAreaHeight-wheelDiameter}px`;
    gameArea.appendChild(gate);
}

