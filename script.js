// Credentials & Settings
let agentName = "Athen";
let sidekickName = "Poppy the Rainbow Bunny";
let selectedAvatar = "🕵️";
let selectedTheme = "spy";
let bgmEnabled = false;
let lastTransportChoice = "bus";

// Progress Engine
let currentMissionIndex = 1;
let m1Count = 0;
let m3NumbersFound = [];
let m3ScratchCount = 0;
let currentVaultCombo = [];
let dialAngle = 0;

// Themes Config
const themes = {
  spy: { title: "CYBER SPY", icon: "🕵️", roleLabel: "AGENT", term: "MISSION", stamp: "TOP SECRET", numSeq: ["7", "2", "9"], targetCode: "729", m4Math: { q: "El robot tiene 8 baterías. Le das 6 más. ¿Cuántas baterías tiene?", ans: 14, options: [12, 14, 16] }, m6Color: "silver key", m7Seq: "🔴 Red | 🔵 Blue" },
  space: { title: "SPACE RANGER", icon: "🚀", roleLabel: "RANGER", term: "EXPEDITION", stamp: "COSMIC CLEARANCE", numSeq: ["4", "1", "8"], targetCode: "418", m4Math: { q: "El cohete tiene 9 celdas de energía. Cargas 5 más. ¿Total de celdas?", ans: 14, options: [11, 14, 15] }, m6Color: "purple crystal", m7Seq: "🟣 Purple | 🟢 Green" },
  dino: { title: "DINO EXPLORER", icon: "🦖", roleLabel: "TRACKER", term: "SAFARI", stamp: "JURASSIC PERMIT", numSeq: ["3", "6", "5"], targetCode: "365", m4Math: { q: "El dinosaurio encontró 7 fósiles en la mañana y 8 en la tarde. ¿Total?", ans: 15, options: [13, 15, 17] }, m6Color: "golden fossil", m7Seq: "🟠 Orange | 🟤 Brown" },
  unicorn: { title: "RAINBOW UNICORN", icon: "🦄", roleLabel: "GUARDIAN", term: "QUEST", stamp: "ROYAL DECREE", numSeq: ["5", "3", "8"], targetCode: "538", m4Math: { q: "El unicornio recolectó 9 gemas mágicas y luego 4 más. ¿Total?", ans: 13, options: [11, 13, 16] }, m6Color: "pink crown", m7Seq: "💖 Pink | 💜 Violet" },
  fairy: { title: "ENCHANTED FAIRY", icon: "🧚", roleLabel: "SPRITE", term: "QUEST", stamp: "FAIRY SPELL", numSeq: ["2", "8", "4"], targetCode: "284", m4Math: { q: "El hada preparó 6 pociones brillantes y 7 pociones de luz. ¿Total?", ans: 13, options: [12, 13, 15] }, m6Color: "emerald wand", m7Seq: "✨ Gold | 🌸 Pink" },
  popstar: { title: "ACADEMY POPSTAR", icon: "🎤", roleLabel: "PERFORMER", term: "TOUR", stamp: "VIP PASS", numSeq: ["6", "2", "7"], targetCode: "627", m4Math: { q: "La banda cantó 8 canciones en la práctica y 7 en el show. ¿Total?", ans: 15, options: [13, 15, 18] }, m6Color: "gold microphone", m7Seq: "🩵 Cyan | 🩷 Magenta" },
  detective: { title: "MYSTERY DETECTIVE", icon: "🔎", roleLabel: "SLEUTH", term: "CASE", stamp: "CONFIDENTIAL", numSeq: ["8", "3", "1"], targetCode: "831", m4Math: { q: "El detective examinó 7 pistas en la biblioteca y 6 en el patio. ¿Total?", ans: 13, options: [11, 13, 14] }, m6Color: "bronze magnifying glass", m7Seq: "🟡 Yellow | 🟤 Brown" },
  safari: { title: "JUNGLE SAFARI", icon: "🦁", roleLabel: "RANGER", term: "TREK", stamp: "WILD PERMIT", numSeq: ["1", "9", "4"], targetCode: "194", m4Math: { q: "El explorador vio 9 leones y 6 jirafas. ¿Cuántos animales en total?", ans: 15, options: [14, 15, 17] }, m6Color: "emerald compass", m7Seq: "🟢 Green | 🟡 Yellow" },
  superhero: { title: "SCHOOL SUPERHERO", icon: "🦸", roleLabel: "HERO", term: "MISSION", stamp: "HERO LEAGUE", numSeq: ["9", "1", "6"], targetCode: "916", m4Math: { q: "El superhéroe rescató 8 mochilas en el pasillo y 7 en el aula. ¿Total?", ans: 15, options: [13, 15, 16] }, m6Color: "red cape", m7Seq: "🔴 Red | 🟡 Yellow" }
};

const animationsData = [
  { icon: "🎒", text: "Backpack packed for Manzanita Elementary!" },
  { icon: "🚌", text: "Transport departing down Manzanita Lane!" },
  { icon: "📝", text: "Secret Numbers scratched and written safely!" },
  { icon: "🤖", text: "Dual-Language System re-aligned!" },
  { icon: "🔓", text: "3D Vault Dial Lock Decoded!" },
  { icon: "🔍", text: "Detective Reading passage solved!" },
  { icon: "🎨", text: "Spanish Pattern Array completed!" },
  { icon: "🍕", text: "Cafeteria Energy recharged!" },
  { icon: "⚽", text: "Recess Kickball Goal scored!" },
  { icon: "🌱", text: "Science Garden Sprout grown!" },
  { icon: "🎨", text: "Art Studio masterpiece finished!" },
  { icon: "🎵", text: "Music Class rhythm synthesized!" },
  { icon: "📚", text: "Library Map Search completed!" },
  { icon: "💻", text: "Computer Lab code activated!" },
  { icon: "🐕", text: "Spanish Vocabulary decoded!" },
  { icon: "🌻", text: "Garden Sunflower measured!" },
  { icon: "⏰", text: "School Bell Timer calibrated!" },
  { icon: "📅", text: "Spanish Days of the Week aligned!" },
  { icon: "🤝", text: "New Manzanita Friendship formed!" },
  { icon: "🏆", text: "GOLDEN SCHOOL BADGE RECOVERED!" }
];

// Web Audio & Procedural BGM
const AudioContext = window.AudioContext || window.webkitAudioContext;
let audioCtx = null, bgmInterval = null;

function initAudio() {
  try {
    if (!audioCtx) audioCtx = new AudioContext();
    if (audioCtx.state === 'suspended') audioCtx.resume();
  } catch (e) {
    console.log("Audio API not supported");
  }
}

function playSound(type) {
  if (!audioCtx) return;
  try {
    const osc = audioCtx.createOscillator(), gain = audioCtx.createGain();
    osc.connect(gain); gain.connect(audioCtx.destination);
    const now = audioCtx.currentTime;

    if (type === 'click') {
      osc.type = 'sine'; osc.frequency.setValueAtTime(600, now);
      gain.gain.setValueAtTime(0.1, now); gain.gain.exponentialRampToValueAtTime(0.01, now + 0.05);
      osc.start(now); osc.stop(now + 0.05);
    } else if (type === 'success') {
      osc.type = 'triangle'; osc.frequency.setValueAtTime(400, now); osc.frequency.setValueAtTime(800, now + 0.1);
      gain.gain.setValueAtTime(0.25, now); gain.gain.exponentialRampToValueAtTime(0.01, now + 0.3);
      osc.start(now); osc.stop(now + 0.3);
    } else if (type === 'wrong') {
      osc.type = 'sawtooth'; osc.frequency.setValueAtTime(140, now);
      gain.gain.setValueAtTime(0.2, now); gain.gain.exponentialRampToValueAtTime(0.01, now + 0.2);
      osc.start(now); osc.stop(now + 0.2);
    }
  } catch (e) {}
}

function toggleBGM() {
  initAudio(); bgmEnabled = !bgmEnabled;
  const btn = document.getElementById("music-toggle-btn");
  if (btn) btn.innerText = bgmEnabled ? "🎵 BGM: ON" : "🎵 BGM: OFF";
  if (bgmEnabled) {
    let noteIdx = 0; const scale = [261.63, 293.66, 329.63, 392.00, 440.00];
    bgmInterval = setInterval(() => {
      if (!bgmEnabled || !audioCtx) return;
      try {
        const osc = audioCtx.createOscillator(), gain = audioCtx.createGain();
        osc.connect(gain); gain.connect(audioCtx.destination);
        osc.type = 'sine'; osc.frequency.setValueAtTime(scale[noteIdx % scale.length], audioCtx.currentTime);
        gain.gain.setValueAtTime(0.03, audioCtx.currentTime); gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.15);
        osc.start(); osc.stop(audioCtx.currentTime + 0.15); noteIdx++;
      } catch (e) {}
    }, 280);
  } else if (bgmInterval) { clearInterval(bgmInterval); }
}

// Fixed Teletype / Typewriter Briefing Effect
function runTeletype(text, containerId, callback) {
  const el = document.getElementById(containerId); 
  if (!el) {
    if (callback) callback();
    return;
  }
  el.innerText = "";
  let i = 0;

  const timer = setInterval(() => {
    if (i < text.length) {
      const char = text.charAt(i);
      el.innerText += char;
      if (char !== " " && char !== "\n") {
        playSound('click'); 
      }
      const parentBox = el.parentElement;
      if (parentBox) {
        parentBox.scrollTop = parentBox.scrollHeight;
      }
      i++;
    } else { 
      clearInterval(timer); 
      if (callback) callback(); 
    }
  }, 20);
}

// Canvas Particles / Confetti Cannon
let particles = [];
function triggerConfetti() {
  const cvs = document.getElementById("fx-canvas");
  if (!cvs) return;
  const ctx = cvs.getContext("2d");
  cvs.width = window.innerWidth; cvs.height = window.innerHeight;
  particles = [];
  for (let i = 0; i < 70; i++) {
    particles.push({ x: cvs.width/2, y: cvs.height/2, vx: (Math.random()-0.5)*12, vy: (Math.random()-0.5)*12-4, color: `hsl(${Math.random()*360}, 100%, 50%)`, size: Math.random()*8+4, life: 60 });
  }
  function loop() {
    ctx.clearRect(0,0,cvs.width,cvs.height);
    particles.forEach((p, idx) => {
      p.x += p.vx; p.y += p.vy; p.vy += 0.2; p.life--;
      ctx.fillStyle = p.color; ctx.fillRect(p.x, p.y, p.size, p.size);
      if (p.life <= 0) particles.splice(idx, 1);
    });
    if (particles.length > 0) requestAnimationFrame(loop);
  }
  loop();
}

function showScreen(id) {
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  const target = document.getElementById(id);
  if (target) target.classList.add('active');
}

function applyThemeColors(tKey) {
  document.body.className = `theme-${tKey}`;
  const t = themes[tKey] || themes['spy'];

  const roleLabel = document.getElementById("hud-role-label");
  if (roleLabel) roleLabel.innerText = t.roleLabel;

  const hudTheme = document.getElementById("hud-theme");
  if (hudTheme) hudTheme.innerText = `${t.icon} ${t.title}`;

  const stampBadge = document.getElementById("stamp-badge");
  if (stampBadge) stampBadge.innerText = t.stamp;

  const briefingHeader = document.getElementById("briefing-header");
  if (briefingHeader) briefingHeader.innerText = `${t.stamp} BRIEFING`;

  const setupTitle = document.getElementById("setup-title");
  if (setupTitle) setupTitle.innerText = `MANZANITA ELEMENTARY ${t.title}`;
}

document.addEventListener("DOMContentLoaded", () => {
  const musicBtn = document.getElementById("music-toggle-btn");
  if (musicBtn) musicBtn.addEventListener("click", toggleBGM);

  document.querySelectorAll(".avatar-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      document.querySelectorAll(".avatar-btn").forEach(b => b.classList.remove("active-avatar"));
      btn.classList.add("active-avatar"); 
      selectedAvatar = btn.getAttribute("data-avatar");
    });
  });

  document.querySelectorAll(".theme-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      document.querySelectorAll(".theme-btn").forEach(b => b.classList.remove("active-theme"));
      btn.classList.add("active-theme"); 
      selectedTheme = btn.getAttribute("data-theme");
      applyThemeColors(selectedTheme);
    });
  });

  const saveBtn = document.getElementById("save-setup-btn");
  if (saveBtn) {
    saveBtn.addEventListener("click", () => {
      initAudio(); 
      playSound('click');

      const nameInput = document.getElementById("input-agent-name");
      const sidekickInput = document.getElementById("input-sidekick-name");

      if (nameInput && nameInput.value.trim()) agentName = nameInput.value.trim();
      if (sidekickInput && sidekickInput.value.trim()) sidekickName = sidekickInput.value.trim();

      applyThemeColors(selectedTheme);

      const hudName = document.getElementById("hud-name");
      if (hudName) hudName.innerText = agentName.toUpperCase();

      const hudSidekick = document.getElementById("hud-sidekick");
      if (hudSidekick) hudSidekick.innerText = sidekickName.toUpperCase();

      const hudAvatar = document.getElementById("hud-avatar");
      if (hudAvatar) hudAvatar.innerText = selectedAvatar;

      document.querySelectorAll(".display-agent-name").forEach(el => el.innerText = agentName);
      document.querySelectorAll(".display-sidekick-name").forEach(el => el.innerText = sidekickName);

      showScreen("screen-briefing");

      const briefingText = `Welcome, ${agentName} and ${sidekickName}!\n\nToday is your first day of 2nd Grade at Manzanita Elementary, but the Golden School Badge has vanished across 20 secret sectors!\n\nSolve all 20 challenges, scratch off the secret Numbers, and decode the 3D Vault Dial before the final bell rings!`;
      runTeletype(briefingText, "typewriter-text");
    });
  }

  const startMissionBtn = document.getElementById("start-mission-btn");
  if (startMissionBtn) {
    startMissionBtn.addEventListener("click", () => {
      initAudio(); 
      playSound('click'); 
      loadMission(1);
    });
  }

  const nextMissionBtn = document.getElementById("next-mission-btn");
  if (nextMissionBtn) {
    nextMissionBtn.addEventListener("click", () => {
      initAudio(); 
      playSound('click');
      if (currentMissionIndex <= 20) { 
        loadMission(currentMissionIndex); 
      } else { 
        triggerConfetti(); 
        showScreen("screen-final"); 
      }
    });
  }

  const parentIntelBtn = document.getElementById("parent-intel-btn");
  if (parentIntelBtn) {
    parentIntelBtn.addEventListener("click", () => { 
      showScreen("screen-parent"); 
    });
  }
});

function loadMission(idx) {
  currentMissionIndex = idx;
  const t = themes[selectedTheme] || themes['spy'];
  const progress = document.getElementById("hud-progress");
  if (progress) progress.innerText = `${idx}/20`;

  showScreen("screen-mission");

  const area = document.getElementById("mission-interactive-area"); 
  if (area) area.innerHTML = "";
  
  const title = document.getElementById("mission-title");
  const prompt = document.getElementById("mission-prompt");

  if (idx === 1) {
    if (title) title.innerText = `${t.term} 1: MORNING LAUNCH ${t.icon}`;
    if (prompt) prompt.innerText = `Find the 5 essential 2nd grade items ${agentName} needs!`;
    if (area) {
      area.innerHTML = `
        <div id="m1-grid" class="item-grid">
          <button class="grid-item correct-m1">🎒 Backpack</button>
          <button class="grid-item wrong-m1">🌙 Pajamas</button>
          <button class="grid-item correct-m1">👟 Shoes</button>
          <button class="grid-item wrong-m1">📺 Remote</button>
          <button class="grid-item correct-m1">🍱 Lunchbox</button>
          <button class="grid-item correct-m1">💧 Water Bottle</button>
          <button class="grid-item correct-m1">✏️ Pencils</button>
          <button class="grid-item wrong-m1">🛌 Pillow</button>
        </div>`;
    }
    m1Count = 0;
    document.querySelectorAll(".correct-m1").forEach(b => b.addEventListener("click", () => {
      initAudio();
      if (!b.classList.contains("selected")) { 
        b.classList.add("selected"); 
        m1Count++; 
        playSound('click'); 
        if (m1Count === 5) completeMission(); 
      }
    }));
    document.querySelectorAll(".wrong-m1").forEach(b => b.addEventListener("click", () => { 
      initAudio(); 
      playSound('wrong'); 
      alert("⚠️ You don't need that at school!"); 
    }));

  } else if (idx === 2) {
    if (title) title.innerText = `${t.term} 2: THE ROAD TO MANZANITA ${t.icon}`;
    if (prompt) prompt.innerText = `Select your transport code! (Both Car and Bus are valid!)`;
    if (area) {
      area.innerHTML = `
        <div class="choice-grid">
          <button class="choice-btn correct-m2" data-trans="car">🚗 Family Car</button>
          <button class="choice-btn correct-m2" data-trans="bus">🚌 School Bus</button>
          <button class="choice-btn wrong-m2">🚀 Space Rocket</button>
          <button class="choice-btn wrong-m2">🐘 Elephant</button>
        </div>`;
    }
    document.querySelectorAll(".correct-m2").forEach(b => b.addEventListener("click", (e) => { 
      lastTransportChoice = e.target.getAttribute("data-trans"); 
      completeMission(); 
    }));
    document.querySelectorAll(".wrong-m2").forEach(b => b.addEventListener("click", () => { 
      initAudio(); 
      playSound('wrong'); 
    }));

  } else if (idx === 3) {
    if (title) title.innerText = `${t.term} 3: SCRATCH-OFF SECRET CODES ${t.icon}`;
    if (prompt) prompt.innerText = `Rub your finger/mouse across the metallic scratch cards to reveal secret Numbers!`;
    if (area) {
      area.innerHTML = `
        <div class="pencil-note">✏️ Write down the 3 revealed Numbers on real paper!</div>
        <div class="scratch-card-box">
          <div class="scratch-bg-text">${t.numSeq.join('  -  ')}</div>
          <canvas id="scratch-cvs" class="scratch-canvas"></canvas>
        </div>`;
    }
    setupScratchCanvas();

  } else if (idx === 4) {
    if (title) title.innerText = `${t.term} 4: SPANISH MATH CHALLENGE ${t.icon}`;
    if (prompt) prompt.innerText = `Desafío en Español: "${t.m4Math.q}"`;
    if (area) {
      area.innerHTML = `
        <div class="choice-grid">
          <button class="choice-btn ${t.m4Math.options[0] === t.m4Math.ans ? 'correct-m4' : 'wrong-m4'}">${t.m4Math.options[0]}</button>
          <button class="choice-btn ${t.m4Math.options[1] === t.m4Math.ans ? 'correct-m4' : 'wrong-m4'}">${t.m4Math.options[1]}</button>
          <button class="choice-btn ${t.m4Math.options[2] === t.m4Math.ans ? 'correct-m4' : 'wrong-m4'}">${t.m4Math.options[2]}</button>
        </div>`;
    }
    const correctM4 = document.querySelector(".correct-m4");
    if (correctM4) correctM4.addEventListener("click", () => completeMission());
    document.querySelectorAll(".wrong-m4").forEach(b => b.addEventListener("click", () => { 
      initAudio(); 
      playSound('wrong'); 
    }));

  } else if (idx === 5) {
    if (title) title.innerText = `${t.term} 5: 3D VAULT DIAL LOCK ${t.icon}`;
    if (prompt) prompt.innerText = `Spin the vault dial to select your 3 secret Numbers (${t.numSeq.join(' - ')})!`;
    if (area) {
      area.innerHTML = `
        <div class="code-display" id="vault-combo-disp">_ _ _</div>
        <div class="vault-dial-container">
          <div class="vault-pointer"></div>
          <div id="v-wheel" class="vault-wheel" onclick="rotateVaultWheel()">
            <span class="vault-number" style="top:5px; left:70px;">1</span>
            <span class="vault-number" style="top:25px; left:120px;">2</span>
            <span class="vault-number" style="top:70px; left:135px;">3</span>
            <span class="vault-number" style="top:115px; left:120px;">4</span>
            <span class="vault-number" style="top:130px; left:70px;">5</span>
            <span class="vault-number" style="top:115px; left:20px;">6</span>
            <span class="vault-number" style="top:70px; left:5px;">7</span>
            <span class="vault-number" style="top:25px; left:20px;">8</span>
            <span class="vault-number" style="top:5px; left:40px;">9</span>
          </div>
        </div>
        <div class="btn-group-row">
          <button class="agent-btn glow-btn" onclick="addVaultNum()">ADD NUMBER</button>
          <button class="agent-btn" style="background:#dc2626;" onclick="resetVault()">CLEAR</button>
        </div>`;
    }
    currentVaultCombo = []; dialAngle = 0;

  } else if (idx === 6) {
    if (title) title.innerText = `${t.term} 6: DETECTIVE READING MYSTERY ${t.icon}`;
    if (prompt) prompt.innerText = `Read the passage carefully to answer the question!`;
    if (area) {
      area.innerHTML = `
        <div class="reading-pass-box">
          It was a sunny morning at Manzanita Elementary. ${agentName} and ${sidekickName} walked quietly down the hallway toward the library. Suddenly, a polite parrot flew over the bookshelves holding a sparkling object in its beak. The parrot dropped the item carefully under the teacher's large oak desk. ${sidekickName} gasped with excitement. It turned out to be the special ${t.m6Color} needed for 2nd grade! Everyone cheered softly so they wouldn't disturb the reading class.
        </div>
        <p style="font-weight:bold; margin-top:10px;">Where did the parrot drop the ${t.m6Color}?</p>
        <div class="choice-grid">
          <button class="choice-btn wrong-m">In a blue backpack</button>
          <button class="choice-btn correct-m">Under the teacher's desk</button>
          <button class="choice-btn wrong-m">On top of the bookshelf</button>
        </div>`;
    }
    const correctM = document.querySelector(".correct-m");
    if (correctM) correctM.addEventListener("click", () => completeMission());
    document.querySelectorAll(".wrong-m").forEach(b => b.addEventListener("click", () => { 
      initAudio(); 
      playSound('wrong'); 
    }));

  } else if (idx === 12) {
    if (title) title.innerText = `${t.term} 12: MUSIC CLASS RHYTHM ${t.icon}`;
    if (prompt) prompt.innerText = `Count the beats in two 4-beat measures (4 + 4 = ?);`;
    if (area) {
      area.innerHTML = `
        <div class="choice-grid">
          <button class="choice-btn correct-m">8 Beats</button>
          <button class="choice-btn wrong-m">6 Beats</button>
        </div>`;
    }
    const correctM = document.querySelector(".correct-m");
    if (correctM) correctM.addEventListener("click", () => completeMission());
    document.querySelectorAll(".wrong-m").forEach(b => b.addEventListener("click", () => { 
      initAudio(); 
      playSound('wrong'); 
    }));

  } else {
    // Missions 7-11, 13-20 Standard Routing
    if (title) title.innerText = `${t.term} ${idx} ${t.icon}`;
    if (prompt) prompt.innerText = `Complete 2nd Grade Challenge Sector ${idx}!`;
    if (area) {
      area.innerHTML = `
        <div class="choice-grid">
          <button class="choice-btn correct-m">Start Sector ${idx} ➔</button>
        </div>`;
    }
    const correctM = document.querySelector(".correct-m");
    if (correctM) correctM.addEventListener("click", () => completeMission());
  }
}

// Search Spot Logic (for interactive search mechanics)
function searchSpot(spotKey, numVal, isReal) {
  initAudio();
  const el = document.getElementById(`spot-${spotKey}`);
  if (!el) return;

  if (!el.classList.contains("found") && !el.classList.contains("empty-found")) {
    if (isReal) {
      el.classList.add("found");
      playSound('click');
      el.innerText = `Found Number: [ ${numVal} ]`;
      m3NumbersFound.push(numVal);

      if (m3NumbersFound.length === 3) {
        playSound('success');
        const t = themes[selectedTheme] || themes['spy'];
        setTimeout(() => {
          alert(`📝 ${agentName}, make sure you wrote down ${t.numSeq.join(' - ')} on your paper! Proceeding!`);
          completeMission();
        }, 800);
      }
    } else {
      el.classList.add("empty-found");
      playSound('wrong');
      el.innerText = `Empty Decoy! Nothing here!`;
    }
  }
}

// Canvas Scratch Off Setup
function setupScratchCanvas() {
  const cvs = document.getElementById("scratch-cvs");
  if (!cvs) return;
  const ctx = cvs.getContext("2d");
  cvs.width = cvs.offsetWidth || 300; 
  cvs.height = cvs.offsetHeight || 100;
  ctx.fillStyle = "#888899"; 
  ctx.fillRect(0,0,cvs.width,cvs.height);
  ctx.fillStyle = "#333"; 
  ctx.font = "bold 16px sans-serif"; 
  ctx.textAlign = "center";
  ctx.fillText("SCRATCH HERE WITH FINGER / MOUSE", cvs.width/2, cvs.height/2 + 5);

  let isScratching = false;
  function scratch(e) {
    if (!isScratching) return;
    const rect = cvs.getBoundingClientRect();
    const clientX = e.clientX || (e.touches && e.touches[0] ? e.touches[0].clientX : 0);
    const clientY = e.clientY || (e.touches && e.touches[0] ? e.touches[0].clientY : 0);
    const x = clientX - rect.left;
    const y = clientY - rect.top;
    ctx.globalCompositeOperation = 'destination-out';
    ctx.beginPath(); 
    ctx.arc(x, y, 22, 0, Math.PI*2); 
    ctx.fill();
    playSound('click'); 
    m3ScratchCount++;
    if (m3ScratchCount > 25) { 
      setTimeout(() => completeMission(), 1000); 
    }
  }

  cvs.addEventListener("mousedown", () => isScratching = true);
  cvs.addEventListener("mouseup", () => isScratching = false);
  cvs.addEventListener("mousemove", scratch);
  cvs.addEventListener("touchstart", () => isScratching = true);
  cvs.addEventListener("touchend", () => isScratching = false);
  cvs.addEventListener("touchmove", scratch);
}

// 3D Vault Wheel Logic
let currentWheelVal = 1;
function rotateVaultWheel() {
  initAudio(); 
  playSound('click');
  dialAngle += 40;
  const wheel = document.getElementById("v-wheel");
  if (wheel) wheel.style.transform = `rotate(${dialAngle}deg)`;
  currentWheelVal = ((currentWheelVal) % 9) + 1;
}

function addVaultNum() {
  initAudio();
  if (currentVaultCombo.length < 3) {
    currentVaultCombo.push(currentWheelVal.toString());
    playSound('click');
    const disp = document.getElementById("vault-combo-disp");
    if (disp) disp.innerText = currentVaultCombo.join(" ");

    if (currentVaultCombo.length === 3) {
      const t = themes[selectedTheme] || themes['spy'];
      if (currentVaultCombo.join("") === t.targetCode) {
        playSound('success'); 
        triggerConfetti();
        setTimeout(() => completeMission(), 600);
      } else {
        playSound('wrong');
        alert(`❌ VAULT LOCK REJECTED! Recalculate your Numbers (${t.numSeq.join(' - ')})`);
        resetVault();
      }
    }
  }
}

function resetVault() {
  currentVaultCombo = [];
  const disp = document.getElementById("vault-combo-disp");
  if (disp) disp.innerText = "_ _ _";
}

// Mission Completion Engine
function completeMission() {
  playSound('success');
  const t = themes[selectedTheme] || themes['spy'];
  const anim = animationsData[currentMissionIndex - 1] || { icon: "⭐", text: "Sector Completed!" };

  const cutsceneTitle = document.getElementById("cutscene-title");
  if (cutsceneTitle) cutsceneTitle.innerText = `${t.term} ${currentMissionIndex} COMPLETE!`;

  const cutsceneSubtext = document.getElementById("cutscene-subtext");
  if (cutsceneSubtext) cutsceneSubtext.innerText = anim.text;

  const stage = document.getElementById("anim-stage");
  if (stage) {
    if (currentMissionIndex === 2 && lastTransportChoice === "car") {
      stage.innerHTML = `<div class="anim-vehicle">🚗</div>`;
      if (cutsceneSubtext) cutsceneSubtext.innerText = "Vroom! Your Family Car arrives safely at Manzanita Elementary!";
    } else if (currentMissionIndex === 2 && lastTransportChoice === "bus") {
      stage.innerHTML = `<div class="anim-vehicle">🚌</div>`;
      if (cutsceneSubtext) cutsceneSubtext.innerText = "Honk Honk! The Manzanita School Bus pulls up to the school doors!";
    } else {
      stage.innerHTML = `<div class="anim-icon">${anim.icon}</div>`;
    }
  }

  showScreen("screen-cutscene");
  currentMissionIndex++;
}