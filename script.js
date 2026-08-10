// Game Credentials & Theme State
let agentName = "Athen";
let sidekickName = "Poppy the Rainbow Bunny";
let selectedTheme = "spy"; // Default theme

// Mission Progress
let currentMissionIndex = 1;
let m1Count = 0;
let m3NumbersFound = [];
let enteredKeypadCode = "";

// Theme Text Templates
const themes = {
  spy: { title: "CYBER SPY", icon: "🕵️", color: "#3b82f6" },
  space: { title: "SPACE RANGER", icon: "🚀", color: "#a855f7" },
  dino: { title: "DINO EXPLORER", icon: "🦖", color: "#10b981" },
  unicorn: { title: "RAINBOW UNICORN", icon: "🦄", color: "#ec4899" },
  fairy: { title: "ENCHANTED FAIRY", icon: "🧚", color: "#f43f5e" },
  popstar: { title: "ACADEMY POPSTAR", icon: "🎤", color: "#eab308" },
  detective: { title: "MYSTERY DETECTIVE", icon: "🔎", color: "#f97316" },
  safari: { title: "JUNGLE SAFARI", icon: "🦁", color: "#84cc16" },
  superhero: { title: "SCHOOL SUPERHERO", icon: "🦸", color: "#ef4444" }
};

// Post-Mission Animations Data
const animationsData = [
  { icon: "🎒", text: "Backpack packed and ready for Manzanita Elementary!", type: "bounce" },
  { icon: "🚌", text: "Vroom! The Transport Shuttle accelerates down Manzanita Lane!", type: "bounce" },
  { icon: "✏️", text: "Pencil note secured! Secret Numbers written down!", type: "airplane" },
  { icon: "🤖", text: "Beep Boop! Robot Dual-Language System fully recalibrated!", type: "bounce" },
  { icon: "🔐", text: "Click! Vault Door Decoded!", type: "bounce" },
  { icon: "📐", text: "Ruler & Math Protocol aligned!", type: "bounce" },
  { icon: "📖", text: "Library Storybook unlocked!", type: "airplane" },
  { icon: "🍎", text: "Cafeteria Nutrition Energy recharged!", type: "bounce" },
  { icon: "⚽", text: "Recess Kickball Goal Scored!", type: "bounce" },
  { icon: "🔬", text: "Science Lab Volcano Erupts Safely!", type: "bounce" },
  { icon: "🎨", text: "Art Studio Masterpiece Completed!", type: "airplane" },
  { icon: "🎵", text: "Music Class Harmony Synthesized!", type: "bounce" },
  { icon: "🗺️", text: "School Map Navigation Complete!", type: "airplane" },
  { icon: "💻", text: "Computer Lab Coding Array Online!", type: "bounce" },
  { icon: "🧩", text: "Classroom Puzzle Pieces Locked in Place!", type: "bounce" },
  { icon: "🪴", text: "School Garden Sprout Grown!", type: "bounce" },
  { icon: "⏰", text: "Bell Timer Calibrated!", type: "bounce" },
  { icon: "⭐", text: "Gold Star Effort Achieved!", type: "bounce" },
  { icon: "🤝", text: "New Manzanita Friendship Formed!", type: "airplane" },
  { icon: "🏆", text: "GOLDEN SCHOOL BADGE RECOVERED!", type: "bounce" }
];

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

  if (type === 'beep') {
    osc.type = 'sine';
    osc.frequency.setValueAtTime(650, now);
    gain.gain.setValueAtTime(0.2, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.1);
    osc.start(now); osc.stop(now + 0.1);
  } else if (type === 'success') {
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(450, now);
    osc.frequency.setValueAtTime(900, now + 0.12);
    gain.gain.setValueAtTime(0.3, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.3);
    osc.start(now); osc.stop(now + 0.3);
  } else if (type === 'wrong') {
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(140, now);
    gain.gain.setValueAtTime(0.2, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.2);
    osc.start(now); osc.stop(now + 0.2);
  }
}

function showScreen(id) {
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  document.getElementById(id).classList.add('active');
}

document.addEventListener("DOMContentLoaded", () => {
  // Theme Selector Binding
  document.querySelectorAll(".theme-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      document.querySelectorAll(".theme-btn").forEach(b => b.classList.remove("active-theme"));
      btn.classList.add("active-theme");
      selectedTheme = btn.getAttribute("data-theme");
    });
  });

  // Save Setup & Credentials
  document.getElementById("save-setup-btn").addEventListener("click", () => {
    initAudio(); playSound('beep');

    const nameInput = document.getElementById("input-agent-name").value.trim();
    const sidekickInput = document.getElementById("input-sidekick-name").value.trim();

    if (nameInput) agentName = nameInput;
    if (sidekickInput) sidekickName = sidekickInput;

    const t = themes[selectedTheme];
    document.getElementById("hud-name").innerText = agentName.toUpperCase();
    document.getElementById("hud-sidekick").innerText = sidekickName.toUpperCase();
    document.getElementById("hud-theme").innerText = `${t.icon} ${t.title}`;

    document.querySelectorAll(".display-agent-name").forEach(el => el.innerText = agentName);
    document.querySelectorAll(".display-sidekick-name").forEach(el => el.innerText = sidekickName);

    showScreen("screen-briefing");
  });

  // Briefing Start
  document.getElementById("start-mission-btn").addEventListener("click", () => {
    initAudio(); playSound('beep');
    loadMission(1);
  });

  // Next Mission Button (Cutscene)
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

// Load Mission Router (1 through 20)
function loadMission(idx) {
  currentMissionIndex = idx;
  document.getElementById("hud-progress").innerText = `${idx}/20`;
  showScreen("screen-mission");

  const area = document.getElementById("mission-interactive-area");
  area.innerHTML = ""; // Clear stage
  const title = document.getElementById("mission-title");
  const prompt = document.getElementById("mission-prompt");

  const themeIcon = themes[selectedTheme].icon;

  if (idx === 1) {
    title.innerText = `MISSION 1: MORNING LAUNCH ${themeIcon}`;
    prompt.innerText = `Find the 5 essential 2nd grade items Agent ${agentName} needs!`;
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
        m1Count++;
        playSound('beep');
        if (m1Count === 5) completeMission();
      }
    }));
    document.querySelectorAll(".wrong-m1").forEach(b => b.addEventListener("click", () => {
      initAudio(); playSound('wrong');
      alert(`⚠️ You don't need that at Manzanita Elementary!`);
    }));

  } else if (idx === 2) {
    title.innerText = `MISSION 2: THE ROAD TO MANZANITA ${themeIcon}`;
    prompt.innerText = `Select your transport code to travel to school! (Both Car and Bus are valid!)`;
    area.innerHTML = `
      <div class="choice-grid">
        <button class="choice-btn correct-m2">🚗 Family Car</button>
        <button class="choice-btn correct-m2">🚌 School Bus</button>
        <button class="choice-btn wrong-m2">🚀 Space Rocket</button>
        <button class="choice-btn wrong-m2">🐘 Elephant</button>
      </div>`;
    document.querySelectorAll(".correct-m2").forEach(b => b.addEventListener("click", () => completeMission()));
    document.querySelectorAll(".wrong-m2").forEach(b => b.addEventListener("click", () => { initAudio(); playSound('wrong'); }));

  } else if (idx === 3) {
    title.innerText = `MISSION 3: INFILTRATE & SEARCH ${themeIcon}`;
    prompt.innerText = `Search the classroom objects below to find secret Numbers!`;
    area.innerHTML = `
      <div class="pencil-note">✏️ <strong>AGENT MANDATE:</strong> Get a real pencil and paper! Write down the 3 secret Numbers you find!</div>
      <div class="search-spot" id="spot-desk" onclick="searchSpot('desk', '7')">🗄️ Search Desk Drawer</div>
      <div class="search-spot" id="spot-globe" onclick="searchSpot('globe', '2')">🌐 Search World Globe</div>
      <div class="search-spot" id="spot-books" onclick="searchSpot('books', '9')">📚 Search Bookshelf</div>`;
    m3NumbersFound = [];

  } else if (idx === 4) {
    title.innerText = `MISSION 4: SPANISH MATH ROBOT ${themeIcon}`;
    prompt.innerText = `Desafío en Español: "El robot tiene 8 baterías. Le das 6 más. ¿Cuántas baterías tiene?"`;
    area.innerHTML = `
      <div class="choice-grid">
        <button class="choice-btn wrong-m4">12</button>
        <button class="choice-btn correct-m4">14 (Catorce)</button>
        <button class="choice-btn wrong-m4">16</button>
      </div>`;
    document.querySelector(".correct-m4").addEventListener("click", () => completeMission());
    document.querySelectorAll(".wrong-m4").forEach(b => b.addEventListener("click", () => { initAudio(); playSound('wrong'); }));

  } else if (idx === 5) {
    title.innerText = `MISSION 5: DECRYPT THE GOLDEN SAFE ${themeIcon}`;
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
    title.innerText = `MISSION 6: ENGLISH READING DETECTIVE ${themeIcon}`;
    prompt.innerText = `"The blue parrot hid the silver key under the teacher's desk." Where is the key?`;
    area.innerHTML = `
      <div class="choice-grid">
        <button class="choice-btn wrong-m">In the backpack</button>
        <button class="choice-btn correct-m">Under the teacher's desk</button>
        <button class="choice-btn wrong-m">On the bookshelf</button>
      </div>`;
    document.querySelector(".correct-m").addEventListener("click", () => completeMission());
    document.querySelectorAll(".wrong-m").forEach(b => b.addEventListener("click", () => { initAudio(); playSound('wrong'); }));

  } else if (idx === 7) {
    title.innerText = `MISSION 7: SPANISH PATTERNS ${themeIcon}`;
    prompt.innerText = `¿Qué color sigue en el patrón? 🔴 Rojo | 🔵 Azul | 🔴 Rojo | 🔵 Azul | [ ? ]`;
    area.innerHTML = `
      <div class="choice-grid">
        <button class="choice-btn correct-m">🔴 Rojo (Red)</button>
        <button class="choice-btn wrong-m">🟡 Amarillo</button>
      </div>`;
    document.querySelector(".correct-m").addEventListener("click", () => completeMission());
    document.querySelectorAll(".wrong-m").forEach(b => b.addEventListener("click", () => { initAudio(); playSound('wrong'); }));

  } else if (idx === 8) {
    title.innerText = `MISSION 8: CAFETERIA FRACTIONS ${themeIcon}`;
    prompt.innerText = `Agent ${agentName} splits a pizza into 2 equal parts with ${sidekickName}. What is each part called?`;
    area.innerHTML = `
      <div class="choice-grid">
        <button class="choice-btn correct-m">One Half (1/2)</button>
        <button class="choice-btn wrong-m">One Quarter (1/4)</button>
      </div>`;
    document.querySelector(".correct-m").addEventListener("click", () => completeMission());
    document.querySelectorAll(".wrong-m").forEach(b => b.addEventListener("click", () => { initAudio(); playSound('wrong'); }));

  } else if (idx === 9) {
    title.innerText = `MISSION 9: RECESS KICKBALL CALCULATION ${themeIcon}`;
    prompt.innerText = `Your team scored 5 runs in the first inning and 4 runs in the second. Total runs?`;
    area.innerHTML = `
      <div class="choice-grid">
        <button class="choice-btn wrong-m">8 Runs</button>
        <button class="choice-btn correct-m">9 Runs</button>
      </div>`;
    document.querySelector(".correct-m").addEventListener("click", () => completeMission());
    document.querySelectorAll(".wrong-m").forEach(b => b.addEventListener("click", () => { initAudio(); playSound('wrong'); }));

  } else if (idx === 10) {
    title.innerText = `MISSION 10: SCIENCE LAB PHENOMENON ${themeIcon}`;
    prompt.innerText = `En Español: ¿Qué necesita una planta para crecer en Manzanita Elementary?`;
    area.innerHTML = `
      <div class="choice-grid">
        <button class="choice-btn correct-m">Agua y Luz del Sol ☀️</button>
        <button class="choice-btn wrong-m">Refresco y Dulces 🍬</button>
      </div>`;
    document.querySelector(".correct-m").addEventListener("click", () => completeMission());
    document.querySelectorAll(".wrong-m").forEach(b => b.addEventListener("click", () => { initAudio(); playSound('wrong'); }));

  } else if (idx === 11) {
    title.innerText = `MISSION 11: ART CLASS COLOR MIXING ${themeIcon}`;
    prompt.innerText = `What color do you get when you mix Red and Yellow together?`;
    area.innerHTML = `
      <div class="choice-grid">
        <button class="choice-btn wrong-m">Purple</button>
        <button class="choice-btn correct-m">Orange 🟠</button>
      </div>`;
    document.querySelector(".correct-m").addEventListener("click", () => completeMission());
    document.querySelectorAll(".wrong-m").forEach(b => b.addEventListener("click", () => { initAudio(); playSound('wrong'); }));

  } else if (idx === 12) {
    title.innerText = `MISSION 12: MUSIC ROOM RHYTHM ${themeIcon}`;
    prompt.innerText = `Count the beats in 2 full 4-beat measures (4 + 4 = ?)` ;
    area.innerHTML = `
      <div class="choice-grid">
        <button class="choice-btn correct-m">8 Beats</button>
        <button class="choice-btn wrong-m">6 Beats</button>
      </div>`;
    document.querySelector(".correct-m").addEventListener("click", () => completeMission());
    document.querySelectorAll(".wrong-m").forEach(b => b.addEventListener("click", () => { initAudio(); playSound('wrong'); }));

  } else if (idx === 13) {
    title.innerText = `MISSION 13: LIBRARY MAP SEARCH ${themeIcon}`;
    prompt.innerText = `Find the 2nd grade book section on the map: Row 3, Shelf 5. What is 3 + 5?`;
    area.innerHTML = `
      <div class="choice-grid">
        <button class="choice-btn wrong-m">7</button>
        <button class="choice-btn correct-m">8</button>
      </div>`;
    document.querySelector(".correct-m").addEventListener("click", () => completeMission());
    document.querySelectorAll(".wrong-m").forEach(b => b.addEventListener("click", () => { initAudio(); playSound('wrong'); }));

  } else if (idx === 14) {
    title.innerText = `MISSION 14: COMPUTER LAB CODING ${themeIcon}`;
    prompt.innerText = `Fill in the missing code loop: 10, 20, 30, [ ? ], 50`;
    area.innerHTML = `
      <div class="choice-grid">
        <button class="choice-btn correct-m">40</button>
        <button class="choice-btn wrong-m">35</button>
      </div>`;
    document.querySelector(".correct-m").addEventListener("click", () => completeMission());
    document.querySelectorAll(".wrong-m").forEach(b => b.addEventListener("click", () => { initAudio(); playSound('wrong'); }));

  } else if (idx === 15) {
    title.innerText = `MISSION 15: SPANISH ANIMAL IDENTIFIER ${themeIcon}`;
    prompt.innerText = `¿Cómo se dice "dog" en Español?`;
    area.innerHTML = `
      <div class="choice-grid">
        <button class="choice-btn correct-m">El Perro 🐕</button>
        <button class="choice-btn wrong-m">El Gato 🐈</button>
      </div>`;
    document.querySelector(".correct-m").addEventListener("click", () => completeMission());
    document.querySelectorAll(".wrong-m").forEach(b => b.addEventListener("click", () => { initAudio(); playSound('wrong'); }));

  } else if (idx === 16) {
    title.innerText = `MISSION 16: GARDEN MEASUREMENT ${themeIcon}`;
    prompt.innerText = `A sunflower is 15 inches tall. It grows 5 more inches. How tall is it now?`;
    area.innerHTML = `
      <div class="choice-grid">
        <button class="choice-btn wrong-m">18 inches</button>
        <button class="choice-btn correct-m">20 inches</button>
      </div>`;
    document.querySelector(".correct-m").addEventListener("click", () => completeMission());
    document.querySelectorAll(".wrong-m").forEach(b => b.addEventListener("click", () => { initAudio(); playSound('wrong'); }));

  } else if (idx === 17) {
    title.innerText = `MISSION 17: BELL TIMER DECODER ${themeIcon}`;
    prompt.innerText = `School starts at 8:00 AM. It is 7:45 AM. How many minutes until the bell?`;
    area.innerHTML = `
      <div class="choice-grid">
        <button class="choice-btn correct-m">15 Minutes</button>
        <button class="choice-btn wrong-m">30 Minutes</button>
      </div>`;
    document.querySelector(".correct-m").addEventListener("click", () => completeMission());
    document.querySelectorAll(".wrong-m").forEach(b => b.addEventListener("click", () => { initAudio(); playSound('wrong'); }));

  } else if (idx === 18) {
    title.innerText = `MISSION 18: SPANISH DAYS OF THE WEEK ${themeIcon}`;
    prompt.innerText = `¿Qué día viene después del Lunes (Monday)?`;
    area.innerHTML = `
      <div class="choice-grid">
        <button class="choice-btn correct-m">Martes (Tuesday)</button>
        <button class="choice-btn wrong-m">Domingo (Sunday)</button>
      </div>`;
    document.querySelector(".correct-m").addEventListener("click", () => completeMission());
    document.querySelectorAll(".wrong-m").forEach(b => b.addEventListener("click", () => { initAudio(); playSound('wrong'); }));

  } else if (idx === 19) {
    title.innerText = `MISSION 19: FRIENDSHIP PROTOCOL ${themeIcon}`;
    prompt.innerText = `Agent ${agentName} sees a classmate sitting alone at recess. What should you do?`;
    area.innerHTML = `
      <div class="choice-grid">
        <button class="choice-btn correct-m">Invite them to play! 🤝</button>
        <button class="choice-btn wrong-m">Ignore them</button>
      </div>`;
    document.querySelector(".correct-m").addEventListener("click", () => completeMission());
    document.querySelectorAll(".wrong-m").forEach(b => b.addEventListener("click", () => { initAudio(); playSound('wrong'); }));

  } else if (idx === 20) {
    title.innerText = `MISSION 20: RECOVER THE GOLDEN BADGE ${themeIcon}`;
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

// Mission 3 Hiding Spot Logic
function searchSpot(spotKey, numVal) {
  initAudio();
  const el = document.getElementById(`spot-${spotKey}`);
  if (!el.classList.contains("found")) {
    el.classList.add("found");
    playSound('beep');
    el.innerText = `Found Number: [ ${numVal} ]`;
    m3NumbersFound.push(numVal);

    if (m3NumbersFound.length === 3) {
      playSound('success');
      setTimeout(() => {
        alert(`📝 Agent ${agentName}, make sure you wrote down 7 - 2 - 9 on your paper! Proceeding!`);
        completeMission();
      }, 800);
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
      if (enteredKeypadCode === "729") {
        playSound('success');
        setTimeout(() => completeMission(), 600);
      } else {
        playSound('wrong');
        alert("❌ VAULT CODE INCORRECT! Check the Numbers you wrote down (7 - 2 - 9)");
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

// Trigger Post-Mission Animation Cutscene
function completeMission() {
  playSound('success');
  
  const anim = animationsData[currentMissionIndex - 1];
  document.getElementById("cutscene-title").innerText = `MISSION ${currentMissionIndex} COMPLETE!`;
  document.getElementById("cutscene-subtext").innerText = anim.text;

  const stage = document.getElementById("anim-stage");
  stage.innerHTML = anim.type === 'airplane' ? 
    `<div class="anim-airplane">✈️</div>` : 
    `<div class="anim-icon">${anim.icon}</div>`;

  showScreen("screen-cutscene");
  currentMissionIndex++;
}