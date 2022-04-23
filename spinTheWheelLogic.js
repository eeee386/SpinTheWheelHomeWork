// DOM elements
let body = null;
let gameArea = null;
let wheel = null;
let gate = null;
let centerWheel = null;
let balls = [];
let scoreText = null;

// Gamehelper variables
let activeColor = null;
let activeDeg = 0;
let difficulty = null;
let rotation = 0;
let numberOfColors = 0;
let score =0;
let keybindings = null;
let isEnd = false;



function setUpGameWorld(pDifficulty, pNumberOfColors, pKeybindings) {
    difficulty = pDifficulty;
    rotation = 360/pNumberOfColors;
    keybindings = pKeybindings;
    numberOfColors = pNumberOfColors;
    body = document.getElementsByTagName("body")[0];
    createGameArea();
    createWheel(numberOfColors);
    createGate();
    createScore();
    activeColor = validColors[0];
    document.addEventListener("click", function (e){
        turnRight();
    })
    document.addEventListener("keydown", function (e){
        handleKeyPress(e);
    });
    if(!isEnd){
        setInterval(createBalls, 3000);
    }
}

function createGameArea() {
    gameArea = document.createElement("div");
    gameArea.id = "gameArea";
    body.appendChild(gameArea)
}

function createWheel(){
    wheel = document.createElement("div");
    centerWheel = document.createElement("div");
    centerWheel.id = "centerWheel";
    wheel.id = "wheel";
    gameArea.appendChild(wheel);
    // Create a full height pole for every color
    // Position them so that it would slice the wheel in half
    // Rotate them in the right angle
    // Add the child div (half the height of the pole)
    // color child div
    for(let i = 0; i < numberOfColors; i++){
        const color = validColors[i]
        const slice = document.createElement("div");
        slice.id = `${color}Slice`;
        slice.classList.add("slice");
        slice.style.transform = `rotate(${rotation*i}deg)`;
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

function createScore() {
    scoreText = document.getElementById("score")
    if(scoreText){
        gameArea.removeChild(scoreText)
    }
    scoreText = document.createElement("div");
    scoreText.id = "score";
    gameArea.appendChild(scoreText)
    scoreText.innerText = score;
}

function createBalls() {
    const ball = document.createElement("div");
    ball.classList.add("ball");
    ball.style.backgroundColor = getColorForBalls().toLowerCase();
    // Here we use that the body has no padding or margin
    const gateRect = gate.getBoundingClientRect();
    gameArea.appendChild(ball);
    const ballRect = ball.getBoundingClientRect();
    const move = [
        {top: "0px"},
        {top: `${gateRect.y-ballRect.height}px`}
    ];
    const timing = {
        duration: 5000,
        iterations: 1,
    }
    console.log(ballRect);
    ball.animate(move, timing);
    setTimeout(function (){
        if(ball.style.backgroundColor === activeColor.toLowerCase()){
            score += 1;
            createScore();
            gameArea.removeChild(ball);
        } else {
            isEnd = true;
            balls.forEach(b => {
                gameArea.removeChild(b);
            });
        }
    }, 5000);
    
}

function getColorForBalls() {
    const step = 1/numberOfColors;
    const chanceArray = [];
    for (let i = 1; i <= numberOfColors; i++){
        chanceArray.push(i*step);
    }
    const randomNumber = Math.random();
    const colorIndex = chanceArray.findIndex(e => randomNumber < e);
    return validColors[colorIndex];
}

function turnLeft() {
    const move = [
        {transform: `rotate(${activeDeg}deg)`},
        {transform: `rotate(${activeDeg-rotation}deg)`}
    ];
    const timing = {
        duration: 100,
        iterations: 1
    }
    wheel.animate(move, timing);

    setTimeout(function (){
        activeDeg -= rotation
        wheel.style.transform = `rotate(${activeDeg}deg)`;
    }, 0.1);

}

function turnRight() {
    const move = [
        {transform: `rotate(${activeDeg}deg)`},
        {transform: `rotate(${activeDeg+rotation}deg)`}
    ];
    const timing = {
        duration: 100,
        iterations: 1
    }
    wheel.animate(move, timing);

    setTimeout(function (){
        activeDeg += rotation
        wheel.style.transform = `rotate(${activeDeg}deg)`;
    }, 0.1);
}
// TODO: fix weird animation when it has to do more than one turn
// (Only the last animation is played)
function calculateTurn(key){
    const index = validColors.indexOf(activeColor);
    const color = keybindings[key];
    const newIndex = validColors.indexOf(color);
    let indexDifference = (newIndex+index)%numberOfColors;

    while(indexDifference > 0){
        turnLeft();
        indexDifference--;
    }
    activeColor = color;
}


function handleKeyPress(e){
    const {key} = e;
    switch(key){
        case "ArrowRight":
            turnRight();
            break;
        case "ArrowLeft":
            turnLeft();
            break;
        case " ":
            turnRight();
            break;
        default:
            calculateTurn(key);
    }
}