// Credentials & Permanent Settings
let agentName = "Athen";
const sidekickName = "Poppy the Rainbow Bunny";
let selectedAvatar = "🔎";
let bgmEnabled = false;
let lastTransportChoice = "bus";

// Progress Engine
let currentMissionIndex = 1;
let m1Count = 0;
let m3NumbersFound = [];
let enteredKeypadCode = "";

// Unified Detective Theme Config
const detectiveTheme = {
  title: "MYSTERY DETECTIVE",
  icon: "🔎",
  roleLabel: "DETECTIVE",
  term: "CASE",
  stamp: "CONFIDENTIAL",
  numSeq: ["8", "3", "1"],
  targetCode: "831",
  m4Math: { q: "El detective examinó 7 pistas en la biblioteca y 6 en el patio. ¿Total?", ans: 13, options: [11, 13, 14] },
  m6Color: "bronze magnifying glass",
  m7Seq: "🟡 Yellow | 🟤 Brown"
};

const animationsData = [
  { icon: "🎒", text: "Backpack packed for Manzanita Elementary!" },
  { icon: "🚌", text: "Transport departing down Manzanita Lane!" },
  { icon: "📝", text: "Secret Numbers found and written safely!" },
  { icon: "🤖", text: "Dual-Language System re-aligned!" },
  { icon: "🔓", text: "Digital Vault Console Decoded!" },
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
  { icon: "🏆", text: "Classroom Rule master achieved!" },
  { icon: "🐱", text: "Spanish Pet Story Mastered!" },
  { icon: "🍎", text: "Spanish Apple Snack Story Solved!" },
  { icon: "⚽", text: "Spanish Recess Story Decoded!" },
  { icon: "🎨", text: "Spanish Color Painting Story Solved!" },
  { icon: "🌟", text: "GOLDEN SCHOOL BADGE RECOVERED!" }
];

// Web Audio
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

// Teletype / Typewriter Briefing Effect
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
      i++;
    } else { 
      clearInterval(timer); 
      const box = document.getElementById("briefing-box");
      if (box) box.scrollTop = 0;
      if (callback) callback(); 
    }
  }, 20);
}

// Canvas Confetti
let particles = [];
let animFrameId = null;

function clearFxCanvas() {
  const cvs = document.getElementById("fx-canvas");
  if (cvs) {
    const ctx = cvs.getContext("2d");
    ctx.clearRect(0, 0, cvs.width, cvs.height);
  }
  if (animFrameId) {
    cancelAnimationFrame(animFrameId);
    animFrameId = null;
  }
  particles = [];
}

function triggerConfetti() {
  clearFxCanvas();
  const cvs = document.getElementById("fx-canvas");
  if (!cvs) return;
  const ctx = cvs.getContext("2d");
  cvs.width = window.innerWidth; cvs.height = window.innerHeight;
  particles = [];
  for (let i = 0; i < 60; i++) {
    particles.push({ x: cvs.width/2, y: cvs.height/2, vx: (Math.random()-0.5)*12, vy: (Math.random()-0.5)*12-4, color: `hsl(${Math.random()*360}, 100%, 50%)`, size: Math.random()*8+4, life: 50 });
  }
  function loop() {
    ctx.clearRect(0,0,cvs.width,cvs.height);
    particles.forEach((p, idx) => {
      p.x += p.vx; p.y += p.vy; p.vy += 0.2; p.life--;
      ctx.fillStyle = p.color; ctx.fillRect(p.x, p.y, p.size, p.size);
      if (p.life <= 0) particles.splice(idx, 1);
    });
    if (particles.length > 0) {
      animFrameId = requestAnimationFrame(loop);
    } else {
      ctx.clearRect(0, 0, cvs.width, cvs.height);
    }
  }
  loop();
}

function triggerErrorShake() {
  const card = document.getElementById("mission-card");
  if (card) {
    card.classList.add("card-shake");
    setTimeout(() => card.classList.remove("card-shake"), 400);
  }
}

function updatePoppyState(state, text) {
  const comp = document.getElementById("poppy-companion");
  const bubble = document.getElementById("poppy-bubble");
  if (comp) {
    comp.className = state === 'happy' ? 'poppy-happy' : 'poppy-idle';
  }
  if (bubble && text) bubble.innerText = text;
}

function updateProgressHUD(idx) {
  const progressText = document.getElementById("hud-progress-text");
  const progressFill = document.getElementById("hud-progress-fill");
  if (progressText) progressText.innerText = `${idx}/25`;
  if (progressFill) progressFill.style.width = `${(idx / 25) * 100}%`;
}

function showScreen(id) {
  clearFxCanvas();
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  const target = document.getElementById(id);
  if (target) {
    target.classList.add('active');
  }
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

  const saveBtn = document.getElementById("save-setup-btn");
  if (saveBtn) {
    saveBtn.addEventListener("click", () => {
      initAudio(); 
      playSound('click');

      const nameInput = document.getElementById("input-agent-name");
      if (nameInput && nameInput.value.trim()) agentName = nameInput.value.trim();

      const hudName = document.getElementById("hud-name");
      if (hudName) hudName.innerText = agentName.toUpperCase();

      const hudSidekick = document.getElementById("hud-sidekick");
      if (hudSidekick) hudSidekick.innerText = "POPPY 🐰";

      const hudAvatar = document.getElementById("hud-avatar");
      if (hudAvatar) hudAvatar.innerText = selectedAvatar;

      document.querySelectorAll(".display-agent-name").forEach(el => el.innerText = agentName);
      document.querySelectorAll(".display-sidekick-name").forEach(el => el.innerText = sidekickName);

      showScreen("screen-briefing");

      const briefingText = `WELCOME 2ND GRADER / ¡BIENVENIDO!\n\n1. The Golden Badge is missing at Manzanita Elementary!\n2. Complete 25 fun cases with ${sidekickName}.\n3. Find secret Numbers & unlock the Golden Vault!`;
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
      if (currentMissionIndex <= 25) { 
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

// Full 25-Mission Load Engine with Dual-Language Prompts & Spanish Reading Focus
function loadMission(idx) {
  clearFxCanvas();
  currentMissionIndex = idx;
  const t = detectiveTheme;
  updateProgressHUD(idx);
  updatePoppyState('idle', `Case ${idx}: Let's do this! 🔎`);

  showScreen("screen-mission");

  const area = document.getElementById("mission-interactive-area"); 
  if (area) area.innerHTML = "";
  
  const title = document.getElementById("mission-title");
  const prompt = document.getElementById("mission-prompt");
  const promptEs = document.getElementById("mission-prompt-es");

  if (idx === 1) {
    if (title) title.innerText = `${t.term} 1: MORNING LAUNCH ${t.icon}`;
    if (prompt) prompt.innerText = `Find the 5 essential 2nd grade items ${agentName} needs!`;
    if (promptEs) promptEs.innerText = `¡Encuentra los 5 objetos esenciales para 2º grado!`;
    if (area) {
      area.innerHTML = `
        <div id="m1-grid" class="item-grid">
          <button class="grid-item correct-m1">🎒 Backpack / Mochila</button>
          <button class="grid-item wrong-m1">🌙 Pajamas / Pijama</button>
          <button class="grid-item correct-m1">👟 Shoes / Zapatos</button>
          <button class="grid-item wrong-m1">📺 Remote / Control</button>
          <button class="grid-item correct-m1">🍱 Lunchbox / Lonchera</button>
          <button class="grid-item correct-m1">💧 Water / Agua</button>
          <button class="grid-item correct-m1">✏️ Pencils / Lápices</button>
          <button class="grid-item wrong-m1">🛌 Pillow / Almohada</button>
        </div>`;
    }
    m1Count = 0;
    document.querySelectorAll(".correct-m1").forEach(b => b.addEventListener("click", () => {
      initAudio();
      if (!b.classList.contains("selected")) { 
        b.classList.add("selected"); 
        m1Count++; 
        playSound('click'); 
        triggerConfetti();
        updatePoppyState('happy', 'Great find! ¡Buen trabajo!');
        if (m1Count === 5) setTimeout(() => completeMission(), 600); 
      }
    }));
    document.querySelectorAll(".wrong-m1").forEach(b => b.addEventListener("click", () => { 
      initAudio(); 
      playSound('wrong'); 
      triggerErrorShake();
      updatePoppyState('idle', "Not for school! ¡Ese no!");
    }));

  } else if (idx === 2) {
    if (title) title.innerText = `${t.term} 2: THE ROAD TO MANZANITA ${t.icon}`;
    if (prompt) prompt.innerText = `${agentName}, how do you travel to Manzanita Elementary this morning?`;
    if (promptEs) promptEs.innerText = `¿Cómo viajas a la escuela esta mañana?`;
    if (area) {
      area.innerHTML = `
        <div class="choice-grid">
          <button class="choice-btn correct-m2" data-trans="car">🚗 Family Car / Auto</button>
          <button class="choice-btn correct-m2" data-trans="bus">🚌 School Bus / Autobús</button>
          <button class="choice-btn wrong-m2">🚀 Space Rocket / Cohete</button>
          <button class="choice-btn wrong-m2">🐘 Elephant / Elefante</button>
        </div>`;
    }
    document.querySelectorAll(".correct-m2").forEach(b => b.addEventListener("click", (e) => { 
      lastTransportChoice = e.target.getAttribute("data-trans"); 
      triggerConfetti();
      completeMission(); 
    }));
    document.querySelectorAll(".wrong-m2").forEach(b => b.addEventListener("click", () => { 
      initAudio(); 
      playSound('wrong'); 
      triggerErrorShake();
    }));

  } else if (idx === 3) {
    if (title) title.innerText = `${t.term} 3: SEARCH THE CLASSROOM ${t.icon}`;
    if (prompt) prompt.innerText = `Search the 6 classroom spots below! 3 contain secret Numbers, and 3 are empty decoys!`;
    if (promptEs) promptEs.innerText = `¡Busca los 3 números secretos en el salón!`;
    if (area) {
      area.innerHTML = `
        <div class="pencil-note">✏️ <strong>SLEUTH MANDATE:</strong> Get real paper & write down the 3 secret Numbers you find!</div>
        <div class="search-grid-6">
          <div class="search-spot" id="spot-desk" onclick="searchSpot('desk', '${t.numSeq[0]}', true)">🗄️ Desk / Escritorio</div>
          <div class="search-spot" id="spot-toys" onclick="searchSpot('toys', '', false)">🧸 Toys / Juguetes</div>
          <div class="search-spot" id="spot-globe" onclick="searchSpot('globe', '${t.numSeq[1]}', true)">🌐 Globe / Globo</div>
          <div class="search-spot" id="spot-clock" onclick="searchSpot('clock', '', false)">⏰ Clock / Reloj</div>
          <div class="search-spot" id="spot-books" onclick="searchSpot('books', '${t.numSeq[2]}', true)">📚 Books / Libros</div>
          <div class="search-spot" id="spot-crafts" onclick="searchSpot('crafts', '', false)">🎨 Crafts / Arte</div>
        </div>`;
    }
    m3NumbersFound = [];

  } else if (idx === 4) {
    if (title) title.innerText = `${t.term} 4: SPANISH MATH CHALLENGE ${t.icon}`;
    if (prompt) prompt.innerText = `Spanish Math Challenge / Desafío de Matemáticas:`;
    if (promptEs) promptEs.innerText = `"${t.m4Math.q}"`;
    if (area) {
      area.innerHTML = `
        <div class="choice-grid">
          <button class="choice-btn ${t.m4Math.options[0] === t.m4Math.ans ? 'correct-m' : 'wrong-m'}">${t.m4Math.options[0]}</button>
          <button class="choice-btn ${t.m4Math.options[1] === t.m4Math.ans ? 'correct-m' : 'wrong-m'}">${t.m4Math.options[1]}</button>
          <button class="choice-btn ${t.m4Math.options[2] === t.m4Math.ans ? 'correct-m' : 'wrong-m'}">${t.m4Math.options[2]}</button>
        </div>`;
    }
    const correctM = document.querySelector(".correct-m");
    if (correctM) correctM.addEventListener("click", () => { triggerConfetti(); completeMission(); });
    document.querySelectorAll(".wrong-m").forEach(b => b.addEventListener("click", () => { initAudio(); playSound('wrong'); triggerErrorShake(); }));

  } else if (idx === 5) {
    if (title) title.innerText = `${t.term} 5: DIGITAL VAULT CONSOLE ${t.icon}`;
    if (prompt) prompt.innerText = `Enter the 3 secret Numbers you wrote on your paper (${t.numSeq.join(' - ')})!`;
    if (promptEs) promptEs.innerText = `¡Ingresa los 3 números secretos de tu papel!`;
    if (area) {
      area.innerHTML = `
        <div class="keypad-console">
          <div class="code-display" id="vault-combo-disp">_ _ _</div>
          <div class="keypad-grid-3x3">
            <button class="digit-btn" onclick="pressPadDigit('1')">1</button>
            <button class="digit-btn" onclick="pressPadDigit('2')">2</button>
            <button class="digit-btn" onclick="pressPadDigit('3')">3</button>
            <button class="digit-btn" onclick="pressPadDigit('4')">4</button>
            <button class="digit-btn" onclick="pressPadDigit('5')">5</button>
            <button class="digit-btn" onclick="pressPadDigit('6')">6</button>
            <button class="digit-btn" onclick="pressPadDigit('7')">7</button>
            <button class="digit-btn" onclick="pressPadDigit('8')">8</button>
            <button class="digit-btn" onclick="pressPadDigit('9')">9</button>
          </div>
          <button class="agent-btn clear-btn" style="margin-top:10px;" onclick="resetVaultPad()">CLEAR / BORRAR</button>
        </div>`;
    }
    enteredKeypadCode = "";

  } else if (idx === 6) {
    if (title) title.innerText = `${t.term} 6: DETECTIVE READING MYSTERY ${t.icon}`;
    if (prompt) prompt.innerText = `Read the passage carefully to answer the question!`;
    if (promptEs) promptEs.innerText = `Lee el texto con atención para responder:`;
    if (area) {
      area.innerHTML = `
        <div class="reading-pass-box">
          It was a sunny morning at Manzanita Elementary. ${agentName} and ${sidekickName} walked quietly down the hallway toward the library. Suddenly, a polite parrot flew over the bookshelves holding a sparkling object in its beak. The parrot dropped the item carefully under the teacher's large oak desk. ${sidekickName} gasped with excitement. It turned out to be the special ${t.m6Color} needed for 2nd grade! Everyone cheered softly so they wouldn't disturb the reading class.
        </div>
        <p style="font-weight:bold; margin-top:10px;">Where did the parrot drop the ${t.m6Color}?</p>
        <div class="choice-grid">
          <button class="choice-btn wrong-m">In a blue backpack / Mochila</button>
          <button class="choice-btn correct-m">Under the teacher's desk / Escritorio</button>
          <button class="choice-btn wrong-m">On top of the bookshelf / Estante</button>
        </div>`;
    }
    const correctM = document.querySelector(".correct-m");
    if (correctM) correctM.addEventListener("click", () => { triggerConfetti(); completeMission(); });
    document.querySelectorAll(".wrong-m").forEach(b => b.addEventListener("click", () => { initAudio(); playSound('wrong'); triggerErrorShake(); }));

  } else if (idx === 7) {
    if (title) title.innerText = `${t.term} 7: SPANISH PATTERN ARRAY ${t.icon}`;
    if (prompt) prompt.innerText = `¿Qué sigue en el patrón? / What comes next?`;
    if (promptEs) promptEs.innerText = `Yellow | Brown | Yellow | Brown | [ ? ]`;
    if (area) {
      area.innerHTML = `
        <div class="choice-grid">
          <button class="choice-btn correct-m">Yellow / Amarillo</button>
          <button class="choice-btn wrong-m">White / Blanco</button>
        </div>`;
    }
    const correctM = document.querySelector(".correct-m");
    if (correctM) correctM.addEventListener("click", () => { triggerConfetti(); completeMission(); });
    document.querySelectorAll(".wrong-m").forEach(b => b.addEventListener("click", () => { initAudio(); playSound('wrong'); triggerErrorShake(); }));

  } else if (idx === 8) {
    if (title) title.innerText = `${t.term} 8: CAFETERIA FRACTIONS ${t.icon}`;
    if (prompt) prompt.innerText = `${agentName} splits a snack into 2 equal parts with ${sidekickName}. What is each part called?`;
    if (promptEs) promptEs.innerText = `Si divides un bocadillo en 2 partes iguales, ¿cómo se llama cada parte?`;
    if (area) {
      area.innerHTML = `
        <div class="choice-grid">
          <button class="choice-btn correct-m">One Half (1/2) / Un Medio</button>
          <button class="choice-btn wrong-m">One Quarter (1/4) / Un Cuarto</button>
        </div>`;
    }
    const correctM = document.querySelector(".correct-m");
    if (correctM) correctM.addEventListener("click", () => { triggerConfetti(); completeMission(); });
    document.querySelectorAll(".wrong-m").forEach(b => b.addEventListener("click", () => { initAudio(); playSound('wrong'); triggerErrorShake(); }));

  } else if (idx === 9) {
    if (title) title.innerText = `${t.term} 9: RECESS GAME CALCULATION ${t.icon}`;
    if (prompt) prompt.innerText = `Your 2nd grade team scored 6 points in game 1 and 5 points in game 2. Total points?`;
    if (promptEs) promptEs.innerText = `Tu equipo anotó 6 puntos y luego 5 puntos. ¿Total de puntos?`;
    if (area) {
      area.innerHTML = `
        <div class="choice-grid">
          <button class="choice-btn wrong-m">10 Points / Puntos</button>
          <button class="choice-btn correct-m">11 Points / Puntos</button>
        </div>`;
    }
    const correctM = document.querySelector(".correct-m");
    if (correctM) correctM.addEventListener("click", () => { triggerConfetti(); completeMission(); });
    document.querySelectorAll(".wrong-m").forEach(b => b.addEventListener("click", () => { initAudio(); playSound('wrong'); triggerErrorShake(); }));

  } else if (idx === 10) {
    if (title) title.innerText = `${t.term} 10: SCIENCE LAB DISCOVERY ${t.icon}`;
    if (prompt) prompt.innerText = `En Español: ¿Qué necesita una planta para crecer en Manzanita Elementary?`;
    if (promptEs) promptEs.innerText = `What does a plant need to grow?`;
    if (area) {
      area.innerHTML = `
        <div class="choice-grid">
          <button class="choice-btn correct-m">Agua y Luz del Sol ☀️</button>
          <button class="choice-btn wrong-m">Refresco y Dulces 🍬</button>
        </div>`;
    }
    const correctM = document.querySelector(".correct-m");
    if (correctM) correctM.addEventListener("click", () => { triggerConfetti(); completeMission(); });
    document.querySelectorAll(".wrong-m").forEach(b => b.addEventListener("click", () => { initAudio(); playSound('wrong'); triggerErrorShake(); }));

  } else if (idx === 11) {
    if (title) title.innerText = `${t.term} 11: ART STUDIO COLOR MIXING ${t.icon}`;
    if (prompt) prompt.innerText = `What color do you get when you mix Red and Yellow paint together?`;
    if (promptEs) promptEs.innerText = `¿Qué color obtienes al mezclar rojo y amarillo?`;
    if (area) {
      area.innerHTML = `
        <div class="choice-grid">
          <button class="choice-btn wrong-m">Purple / Morado</button>
          <button class="choice-btn correct-m">Orange / Naranja</button>
        </div>`;
    }
    const correctM = document.querySelector(".correct-m");
    if (correctM) correctM.addEventListener("click", () => { triggerConfetti(); completeMission(); });
    document.querySelectorAll(".wrong-m").forEach(b => b.addEventListener("click", () => { initAudio(); playSound('wrong'); triggerErrorShake(); }));

  } else if (idx === 12) {
    if (title) title.innerText = `${t.term} 12: MUSIC CLASS RHYTHM ${t.icon}`;
    if (prompt) prompt.innerText = `Count the beats in two 4-beat measures (4 + 4 = ?)`;
    if (promptEs) promptEs.innerText = `Cuenta los tiempos en dos compases (4 + 4 = ?)`;
    if (area) {
      area.innerHTML = `
        <div class="choice-grid">
          <button class="choice-btn correct-m">8 Beats / Tiempos</button>
          <button class="choice-btn wrong-m">6 Beats / Tiempos</button>
        </div>`;
    }
    const correctM = document.querySelector(".correct-m");
    if (correctM) correctM.addEventListener("click", () => { triggerConfetti(); completeMission(); });
    document.querySelectorAll(".wrong-m").forEach(b => b.addEventListener("click", () => { initAudio(); playSound('wrong'); triggerErrorShake(); }));

  } else if (idx === 13) {
    if (title) title.innerText = `${t.term} 13: LIBRARY MAP COORDINATES ${t.icon}`;
    if (prompt) prompt.innerText = `Find the 2nd grade book shelf at coordinates (5 + 3). What is 5 + 3?`;
    if (promptEs) promptEs.innerText = `Encuentra el estante en las coordenadas (5 + 3). ¿Cuánto es 5 + 3?`;
    if (area) {
      area.innerHTML = `
        <div class="choice-grid">
          <button class="choice-btn wrong-m">7</button>
          <button class="choice-btn correct-m">8</button>
        </div>`;
    }
    const correctM = document.querySelector(".correct-m");
    if (correctM) correctM.addEventListener("click", () => { triggerConfetti(); completeMission(); });
    document.querySelectorAll(".wrong-m").forEach(b => b.addEventListener("click", () => { initAudio(); playSound('wrong'); triggerErrorShake(); }));

  } else if (idx === 14) {
    if (title) title.innerText = `${t.term} 14: COMPUTER LAB CODING ${t.icon}`;
    if (prompt) prompt.innerText = `Fill in the missing code sequence: 10, 20, 30, [ ? ], 50`;
    if (promptEs) promptEs.innerText = `Completa la secuencia numérica: 10, 20, 30, [ ? ], 50`;
    if (area) {
      area.innerHTML = `
        <div class="choice-grid">
          <button class="choice-btn correct-m">40</button>
          <button class="choice-btn wrong-m">35</button>
        </div>`;
    }
    const correctM = document.querySelector(".correct-m");
    if (correctM) correctM.addEventListener("click", () => { triggerConfetti(); completeMission(); });
    document.querySelectorAll(".wrong-m").forEach(b => b.addEventListener("click", () => { initAudio(); playSound('wrong'); triggerErrorShake(); }));

  } else if (idx === 15) {
    if (title) title.innerText = `${t.term} 15: SPANISH ANIMAL IDENTIFIER ${t.icon}`;
    if (prompt) prompt.innerText = `¿Cómo se dice "dog" en Español?`;
    if (promptEs) promptEs.innerText = `How do you say "dog" in Spanish?`;
    if (area) {
      area.innerHTML = `
        <div class="choice-grid">
          <button class="choice-btn correct-m">El Perro 🐕</button>
          <button class="choice-btn wrong-m">El Gato 🐈</button>
        </div>`;
    }
    const correctM = document.querySelector(".correct-m");
    if (correctM) correctM.addEventListener("click", () => { triggerConfetti(); completeMission(); });
    document.querySelectorAll(".wrong-m").forEach(b => b.addEventListener("click", () => { initAudio(); playSound('wrong'); triggerErrorShake(); }));

  } else if (idx === 16) {
    if (title) title.innerText = `${t.term} 16: GARDEN MEASUREMENT ${t.icon}`;
    if (prompt) prompt.innerText = `A sunflower is 12 inches tall. It grows 6 more inches. How tall is it now?`;
    if (promptEs) promptEs.innerText = `Un girasol mide 12 pulgadas. Crece 6 pulgadas más. ¿Cuánto mide ahora?`;
    if (area) {
      area.innerHTML = `
        <div class="choice-grid">
          <button class="choice-btn wrong-m">16 inches / Pulgadas</button>
          <button class="choice-btn correct-m">18 inches / Pulgadas</button>
        </div>`;
    }
    const correctM = document.querySelector(".correct-m");
    if (correctM) correctM.addEventListener("click", () => { triggerConfetti(); completeMission(); });
    document.querySelectorAll(".wrong-m").forEach(b => b.addEventListener("click", () => { initAudio(); playSound('wrong'); triggerErrorShake(); }));

  } else if (idx === 17) {
    if (title) title.innerText = `${t.term} 17: BELL TIMER CALIBRATION ${t.icon}`;
    if (prompt) prompt.innerText = `School starts at 8:00 AM. It is 7:45 AM. How many minutes until the bell rings?`;
    if (promptEs) promptEs.innerText = `La escuela empieza a las 8:00 AM. Son las 7:45 AM. ¿Cuántos minutos faltan?`;
    if (area) {
      area.innerHTML = `
        <div class="choice-grid">
          <button class="choice-btn correct-m">15 Minutes / Minutos</button>
          <button class="choice-btn wrong-m">30 Minutes / Minutos</button>
        </div>`;
    }
    const correctM = document.querySelector(".correct-m");
    if (correctM) correctM.addEventListener("click", () => { triggerConfetti(); completeMission(); });
    document.querySelectorAll(".wrong-m").forEach(b => b.addEventListener("click", () => { initAudio(); playSound('wrong'); triggerErrorShake(); }));

  } else if (idx === 18) {
    if (title) title.innerText = `${t.term} 18: SPANISH DAYS OF THE WEEK ${t.icon}`;
    if (prompt) prompt.innerText = `¿Qué día viene después del Lunes (Monday)?`;
    if (promptEs) promptEs.innerText = `What day comes after Monday?`;
    if (area) {
      area.innerHTML = `
        <div class="choice-grid">
          <button class="choice-btn correct-m">Martes (Tuesday)</button>
          <button class="choice-btn wrong-m">Domingo (Sunday)</button>
        </div>`;
    }
    const correctM = document.querySelector(".correct-m");
    if (correctM) correctM.addEventListener("click", () => { triggerConfetti(); completeMission(); });
    document.querySelectorAll(".wrong-m").forEach(b => b.addEventListener("click", () => { initAudio(); playSound('wrong'); triggerErrorShake(); }));

  } else if (idx === 19) {
    if (title) title.innerText = `${t.term} 19: FRIENDSHIP PROTOCOL ${t.icon}`;
    if (prompt) prompt.innerText = `${agentName} sees a classmate sitting alone at recess. What should you do?`;
    if (promptEs) promptEs.innerText = `Si ves a un compañero solo en el recreo, ¿qué debes hacer?`;
    if (area) {
      area.innerHTML = `
        <div class="choice-grid">
          <button class="choice-btn correct-m">Invite them to play! 🤝 / ¡Invitarlo a jugar!</button>
          <button class="choice-btn wrong-m">Ignore them / Ignorarlo</button>
        </div>`;
    }
    const correctM = document.querySelector(".correct-m");
    if (correctM) correctM.addEventListener("click", () => { triggerConfetti(); completeMission(); });
    document.querySelectorAll(".wrong-m").forEach(b => b.addEventListener("click", () => { initAudio(); playSound('wrong'); triggerErrorShake(); }));

  } else if (idx === 20) {
    if (title) title.innerText = `${t.term} 20: CLASSROOM RULE ${t.icon}`;
    if (prompt) prompt.innerText = `What is the official rule of 2nd Grade at Manzanita Elementary?`;
    if (promptEs) promptEs.innerText = `¿Cuál es la regla oficial de 2º Grado?`;
    if (area) {
      area.innerHTML = `
        <div class="choice-grid">
          <button class="choice-btn correct-m">Try your best & have fun! ⭐ / ¡Hacer tu mejor esfuerzo!</button>
          <button class="choice-btn wrong-m">Be perfect at everything / Ser perfecto en todo</button>
        </div>`;
    }
    const correctM = document.querySelector(".correct-m");
    if (correctM) correctM.addEventListener("click", () => { triggerConfetti(); completeMission(); });
    document.querySelectorAll(".wrong-m").forEach(b => b.addEventListener("click", () => { initAudio(); playSound('wrong'); triggerErrorShake(); }));

  // NEW SPANISH READING FOCUS CASES (21 TO 25)
  } else if (idx === 21) {
    if (title) title.innerText = `${t.term} 21: LECTURA EN ESPAÑOL - EL GATO 🐱 ${t.icon}`;
    if (prompt) prompt.innerText = `Read the Spanish story carefully to answer:`;
    if (promptEs) promptEs.innerText = `Lee la historia con atención para responder:`;
    if (area) {
      area.innerHTML = `
        <div class="reading-pass-box">
          El gato de ${agentName} se llama Pelusa. Pelusa es de color blanco y le gusta jugar con una pelota roja en el jardín de Manzanita Elementary.
        </div>
        <p style="font-weight:bold; margin-top:10px;">¿De qué color es Pelusa?</p>
        <div class="choice-grid">
          <button class="choice-btn wrong-m">Azul / Blue</button>
          <button class="choice-btn correct-m">Blanco / White</button>
          <button class="choice-btn wrong-m">Verde / Green</button>
        </div>`;
    }
    const correctM = document.querySelector(".correct-m");
    if (correctM) correctM.addEventListener("click", () => { triggerConfetti(); completeMission(); });
    document.querySelectorAll(".wrong-m").forEach(b => b.addEventListener("click", () => { initAudio(); playSound('wrong'); triggerErrorShake(); }));

  } else if (idx === 22) {
    if (title) title.innerText = `${t.term} 22: LECTURA EN ESPAÑOL - LA MERIENDA 🍎 ${t.icon}`;
    if (prompt) prompt.innerText = `Read the Spanish story carefully to answer:`;
    if (promptEs) promptEs.innerText = `Lee la historia con atención para responder:`;
    if (area) {
      area.innerHTML = `
        <div class="reading-pass-box">
          A las doce del día, ${sidekickName} abre su lonchera. Tiene una manzana roja y un bocadillo de queso delicioso.
        </div>
        <p style="font-weight:bold; margin-top:10px;">¿Qué fruta tiene en la lonchera?</p>
        <div class="choice-grid">
          <button class="choice-btn correct-m">Manzana / Apple 🍎</button>
          <button class="choice-btn wrong-m">Plátano / Banana 🍌</button>
          <button class="choice-btn wrong-m">Uvas / Grapes 🍇</button>
        </div>`;
    }
    const correctM = document.querySelector(".correct-m");
    if (correctM) correctM.addEventListener("click", () => { triggerConfetti(); completeMission(); });
    document.querySelectorAll(".wrong-m").forEach(b => b.addEventListener("click", () => { initAudio(); playSound('wrong'); triggerErrorShake(); }));

  } else if (idx === 23) {
    if (title) title.innerText = `${t.term} 23: LECTURA EN ESPAÑOL - EL RECREO ⚽ ${t.icon}`;
    if (prompt) prompt.innerText = `Read the Spanish story carefully to answer:`;
    if (promptEs) promptEs.innerText = `Lee la historia con atención para responder:`;
    if (area) {
      area.innerHTML = `
        <div class="reading-pass-box">
          En el recreo, los estudiantes corren al patio. ${agentName} juega al fútbol con sus amigos bajo el sol brillante.
        </div>
        <p style="font-weight:bold; margin-top:10px;">¿A qué juego juegan en el patio?</p>
        <div class="choice-grid">
          <button class="choice-btn wrong-m">Baloncesto / Basketball 🏀</button>
          <button class="choice-btn correct-m">Fútbol / Soccer ⚽</button>
          <button class="choice-btn wrong-m">Tenis / Tennis 🎾</button>
        </div>`;
    }
    const correctM = document.querySelector(".correct-m");
    if (correctM) correctM.addEventListener("click", () => { triggerConfetti(); completeMission(); });
    document.querySelectorAll(".wrong-m").forEach(b => b.addEventListener("click", () => { initAudio(); playSound('wrong'); triggerErrorShake(); }));

  } else if (idx === 24) {
    if (title) title.innerText = `${t.term} 24: LECTURA EN ESPAÑOL - LA CLASE DE ARTE 🎨 ${t.icon}`;
    if (prompt) prompt.innerText = `Read the Spanish story carefully to answer:`;
    if (promptEs) promptEs.innerText = `Lee la historia con atención para responder:`;
    if (area) {
      area.innerHTML = `
        <div class="reading-pass-box">
          En la clase de arte, la maestra dice: "Hoy pintamos un arcoíris con pintura azul, amarilla y roja".
        </div>
        <p style="font-weight:bold; margin-top:10px;">¿Qué pintan hoy en la clase de arte?</p>
        <div class="choice-grid">
          <button class="choice-btn wrong-m">Un coche / A car 🚗</button>
          <button class="choice-btn correct-m">Un arcoíris / A rainbow 🌈</button>
          <button class="choice-btn wrong-m">Un árbol / A tree 🌳</button>
        </div>`;
    }
    const correctM = document.querySelector(".correct-m");
    if (correctM) correctM.addEventListener("click", () => { triggerConfetti(); completeMission(); });
    document.querySelectorAll(".wrong-m").forEach(b => b.addEventListener("click", () => { initAudio(); playSound('wrong'); triggerErrorShake(); }));

  } else if (idx === 25) {
    if (title) title.innerText = `${t.term} 25: LECTURA EN ESPAÑOL - LA PLACA DORADA 🌟 ${t.icon}`;
    if (prompt) prompt.innerText = `Read the final Spanish mystery passage:`;
    if (promptEs) promptEs.innerText = `Lee la pista final en español:`;
    if (area) {
      area.innerHTML = `
        <div class="reading-pass-box">
          ¡Felicidades Detective ${agentName}! La Placa Dorada de Manzanita Elementary estaba dentro de la caja fuerte del segundo grado. ¡Lo lograste con éxito junto a ${sidekickName}!
        </div>
        <p style="font-weight:bold; margin-top:10px;">¿Dónde estaba la Placa Dorada?</p>
        <div class="choice-grid">
          <button class="choice-btn correct-m">En la caja fuerte / In the vault safe 🔐</button>
          <button class="choice-btn wrong-m">En el autobús / In the bus 🚌</button>
        </div>`;
    }
    const correctM = document.querySelector(".correct-m");
    if (correctM) correctM.addEventListener("click", () => { triggerConfetti(); completeMission(); });
    document.querySelectorAll(".wrong-m").forEach(b => b.addEventListener("click", () => { initAudio(); playSound('wrong'); triggerErrorShake(); }));
  }
}

// Search Spot Logic (3 Real, 3 Decoys for Mission 3)
function searchSpot(spotKey, numVal, isReal) {
  initAudio();
  const el = document.getElementById(`spot-${spotKey}`);
  if (!el) return;

  if (!el.classList.contains("found") && !el.classList.contains("empty-found")) {
    if (isReal) {
      el.classList.add("found");
      playSound('click');
      triggerConfetti();
      el.innerText = `Found Number: [ ${numVal} ]`;
      m3NumbersFound.push(numVal);
      updatePoppyState('happy', `Found Number ${numVal}! ¡Número encontrado!`);

      if (m3NumbersFound.length === 3) {
        playSound('success');
        const t = detectiveTheme;
        setTimeout(() => {
          alert(`📝 ${agentName}, make sure you wrote down ${t.numSeq.join(' - ')} on your paper! Proceeding!`);
          completeMission();
        }, 800);
      }
    } else {
      el.classList.add("empty-found");
      playSound('wrong');
      triggerErrorShake();
      el.innerText = `Empty Decoy! Nothing here!`;
      updatePoppyState('idle', "Empty spot! ¡Nada aquí!");
    }
  }
}

// Digital Keypad Console Logic (Mission 5)
function pressPadDigit(digit) {
  initAudio();
  if (enteredKeypadCode.length < 3) {
    enteredKeypadCode += digit;
    playSound('click');
    const disp = document.getElementById("vault-combo-disp");
    if (disp) disp.innerText = enteredKeypadCode;

    if (enteredKeypadCode.length === 3) {
      const t = detectiveTheme;
      if (enteredKeypadCode === t.targetCode) {
        playSound('success'); 
        triggerConfetti();
        updatePoppyState('happy', 'Vault Unlocked! ¡Bóveda abierta!');
        setTimeout(() => completeMission(), 600);
      } else {
        playSound('wrong');
        triggerErrorShake();
        updatePoppyState('idle', 'Wrong code! ¡Código incorrecto!');
        alert(`❌ CONSOLE CODE REJECTED! Recalculate your Numbers (${t.numSeq.join(' - ')})`);
        resetVaultPad();
      }
    }
  }
}

function resetVaultPad() {
  enteredKeypadCode = "";
  const disp = document.getElementById("vault-combo-disp");
  if (disp) disp.innerText = "_ _ _";
}

// Mission Completion Engine
function completeMission() {
  playSound('success');
  const t = detectiveTheme;
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