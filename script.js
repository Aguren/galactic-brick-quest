const canvas = document.getElementById("arcadeCanvas");
const ctx = canvas.getContext("2d");

function resize() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
window.addEventListener("resize", resize);
resize();

// Game State
let running = false;
let score = 0;
let shield = 100;
let shakeTime = 0;

// Player Ship
const player = {
  x: canvas.width / 2,
  y: canvas.height - 120,
  radius: 24
};

// Lists
let stars = [];
let lasers = [];
let enemyLasers = [];
let enemies = [];
let particles = [];
let targetMissiles = [];

let lastEnemySpawn = 0;
let lastMissileSpawn = 0;

// Parallax Starfield
for (let i = 0; i < 90; i++) {
  stars.push({
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    size: Math.random() * 2 + 0.5,
    speed: Math.random() * 3 + 1
  });
}

// Sound Synthesizer Engine
const AudioContext = window.AudioContext || window.webkitAudioContext;
let audioCtx = null;

function initAudio() {
  if (!audioCtx) audioCtx = new AudioContext();
  if (audioCtx.state === 'suspended') audioCtx.resume();
}

function playFX(type) {
  if (!audioCtx) return;
  const osc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();
  osc.connect(gain);
  gain.connect(audioCtx.destination);
  const now = audioCtx.currentTime;

  if (type === 'laser') {
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(700, now);
    osc.frequency.exponentialRampToValueAtTime(100, now + 0.12);
    gain.gain.setValueAtTime(0.2, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.12);
    osc.start(now);
    osc.stop(now + 0.12);
  } else if (type === 'boom') {
    osc.type = 'square';
    osc.frequency.setValueAtTime(120, now);
    osc.frequency.exponentialRampToValueAtTime(20, now + 0.3);
    gain.gain.setValueAtTime(0.4, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.3);
    osc.start(now);
    osc.stop(now + 0.3);
  }
}

// Touch Steering Controls
canvas.addEventListener("touchmove", (e) => {
  e.preventDefault();
  initAudio();
  const touch = e.touches[0];
  player.x = touch.clientX;
  player.y = touch.clientY - 40;
}, { passive: false });

canvas.addEventListener("mousemove", (e) => {
  if (running) {
    player.x = e.clientX;
    player.y = e.clientY;
  }
});

// Auto-blasters
setInterval(() => {
  if (running) {
    lasers.push({ x: player.x - 12, y: player.y - 20, vy: -14 });
    lasers.push({ x: player.x + 12, y: player.y - 20, vy: -14 });
    playFX('laser');
  }
}, 200);

document.getElementById("start-btn").addEventListener("click", () => {
  initAudio();
  document.getElementById("menu-overlay").style.display = "none";
  score = 0;
  shield = 100;
  enemies = [];
  lasers = [];
  enemyLasers = [];
  targetMissiles = [];
  running = true;
  lastMissileSpawn = Date.now();
  requestAnimationFrame(gameLoop);
});

function spawnMissileMatrix() {
  const num1 = Math.floor(Math.random() * 8) + 4;
  const num2 = Math.floor(Math.random() * 8) + 3;
  const correct = num1 + num2;

  let choices = [correct];
  while (choices.length < 3) {
    let wrong = correct + (Math.floor(Math.random() * 6) - 3);
    if (wrong > 0 && !choices.includes(wrong)) choices.push(wrong);
  }
  choices.sort(() => Math.random() - 0.5);

  const laneWidth = canvas.width / 3;
  choices.forEach((val, idx) => {
    targetMissiles.push({
      x: laneWidth * idx + laneWidth / 2,
      y: -60,
      val: val,
      isCorrect: val === correct,
      promptText: `${num1} + ${num2}`,
      speed: 2.2
    });
  });
}

function addExplosion(x, y, count = 25) {
  for (let i = 0; i < count; i++) {
    particles.push({
      x: x, y: y,
      vx: (Math.random() - 0.5) * 10,
      vy: (Math.random() - 0.5) * 10,
      life: 30,
      color: Math.random() > 0.5 ? "#ff0033" : "#ffcc00"
    });
  }
}

function update() {
  if (shakeTime > 0) shakeTime--;

  // Stars
  stars.forEach(s => {
    s.y += s.speed;
    if (s.y > canvas.height) s.y = 0;
  });

  // Regular Enemies Spawning
  if (Date.now() - lastEnemySpawn > 1000) {
    enemies.push({
      x: Math.random() * (canvas.width - 60) + 30,
      y: -40,
      speed: Math.random() * 2 + 2,
      lastShoot: Date.now()
    });
    lastEnemySpawn = Date.now();
  }

  // Math Missile Matrix Spawning (Every 12 seconds)
  if (targetMissiles.length === 0 && Date.now() - lastMissileSpawn > 12000) {
    spawnMissileMatrix();
    lastMissileSpawn = Date.now();
  }

  // Lasers
  lasers.forEach((l, idx) => {
    l.y += l.vy;
    if (l.y < 0) lasers.splice(idx, 1);
  });

  // Enemies & Combat AI
  enemies.forEach((e, eIdx) => {
    e.y += e.speed;

    if (Date.now() - e.lastShoot > 1200 && e.y < canvas.height - 200) {
      e.lastShoot = Date.now();
      enemyLasers.push({ x: e.x, y: e.y + 15, vy: 6 });
    }

    // Player Hits Enemy
    lasers.forEach((l, lIdx) => {
      if (Math.hypot(e.x - l.x, e.y - l.y) < 25) {
        addExplosion(e.x, e.y);
        playFX('boom');
        score += 20;
        document.getElementById("score-val").innerText = score;
        enemies.splice(eIdx, 1);
        lasers.splice(lIdx, 1);
      }
    });

    if (e.y > canvas.height + 40) enemies.splice(eIdx, 1);
  });

  // Enemy Lasers Hit Player
  enemyLasers.forEach((el, elIdx) => {
    el.y += el.vy;
    if (Math.hypot(player.x - el.x, player.y - el.y) < player.radius) {
      shield -= 10;
      shakeTime = 12;
      addExplosion(player.x, player.y, 10);
      playFX('boom');
      document.getElementById("shield-val").innerText = Math.max(0, shield) + "%";
      enemyLasers.splice(elIdx, 1);

      if (shield <= 0) {
        running = false;
        document.getElementById("menu-overlay").style.display = "flex";
      }
    }
  });

  // Missile Matrix Target Intercepts
  targetMissiles.forEach((m, mIdx) => {
    m.y += m.speed;

    // Player shoots a missile target
    lasers.forEach((l, lIdx) => {
      if (Math.hypot(m.x - l.x, m.y - l.y) < 35) {
        lasers.splice(lIdx, 1);
        if (m.isCorrect) {
          addExplosion(m.x, m.y, 40);
          playFX('boom');
          score += 100;
          document.getElementById("score-val").innerText = score;
          targetMissiles = []; // Clear current matrix wave
        } else {
          shield -= 15;
          shakeTime = 15;
          document.getElementById("shield-val").innerText = Math.max(0, shield) + "%";
          targetMissiles.splice(mIdx, 1);
        }
      }
    });

    if (m.y > canvas.height + 50) targetMissiles.splice(mIdx, 1);
  });

  // Particles
  particles.forEach((p, pIdx) => {
    p.x += p.vx;
    p.y += p.vy;
    p.life--;
    if (p.life <= 0) particles.splice(pIdx, 1);
  });
}

function draw() {
  ctx.save();

  // Screen Shake FX
  if (shakeTime > 0) {
    ctx.translate((Math.random() - 0.5) * 10, (Math.random() - 0.5) * 10);
  }

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Stars
  ctx.fillStyle = "#fff";
  stars.forEach(s => {
    ctx.beginPath();
    ctx.arc(s.x, s.y, s.size, 0, Math.PI * 2);
    ctx.fill();
  });

  // Player Lasers (Glow)
  ctx.fillStyle = "#ff0033";
  ctx.shadowColor = "#ff0033";
  ctx.shadowBlur = 12;
  lasers.forEach(l => {
    ctx.fillRect(l.x - 3, l.y, 6, 16);
  });

  // Enemy Lasers
  ctx.fillStyle = "#00ffcc";
  ctx.shadowColor = "#00ffcc";
  enemyLasers.forEach(el => {
    ctx.fillRect(el.x - 2, el.y, 4, 12);
  });

  // Enemy Ships
  ctx.shadowBlur = 0;
  enemies.forEach(e => {
    ctx.fillStyle = "#4cc9f0";
    ctx.beginPath();
    ctx.moveTo(e.x, e.y + 15);
    ctx.lineTo(e.x - 18, e.y - 15);
    ctx.lineTo(e.x + 18, e.y - 15);
    ctx.closePath();
    ctx.fill();
  });

  // Missile Matrix (Math Targets)
  targetMissiles.forEach(m => {
    ctx.fillStyle = "#1a0005";
    ctx.strokeStyle = "#ff0033";
    ctx.lineWidth = 3;
    ctx.shadowColor = "#ff0033";
    ctx.shadowBlur = 15;

    ctx.beginPath();
    ctx.arc(m.x, m.y, 32, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    // Text on missile
    ctx.shadowBlur = 0;
    ctx.fillStyle = "#ffcc00";
    ctx.font = "bold 20px -apple-system, sans-serif";
    ctx.textAlign = "center";
    ctx.fillText(m.val, m.x, m.y + 7);

    ctx.fillStyle = "#ffffff";
    ctx.font = "12px -apple-system, sans-serif";
    ctx.fillText(m.promptText, m.x, m.y - 38);
  });

  // Explosions
  particles.forEach(p => {
    ctx.fillStyle = p.color;
    ctx.shadowColor = p.color;
    ctx.shadowBlur = 8;
    ctx.fillRect(p.x, p.y, 4, 4);
  });

  // Player Sith Ship (High Detail)
  ctx.shadowColor = "#ff0033";
  ctx.shadowBlur = 20;
  ctx.fillStyle = "#e60000";
  ctx.beginPath();
  ctx.moveTo(player.x, player.y - 28);
  ctx.lineTo(player.x - 24, player.y + 20);
  ctx.lineTo(player.x, player.y + 10);
  ctx.lineTo(player.x + 24, player.y + 20);
  ctx.closePath();
  ctx.fill();

  ctx.restore();
}

function gameLoop() {
  if (!running) return;
  update();
  draw();
  requestAnimationFrame(gameLoop);
}