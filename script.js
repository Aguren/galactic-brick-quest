let sector = 1;
let bricks = 0;
let currentAnswer = 0;

const stories = [
  "You dock your X-Wing outside Docking Bay A. The door is locked by a laser brick code! Solve the math sequence to power the door lock:",
  "You step into the Main Control Room. Red warning lights are flashing! To clear the mystery signal, balance the power grid equation:",
  "A rogue Astro-Droid blocks the bridge! He speaks in pattern codes. Find the missing brick number to pass him:",
  "You reached the Secret Brick Vault! The ancient alien lock needs a double-boost calculation to unlock the vault doors:",
  "You enter the Central Reactor Core! Reconnect the energy bricks to rebuild the power core and solve the mystery!"
];

document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("start-btn").addEventListener("click", startGame);
  document.getElementById("play-again-btn").addEventListener("click", startGame);
});

function startGame() {
  sector = 1;
  bricks = 0;
  updateHUD();
  showScreen("game-screen");
  loadLevel();
}

function updateHUD() {
  document.getElementById("sector-val").innerText = sector;
  document.getElementById("bricks-val").innerText = bricks;
}

function showScreen(id) {
  document.querySelectorAll(".screen").forEach(s => s.classList.remove("active"));
  document.getElementById(id).classList.add("active");
}

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function loadLevel() {
  document.getElementById("story-text").innerText = stories[sector - 1];
  
  let qText = "";
  let options = [];

  if (sector === 1) {
    let num1 = getRandomInt(4, 12);
    let num2 = getRandomInt(3, 10);
    currentAnswer = num1 + num2;
    qText = `${num1} + ${num2} = ?`;
  } else if (sector === 2) {
    let num1 = getRandomInt(10, 20);
    let num2 = getRandomInt(2, 8);
    currentAnswer = num1 - num2;
    qText = `${num1} - ${num2} = ?`;
  } else if (sector === 3) {
    let step = getRandomInt(2, 5);
    let start = getRandomInt(1, 5);
    let p1 = start;
    let p2 = start + step;
    let p3 = start + (step * 2);
    currentAnswer = start + (step * 3);
    qText = `Pattern: ${p1}, ${p2}, ${p3}, [ ? ]`;
  } else if (sector === 4) {
    let a = getRandomInt(2, 6);
    let b = getRandomInt(2, 6);
    let c = getRandomInt(2, 6);
    currentAnswer = a + b + c;
    qText = `${a} + ${b} + ${c} = ?`;
  } else if (sector === 5) {
    let start = getRandomInt(5, 12);
    let add = getRandomInt(4, 10);
    let total = start + add;
    currentAnswer = add;
    qText = `${start} + [ ? ] = ${total}`;
  }

  document.getElementById("puzzle-q").innerText = qText;

  options = [currentAnswer];
  while (options.length < 4) {
    let wrong = currentAnswer + getRandomInt(-4, 4);
    if (wrong > 0 && !options.includes(wrong)) {
      options.push(wrong);
    }
  }
  
  options.sort(() => Math.random() - 0.5);

  const optContainer = document.getElementById("options-container");
  optContainer.innerHTML = "";
  options.forEach(opt => {
    const btn = document.createElement("button");
    btn.className = "brick-btn blue-btn";
    btn.innerText = opt;
    btn.onclick = () => checkAnswer(opt);
    optContainer.appendChild(btn);
  });
}

function checkAnswer(selected) {
  if (selected === currentAnswer) {
    bricks += 10;
    sector++;
    updateHUD();

    if (sector > 5) {
      document.getElementById("win-text").innerText = 
        `Master Builder! You collected ${bricks} energy bricks and restored power to Sector 7. You discovered the secret blueprint for the Millennium Brick Falcon!`;
      showScreen("win-screen");
    } else {
      alert("🔓 Access Granted! +10 Lego Energy Bricks collected.");
      loadLevel();
    }
  } else {
    alert("⚡ Power glitch! Double check your math and try again.");
  }
}