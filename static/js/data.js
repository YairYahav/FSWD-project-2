const GAMES = [
    "simon",
    "startMemoryGame",
    "unders development",
    "unders development",
    "unders development",
    "unders development",
  ];
  
  function getItem(key) {
    const item = localStorage.getItem(key);
    if (!item) return null;
    return JSON.parse(item);
  }
  
  function setItem(key, val) {
    localStorage.setItem(key, JSON.stringify(val));
  }
  
  function getScores(game) {
    const scores = getItem("scores");
    return scores?.[game] || [];
  }
  
  function setScores(newScores) {
    setItem("scores", newScores);
  }
  
  function getCurrUser() {
    return sessionStorage.getItem("current-user");
  }
  
  function getCurrGame() {
    return window.location.pathname.split("/").at(-1).split(".")[0];
  }
  
  function getHighestScore(game) {
    const scores = getScores(game);
    if (!scores?.length) {
      return { name: "maybe you", score: 0 };
    }
    return scores.sort((a, b) => b.score - a.score)?.[0];
  }
  
  function getCurrHighestScore(game) {
    const scores = getScores(game);
    const currUser = getCurrUser();
  
    return (
      scores
        .filter((s) => s.name === currUser)
        .sort((a, b) => b.score - a.score)?.[0]?.score || 0
    );
  }
  
  function saveScore(score) {
    const currGame = getCurrGame();
    const prevScores = getItem("scores");
  
    const userScore = { name: getCurrUser(), score };
    prevScores[currGame].push(userScore);
  
    setScores(prevScores);
  }
  
  function logout() {
    sessionStorage.removeItem("current-user");
    window.location.href = "/html/login.html";
  }
  
  function initDS() {
    let scores = getItem("scores");
    if (!scores) {
      scores = GAMES.reduce((acc, c) => {
        if (c !== "unders development") {
          acc[c] = [];
        }
  
        return acc;
      }, {});
      setItem("scores", scores);
    }
  }
  
  initDS();