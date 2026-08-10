// Game Progress State
let m1ItemsCount = 0;
let m3SymbolsCount = 0;
let currentCode = "";

// Audio Synthesizer (Web Audio API)
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
    osc.frequency.setValueAtTime(600, now);
    gain.gain.setValueAtTime(0.2, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.1);
    osc.start(now);
    osc.stop(now + 0.1);
  } else if (type === 'success') {
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(400, now);
    osc.frequency.setValueAtTime(800, now + 0.1);
    gain.gain.setValueAtTime(0.3, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.3);
    osc.start(now);
    osc.stop(now + 0.3);
  } else if (type === 'wrong') {
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(150, now);
    gain.gain.setValueAtTime(0.2, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.2);
    osc.start(now);
    osc.stop(now + 0.2);
  }
}

function showScreen(id) {
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  document.getElementById(id).classList.add('active');
}

// Event Bindings
document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("start-mission-btn").addEventListener("click", () => {
    initAudio();
    playSound('beep');
    showScreen("screen-m1");
  });

  // Mission 1 Grid Click
  document.querySelectorAll("#m1-grid .grid-item").forEach(btn => {
    btn.addEventListener("click", (e) => {
      initAudio();
      if (btn.classList.contains("correct-item") && !btn.classList.contains("selected")) {
        btn.classList.add("selected");
        m1ItemsCount++;
        playSound('beep');
        document.getElementById("m1-count").innerText = m1ItemsCount;

        if (m1ItemsCount === 5) {
          playSound('success');
          setTimeout(() => showScreen("screen-m2"), 800);
        }
      } else if (btn.classList.contains("wrong-item")) {
        playSound('wrong');
        alert("⚠️ Agent Athen, you don't need that for 2nd grade! Try another item.");
      }
    });
  });

  // Mission 2 Choice Click
  document.getElementById("m2-correct-btn").addEventListener("click", () => {
    initAudio();
    playSound('success');
    showScreen("screen-m3");
  });

  document.querySelectorAll(".choice-grid .wrong-choice").forEach(btn => {
    btn.addEventListener("click", () => {
      initAudio();
      playSound('wrong');
      alert("❌ Transport code incorrect! Try again, Agent!");
    });
  });

  // Mission 3 Symbol Click
  document.querySelectorAll(".symbol-item").forEach(sym => {
    sym.addEventListener("click", () => {
      initAudio();
      if (!sym.classList.contains("found")) {
        sym.classList.add("found");
        m3SymbolsCount++;
        playSound('beep');

        if (m3SymbolsCount === 3) {
          playSound('success');
          document.getElementById("intel-count").innerText = "3/3 CODES";
          setTimeout(() => showScreen("screen-m4"), 800);
        }
      }
    });
  });

  // Mission 4 Challenges
  document.querySelector(".chal-a-correct").addEventListener("click", () => {
    initAudio(); playSound('success');
    document.getElementById("chal-a").classList.add("hidden");
    document.getElementById("chal-b").classList.remove("hidden");
  });

  document.querySelector(".chal-b-correct").addEventListener("click", () => {
    initAudio(); playSound('success');
    document.getElementById("chal-b").classList.add("hidden");
    document.getElementById("chal-c").classList.remove("hidden");
  });

  document.querySelector(".chal-c-correct").addEventListener("click", () => {
    initAudio(); playSound('success');
    setTimeout(() => showScreen("screen-m5"), 800);
  });

  document.querySelectorAll(".chal-a-wrong, .chal-b-wrong, .chal-c-wrong").forEach(btn => {
    btn.addEventListener("click", () => {
      initAudio(); playSound('wrong');
      alert("⚠️ Robot recalibrating! Double check your calculation, Agent!");
    });
  });

  // Parent Intel Toggle
  document.getElementById("parent-intel-btn").addEventListener("click", () => {
    showScreen("screen-parent");
  });
});

// Keypad Input for Mission 5
function pressKey(num) {
  initAudio();
  if (currentCode.length < 3) {
    currentCode += num;
    playSound('beep');
    document.getElementById("code-input").innerText = currentCode;

    if (currentCode.length === 3) {
      if (currentCode === "729") {
        playSound('success');
        setTimeout(() => showScreen("screen-final"), 800);
      } else {
        playSound('wrong');
        alert("❌ CODE INCORRECT! Hint: Star [7], Lightning [2], Key [9]");
        clearKey();
      }
    }
  }
}

function clearKey() {
  currentCode = "";
  document.getElementById("code-input").innerText = "_ _ _";
}