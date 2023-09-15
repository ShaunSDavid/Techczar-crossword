document.addEventListener("DOMContentLoaded", function () {
  const registrationContainer = document.querySelector(".container-cross");
  const accessDate = new Date(registrationContainer.dataset.accessDate);
  const endDate = new Date(registrationContainer.dataset.endDate); // Add this line
  const now = new Date();

  if (now < accessDate) {
    // If the current date is before the access date, disable the registration form
    const form = document.getElementById("signupForm");
    form.innerHTML = `<p style="color:black; padding-left:30px;">Registration will be available on ${accessDate.toLocaleString()}.</p>`;
  } else if (now > endDate) {
    // If the current date is after the end date, display a message
    const form = document.getElementById("signupForm");
    form.innerHTML = `<p style="color:black; padding-left:10px;">Event has Ended.</p>`;
  }
});

function submitForm(event) {
  event.preventDefault();

  const name = document.getElementById("name").value;
  const email = document.getElementById("email").value;

  // Check if the email exists in the database
  CrossDB.orderByChild("email")
    .equalTo(email)
    .once("value")
    .then((snapshot) => {
      if (snapshot.exists()) {
        alert("You have already attempted the quiz.");
        return;
      } else {
        // New user, start with a score of 0
        score = 0;
        window.location.href = `crossword.html?name=${name}&email=${email}`;
      }
    });
}

let score = 0;
let usersData = [];

function checkCompletion() {
  const cells = document.querySelectorAll("td");
  let allAnswersCorrect = true;
  for (const cell of cells) {
    if (cell.classList.length > 0 && cell.style.color !== "black") {
      allAnswersCorrect = false;
      break;
    }
  }

  if (allAnswersCorrect) {
    puzzleCompleted = true;
    alert("Congratulations! You've completed the entire puzzle.");
    disableForm();
  }
}

function checkAnswer(event) {
  event.preventDefault();
  console.log("Function executed");
  const clueNumber = document.getElementById("clueNumber").value;
  const answer = document.getElementById("answer").value.trim().toLowerCase();

  const correctAnswer = answers[clueNumber];

  if (correctAnswer && answer === correctAnswer) {
    const cells = document.querySelectorAll("td");
    for (const cell of cells) {
      if (cell.classList.contains(`'${correctAnswer}'`)) {
        cell.style.color = "black";
      }
    }
    score += 5;
    checkCompletion();
  } else {
    alert("Wrong answer. Please try again.");
  }

  document.getElementById("clueNumber").value = "";
  document.getElementById("answer").value = "";

  return false;
}

function finishPuzzle() {
  clearInterval(countdown);
  const timeTaken = 480 - timesecond;
  const crosswordContainer = document.querySelector(".Tab");
  const form = document.querySelector("form");
  const content = document.getElementById("content");
  const hints = document.getElementById("hints");
  crosswordContainer.style.display = "none";
  form.style.display = "none";
  content.style.display = "none";
  hints.style.display = "none";

  const resultsMessage = document.createElement("div");
  resultsMessage.innerHTML = `Time Taken: ${Math.floor(timeTaken / 60)} mins ${
    timeTaken % 60
  } secs<br/>Your Score: ${score}`;
  resultsMessage.classList.add("results-text");
  resultsMessage.style.fontSize = "2.0em";
  resultsMessage.style.textAlign = "center";
  document.body.appendChild(resultsMessage);
  const finishBtn = document.getElementById("finishBtn");
  finishBtn.style.display = "none";

  const params = new URLSearchParams(window.location.search);
  const name = params.get("name");
  const email = params.get("email");

  // Call updateScore function here
  updateScore(name, email, score);

  // Show the "Show Scoreboard" button
  const showScoreboardBtn = document.getElementById("showScoreboard");
  showScoreboardBtn.style.display = "block";
  showScoreboardBtn.style.margin = "0%";
}

function showScoreboard() {
  // Show the scoreboard container
  document.getElementById("scoreboard").style.display = "block";

  // Reference to your Firebase database
  const scoresRef = CrossDB.orderByChild("score"); // Limit to the top 3 scores in ascending order

  // Fetch the top scores
  scoresRef.once("value", (snapshot) => {
    const topScoresList = document.getElementById("topScores");
    topScoresList.innerHTML = ""; // Clear previous scores

    const scoresArray = []; // Store scores in an array

    snapshot.forEach((childSnapshot) => {
      const userData = childSnapshot.val();
      const name = userData.name;
      const score = userData.score;
      scoresArray.push({ name, score }); // Push each score to the array
    });

    // Sort the scores in descending order
    scoresArray.sort((a, b) => b.score - a.score);

    // Create list items for the sorted scores
    scoresArray.forEach((item) => {
      const listItem = document.createElement("li");
      listItem.textContent = `${item.name}: ${item.score}`;
      listItem.style.fontSize = "large";
      listItem.style.color = "black";
      topScoresList.appendChild(listItem);
    });
  });
}

const firebaseConfig = {
  apiKey: "AIzaSyDFjHUU6aEXYx8Xu4oI0gRmoZ3IJfBaJhw",
  authDomain: "techczar-cross.firebaseapp.com",
  databaseURL: "https://techczar-cross-default-rtdb.firebaseio.com",
  projectId: "techczar-cross",
  storageBucket: "techczar-cross.appspot.com",
  messagingSenderId: "1021179059862",
  appId: "1:1021179059862:web:b6450d60ec83151327acb7",
};
firebase.initializeApp(firebaseConfig);
const CrossDB = firebase.database().ref("signupForm");

function updateScore(name, email, score) {
  CrossDB.push().set({
    name: name,
    email: email,
    score: score,
  });
}
const answers = {
  1: "firewall",
  2: "wizard",
  3: "forbidden",
  4: "scrollsql",
  5: "cookies",
  6: "shield",
  7: "python",
  8: "soulstack",
  9: "spellcode",
};
