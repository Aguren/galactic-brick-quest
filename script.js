// Credentials & Theme Settings
let agentName = "Athen";
let sidekickName = "Poppy the Rainbow Bunny";
let selectedTheme = "spy";
let lastTransportChoice = "bus";

// Progress Engine
let currentMissionIndex = 1;
let m1Count = 0;
let m3NumbersFound = [];
let enteredKeypadCode = "";

// 9 Themes Engine Config
const themes = {
  spy: {
    title: "CYBER SPY", icon: "🕵️", roleLabel: "AGENT", term: "MISSION",
    stamp: "TOP SECRET", numSeq: ["7", "2", "9"], targetCode: "729",
    m4Math: { q: "El robot tiene 8 baterías. Le das 6 más. ¿Cuántas baterías tiene?", ans: 14, options: [12, 14, 16] },
    m6Color: "silver key", m7Seq: "🔴 Red | 🔵 Blue"
  },
  space: {
    title: "SPACE RANGER", icon: "🚀", roleLabel: "RANGER", term: "EXPEDITION",
    stamp: "COSMIC CLEARANCE", numSeq: ["4", "1", "8"], targetCode: "418",
    m4Math: { q: "El cohete tiene 9 celdas de energía. Cargas 5 más. ¿Total de celdas?", ans: 14, options: [11, 14, 15] },
    m6Color: "purple crystal", m7Seq: "🟣 Purple | 🟢 Green"
  },
  dino: {
    title: "DINO EXPLORER", icon: "🦖", roleLabel: "TRACKER", term: "SAFARI",
    stamp: "JURASSIC PERMIT", numSeq: ["3", "6", "5"], targetCode: "365",
    m4Math: { q: "El dinosaurio encontró 7 fósiles en la mañana y 8 en la tarde. ¿Total?", ans: 15, options: [13, 15, 17] },
    m6Color: "golden fossil", m7Seq: "🟠 Orange | 🟤 Brown"
  },
  unicorn: {
    title: "RAINBOW UNICORN", icon: "🦄", roleLabel: "GUARDIAN", term: "QUEST",
    stamp: "ROYAL DECREE", numSeq: ["5", "3", "8"], targetCode: "538",
    m4Math: { q: "El unicornio recolectó 9 gemas mágicas y luego 4 más. ¿Total de gemas?", ans: 13, options: [11, 13, 16] },
    m6Color: "pink crown", m7Seq: "💖 Pink | 💜 Violet"
  },
  fairy: {
    title: "ENCHANTED FAIRY", icon: "🧚", roleLabel: "SPRITE", term: "QUEST",
    stamp: "FAIRY SPELL", numSeq: ["2", "8", "4"], targetCode: "284",
    m4Math: { q: "El hada preparó 6 pociones brillantes y 7 pociones de luz. ¿Total?", ans: 13, options: [12, 13, 15] },
    m6Color: "emerald wand", m7Seq: "✨ Gold | 🌸 Pink"
  },
  popstar: {
    title: "ACADEMY POPSTAR", icon: "🎤", roleLabel: "PERFORMER", term: "TOUR",
    stamp: "VIP PASS", numSeq: ["6", "2", "7"], targetCode: "627",
    m4Math: { q: "La banda cantó 8 canciones en la práctica y 7 en el show. ¿Total?", ans: 15, options: [13, 15, 18] },
    m6Color: "gold microphone", m7Seq: "🩵 Cyan | 🩷 Magenta"
  },
  detective: {
    title: "MYSTERY DETECTIVE", icon: "🔎", roleLabel: "SLEUTH", term: "CASE",
    stamp: "CONFIDENTIAL", numSeq: ["8", "3", "1"], targetCode: "831",
    m4Math: { q: "El detective examinó 7 pistas en la biblioteca y 6 en el patio. ¿Total?", ans: 13, options: [11, 13, 14] },
    m6Color: "bronze magnifying glass", m7Seq: "🟡 Yellow | 🟤 Brown"
  },
  safari: {
    title: "JUNGLE SAFARI", icon: "🦁", roleLabel: "RANGER", term: "TREK",
    stamp: "WILD PERMIT", numSeq: ["1", "9", "4"], targetCode: "194",
    m4Math: { q: "El explorador vio 9 leones y 6 jirafas. ¿Cuántos animales en total?", ans: 15, options: [14, 15, 17] },
    m6Color: "emerald compass", m7Seq: "🟢 Green | 🟡 Yellow"
  },
  superhero: {
    title: "SCHOOL SUPERHERO", icon: "🦸", roleLabel: "HERO", term: "MISSION",
    stamp: "HERO LEAGUE", numSeq: ["9", "1", "6"], targetCode: "916",
    m4Math: { q: "El superhéroe rescató 8 mochilas en el pasillo y 7 en el aula. ¿Total?", ans: 15, options: [13, 15, 16] },
    m6Color: "red cape", m7Seq: "🔴 Red | 🟡 Yellow"
  }
};

// Post-Mission Custom Contextual Cutscenes
const animationsData = [
  { icon: "🎒", text: "Backpack packed and ready for Manzanita Elementary!", type: "bounce" },
  { icon: "🚌", text: "Transport departing down Manzanita Lane!", type: "vehicle" },
  { icon: "📝", text: "Secret Numbers written safely on paper!", type: "bounce" },
  { icon: "🤖", text: "Dual-Language System re-aligned!", type: "bounce" },
  { icon: "🔓", text: "Golden Vault Security Decoded!", type: "bounce" },
  { icon: "🔍", text: "Mystery Reading Clue deciphered!", type: "bounce" },
  { icon: "🎨", text: "Dual-Language Pattern completed!", type: "bounce" },
  { icon: "🍕", text: "Cafeteria Energy recharged!", type: "bounce" },
  { icon: "⚽", text: "Recess Kickball Goal scored!", type: "bounce" },
  { icon: "🌱", text: "Science Garden Sprout grown!", type: "bounce" },
  { icon: "🎨", text: "Art Studio masterpiece finished!", type: "bounce" },
  { icon: "🎵", text: "Music Class harmony synthesized!", type: "bounce" },
  { icon: "📚", text: "Library Map Search completed!", type: "bounce" },
  { icon: "💻", text: "Computer Lab code activated!", type: "bounce" },
  { icon: "🐕", text: "Spanish Vocabulary decoded!", type: "bounce" },
  { icon: "🌻", text: "Garden Sunflower measured!", type: "bounce" },
  { icon: "⏰", text: "School Bell Timer calibrated!", type: "bounce" },
  { icon: "📅", text: "Spanish Days of the Week aligned!", type: "bounce" },
  { icon: "🤝", text: "New Manzanita Friendship formed!", type: "bounce" },
  { icon: "🏆", text: "GOLDEN SCHOOL BADGE RECOVERED!", type: "bounce" }
];

// Audio Engine
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

  if (type === 'beep') {
    osc.type = 'sine'; osc.frequency.setValueAtTime(650, now);
    gain.gain.setValueAtTime(0.2, now); gain.gain.exponentialRampToValueAtTime(0.01, now + 0.1);
    osc.start(now); osc.stop(now + 0.1);
  } else if (type === 'success') {
    osc.type = 'triangle'; osc.frequency.setValueAtTime(450, now); osc.frequency.setValueAtTime(900, now + 0.12);
    gain.gain.setValueAtTime(0.3, now); gain.gain.exponentialRampToValueAtTime(0.01, now + 0.3);
    osc.start(now); osc.stop(now + 0.3);
  } else if (type === 'wrong') {
    osc.type = 'sawtooth'; osc.frequency.setValueAtTime(140, now);
    gain.gain.setValueAtTime(0.2, now); gain.gain.exponentialRampToValueAtTime(0.01, now + 0.2);
    osc.start(now); osc.stop(now + 0.2);
  }
}

function showScreen(id) {
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  document.getElementById(id).classList.add('active');
}

function applyThemeColors(tKey) {
  document.body.className = `theme-${tKey}`;
  const t = themes[tKey];

  document.getElementById("hud-role-label").innerText = t.roleLabel;
  document.getElementById("hud-theme").innerText = `${t.icon} ${t.title}`;
  document.getElementById("stamp-badge").innerText = t.stamp;
  document.getElementById("briefing-header").innerText = `${t.stamp} BRIEFING`;
  document.getElementById("setup-title").innerText = `MANZANITA ELEMENTARY ${t.title}`;
}

document.addEventListener("DOMContentLoaded", () => {
  // Theme Selector Buttons
  document.querySelectorAll(".theme-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      document.querySelectorAll(".theme-btn").forEach(b => b.classList.remove("active-theme"));
      btn.classList.add("active-theme");
      selectedTheme = btn.getAttribute("data-theme");
      applyThemeColors(selectedTheme);
    });
  });

  // Save Credentials
  document.getElementById("save-setup-btn").addEventListener("click", () => {
    initAudio(); playSound('beep');

    const nameInput = document.getElementById("input-agent-name").value.trim();
    const sidekickInput = document.getElementById("input-sidekick-name").value.trim();

    if (nameInput) agentName = nameInput;
    if (sidekickInput) sidekickName = sidekickInput;

    document.getElementById("hud-name").innerText = agentName.toUpperCase();
    document.getElementById("hud-sidekick").innerText = sidekickName.toUpperCase();

    document.querySelectorAll(".display-agent-name").forEach(el => el.innerText = agentName);
    document.querySelectorAll(".display-sidekick-name").forEach(el => el.innerText = sidekickName);

    showScreen("screen-briefing");
  });

  // Briefing Start
  document.getElementById("start-mission-btn").addEventListener("click", () => {
    initAudio(); playSound('beep');
    loadMission(1);
  });

  // Next Mission Button
  document.getElementById("next-mission-btn").addEventListener("click", () => {
    initAudio(); playSound('beep');
    if (currentMissionIndex <= 20) {
      loadMission(currentMissionIndex);
    } else {
      showScreen("screen-final");
    }
  });

  // Parent Intel Button
  document.getElementById("parent-intel-btn").addEventListener("click", () => {
    showScreen("screen-parent");
  });
});

// Load Mission Engine (1 through 20)
function loadMission(idx) {
  currentMissionIndex = idx;
  const t = themes[selectedTheme];
  document.getElementById("hud-progress").innerText = `${idx}/20`;
  showScreen("screen-mission");

  const area = document.getElementById("mission-interactive-area");
  area.innerHTML = "";
  const title = document.getElementById("mission-title");
  const prompt = document.getElementById("mission-prompt");

  if (idx === 1) {
    title.innerText = `${t.term} 1: MORNING LAUNCH ${t.icon}`;
    prompt.innerText = `Find the 5 essential 2nd grade items ${t.roleLabel.toLowerCase()} ${agentName} needs!`;
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
    
    m1Count = 0;
    document.querySelectorAll(".correct-m1").forEach(b => b.addEventListener("click", () => {
      initAudio();
      if (!b.classList.contains("selected")) {
        b.classList.add("selected");
        m1Count++; playSound('beep');
        if (m1Count === 5) completeMission();
      }
    }));
    document.querySelectorAll(".wrong-m1").forEach(b => b.addEventListener("click", () => {
      initAudio(); playSound('wrong');
      alert(`⚠️ You don't need that at Manzanita Elementary!`);
    }));

  } else if (idx === 2) {
    title.innerText = `${t.term} 2: THE ROAD TO MANZANITA ${t.icon}`;
    prompt.innerText = `Select your transport code to travel to school! (Both Car and Bus are valid!)`;
    area.innerHTML = `
      <div class="choice-grid">
        <button class="choice-btn correct-m2" data-trans="car">🚗 Family Car</button>
        <button class="choice-btn correct-m2" data-trans="bus">🚌 School Bus</button>
        <button class="choice-btn wrong-m2">🚀 Space Rocket</button>
        <button class="choice-btn wrong-m2">🐘 Elephant</button>
      </div>`;
    document.querySelectorAll(".correct-m2").forEach(b => b.addEventListener("click", (e) => {
      lastTransportChoice = e.target.getAttribute("data-trans");
      completeMission();
    }));
    document.querySelectorAll(".wrong-m2").forEach(b => b.addEventListener("click", () => { initAudio(); playSound('wrong'); }));

  } else if (idx === 3) {
    title.innerText = `${t.term} 3: SEARCH THE CLASSROOM ${t.icon}`;
    prompt.innerText = `Search the 6 classroom spots below! 3 contain secret Numbers, and 3 are empty decoys!`;
    area.innerHTML = `
      <div class="pencil-note">✏️ <strong>${t.roleLabel} MANDATE:</strong> Get a real pencil and paper! Write down the 3 secret Numbers you find!</div>
      <div class="search-grid-6">
        <div class="search-spot" id="spot-desk" onclick="searchSpot('desk', '${t.numSeq[0]}', true)">🗄️ Desk Drawer</div>
        <div class="search-spot" id="spot-toys" onclick="searchSpot('toys', '', false)">🧸 Toy Chest</div>
        <div class="search-spot" id="spot-globe" onclick="searchSpot('globe', '${t.numSeq[1]}', true)">🌐 World Globe</div>
        <div class="search-spot" id="spot-clock" onclick="searchSpot('clock', '', false)">⏰ Wall Clock</div>
        <div class="search-spot" id="spot-books" onclick="searchSpot('books', '${t.numSeq[2]}', true)">📚 Bookshelf</div>
        <div class="search-spot" id="spot-crafts" onclick="searchSpot('crafts', '', false)">🎨 Craft Table</div>
      </div>`;
    m3NumbersFound = [];

  } else if (idx === 4) {
    title.innerText = `${t.term} 4: SPANISH MATH CHALLENGE ${t.icon}`;
    prompt.innerText = `Desafío en Español: "${t.m4Math.q}"`;
    area.innerHTML = `
      <div class="choice-grid">
        <button class="choice-btn ${t.m4Math.options[0] === t.m4Math.ans ? 'correct-m4' : 'wrong-m4'}">${t.m4Math.options[0]}</button>
        <button class="choice-btn ${t.m4Math.options[1] === t.m4Math.ans ? 'correct-m4' : 'wrong-m4'}">${t.m4Math.options[1]}</button>
        <button class="choice-btn ${t.m4Math.options[2] === t.m4Math.ans ? 'correct-m4' : 'wrong-m4'}">${t.m4Math.options[2]}</button>
      </div>`;
    document.querySelector(".correct-m4").addEventListener("click", () => completeMission());
    document.querySelectorAll(".wrong-m4").forEach(b => b.addEventListener("click", () => { initAudio(); playSound('wrong'); }));

  } else if (idx === 5) {
    title.innerText = `${t.term} 5: DECRYPT THE GOLDEN SAFE ${t.icon}`;
    prompt.innerText = `Enter the 3 secret Numbers you wrote down on your paper!`;
    area.innerHTML = `
      <div class="code-display" id="keypad-disp">_ _ _</div>
      <div class="keypad-grid-10">
        <button class="key-btn" onclick="press10Key('1')">1</button>
        <button class="key-btn" onclick="press10Key('2')">2</button>
        <button class="key-btn" onclick="press10Key('3')">3</button>
        <button class="key-btn" onclick="press10Key('4')">4</button>
        <button class="key-btn" onclick="press10Key('5')">5</button>
        <button class="key-btn" onclick="press10Key('6')">6</button>
        <button class="key-btn" onclick="press10Key('7')">7</button>
        <button class="key-btn" onclick="press10Key('8')">8</button>
        <button class="key-btn" onclick="press10Key('9')">9</button>
        <button class="key-btn clear-key" onclick="clear10Key()">C</button>
        <button class="key-btn" onclick="press10Key('0')">0</button>
      </div>`;
    enteredKeypadCode = "";

  } else if (idx === 6) {
    title.innerText = `${t.term} 6: DETECTIVE READING MYSTERY ${t.icon}`;
    prompt.innerText = `Read the passage carefully to answer the question!`;
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
    document.querySelector(".correct-m").addEventListener("click", () => completeMission());
    document.querySelectorAll(".wrong-m").forEach(b => b.addEventListener("click", () => { initAudio(); playSound('wrong'); }));

  } else if (idx === 7) {
    title.innerText = `${t.term} 7: SPANISH PATTERN ARRAY ${t.icon}`;
    prompt.innerText = `¿Qué sigue en el patrón? ${t.m7Seq} | ${t.m7Seq} | [ ? ]`;
    area.innerHTML = `
      <div class="choice-grid">
        <button class="choice-btn correct-m">${t.m7Seq.split('|')[0]}</button>
        <button class="choice-btn wrong-m">⚪ White</button>
      </div>`;
    document.querySelector(".correct-m").addEventListener("click", () => completeMission());
    document.querySelectorAll(".wrong-m").forEach(b => b.addEventListener("click", () => { initAudio(); playSound('wrong'); }));

  } else if (idx === 8) {
    title.innerText = `${t.term} 8: CAFETERIA FRACTIONS ${t.icon}`;
    prompt.innerText = `${agentName} splits a snack into 2 equal parts with ${sidekickName}. What is each part called?`;
    area.innerHTML = `
      <div class="choice-grid">
        <button class="choice-btn correct-m">One Half (1/2)</button>
        <button class="choice-btn wrong-m">One Quarter (1/4)</button>
      </div>`;
    document.querySelector(".correct-m").addEventListener("click", () => completeMission());
    document.querySelectorAll(".wrong-m").forEach(b => b.addEventListener("click", () => { initAudio(); playSound('wrong'); }));

  } else if (idx === 9) {
    title.innerText = `${t.term} 9: RECESS GAME CALCULATION ${t.icon}`;
    prompt.innerText = `Your 2nd grade team scored 6 points in game 1 and 5 points in game 2. Total points?`;
    area.innerHTML = `
      <div class="choice-grid">
        <button class="choice-btn wrong-m">10 Points</button>
        <button class="choice-btn correct-m">11 Points</button>
      </div>`;
    document.querySelector(".correct-m").addEventListener("click", () => completeMission());
    document.querySelectorAll(".wrong-m").forEach(b => b.addEventListener("click", () => { initAudio(); playSound('wrong'); }));

  } else if (idx === 10) {
    title.innerText = `${t.term} 10: SCIENCE LAB DISCOVERY ${t.icon}`;
    prompt.innerText = `En Español: ¿Qué necesita una planta para crecer en Manzanita Elementary?`;
    area.innerHTML = `
      <div class="choice-grid">
        <button class="choice-btn correct-m">Agua y Luz del Sol ☀️</button>
        <button class="choice-btn wrong-m">Refresco y Dulces 🍬</button>
      </div>`;
    document.querySelector(".correct-m").addEventListener("click", () => completeMission());
    document.querySelectorAll(".wrong-m").forEach(b => b.addEventListener("click", () => { initAudio(); playSound('wrong'); }));

  } else if (idx === 11) {
    title.innerText = `${t.term} 11: ART STUDIO COLOR MIXING ${t.icon}`;
    prompt.innerText = `What color do you get when you mix Red and Yellow paint together?`;
    area.innerHTML = `
      <div class="choice-grid">
        <button class="choice-btn wrong-m">Purple</button>
        <button class="choice-btn correct-m">Orange 🟠</button>
      </div>`;
    document.querySelector(".correct-m").addEventListener("click", () => completeMission());
    document.querySelectorAll(".wrong-m").forEach(b => b.addEventListener("click", () => { initAudio(); playSound('wrong'); }));

  } else if (idx === 12) {
    title.innerText = `${t.term} 12: MUSIC CLASS RHYTHM ${t.icon}`;
    prompt.innerText = `Count the beats in two 4-beat measures (4 + 4 = ?)` ;
    area.innerHTML = `
      <div class="choice-grid">
        <button class="choice-btn correct-m">8 Beats</button>
        <button class="choice-btn wrong-m">6 Beats</button>
      </div>`;
    document.querySelector(".correct-m").addEventListener("click", () => completeMission());
    document.querySelectorAll(".wrong-m").forEach(b => b.addEventListener("click", () => { initAudio(); playSound('wrong'); }));

  } else if (idx === 13) {
    title.innerText = `${t.term} 13: LIBRARY MAP COORDINATES ${t.icon}`;
    prompt.innerText = `Find the 2nd grade book shelf at coordinates (4 + 4). What is 4 + 4?`;
    area.innerHTML = `
      <div class="choice-grid">
        <button class="choice-btn wrong-m">7</button>
        <button class="choice-btn correct-m">8</button>
      </div>`;
    document.querySelector(".correct-m").addEventListener("click", () => completeMission());
    document.querySelectorAll(".wrong-m").forEach(b => b.addEventListener("click", () => { initAudio(); playSound('wrong'); }));

  } else if (idx === 14) {
    title.innerText = `${t.term} 14: COMPUTER LAB CODING ${t.icon}`;
    prompt.innerText = `Fill in the missing code sequence: 10, 20, 30, [ ? ], 50`;
    area.innerHTML = `
      <div class="choice-grid">
        <button class="choice-btn correct-m">40</button>
        <button class="choice-btn wrong-m">35</button>
      </div>`;
    document.querySelector(".correct-m").addEventListener("click", () => completeMission());
    document.querySelectorAll(".wrong-m").forEach(b => b.addEventListener("click", () => { initAudio(); playSound('wrong'); }));

  } else if (idx === 15) {
    title.innerText = `${t.term} 15: SPANISH ANIMAL IDENTIFIER ${t.icon}`;
    prompt.innerText = `¿Cómo se dice "dog" en Español?`;
    area.innerHTML = `
      <div class="choice-grid">
        <button class="choice-btn correct-m">El Perro 🐕</button>
        <button class="choice-btn wrong-m">El Gato 🐈</button>
      </div>`;
    document.querySelector(".correct-m").addEventListener("click", () => completeMission());
    document.querySelectorAll(".wrong-m").forEach(b => b.addEventListener("click", () => { initAudio(); playSound('wrong'); }));

  } else if (idx === 16) {
    title.innerText = `${t.term} 16: GARDEN MEASUREMENT ${t.icon}`;
    prompt.innerText = `A sunflower is 12 inches tall. It grows 6 more inches. How tall is it now?`;
    area.innerHTML = `
      <div class="choice-grid">
        <button class="choice-btn wrong-m">16 inches</button>
        <button class="choice-btn correct-m">18 inches</button>
      </div>`;
    document.querySelector(".correct-m").addEventListener("click", () => completeMission());
    document.querySelectorAll(".wrong-m").forEach(b => b.addEventListener("click", () => { initAudio(); playSound('wrong'); }));

  } else if (idx === 17) {
    title.innerText = `${t.term} 17: BELL TIMER CALIBRATION ${t.icon}`;
    prompt.innerText = `School starts at 8:00 AM. It is 7:45 AM. How many minutes until the bell rings?`;
    area.innerHTML = `
      <div class="choice-grid">
        <button class="choice-btn correct-m">15 Minutes</button>
        <button class="choice-btn wrong-m">30 Minutes</button>
      </div>`;
    document.querySelector(".correct-m").addEventListener("click", () => completeMission());
    document.querySelectorAll(".wrong-m").forEach(b => b.addEventListener("click", () => { initAudio(); playSound('wrong'); }));

  } else if (idx === 18) {
    title.innerText = `${t.term} 18: SPANISH DAYS OF THE WEEK ${t.icon}`;
    prompt.innerText = `¿Qué día viene después del Lunes (Monday)?`;
    area.innerHTML = `
      <div class="choice-grid">
        <button class="choice-btn correct-m">Martes (Tuesday)</button>
        <button class="choice-btn wrong-m">Domingo (Sunday)</button>
      </div>`;
    document.querySelector(".correct-m").addEventListener("click", () => completeMission());
    document.querySelectorAll(".wrong-m").forEach(b => b.addEventListener("click", () => { initAudio(); playSound('wrong'); }));

  } else if (idx === 19) {
    title.innerText = `${t.term} 19: FRIENDSHIP PROTOCOL ${t.icon}`;
    prompt.innerText = `${agentName} sees a classmate sitting alone at recess. What should you do?`;
    area.innerHTML = `
      <div class="choice-grid">
        <button class="choice-btn correct-m">Invite them to play! 🤝</button>
        <button class="choice-btn wrong-m">Ignore them</button>
      </div>`;
    document.querySelector(".correct-m").addEventListener("click", () => completeMission());
    document.querySelectorAll(".wrong-m").forEach(b => b.addEventListener("click", () => { initAudio(); playSound('wrong'); }));

  } else if (idx === 20) {
    title.innerText = `${t.term} 20: RECOVER THE GOLDEN BADGE ${t.icon}`;
    prompt.innerText = `Final Challenge! What is the official rule of 2nd Grade at Manzanita Elementary?`;
    area.innerHTML = `
      <div class="choice-grid">
        <button class="choice-btn correct-m">Try your best & have fun! ⭐</button>
        <button class="choice-btn wrong-m">Be perfect at everything</button>
      </div>`;
    document.querySelector(".correct-m").addEventListener("click", () => completeMission());
    document.querySelectorAll(".wrong-m").forEach(b => b.addEventListener("click", () => { initAudio(); playSound('wrong'); }));
  }
}

// Search Spot Logic (3 real, 3 decoys)
function searchSpot(spotKey, numVal, isReal) {
  initAudio();
  const el = document.getElementById(`spot-${spotKey}`);

  if (!el.classList.contains("found") && !el.classList.contains("empty-found")) {
    if (isReal) {
      el.classList.add("found");
      playSound('beep');
      el.innerText = `Found Number: [ ${numVal} ]`;
      m3NumbersFound.push(numVal);

      if (m3NumbersFound.length === 3) {
        playSound('success');
        const t = themes[selectedTheme];
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

// Mission 5 10-Keypad Logic
function press10Key(n) {
  initAudio();
  if (enteredKeypadCode.length < 3) {
    enteredKeypadCode += n;
    playSound('beep');
    document.getElementById("keypad-disp").innerText = enteredKeypadCode;

    if (enteredKeypadCode.length === 3) {
      const t = themes[selectedTheme];
      if (enteredKeypadCode === t.targetCode) {
        playSound('success');
        setTimeout(() => completeMission(), 600);
      } else {
        playSound('wrong');
        alert(`❌ VAULT CODE INCORRECT! Check the Numbers you wrote down (${t.numSeq.join(' - ')})`);
        clear10Key();
      }
    }
  }
}

function clear10Key() {
  enteredKeypadCode = "";
  const disp = document.getElementById("keypad-disp");
  if (disp) disp.innerText = "_ _ _";
}

// Cutscene Trigger Engine
function completeMission() {
  playSound('success');
  const t = themes[selectedTheme];
  const anim = animationsData[currentMissionIndex - 1];

  document.getElementById("cutscene-title").innerText = `${t.term} ${currentMissionIndex} COMPLETE!`;
  document.getElementById("cutscene-subtext").innerText = anim.text;

  const stage = document.getElementById("anim-stage");

  if (currentMissionIndex === 2 && lastTransportChoice === "car") {
    stage.innerHTML = `<div class="anim-vehicle">🚗</div>`;
    document.getElementById("cutscene-subtext").innerText = "Vroom! Your Family Car arrives safely at Manzanita Elementary!";
  } else if (currentMissionIndex === 2 && lastTransportChoice === "bus") {
    stage.innerHTML = `<div class="anim-vehicle">🚌</div>`;
    document.getElementById("cutscene-subtext").innerText = "Honk Honk! The Manzanita School Bus pulls up to the school doors!";
  } else {
    stage.innerHTML = `<div class="anim-icon">${anim.icon}</div>`;
  }

  showScreen("screen-cutscene");
  currentMissionIndex++;
}