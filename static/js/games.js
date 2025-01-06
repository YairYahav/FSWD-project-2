const gamesSection = document.getElementById("games");

function displayGames() {
  for (const game of GAMES) {
    const gameCard = document.createElement("a");
    gameCard.classList.add("card");

    const cardContent = document.createElement("div");
    cardContent.classList.add("card-content");
    const gameName = document.createElement("h3");
    gameName.textContent = game;
    cardContent.append(gameName);

    let gameImg;
    if (game === "unders development") {
      gameImg = document.createElement("img");
      gameImg.src = "../static/pictures/under-dev.png";
    } else {
      const gameLink = `${game !== "memory" ? game : "startMemoryGame"}.html`;
      gameCard.href = gameLink;

      gameImg = document.createElement("iframe");
      gameImg.style.border = "0";
      gameImg.src = gameLink;

      // score section
      const scores = document.createElement("div");
      scores.classList.add("scores");

      const leader = document.createElement("p");
      const leaderSpan = document.createElement("span");
      leaderSpan.textContent = "Leader: ";
      leaderSpan.style.fontWeight = "bold";
      leader.append(leaderSpan);
      const highestScore = getHighestScore(game);
      leader.append(highestScore.name + " " + highestScore.score);

      const userHighest = document.createElement("p");
      const uhs = document.createElement("span");
      uhs.style.fontWeight = "bold";
      uhs.textContent = "Your highest score: ";
      userHighest.append(uhs);
      userHighest.append(getCurrHighestScore(game));

      scores.append(leader);
      scores.append(userHighest);
      cardContent.append(scores);
    }

    gameCard.append(gameImg);
    gameCard.append(cardContent);

    gamesSection.append(gameCard);
  }
}

displayGames();
