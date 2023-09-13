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
  const params = new URLSearchParams(window.location.search);
  const name = params.get("name");
  const email = params.get("email");

  const crosswordContainer = document.querySelector(".Tab");
  const form = document.querySelector("form");
  const content = document.getElementById("content");
  const header = document.querySelector("header");
  const hints = document.getElementById("hints");
  header.style.display = "none";
  crosswordContainer.style.display = "none";
  form.style.display = "none";
  content.style.display = "none";
  const finishBtn = document.getElementById("finishBtn");
  finishBtn.style.display = "none";
  hints.style.display = "none";

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

  updateScore(name, email, score);

  const showScoreboardBtn = document.createElement("button");
  showScoreboardBtn.textContent = "Show Scoreboard";
  showScoreboardBtn.classList.add("scoreboard-btn");
  showScoreboardBtn.style.margin = "0%";
  showScoreboardBtn.addEventListener("click", showScoreboard);
  timeoutContainer.appendChild(showScoreboardBtn);
  document.body.appendChild(timeoutContainer);
}

function showScoreboard() {
  // Show the scoreboard container
  document.getElementById("scoreboard").style.display = "block";

  // Reference to your Firebase database
  const scoresRef = CrossDB.orderByChild("score");

  // Fetch the top scores
  scoresRef.once("value", (snapshot) => {
    const topScoresList = document.getElementById("topScores");
    topScoresList.innerHTML = "";

    const scoresArray = [];

    snapshot.forEach((childSnapshot) => {
      const userData = childSnapshot.val();
      const name = userData.name;
      const score = userData.score;
      scoresArray.push({ name, score });
    });

    scoresArray.sort((a, b) => b.score - a.score);

    scoresArray.forEach((item) => {
      const listItem = document.createElement("li");
      listItem.textContent = `${item.name}: ${item.score}`;
      listItem.style.fontSize = "large";
      listItem.style.color = "black";
      topScoresList.appendChild(listItem);
    });
  });
}

function saveStartTime() {
  localStorage.setItem("startTime", timesecond);
}

window.addEventListener("beforeunload", saveStartTime);
