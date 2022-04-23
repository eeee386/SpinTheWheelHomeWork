// DOM elements
let body = null;
let gameArea = null;
let wheel = null;
let gate = null;
let centerWheel = null;

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
    centerWheel = document.createElement("div");
    centerWheel.id = "centerWheel";
    wheel.id = "wheel";
    gameArea.appendChild(wheel);
    for(let i = 0; i < numberOfColors; i++){
        const color = validColors[i]
        const slice = document.createElement("div");
        slice.id = `${color}Slice`;
        slice.classList.add("slice");
        slice.style.transform = `rotate(${(360/numberOfColors)*i}deg)`;
        const sliceColored = document.createElement("div");
        sliceColored.classList.add("colored");
        sliceColored.style.backgroundColor = color.toLowerCase();
        slice.appendChild(sliceColored);
        wheel.appendChild(slice);
        wheel.appendChild(centerWheel)
    }
}

function createGate(){
    gate = document.createElement("div");
    gate.id = "gate";
    gameArea.appendChild(gate);
}

