let sector = 1;
let bricks = 0;
let currentAnswer = 0;
let forceCharge = 0;
let bossHP = 100;
let isBossSector = false;

// Audio Synthesizer optimized for iOS Safari Web Audio Policy
const AudioContext = window.AudioContext || window.webkitAudioContext;
let audioCtx = null;

function unlockAudioContext() {
  if (!audioCtx) {
    audioCtx = new AudioContext();
  }
  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
}

function playSound(type) {
  if (!audioCtx) return;
  
  const osc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();
  osc.connect(gain);
  gain.connect(audioCtx.destination);

  const now = audioCtx.currentTime;

  if (type === 'saber') {
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(450, now);
    osc.frequency.exponentialRampToValueAtTime(110, now + 0.3);
    gain.gain.setValueAtTime(0.35, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.3);
    osc.start(now);
    osc.stop(now + 0.3);
  } else if (type === 'force') {
    osc.type = 'square';
    osc.frequency.setValueAtTime(850, now);
    osc.frequency.setValueAtTime(250, now + 0.1);
    osc.frequency.setValueAtTime(650, now + 0.2);
    gain.gain.setValueAtTime(0.25, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.4);
    osc.start(now);
    osc.stop(now + 0.4);
  } else if (type === 'click') {
    osc.type = 'sine';
    osc.frequency.setValueAtTime(600, now);
    gain.gain.setValueAtTime(0.15, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.05);
    osc.start(now);
    osc.stop(now + 0.05);
  } else if (type === 'wrong') {
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(140, now);
    osc.frequency.setValueAtTime(70, now + 0.15);
    gain.gain.setValueAtTime(0.3, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.3);
    osc.start(now);
    osc.stop(now + 0.3);
  }
}

const stories = [
  "Dark Commander Athen docks his Tie Fighter at Bay 1. Crack the laser door lock to breach the station:",
  "Athen enters the Command Deck. Red Sith alarms flash! Balance the force grid equation to bypass security:",
  "A rogue Trooper Droid blocks Athen's path. Decipher his number sequence code to force push him aside:",
  "Athen reaches the Secret Lego Armory. Solve the triple-code to unlock the dark kyber crystal storage:",
  "⚡ BOSS BATTLE: Grand Master Yoda blocks Sector 5! Strike him with math answers to drain his HP!",
  "Athen steps into the Shadow Vault. The door requires a reverse force calculation to proceed:",
  "An ancient Sith Holocron floats in the air. Decode its mystery equation to reveal its knowledge:",
  "Athen reaches the Imperial Control Bridge. Solve the multi-boost sequence to override the station controls:",
  "The Reactor Core door is heavily shielded! Calculate the precise missing power number to blast it open:",
  "⚡ FINAL BOSS BATTLE: The Ancient Jedi Sentinel guards the Core! Strike with full Dark Side power!"
];

document.addEventListener("DOMContentLoaded", () => {
  // Bind both click and touchstart for instant response on iPad
  const startBtn = document.getElementById("start-btn");
  const playAgainBtn = document.getElementById("play-again-btn");
  const continueBtn = document.getElementById("continue-btn");
  const forceBtn = document.getElementById("force-btn");

  const bindTouch = (el, handler) => {
    el.addEventListener("touchstart", (e) => {
      e.preventDefault();
      unlockAudioContext();
      handler(e);
    }, { passive: false });
    el.addEventListener("click", (e) => {
      unlockAudioContext();
      handler(e);
    });
  };

  bindTouch(startBtn, startGame);
  bindTouch(playAgainBtn, startGame);
  bindTouch(continueBtn, continueMission);
  bindTouch(forceBtn, useForceLightning);
});

function startGame() {
  sector = 1;
  bricks = 0;
  forceCharge = 0;
  updateHUD();
  showScreen("game-screen");
  loadLevel();
}

function updateHUD() {
  document.getElementById("sector-val").innerText = sector;
  document.getElementById("bricks-val").innerText = bricks;
  
  const forceBtn = document.getElementById("force-btn");
  if (forceCharge >= 2) {
    forceBtn.disabled = false;
    forceBtn.innerText = "⚡ Force Lightning (READY!)";
  } else {
    forceBtn.disabled = true;
    forceBtn.innerText = `⚡ Force Lightning (${forceCharge}/2)`;
  }
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
  
  const bossBox = document.getElementById("boss-container");
  if (sector === 5 || sector === 10) {
    isBossSector = true;
    bossHP = 100;
    bossBox.classList.remove("hidden");
    document.getElementById("boss-name").innerText = sector === 5 ? "💥 BOSS: Grand Master Yoda" : "💥 FINAL BOSS: Ancient Jedi Sentinel";
    updateBossHP();
  } else {
    isBossSector = false;
    bossBox.classList.add("hidden");
  }

  let qText = "";

  if (sector === 1) {
    let num1 = getRandomInt(5, 12), num2 = getRandomInt(3, 10);
    currentAnswer = num1 + num2;
    qText = `${num1} + ${num2} = ?`;
  } else if (sector === 2) {
    let num1 = getRandomInt(10, 20), num2 = getRandomInt(2, 8);
    currentAnswer = num1 - num2;
    qText = `${num1} - ${num2} = ?`;
  } else if (sector === 3) {
    let step = getRandomInt(2, 5), start = getRandomInt(1, 5);
    currentAnswer = start + (step * 3);
    qText = `Pattern: ${start}, ${start + step}, ${start + (step * 2)}, [ ? ]`;
  } else if (sector === 4) {
    let a = getRandomInt(2, 6), b = getRandomInt(2, 6), c = getRandomInt(2, 6);
    currentAnswer = a + b + c;
    qText = `${a} + ${b} + ${c} = ?`;
  } else if (sector === 5) {
    let num1 = getRandomInt(6, 12), num2 = getRandomInt(5, 10);
    currentAnswer = num1 + num2;
    qText = `BOSS STRIKE: ${num1} + ${num2} = ?`;
  } else if (sector === 6) {
    let num1 = getRandomInt(15, 25), num2 = getRandomInt(5, 12);
    currentAnswer = num1 - num2;
    qText = `${num1} - ${num2} = ?`;
  } else if (sector === 7) {
    let step = 10, start = getRandomInt(1, 4) * 10;
    currentAnswer = start + 30;
    qText = `Pattern: ${start}, ${start + 10}, ${start + 20}, [ ? ]`;
  } else if (sector === 8) {
    let a = getRandomInt(5, 10), b = getRandomInt(5, 10), c = getRandomInt(5, 10);
    currentAnswer = a + b + c;
    qText = `${a} + ${b} + ${c} = ?`;
  } else if (sector === 9) {
    let start = getRandomInt(10, 20), add = getRandomInt(5, 15);
    currentAnswer = add;
    qText = `${start} + [ ? ] = ${start + add}`;
  } else if (sector === 10) {
    let num1 = getRandomInt(10, 20), num2 = getRandomInt(10, 20);
    currentAnswer = num1 + num2;
    qText = `FINAL STRIKE: ${num1} + ${num2} = ?`;
  }

  document.getElementById("puzzle-q").innerText = qText;

  let options = [currentAnswer];
  while (options.length < 4) {
    let wrong = currentAnswer + getRandomInt(-4, 4);
    if (wrong > 0 && !options.includes(wrong)) options.push(wrong);
  }
  
  options.sort(() => Math.random() - 0.5);

  const optContainer = document.getElementById("options-container");
  optContainer.innerHTML = "";
  options.forEach(opt => {
    const btn = document.createElement("button");
    btn.className = "lego-btn option-btn";
    btn.innerText = opt;
    
    // Bind touch for zero delay on iPad
    btn.addEventListener("touchstart", (e) => {
      e.preventDefault();
      unlockAudioContext();
      checkAnswer(opt, e.touches[0]);
    }, { passive: false });

    btn.addEventListener("click", (e) => {
      unlockAudioContext();
      checkAnswer(opt, e);
    });

    optContainer.appendChild(btn);
  });
}

function updateBossHP() {
  document.getElementById("boss-hp-inner").style.width = `${bossHP}%`;
}

function checkAnswer(selected, touchEvent) {
  if (selected === currentAnswer) {
    bricks += 10;
    if (forceCharge < 2) forceCharge++;
    updateHUD();

    playSound('saber');
    triggerSlashFX();

    const x = touchEvent.clientX || window.innerWidth / 2;
    const y = touchEvent.clientY || window.innerHeight / 2;
    triggerFloatingText("+10 KYBER!", x, y);

    if (isBossSector) {
      bossHP -= 50;
      updateBossHP();
      if (bossHP <= 0) {
        setTimeout(() => {
          if (sector === 5) triggerAnimation(5);
          else if (sector === 10) triggerAnimation(10);
        }, 500);
        return;
      }
    }

    if (!isBossSector) {
      sector++;
      setTimeout(loadLevel, 400);
    } else {
      setTimeout(loadLevel, 400);
    }
  } else {
    playSound('wrong');
    const container = document.getElementById("game-container");
    container.classList.add("shake");
    setTimeout(() => container.classList.remove("shake"), 400);
  }
}

function triggerSlashFX() {
  const slash = document.getElementById("slash-fx");
  slash.classList.add("active-slash");
  setTimeout(() => slash.classList.remove("active-slash"), 350);
}

function triggerFloatingText(text, x, y) {
  const el = document.createElement("div");
  el.className = "floating-text";
  el.innerText = text;
  el.style.left = `${x - 50}px`;
  el.style.top = `${y - 50}px`;
  document.getElementById("floating-text-container").appendChild(el);
  setTimeout(() => el.remove(), 1200);
}

function useForceLightning() {
  if (forceCharge < 2) return;
  forceCharge = 0;
  updateHUD();
  playSound('force');

  const buttons = document.querySelectorAll(".option-btn");
  let removed = 0;
  buttons.forEach(btn => {
    if (parseInt(btn.innerText) !== currentAnswer && removed < 2) {
      btn.style.visibility = "hidden";
      removed++;
    }
  });
}

function triggerAnimation(level) {
  showScreen("reward-screen");
  const blade = document.getElementById("saber-blade");
  blade.classList.remove("ignite");

  if (level === 5) {
    document.getElementById("reward-title").innerText = "⚡ MID-WAY POWER UNLOCKED! ⚡";
    document.getElementById("reward-text").innerText = 
      "Lord Athen has defeated Yoda and empowered his Sith Kyber Crystal! Red Lightsaber ignition activated!";
  } else if (level === 10) {
    document.getElementById("reward-title").innerText = "👑 ULTIMATE SITH POWER! 👑";
    document.getElementById("reward-text").innerText = 
      "Lord Athen has conquered all 10 Sith Vaults and defeated the Ancient Sentinel!";
  }

  setTimeout(() => blade.classList.add("ignite"), 200);
}

function continueMission() {
  if (sector === 5) {
    sector = 6;
    updateHUD();
    showScreen("game-screen");
    loadLevel();
  } else if (sector === 10) {
    document.getElementById("win-text").innerText = 
      `All hail Supreme Dark Jedi Athen! You collected ${bricks} Sith Kyber Crystals, completed all 10 missions, and built the ultimate Dark Side Lego Starship!`;
    showScreen("win-screen");
  }
}