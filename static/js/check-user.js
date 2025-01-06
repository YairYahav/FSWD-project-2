function checkForUser() {
    const currUser = sessionStorage.getItem("current-user");
    if (!currUser) {
      window.location = "./login.html";
    }
  }
  
  checkForUser();