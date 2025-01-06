const signupPasswordInput = document.getElementById("signup-password");
const confirmPasswordInput = document.getElementById("signup-confirm-password");
const signupForm = document.getElementById("signup-form");
const loginForm = document.getElementById("login-form");
const submitBtn = loginForm.querySelector("button");
const blockedDiv = loginForm.querySelector(".blocked");

confirmPasswordInput.addEventListener("input", (e) => {
  if (e.target.value !== signupPasswordInput.value) {
    confirmPasswordInput.className = "error";
  } else {
    confirmPasswordInput.className = "success";
  }
});

signupForm.addEventListener("submit", signup);
loginForm.addEventListener("submit", login);

function signup(e) {
  e.preventDefault();

  const formDate = new FormData(e.target);
  if (formDate.get("password") !== formDate.get("confirm-password")) {
    alert("Passwords dons't match");
    return;
  }

  const newUser = Object.fromEntries(formDate.entries());
  const users = JSON.parse(localStorage.getItem("users")) || [];
  const userExist = users.some((user) => user.username === newUser.username);

  if (userExist) {
    alert(
      `User with username ${newUser.username} already exits. login or choose different username.`
    );
  } else {
    users.push(newUser);
    localStorage.setItem("users", JSON.stringify(users));
    sessionStorage.setItem("current-user", newUser.username);
    window.location = "./games.html";
  }
}

let attempts = 2;
function login(e) {
  e.preventDefault();

  if (attempts <= 0) {
    submitBtn.disabled = true;
    blockedDiv.classList.remove("hide");

    setTimeout(() => {
      blockedDiv.classList.add("hide");
      submitBtn.disabled = false;
      attempts = 3;
    }, 5 * 60 * 1000);
  }

  const formDate = new FormData(e.target);
  const username = formDate.get("username");
  const password = formDate.get("password");

  const users = JSON.parse(localStorage.getItem("users"));
  console.log(users)
  let user = null
  if (users)
    user = users.find((user) => user.username === username);

  if (!users || !user) {
    alert(
      `User with username ${username} dosn't exits. \n${
        attempts !== 0
          ? `You have ${attempts} more attempts.`
          : "You are blocked."
      }`
    );
    attempts--;
  } else if (user.password !== password) {
    alert(
      `Wrong password. \n${
        attempts !== 0
          ? `You have ${attempts} more attempts.`
          : "You are blocked."
      }`
    );
    attempts--;
  } else {
    sessionStorage.setItem("current-user", username);
    window.location = "./games.html";
  }
}