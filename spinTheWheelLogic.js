// DOM elements
let body = null;
let gameArea = null;
let wheel = null;
let gate = null;
let centerWheel = null;
let scoreText = null;
let endText = null;

// Gamehelper variables
let activeColor = null;
let activeDeg = 0;
let difficulty = null;
let rotation = 0;
let numberOfColors = 0;
let score =0;
let keybindings = null;
let isEnd = false;
let name = null;
const difficultyDict = {
    easy: {newBallInterval: 3000, travelTime: 5000},
    medium: {newBallInterval: 2000, travelTime: 4000},
    hard: {newBallInterval: 1000, travelTime: 3000}
};
let soundtrack = null;

//https://www.pentarem.com/blog/how-to-use-settimeout-with-async-await-in-javascript/
function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

//https://stackoverflow.com/questions/4777077/removing-elements-by-class-name
function removeElementsByClass(className){
    const elements = document.getElementsByClassName(className);
    while(elements.length > 0){
        elements[0].parentNode.removeChild(elements[0]);
    }
}


function setUpGameWorld(pDifficulty, pNumberOfColors, pKeybindings, pName) {
    difficulty = pDifficulty;
    rotation = 360/pNumberOfColors;
    keybindings = pKeybindings;
    numberOfColors = pNumberOfColors;
    name = pName;
    body = document.getElementsByTagName("body")[0];
    createGameArea();
    createWheel();
    createGate();
    createScore();
    activeColor = validColors[0];
    document.addEventListener("click", function (e){
        turnRight();
    })
    document.addEventListener("keydown", function (e){
        handleKeyPress(e);
    });
    soundtrack = new Audio("Loyalty_Freak_Music_-_04_-_Cant_Stop_My_Feet_.mp3");
    soundtrack.autoplay = true;
    soundtrack.play();
    setInterval(createBalls, difficultyDict[difficulty].newBallInterval);
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

function handleEnd(){
    endText = document.createElement("div");
    endText.id = "end";
    gameArea.appendChild(endText)
    endText.innerText = "Game over!";
    soundtrack.pause();
    localStorage.setItem(name, score.toString());
}

async function createBalls() {
    if(isEnd){
        return;
    }
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
        duration: difficultyDict[difficulty].travelTime,
        iterations: 1,
    }
    ball.animate(move, timing);
    await delay(difficultyDict[difficulty].travelTime);
    // If this is not here game over duplicates because multiple instances of the
    // function is running because of the interval and delay
    if(isEnd){
        return;
    }
    if(ball.style.backgroundColor === activeColor.toLowerCase()){
        score += 1;
        createScore();
        gameArea.removeChild(ball);
    } else {
        isEnd = true;
        removeElementsByClass("ball");
        handleEnd();
    }
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

async function turnLeft() {
    const index = validColors.indexOf(activeColor);
    const newIndex = (index+1)%numberOfColors;
    activeColor = validColors[newIndex];

    const move = [
        {transform: `rotate(${activeDeg}deg)`},
        {transform: `rotate(${activeDeg-rotation}deg)`}
    ];
    const timing = {
        duration: 100,
        iterations: 1
    }
    wheel.animate(move, timing);
    await delay(100);
    activeDeg -= rotation
    wheel.style.transform = `rotate(${activeDeg}deg)`;
}

async function turnRight() {
    const index = validColors.indexOf(activeColor);
    const newIndex = index-1 !== -1 ? index-1 : numberOfColors-1;
    activeColor = validColors[newIndex];

    const move = [
        {transform: `rotate(${activeDeg}deg)`},
        {transform: `rotate(${activeDeg+rotation}deg)`}
    ];
    const timing = {
        duration: 100,
        iterations: 1
    }
    wheel.animate(move, timing);
    await delay(0.1);
    activeDeg += rotation
    wheel.style.transform = `rotate(${activeDeg}deg)`;
}
// TODO: fix this!
function calculateTurn(key){
    const index = validColors.indexOf(activeColor);
    const color = keybindings[key];
    const newIndex = validColors.indexOf(color);
    let indexDifference = (newIndex+index)%numberOfColors;

    activeColor = color;
    while(indexDifference > 0){
        turnLeft();
        indexDifference--;
    }
}


async function handleKeyPress(e){
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
            await calculateTurn(key);
    }
}