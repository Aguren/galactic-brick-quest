let sector = 1;
let bricks = 0;
let currentAnswer = 0;

const stories = [
  // Sector 1-5 (Act I)
  "Dark Commander Athen docks his Tie Fighter at Bay 1. Crack the laser door lock to breach the station:",
  "Athen enters the Command Deck. Red Sith alarms flash! Balance the force grid equation to bypass security:",
  "A rogue Trooper Droid blocks Athen's path. Decipher his number sequence code to force push him aside:",
  "Athen reaches the Secret Lego Armory. Solve the triple-code to unlock the dark kyber crystal storage:",
  "Athen reaches the Mid-Way Power Core! Rebuild the Sith energy cell to channel your Force powers:",
  
  // Sector 6-10 (Act II)
  "Athen steps into the Shadow Vault. The door requires a reverse force calculation to proceed:",
  "An ancient Sith Holocron floats in the air. Decode its mystery equation to reveal its knowledge:",
  "Athen reaches the Imperial Control Bridge. Solve the multi-boost sequence to override the station controls:",
  "The Reactor Core door is heavily shielded! Calculate the precise missing power number to blast it open:",
  "Athen enters the Final Sith Chamber! Connect the master kyber crystals to complete your Dark Side mastery!"
];

document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("start-btn").addEventListener("click", startGame);
  document.getElementById("play-again-btn").addEventListener("click", startGame);
  document.getElementById("continue-btn").addEventListener("click", continueMission);
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

  // 10 Math problems tailored for age 7
  if (sector === 1) {
    let num1 = getRandomInt(5, 12);
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
    let p1 = start, p2 = start + step, p3 = start + (step * 2);
    currentAnswer = start + (step * 3);
    qText = `Pattern: ${p1}, ${p2}, ${p3}, [ ? ]`;
  } else if (sector === 4) {
    let a = getRandomInt(2, 7);
    let b = getRandomInt(2, 7);
    let c = getRandomInt(2, 7);
    currentAnswer = a + b + c;
    qText = `${a} + ${b} + ${c} = ?`;
  } else if (sector === 5) {
    let start = getRandomInt(6, 12);
    let add = getRandomInt(4, 10);
    currentAnswer = add;
    qText = `${start} + [ ? ] = ${start + add}`;
  } else if (sector === 6) {
    let num1 = getRandomInt(15, 25);
    let num2 = getRandomInt(5, 12);
    currentAnswer = num1 - num2;
    qText = `${num1} - ${num2} = ?`;
  } else if (sector === 7) {
    let step = 10;
    let start = getRandomInt(1, 5) * 10;
    let p1 = start, p2 = start + step, p3 = start + (step * 2);
    currentAnswer = start + (step * 3);
    qText = `Pattern: ${p1}, ${p2}, ${p3}, [ ? ]`;
  } else if (sector === 8) {
    let a = getRandomInt(5, 10);
    let b = getRandomInt(5, 10);
    let c = getRandomInt(5, 10);
    currentAnswer = a + b + c;
    qText = `${a} + ${b} + ${c} = ?`;
  } else if (sector === 9) {
    let start = getRandomInt(10, 20);
    let add = getRandomInt(5, 15);
    currentAnswer = add;
    qText = `${start} + [ ? ] = ${start + add}`;
  } else if (sector === 10) {
    let num1 = getRandomInt(12, 20);
    let num2 = getRandomInt(12, 20);
    currentAnswer = num1 + num2;
    qText = `${num1} + ${num2} = ?`;
  }

  document.getElementById("puzzle-q").innerText = qText;

  let options = [currentAnswer];
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
    btn.className = "brick-btn red-btn";
    btn.innerText = opt;
    btn.onclick = () => checkAnswer(opt);
    optContainer.appendChild(btn);
  });
}

function checkAnswer(selected) {
  if (selected === currentAnswer) {
    bricks += 10;
    updateHUD();

    if (sector === 5) {
      triggerAnimation(5);
    } else if (sector === 10) {
      triggerAnimation(10);
    } else {
      sector++;
      updateHUD();
      alert("⚡ Force Surge! Door Unlocked (+10 Kyber Crystals)");
      loadLevel();
    }
  } else {
    alert("❌ The Force wobbles! Recalculate your math, Dark Commander.");
  }
}

function triggerAnimation(level) {
  showScreen("reward-screen");
  const blade = document.getElementById("saber-blade");
  blade.classList.remove("ignite");

  if (level === 5) {
    document.getElementById("reward-title").innerText = "⚡ MID-WAY POWER UNLOCKED! ⚡";
    document.getElementById("reward-text").innerText = 
      "Lord Athen has empowered his Sith Kyber Crystal! Red Lightsaber ignition sequence activated!";
  } else if (level === 10) {
    document.getElementById("reward-title").innerText = "👑 ULTIMATE SITH POWER! 👑";
    document.getElementById("reward-text").innerText = 
      "Lord Athen has conquered all 10 Sith Vaults! His Red Lightsaber is fully maxed out!";
  }

  // Trigger CSS transition
  setTimeout(() => {
    blade.classList.add("ignite");
  }, 200);
}

function continueMission() {
  if (sector === 5) {
    sector = 6;
    updateHUD();
    showScreen("game-screen");
    loadLevel();
  } else if (sector === 10) {
    document.getElementById("win-text").innerText = 
      `All hail Lord Athen! You collected ${bricks} Sith Kyber Crystals, completed all 10 missions, and built the ultimate Dark Side Lego Starship!`;
    showScreen("win-screen");
  }
}