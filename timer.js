const timeh = document.querySelector("h2");
let timesecond = localStorage.getItem("startTime") || 5;

displaytime(timesecond);

const countdown = setInterval(() => {
  timesecond--;
  displaytime(timesecond);
  if (timesecond <= 0 || timesecond < 1) {
    clearInterval(countdown);
    endtime(score);
  }
}, 1000);

function displaytime(sec) {
  const min = Math.floor(sec / 60);
  const second = Math.floor(sec % 60);
  timeh.innerHTML = `${min < 10 ? "0" : ""}${min}:${
    second < 10 ? "0" : ""
  }${second}`;
}

function endtime(score) {
  const crosswordContainer = document.querySelector(".Tab");
  const form = document.querySelector("form");
  const content = document.getElementById("content");
  const header = document.querySelector("header");
  header.style.display = "none";
  crosswordContainer.style.display = "none";
  form.style.display = "none";
  content.style.display = "none";
  const finishBtn = document.getElementById("finishBtn");
  finishBtn.style.display = "none";

  const timeoutContainer = document.createElement("div");
  timeoutContainer.style.display = "flex";
  timeoutContainer.style.flexDirection = "column";
  timeoutContainer.style.alignItems = "center";
  timeoutContainer.style.justifyContent = "center";
  timeoutContainer.style.position = "fixed";
  timeoutContainer.style.top = "10%";
  timeoutContainer.style.right = "0";
  timeoutContainer.style.bottom = "-50px";
  timeoutContainer.style.left = "0";
  timeoutContainer.style.zIndex = "9999";

  const timeoutMessage = document.createElement("div");
  timeoutMessage.textContent = `TIME OUT - Your Score: ${score}`;
  timeoutMessage.classList.add("results-text");
  timeoutMessage.style.fontSize = "2.0em";
  timeoutMessage.style.textAlign = "center";
  timeoutContainer.appendChild(timeoutMessage);

  const userName = prompt("Enter your name:");
  if (userName) {
    usersData.push({ name: userName, score: score });

    // Sort and display rankings
    sortUsersByScore();
    displayRankingsAndScores();

    // Save user data
    saveUserData();
  }

  const showScoreboardButton = document.createElement("button");
  showScoreboardButton.textContent = "Show Scoreboard";
  showScoreboardButton.id = "showScoreboard1";

  showScoreboardButton.addEventListener("click", function () {
    window.location.href = "score.html";
  });

  timeoutContainer.appendChild(showScoreboardButton);
  document.body.appendChild(timeoutContainer);
}

function clearScoreboard() {
  const password = prompt("Enter the password to clear the scoreboard:");

  // Check if the password is correct (replace 'your_password_here' with your actual password)
  if (password === "Techczar@2023") {
    usersData = [];
    saveUserData();
    displayRankingsAndScores();
    alert("Scoreboard cleared successfully.");
  } else {
    alert("Incorrect password. Scoreboard not cleared.");
  }
}
function saveStartTime() {
  localStorage.setItem("startTime", timesecond);
}

window.addEventListener("beforeunload", saveStartTime);
