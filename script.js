const canvas = document.getElementById("arcadeCanvas");
const ctx = canvas.getContext("2d");

// Full Screen Canvas Resizer
function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
window.addEventListener("resize", resizeCanvas);
resizeCanvas();

// Game State Setup
let gameRunning = false;
let score = 0;
let shield = 100;
let currentTargetAns = 0;
let lockActive = false;

// Starfighter (Lord Athen)
const ship = {
  x: canvas.width / 2,
  y: canvas.height - 120,
  width: 44,
  height: 44,
  speed: 8
};

// Dynamic Game Objects
let lasers = [];
let enemies = [];
let stars = [];
let particles = [];
let lastSpawn = 0;
let lastTargetSpawn = 0;

// Generate Starfield Background
for (let i = 0; i < 70; i++) {
  stars.push({
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    size: Math.random() * 2 + 1,
    speed: Math.random() * 3 + 1
  });
}

// Audio Synthesizer (iOS Web Audio Compliant)
const AudioContext = window.AudioContext || window.webkitAudioContext;
let audioCtx = null;

function unlockAudio() {
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

  if (type === 'laser') {
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(600, now);
    osc.frequency.exponentialRampToValueAtTime(150, now + 0.15);
    gain.gain.setValueAtTime(0.2, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.15);
    osc.start(now);
    osc.stop(now + 0.15);
  } else if (type === 'boom') {
    osc.type = 'square';
    osc.frequency.setValueAtTime(120, now);
    osc.frequency.exponentialRampToValueAtTime(30, now + 0.3);
    gain.gain.setValueAtTime(0.4, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.3);
    osc.start(now);
    osc.stop(now + 0.3);
  }
}

// iPad Touch Drag Steering & Continuous Auto-Firing
canvas.addEventListener("touchmove", (e) => {
  e.preventDefault();
  unlockAudio();
  const touch = e.touches[0];
  ship.x = touch.clientX;
  ship.y = touch.clientY - 30; // Position ship slightly above finger so he can see it
}, { passive: false });

// Desktop Mouse Steering Fallback
canvas.addEventListener("mousemove", (e) => {
  if (gameRunning) {
    ship.x = e.clientX;
    ship.y = e.clientY;
  }
});

// Automatic Blaster Fire
setInterval(() => {
  if (gameRunning && !lockActive) {
    lasers.push({ x: ship.x, y: ship.y - 20, speed: 12 });
    playSound('laser');
  }
}, 220);

// Menu & Start Trigger
document.getElementById("start-btn").addEventListener("click", () => {
  unlockAudio();
  document.getElementById("menu-overlay").classList.add("hidden");
  score = 0;
  shield = 100;
  enemies = [];
  lasers = [];
  document.getElementById("score-val").innerText = score;
  document.getElementById("shield-val").innerText = shield + "%";
  gameRunning = true;
  lastTargetSpawn = Date.now();
  requestAnimationFrame(gameLoop);
});

function spawnEnemy() {
  const isAsteroid = Math.random() > 0.5;
  enemies.push({
    x: Math.random() * (canvas.width - 40) + 20,
    y: -40,
    size: isAsteroid ? 30 : 22,
    speed: Math.random() * 2 + 2,
    isAsteroid: isAsteroid
  });
}

function spawnMathTarget() {
  lockActive = true;
  const targetBar = document.getElementById("target-lock-bar");
  targetBar.classList.remove("hidden");

  let n1 = Math.floor(Math.random() * 10) + 4;
  let n2 = Math.floor(Math.random() * 10) + 3;
  currentTargetAns = n1 + n2;

  document.getElementById("lock-target-q").innerText = `⚡ TARGET LOCK: ${n1} + ${n2} = ?`;

  let options = [currentTargetAns];
  while (options.length < 4) {
    let wrong = currentTargetAns + (Math.floor(Math.random() * 8) - 4);
    if (wrong > 0 && !options.includes(wrong)) options.push(wrong);
  }
  options.sort(() => Math.random() - 0.5);

  const optContainer = document.getElementById("lock-options");
  optContainer.innerHTML = "";
  options.forEach(opt => {
    const btn = document.createElement("button");
    btn.className = "arcade-btn";
    btn.style.fontSize = "20px";
    btn.style.padding = "10px";
    btn.innerText = opt;
    btn.onclick = () => checkTargetCode(opt);
    optContainer.appendChild(btn);
  });
}

function checkTargetCode(selected) {
  if (selected === currentTargetAns) {
    playSound('boom');
    score += 50;
    document.getElementById("score-val").innerText = score;
    createExplosion(canvas.width / 2, 120);
  }
  lockActive = false;
  document.getElementById("target-lock-bar").classList.add("hidden");
  lastTargetSpawn = Date.now();
}

function createExplosion(x, y) {
  for (let i = 0; i < 20; i++) {
    particles.push({
      x: x, y: y,
      vx: (Math.random() - 0.5) * 8,
      vy: (Math.random() - 0.5) * 8,
      life: 25
    });
  }
}

function update() {
  // Move Stars
  stars.forEach(s => {
    s.y += s.speed;
    if (s.y > canvas.height) s.y = 0;
  });

  // Spawn Regular Enemies
  if (Date.now() - lastSpawn > 900) {
    spawnEnemy();
    lastSpawn = Date.now();
  }

  // Spawn Math Target Lock Event every 14 seconds
  if (!lockActive && Date.now() - lastTargetSpawn > 14000) {
    spawnMathTarget();
  }

  // Move Lasers
  lasers.forEach((l, index) => {
    l.y -= l.speed;
    if (l.y < 0) lasers.splice(index, 1);
  });

  // Move Enemies & Check Laser Collisions
  enemies.forEach((e, eIdx) => {
    e.y += e.speed;

    // Check collision with ship
    if (Math.abs(e.x - ship.x) < 30 && Math.abs(e.y - ship.y) < 30) {
      shield -= 15;
      document.getElementById("shield-val").innerText = Math.max(0, shield) + "%";
      createExplosion(e.x, e.y);
      enemies.splice(eIdx, 1);
      playSound('boom');

      if (shield <= 0) {
        gameRunning = false;
        document.getElementById("menu-overlay").classList.remove("hidden");
      }
    }

    // Check collision with Lasers
    lasers.forEach((l, lIdx) => {
      if (Math.abs(e.x - l.x) < 25 && Math.abs(e.y - l.y) < 25) {
        score += 10;
        document.getElementById("score-val").innerText = score;
        createExplosion(e.x, e.y);
        playSound('boom');
        enemies.splice(eIdx, 1);
        lasers.splice(lIdx, 1);
      }
    });

    if (e.y > canvas.height + 40) enemies.splice(eIdx, 1);
  });

  // Update Particles
  particles.forEach((p, pIdx) => {
    p.x += p.vx;
    p.y += p.vy;
    p.life--;
    if (p.life <= 0) particles.splice(pIdx, 1);
  });
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Draw Starfield
  ctx.fillStyle = "#ffffff";
  stars.forEach(s => {
    ctx.beginPath();
    ctx.arc(s.x, s.y, s.size, 0, Math.PI * 2);
    ctx.fill();
  });

  // Draw Lasers
  ctx.fillStyle = "#ff0033";
  ctx.shadowBlur = 10;
  ctx.shadowColor = "#ff0033";
  lasers.forEach(l => {
    ctx.fillRect(l.x - 3, l.y, 6, 18);
  });

  // Draw Enemies
  enemies.forEach(e => {
    if (e.isAsteroid) {
      ctx.fillStyle = "#777";
      ctx.shadowBlur = 0;
      ctx.beginPath();
      ctx.arc(e.x, e.y, e.size, 0, Math.PI * 2);
      ctx.fill();
    } else {
      ctx.fillStyle = "#4cc9f0"; // Jedi Droid Blue
      ctx.shadowColor = "#4cc9f0";
      ctx.shadowBlur = 8;
      ctx.fillRect(e.x - 15, e.y - 15, 30, 30);
    }
  });

  // Draw Explosion Particles
  particles.forEach(p => {
    ctx.fillStyle = "#ffcc00";
    ctx.shadowBlur = 6;
    ctx.shadowColor = "#ff9900";
    ctx.fillRect(p.x, p.y, 4, 4);
  });

  // Draw Player Starfighter (Sith Red Interceptor)
  ctx.fillStyle = "#e60000";
  ctx.shadowColor = "#ff0033";
  ctx.shadowBlur = 15;
  ctx.beginPath();
  ctx.moveTo(ship.x, ship.y - 25);
  ctx.lineTo(ship.x - 22, ship.y + 18);
  ctx.lineTo(ship.x + 22, ship.y + 18);
  ctx.closePath();
  ctx.fill();

  ctx.shadowBlur = 0; // Reset shadow
}

function gameLoop() {
  if (!gameRunning) return;
  update();
  draw();
  requestAnimationFrame(gameLoop);
}