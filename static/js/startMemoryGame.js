const startGameButton = document.getElementById("start-game-button");
const playerCards = document.querySelectorAll(".player-card");

let activePlayers = [];

// Enable/Disable Button
document.querySelectorAll(".toggle-player").forEach((button) => {
    button.addEventListener("click", () => {
        const playerCard = button.closest(".player-card");
        const playerInput = playerCard.querySelector("input");
        const confirmButton = playerCard.querySelector(".confirm-name");

        if (playerCard.classList.contains("inactive")) {
            playerCard.classList.remove("inactive");
            playerCard.classList.add("active");
            playerInput.disabled = false;
            confirmButton.disabled = false;
            button.textContent = "Disable Player";
        } else {
            playerCard.classList.add("inactive");
            playerCard.classList.remove("active", "confirmed");
            playerInput.disabled = true;
            confirmButton.disabled = true;
            playerInput.value = "";
            button.textContent = "Enable Player";
        }
        updateStartButton();
    });
});

// Confirm button
document.querySelectorAll(".confirm-name").forEach((button) => {
    button.addEventListener("click", () => {
        const playerCard = button.closest(".player-card");
        const playerInput = document.getElementById(`name${button.dataset.player}`);

        if (playerCard.classList.contains("confirmed")) {
            playerCard.classList.remove("confirmed");
            playerInput.disabled = false;
            button.disabled = false;
        } else {
            if (!playerInput.value.trim()) {
                alert("Please enter a name!");
                return;
            }

            playerCard.classList.add("confirmed");
            playerInput.disabled = true;
            button.disabled = true;
        }

        updateStartButton();
    });
});

// Updating the start button
function updateStartButton() {
    activePlayers = Array.from(playerCards)
        .filter((card) => card.classList.contains("confirmed"))
        .map((card) => card.querySelector("input").value.trim());

    startGameButton.disabled = activePlayers.length === 0 ||
        activePlayers.length !== Array.from(playerCards).filter((card) => card.classList.contains("active")).length;

    if (!startGameButton.disabled) {
        startGameButton.classList.add("active");
    } else {
        startGameButton.classList.remove("active");
    }
}






// when mooving to memory.html we need the names 
document.getElementById("start-game-button").addEventListener("click", () => {
    const activePlayers = Array.from(document.querySelectorAll(".player-card")) // let's create a array with the names
        .filter(card => card.classList.contains("confirmed")) // we will use filter to take only the confirmed ones
        .map(card => card.querySelector("input").value.trim());

    localStorage.setItem("memoryGamePlayers", JSON.stringify(activePlayers)); // we are saving the names in the localStorage
    window.location.href = "memory.html"; // mooving to the game where we will have the rest
});
