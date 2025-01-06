// Selecting elements
const colors = ["red", "blue", "green", "yellow"];
const gameBoard = document.getElementById("game-board");
const highScoreDisplay = document.getElementById("high-score");
const currentScoreDisplay = document.getElementById("current-score");
const startButton = document.getElementById("start-button");
const modal = document.getElementById("game-over-modal");
const playAgainButton = document.getElementById("play-again");
const backButton = document.getElementById("back");
const backToMenu = document.getElementById("back-to-menu");




let sequence = [];
let playerSequence = [];
let highScore = 0;
let isPlayingTheSequence = false;
let isGameStarted = false;
let isGameOver = false;
let speed = 1000;



// Start a game
function startSimonGame() {
    sequence = [];
    playerSequence = [];
    speed = 1000;
    isGameStarted = true;
    isGameOver = false;
    isPlayingTheSequence = false;
    startButton.style.display = "none";
    currentScoreDisplay.textContent = `Current Score: 0`;

    modal.classList.remove("active");
    modal.classList.add("hidden");

    playStartSound();
    setTimeout(() => {
      generateSequence();
    }, 1000);
}


// Random sequence generator function 
function generateSequence() {
  const randomColor = colors[Math.floor(Math.random() * colors.length)];
  sequence.push(randomColor);
  showSequence();
}


// Show sequence with proper timing
function showSequence() {
    isPlayingTheSequence = true;
    document.body.classList.add("no-click");
    document.getElementById("wait-text").classList.remove("hidden");

    let i = 0;
  
    const interval = setInterval(() => {
        if (i >= sequence.length) {
          clearInterval(interval);
          isPlayingTheSequence = false;
          document.body.classList.remove("no-click");
          document.getElementById("wait-text").classList.add("hidden");
          return;
        }
        highlightColor(sequence[i]);
        i++;
    }, speed);
    
      speed = Math.max(300, speed - 50);
}
  
  // Highlight color
  function highlightColor(color) {
    const element = document.getElementById(color);
    playSound(color);
    element.classList.add("active");
    setTimeout(() => element.classList.remove("active"), speed / 2);
  }
  

  // case of mistakes
  function handleMistake() {
    playErrorSound();
    document.body.classList.add("mistake")

    setTimeout(() => {
      document.body.classList.remove("mistake")
      gameOver();
    }, 750);
  }





  // Prevent clicking while sequence is playing too
  // Cases of using the mouse
  gameBoard.addEventListener("click", (event) => {
    if (!isGameStarted) return;

    const clickedColor = event.target.id;
    if (isPlayingTheSequence || !colors.includes(clickedColor)) return;
  
    playerSequence.push(clickedColor);
    highlightColor(clickedColor);
  
    const currentStep = playerSequence.length - 1;
    if (playerSequence[currentStep] !== sequence[currentStep]) {
      gameOver(); 
    } 
    else if (playerSequence.length === sequence.length) {
      highScore = Math.max(highScore, sequence.length);
      currentScoreDisplay.textContent = `Current Score: ${playerSequence.length}`
      highScoreDisplay.textContent = `Highest Score: ${highScore}`;
      playerSequence = [];
      setTimeout(() => {
        generateSequence();
      }, 1000);
    }
  });

  // Prevent clicking while sequence is playing too
  // Cases of using the keyboard
  document.addEventListener("keydown", (event) => {
    if (isPlayingTheSequence || !isGameStarted || isGameOver) return; 

    let selectedColor;
    switch (event.key) {
      case "ArrowUp":
        selectedColor = "red";
        event.preventDefault(); // to stop it from moving the page up and down
        break;
      case "ArrowDown":
        selectedColor = "yellow";
        event.preventDefault();
        break;
      case "ArrowRight":
        selectedColor = "blue";
        event.preventDefault();
        break;
      case "ArrowLeft":
        selectedColor = "green";
        event.preventDefault();
        break;
      default:
        return;
    }

    playerSequence.push(selectedColor);
    highlightColor(selectedColor);

    //checking the answer
    const currentStep = playerSequence.length - 1;
    if (playerSequence[currentStep] !== sequence[currentStep]) {
        gameOver();
    }
    else if (playerSequence.length === sequence.length) {
        highScore = Math.max(highScore, sequence.length);
        currentScoreDisplay.textContent = `Current Score: ${playerSequence.length}`
        highScoreDisplay.textContent = `Highest Score: ${highScore}`;
        playerSequence = [];
        setTimeout(() => {
            generateSequence();
        }, 1000);
    }
  });


  // SOUNDS
  // start
  function playStartSound() {
    const StartSound = new Audio('/static/sounds/Simon-game-start.mp3');
    StartSound.play();
  }
  // colors
  function playSound(color) {
    const sound = new Audio(`/static/sounds/simonSound-${color}.mp3`);
    sound.play();
  }
  // end
  function playErrorSound() {
    const ErrorSound = new Audio('/static/sounds/Simon-game-over.mp3');
    ErrorSound.play();
  }





  function gameOver() {
    saveScore(highScore);

    isGameOver = true;
    const modal = document.getElementById("game-over-modal");
    modal.classList.add("active");
    modal.classList.remove("hidden");
    playErrorSound();

    const centerCircle = document.getElementById("inner-circle");
    if (centerCircle) {
      centerCircle.style.display = "none";
    }
  }
  

  playAgainButton.addEventListener("click", () => {
    startSimonGame();
  });

  backButton.addEventListener("click", () => {
    window.location.href = "../html/games.html"; // בכוונה בעברית שיהיה בולט איפה צריך להוסיף
  });

  backToMenu.addEventListener("click", () => {
    window.location.href = "../html/games.html";
  });


  startButton.addEventListener("click", (event) => {
    event.stopPropagation();
    startButton.style.display = "none";
    startSimonGame();
  });


