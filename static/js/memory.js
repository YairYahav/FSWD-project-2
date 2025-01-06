// taking the names from the localStorage
const players = JSON.parse(localStorage.getItem("memoryGamePlayers"));
// lets make an array now with all of the players
let playerArray = [];
players.forEach((player, i) => {
    const playerName = `player${i + 1}`; // starting from 0
    window[playerName] = player; // saving as global
    playerArray.push({ [playerName]: player }); // adding to the array


    console.log(`Player ${i + 1}:`, window[`player${i + 1}`]); // printing to the console the names for checking
});


// Now let's update the names to the player column
players.forEach((player, i) => {
    const playerName = document.getElementById(`player${i + 1}-name`);
    if (playerName) {
        playerName.textContent = player;
    }
});












// Now we can start with the code to the game:
let currentPlayerTurn = 0;
let firstCard = null;
let secondCard = null;
let isFlipped = false;
let lockBoard = false;
let isGameOver = false;


const board = document.getElementById('game-board');
const playAgainButton = document.getElementById("play-again");
const backButton = document.getElementById("back");
const backToMenu = document.getElementById("back-to-menu");





// Is the player active? if so let's color the bg of his card
players.forEach((player, i) => {
    const playerName = document.getElementById(`player${i + 1}-name`);
    const playerCard = document.getElementById(`player${i + 1}-card`);

    if (player.trim() !== "") { // a note for myself:    in JS it's !== and not !=
        playerCard.classList.add("player-active");
        playerName.textContent = player;
    }
    else {
        playerCard.classList.add("player-inactive");
    }
});

// if this is a player turn we will color his border in gold like in the "Confirm"
function setPlayerAsActive(playerIndex) {
    document.querySelectorAll('.player-card').forEach((card, i) => {
        if (i === playerIndex)
            card.classList.add('active');
        else
            card.classList.remove('active');
    });
    updateCurrentPlayerName(playerIndex);
}




// The game logic itself:
// A func to update the second header to the current player's name
function updateCurrentPlayerName(playerIndex) {
    const currentPlayerTurnHeader = document.getElementById("current-player");
    const currentPlayerName = players[playerIndex];
    currentPlayerTurnHeader.textContent = `${currentPlayerName}'s turn`;
}


// It was easyer to code and much more easyer to understand by spliting the board making into 4 phases
// Pase 1: Creating an array of images
function getImages() {
    const images = [];
    for (let i=1; i<=16; i++) {
        images.push(`../static/pictures/memory-image${i}.jpg`);
    }
    
    return images;
}


// Pase 2: Multipling the cards and suffles them
function shuffleTheImages() {
    const images = getImages();
    const doubledImages = images.concat(images);
    for (let i=doubledImages.length - 1; i>0; i--) {
        const j = Math.floor(Math.random() * (i +1));
        [doubledImages[i], doubledImages[j]] = [doubledImages[j], doubledImages[i]]; // the shuffle itself
    }

    return doubledImages;
}


// Pase 3: assigning an image to each card
function assignImagesToCards() {
    const images = shuffleTheImages();
    const cards = document.querySelectorAll('.card');

    cards.forEach((card, i) => {
        card.setAttribute('data-image', images[i]);
    });
}


// Pase 4: Placing the pictures on the board
function placeImagesOnBoard() {
    const cards = document.querySelectorAll('.card');

    cards.forEach(card => {
        const cardFront = card.querySelector('.card-front');
        const image = card.getAttribute('data-image');
        cardFront.style.backgroundImage = `url(${image})`;
    });
}


// Starts the game
function startMemoryGame() {
    assignImagesToCards();
    placeImagesOnBoard();
    setPlayerAsActive(currentPlayerTurn);
    updateCurrentPlayerName(currentPlayerTurn);
}


// Clicking event listener for each card
document.querySelectorAll('.card').forEach(card => {
    card.addEventListener('click', () => handleSelectingCards(card));
});


// Case of selecting cards
function handleSelectingCards(card) {
    if (lockBoard) return;
    if (isFlipped || card === firstCard || card.classList.contains('matched')) return; //see "handleMatch" for "matched"

    card.classList.add('flipped');
    if (!firstCard){
        firstCard = card;
    }
    else {
        secondCard = card;
        isFlipped = true;
        setTimeout(checkForMatch, 500);
    }
}


// Checking if ther is a macth
function checkForMatch() {
    const isMatch = (firstCard.dataset.image === secondCard.dataset.image); // if the image of both card is matching
    if (isMatch)
        handleMatch();
    else
        handleMistake();
}


// Handle match or mistake:
function handleMatch() {
    firstCard.classList.add('matched');
    secondCard.classList.add('matched');
    addPoint(currentPlayerTurn);
    playSound('memory-success');
    if (isTheGameIsOver())
        endGame();
    
    firstCard = null;
    secondCard = null;
    isFlipped = false;
}
function handleMistake() {
    lockBoard = true;
    playSound('memory-fail');

    firstCard.classList.add('locked');
    secondCard.classList.add('locked');

    setTimeout(() => {
        firstCard.classList.remove('flipped', 'locked');
        secondCard.classList.remove('flipped', 'locked');
        currentPlayerTurn = ((currentPlayerTurn + 1) % players.length);
        setPlayerAsActive(currentPlayerTurn); // calls already to updateCurrentPlayerName
        lockBoard = false;
            
        firstCard = null;
        secondCard = null;
        isFlipped = false;
    }, 1000);
}



// Playing the sounds, like in the Simon-Game
function playSound(typeOfSound) {
    const sound = new Audio(`/static/sounds/${typeOfSound}.mp3`);
    sound.play();
}


// Adding points and updating the player score
function addPoint(playerIndex) {
    const playerScore = document.getElementById(`player${playerIndex + 1}-score`);
    // instade of canging all the words we will split by the : and space and save only the current score and than add it to the text
    const currentScore = parseInt(playerScore.textContent.split(': ')[1]);
    playerScore.textContent = `Score: ${currentScore + 1}`;
}


// Checing if the game is over, if all cards have a "mached" flag
function isTheGameIsOver() {
    return (document.querySelectorAll('.card:not(.matched)').length === 0); // if the Query isn't empty it will return false.
}


// Ending the game - actually a useless function but I want everyting to be by itself and then add the Pop up screen
function endGame(){
    gameOver();
}

// In order to call the startGame func
document.addEventListener('DOMContentLoaded', startMemoryGame);

// Who is the winner
function winner() {
    let maxScore = 0;
    let winners = []; // there might be more than 1 winner

    players.forEach((player, i) => {
        const playerScoreElement = document.getElementById(`player${i + 1}-score`);
        const playerScore = parseInt(playerScoreElement.textContent.split(': ')[1]);

        if (playerScore > maxScore) {
            maxScore = playerScore;
            winners = [player];
        }
        else if (playerScore === maxScore) {
            winners.push(player);
        }
    });

    // if there is only 1 winner we'll return only him but if there is more than 1 we'll use come between them.
    return winners.length === 1 ? winners[0] : winners.join(', ');
}





// Pop up screen, back and play again buttons - like in the simon game
function gameOver() {
    isGameOver = true;
    setTimeout(() => {
        const modal = document.getElementById("game-over-modal");
        const winnerName = document.getElementById("winner-name");
    
        const winners = winner();
        if (winners.includes(',')) {
            winnerName.textContent = `The winners are: ${winners}`
        }
        else {
            winnerName.textContent = `${winner()} WON THE GAME!`;
        }
    
        modal.classList.add("active");
        modal.classList.remove("hidden");
    }, 1500);
}
  

playAgainButton.addEventListener("click", () => {
    players.forEach((player, i) => {
        const playerScore = document.getElementById(`player${i + 1}-score`);
        playerScore.textContent = `Score: 0`;
    });

    const modal = document.getElementById("game-over-modal");
    modal.classList.remove("active");
    modal.classList.add("hidden");

    currentPlayerTurn = 0;
    firstCard = null;
    secondCard = null;
    isFlipped = false;
    lockBoard = false;
    isGameOver = false;

    const cards = document.querySelectorAll('.card');
    cards.forEach(card => {
        card.classList.remove('flipped', 'matched', 'locked');
        card.querySelector('.card-front').style.backgroundImage = '';
    });
    
    startMemoryGame();
});

backButton.addEventListener("click", () => {
    window.location.href = "../html/games.html"; // בכוונה בעברית שיהיה בולט איפה צריך להוסיף
});

backToMenu.addEventListener("click", () => {
    window.location.href = "../html/games.html";
});