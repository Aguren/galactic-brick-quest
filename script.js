const canvas = document.getElementById("rpgCanvas");
const ctx = canvas.getContext("2d");

function resize() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
window.addEventListener("resize", resize);
resize();

// Game Engine State
let running = false;
let currentChapter = 1;
let inventory = [];

// Hero Definition (Lord Athen)
const player = {
  x: 100,
  y: 200,
  targetX: 100,
  targetY: 200,
  radius: 18,
  speed: 3.5,
  hasLightsaber: false
};

// RPG Map World Entities (Chapter 1 Zone)
let chests = [
  { id: 'chest1', x: 280, y: 150, opened: false, item: 'Broken Lightsaber Hilt' },
  { id: 'chest2', x: 500, y: 320, opened: false, item: 'Red Kyber Crystal' }
];

let npcs = [
  { id: 'droid', x: 220, y: 220, name: 'SITH ASTRO-DROID', dialogue: "Commander Athen! The Holocron vault is sealed ahead. Find the two missing components in the hangar chests to forge your Lightsaber!" }
];

let doors = [
  { id: 'vaultDoor', x: 620, y: 180, width: 20, height: 120, locked: true, requiredItem: 'Forged Red Lightsaber' }
];

// Audio Synthesizer Engine
const AudioContext = window.AudioContext || window.webkitAudioContext;
let audioCtx = null;

function unlockAudio() {
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

  if (type === 'item') {
    osc.type = 'sine';
    osc.frequency.setValueAtTime(523.25, now);
    osc.frequency.setValueAtTime(659.25, now + 0.1);
    gain.gain.setValueAtTime(0.2, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.3);
    osc.start(now);
    osc.stop(now + 0.3);
  } else if (type === 'saber') {
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(400, now);
    osc.frequency.exponentialRampToValueAtTime(100, now + 0.2);
    gain.gain.setValueAtTime(0.3, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.2);
    osc.start(now);
    osc.stop(now + 0.2);
  }
}

// Touch & Click Tap-To-Move Navigation
canvas.addEventListener("touchstart", (e) => {
  e.preventDefault();
  unlockAudio();
  const touch = e.touches[0];
  player.targetX = touch.clientX;
  player.targetY = touch.clientY;
}, { passive: false });

canvas.addEventListener("click", (e) => {
  unlockAudio();
  player.targetX = e.clientX;
  player.targetY = e.clientY;
});

// UI Event Handlers
document.getElementById("start-btn").addEventListener("click", () => {
  unlockAudio();
  document.getElementById("menu-overlay").classList.add("hidden");
  running = true;
  requestAnimationFrame(gameLoop);
});

document.getElementById("dialogue-next-btn").addEventListener("click", () => {
  document.getElementById("dialogue-box").classList.add("hidden");
});

function showDialogue(speaker, text) {
  document.getElementById("dialogue-speaker").innerText = speaker;
  document.getElementById("dialogue-text").innerText = text;
  document.getElementById("dialogue-box").classList.remove("hidden");
}

function update() {
  if (!running) return;

  // Move Player toward Target Destination
  const dx = player.targetX - player.x;
  const dy = player.targetY - player.y;
  const dist = Math.hypot(dx, dy);

  if (dist > 4) {
    player.x += (dx / dist) * player.speed;
    player.y += (dy / dist) * player.speed;
  }

  // Check NPC Proximity Dialogue Trigger
  npcs.forEach(npc => {
    if (Math.hypot(player.x - npc.x, player.y - npc.y) < 35) {
      showDialogue(npc.name, npc.dialogue);
      player.targetX = player.x; // Stop movement
    }
  });

  // Check Chest Interaction & Item Pickups
  chests.forEach(chest => {
    if (!chest.opened && Math.hypot(player.x - chest.x, player.y - chest.y) < 30) {
      chest.opened = true;
      inventory.push(chest.item);
      playFX('item');
      showDialogue("TREASURE FOUND!", `Lord Athen acquired: [ ${chest.item} ]!`);
      checkCraftingRecipe();
    }
  });

  // Check Door Collision & Unlock Event
  doors.forEach(door => {
    if (door.locked && player.x + player.radius > door.x - 10) {
      if (inventory.includes(door.requiredItem)) {
        door.locked = false;
        playFX('saber');
        showDialogue("VAULT UNLOCKED!", "Lord Athen ignites his newly forged Red Lightsaber and cuts through the blast door!");
        advanceChapter();
      } else {
        player.targetX = door.x - 30; // Block passage
        showDialogue("SECURITY LOCK", `This vault door requires: [ ${door.requiredItem} ] to cut through!`);
      }
    }
  });
}

function checkCraftingRecipe() {
  if (inventory.includes("Broken Lightsaber Hilt") && inventory.includes("Red Kyber Crystal") && !inventory.includes("Forged Red Lightsaber")) {
    inventory.push("Forged Red Lightsaber");
    player.hasLightsaber = true;
    setTimeout(() => {
      playFX('saber');
      showDialogue("ITEM FORGED!", "Lord Athen combined the Hilt and Kyber Crystal to assemble his Red Sith Lightsaber!");
      document.getElementById("quest-objective").innerText = "Objective: Slice through the Vault Blast Door ahead!";
    }, 1500);
  }
}

function advanceChapter() {
  currentChapter = 2;
  document.getElementById("chapter-tag").innerText = "CHAPTER 2: THE ANCIENT SITH HOLOCRON";
  document.getElementById("quest-objective").innerText = "Objective: Claim the ancient Sith Holocron inside the chamber!";
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Draw Space Station Floor Grid
  ctx.strokeStyle = "#151525";
  ctx.lineWidth = 1;
  for (let x = 0; x < canvas.width; x += 50) {
    ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, canvas.height); ctx.stroke();
  }
  for (let y = 0; y < canvas.height; y += 50) {
    ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(canvas.width, y); ctx.stroke();
  }

  // Draw Blast Doors
  doors.forEach(d => {
    if (d.locked) {
      ctx.fillStyle = "#ff0033";
      ctx.shadowColor = "#ff0033";
      ctx.shadowBlur = 15;
      ctx.fillRect(d.x, d.y, d.width, d.height);
      ctx.shadowBlur = 0;
    }
  });

  // Draw Treasure Chests
  chests.forEach(c => {
    ctx.fillStyle = c.opened ? "#444" : "#ffcc00";
    ctx.shadowColor = c.opened ? "none" : "#ffcc00";
    ctx.shadowBlur = c.opened ? 0 : 10;
    ctx.fillRect(c.x - 12, c.y - 12, 24, 24);
  });

  // Draw NPCs (Astro-Droid)
  npcs.forEach(n => {
    ctx.fillStyle = "#4cc9f0";
    ctx.shadowColor = "#4cc9f0";
    ctx.shadowBlur = 10;
    ctx.beginPath();
    ctx.arc(n.x, n.y, 14, 0, Math.PI * 2);
    ctx.fill();
  });

  // Draw Player (Lord Athen)
  ctx.fillStyle = "#e60000";
  ctx.shadowColor = "#ff0033";
  ctx.shadowBlur = 18;
  ctx.beginPath();
  ctx.arc(player.x, player.y, player.radius, 0, Math.PI * 2);
  ctx.fill();

  // Draw Equipped Red Lightsaber Blade
  if (player.hasLightsaber) {
    ctx.fillStyle = "#ffffff";
    ctx.shadowColor = "#ff0033";
    ctx.shadowBlur = 15;
    ctx.fillRect(player.x + 12, player.y - 4, 26, 8);
  }

  ctx.shadowBlur = 0; // Reset
}

function gameLoop() {
  if (!running) return;
  update();
  draw();
  requestAnimationFrame(gameLoop);
}