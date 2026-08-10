const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

// Game State Variables
let gameRunning = false;
let crystalsCollected = 0;
let keycards = 0;
let activeDoor = null;

// Player Setup (Dark Commander Athen)
const player = {
  x: 50,
  y: 180,
  width: 24,
  height: 24,
  speed: 3,
  dx: 0,
  dy: 0,
  isAttacking: false,
  attackTimer: 0
};

// Collectible Kyber Crystals
let crystals = [
  { x: 120, y: 80, collected: false },
  { x: 280, y: 280, collected: false },
  { x: 420, y: 100, collected: false }
];

// Patrol Droids (Enemies)
let droids = [
  { x: 200, y: 100, width: 22, height: 22, dirY: 2, minY: 50, maxY: 300 },
  { x: 380, y: 250, width: 22, height: 22, dirY: -2, minY: 80, maxY: 320 }
];

// Security Blast Doors (Require Math Lock)
let blastDoor = {
  x: 480,
  y: 140,
  width: 20,
  height: 100,
  locked: true,
  problem: { q: "8 + 6", answer: 14, options: [12, 14, 15, 16] }
};

// Audio Synthesizer
const AudioContext = window.AudioContext || window.webkitAudioContext;
let audioCtx = null;

function initAudio() {
  if (!audioCtx) audioCtx = new AudioContext();
  if (audioCtx.state === 'suspended') audioCtx.resume();
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
    osc.frequency.setValueAtTime(500, now);
    osc.frequency.exponentialRampToValueAtTime(100, now + 0.2);
    gain.gain.setValueAtTime(0.3, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.2);
    osc.start(now);
    osc.stop(now + 0.2);
  } else if (type === 'crystal') {
    osc.type = 'sine';
    osc.frequency.setValueAtTime(800, now);
    osc.frequency.setValueAtTime(1200, now + 0.1);
    gain.gain.setValueAtTime(0.2, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.2);
    osc.start(now);
    osc.stop(now + 0.2);
  }
}

// Input Handlers (Keyboard + iPad Touch Controls)
const keys = {};

window.addEventListener("keydown", (e) => {
  keys[e.key] = true;
  if (e.key === " ") triggerSaberAttack();
});
window.addEventListener("keyup", (e) => keys[e.key] = false);

function bindDPadButton(id, dx, dy) {
  const el = document.getElementById(id);
  const startHandler = (e) => { e.preventDefault(); initAudio(); player.dx = dx * player.speed; player.dy = dy * player.speed; };
  const endHandler = (e) => { e.preventDefault(); player.dx = 0; player.dy = 0; };
  
  el.addEventListener("touchstart", startHandler, { passive: false });
  el.addEventListener("touchend", endHandler, { passive: false });
  el.addEventListener("mousedown", startHandler);
  el.addEventListener("mouseup", endHandler);
}

bindDPadButton("btn-up", 0, -1);
bindDPadButton("btn-down", 0, 1);
bindDPadButton("btn-left", -1, 0);
bindDPadButton("btn-right", 1, 0);

document.getElementById("btn-action").addEventListener("click", () => { initAudio(); triggerSaberAttack(); });
document.getElementById("start-game-btn").addEventListener("click", () => {
  initAudio();
  document.getElementById("start-overlay").classList.add("hidden");
  gameRunning = true;
  gameLoop();
});

function triggerSaberAttack() {
  if (!player.isAttacking) {
    player.isAttacking = true;
    player.attackTimer = 12;
    playSound('saber');
  }
}

// Game Loop Functions
function update() {
  if (!gameRunning) return;

  // Keyboard Movement
  if (keys["ArrowUp"] || keys["w"]) player.dy = -player.speed;
  else if (keys["ArrowDown"] || keys["s"]) player.dy = player.speed;
  else if (!player.dx) player.dy = 0;

  if (keys["ArrowLeft"] || keys["a"]) player.dx = -player.speed;
  else if (keys["ArrowRight"] || keys["d"]) player.dx = player.speed;
  else if (!player.dy) player.dx = 0;

  // Move Player & Clamp inside walls
  player.x += player.dx;
  player.y += player.dy;
  player.x = Math.max(10, Math.min(canvas.width - player.width - 10, player.x));
  player.y = Math.max(10, Math.min(canvas.height - player.height - 10, player.y));

  // Handle Saber Attack Animation
  if (player.isAttacking) {
    player.attackTimer--;
    if (player.attackTimer <= 0) player.isAttacking = false;
  }

  // Patrol Droids Logic
  droids.forEach(d => {
    d.y += d.dirY;
    if (d.y <= d.minY || d.y >= d.maxY) d.dirY *= -1;

    // Check collision with player attack
    if (player.isAttacking && Math.abs(player.x - d.x) < 40 && Math.abs(player.y - d.y) < 40) {
      d.x = -100; // Destroy droid!
    }
  });

  // Collect Kyber Crystals
  crystals.forEach(c => {
    if (!c.collected && Math.abs(player.x - c.x) < 20 && Math.abs(player.y - c.y) < 20) {
      c.collected = true;
      crystalsCollected += 10;
      document.getElementById("kyber-count").innerText = crystalsCollected;
      playSound('crystal');
    }
  });

  // Check Blast Door Proximity Trigger
  if (blastDoor.locked && player.x + player.width >= blastDoor.x - 10 && Math.abs(player.y - blastDoor.y) < 60) {
    player.x = blastDoor.x - player.width - 12; // Stop player movement
    triggerDoorHack();
  }
}

function triggerDoorHack() {
  gameRunning = false;
  const overlay = document.getElementById("hack-overlay");
  overlay.classList.remove("hidden");
  
  document.getElementById("math-problem").innerText = `${blastDoor.problem.q} = ?`;
  const optContainer = document.getElementById("hack-options");
  optContainer.innerHTML = "";

  blastDoor.problem.options.forEach(opt => {
    const btn = document.createElement("button");
    btn.className = "lego-btn";
    btn.innerText = opt;
    btn.onclick = () => {
      if (opt === blastDoor.problem.answer) {
        blastDoor.locked = false;
        overlay.classList.add("hidden");
        playSound('saber');
        gameRunning = true;
        gameLoop();
      } else {
        alert("⚡ Security Lock Glitch! Recalculate your code!");
      }
    };
    optContainer.appendChild(btn);
  });
}

function draw() {
  // Clear Frame
  ctx.fillStyle = "#0c0d14";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Draw Space Station Walls
  ctx.strokeStyle = "#ff0033";
  ctx.lineWidth = 4;
  ctx.strokeRect(5, 5, canvas.width - 10, canvas.height - 10);

  // Draw Kyber Crystals
  crystals.forEach(c => {
    if (!c.collected) {
      ctx.fillStyle = "#4cc9f0";
      ctx.beginPath();
      ctx.arc(c.x, c.y, 8, 0, Math.PI * 2);
      ctx.fill();
    }
  });

  // Draw Droids
  ctx.fillStyle = "#ffcc00";
  droids.forEach(d => {
    if (d.x > 0) ctx.fillRect(d.x, d.y, d.width, d.height);
  });

  // Draw Blast Door
  if (blastDoor.locked) {
    ctx.fillStyle = "#ff0033";
    ctx.fillRect(blastDoor.x, blastDoor.y, blastDoor.width, blastDoor.height);
  }

  // Draw Player (Lord Athen)
  ctx.fillStyle = "#e60000"; // Sith Red Armor
  ctx.fillRect(player.x, player.y, player.width, player.height);

  // Draw Lightsaber Blade on Attack
  if (player.isAttacking) {
    ctx.fillStyle = "#ffffff";
    ctx.shadowBlur = 12;
    ctx.shadowColor = "#ff0033";
    ctx.fillRect(player.x + player.width, player.y + 4, 30, 6);
    ctx.shadowBlur = 0;
  }
}

function gameLoop() {
  if (!gameRunning) return;
  update();
  draw();
  requestAnimationFrame(gameLoop);
}