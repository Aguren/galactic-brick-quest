// Dynamic Agent Profile
let agentName = "Athen";
let sidekickName = "Poppy the Rainbow Bunny";

// Mission Progress Tracker
let m1Count = 0;
let m3CodesFound = [];
let currentEnteredCode = "";

// Web Audio API Sound FX Engine
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
    osc.start(now);
    osc.stop(now + 0.1);
  } else if (type === 'success') {
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(450, now);
    osc.frequency.setValueAtTime(900, now + 0.12);
    gain.gain.setValueAtTime(0.3, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.3);
    osc.start(now);
    osc.stop(now + 0.3);
  } else if (type === 'wrong') {
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(140, now);
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

function updateHUDLocation(locText) {
  document.getElementById("hud-loc").innerText = locText;
}

document.addEventListener("DOMContentLoaded", () => {
  // Screen 0: Save Custom Setup
  document.getElementById("save-setup-btn").addEventListener("click", () => {
    initAudio();
    playSound('beep');

    const nameInput = document.getElementById("input-agent-name").value.trim();
    const sidekickInput = document.getElementById("input-sidekick-name").value.trim();

    if (nameInput) agentName = nameInput;
    if (sidekickInput) sidekickName = sidekickInput;

    // Update UI elements with custom names
    document.getElementById("hud-name").innerText = agentName.toUpperCase();
    document.getElementById("hud-sidekick").innerText = sidekickName.toUpperCase();

    document.querySelectorAll(".display-agent-name").forEach(el => el.innerText = agentName);
    document.querySelectorAll(".display-sidekick-name").forEach(el => el.innerText = sidekickName);

    showScreen("screen-briefing");
  });

  // Briefing Launch Button
  document.getElementById("start-m1-btn").addEventListener("click", () => {
    initAudio(); playSound('beep');
    updateHUDLocation("HOME BASE");
    showScreen("screen-m1");
  });

  // Mission 1 Grid Logic
  document.querySelectorAll("#m1-grid .grid-item").forEach(btn => {
    btn.addEventListener("click", () => {
      initAudio();
      if (btn.classList.contains("correct-item") && !btn.classList.contains("selected")) {
        btn.classList.add("selected");
        m1Count++;
        playSound('beep');
        document.getElementById("m1-count").innerText = m1Count;

        if (m1Count === 5) {
          playSound('success');
          setTimeout(() => {
            updateHUDLocation("IN TRANSIT");
            showScreen("screen-m2");
          }, 800);
        }
      } else if (btn.classList.contains("wrong-item")) {
        playSound('wrong');
        alert(`⚠️ Agent ${agentName}, you don't need that item at Manzanita Elementary!`);
      }
    });
  });

  // Mission 2 Transport Code Logic (Car and Bus are both valid)
  document.querySelectorAll(".correct-transport").forEach(btn => {
    btn.addEventListener("click", () => {
      initAudio(); playSound('success');
      alert(`✅ Transport Code Approved! Agent ${agentName} & ${sidekickName} are arriving at Manzanita Elementary!`);
      updateHUDLocation("MANZANITA ELEM");
      showScreen("screen-m3");
    });
  });

  document.querySelectorAll(".wrong-transport").forEach(btn => {
    btn.addEventListener("click", () => {
      initAudio(); playSound('wrong');
      alert("❌ Transport Code Rejected! Select Car or Bus, Agent!");
    });
  });

  // Mission 4 Dual-Language Handlers
  document.querySelector(".m4-correct-1").addEventListener("click", () => {
    initAudio(); playSound('success');
    document.getElementById("m4-step1").classList.add("hidden");
    document.getElementById("m4-step2").classList.remove("hidden");
  });

  document.querySelector(".m4-correct-2").addEventListener("click", () => {
    initAudio(); playSound('success');
    document.getElementById("m4-step2").classList.add("hidden");
    document.getElementById("m4-step3").classList.remove("hidden");
  });

  document.querySelector(".m4-correct-3").addEventListener("click", () => {
    initAudio(); playSound('success');
    alert(`🤖 "¡GRACIAS AGENTE ${agentName.toUpperCase()}! ROBOT REPAIRED!"`);
    setTimeout(() => {
      updateHUDLocation("GOLDEN VAULT");
      showScreen("screen-m5");
    }, 800);
  });

  document.querySelectorAll(".m4-wrong").forEach(btn => {
    btn.addEventListener("click", () => {
      initAudio(); playSound('wrong');
      alert("⚠️ Robot recalibrating! Recalculate your answer!");
    });
  });

  // Parent Intel
  document.getElementById("parent-intel-btn").addEventListener("click", () => {
    showScreen("screen-parent");
  });
});

// Mission 3 Interactive Hiding Spots
function inspectSpot(spotType) {
  initAudio();
  const spotEl = document.getElementById(`spot-${spotType}`);

  if (!spotEl.classList.contains("found")) {
    spotEl.classList.add("found");
    playSound('beep');

    if (spotType === 'desk') {
      m3CodesFound.push("Digit 1: [ 7 ]");
      spotEl.innerText = "🗄️ Found Digit 1: [ 7 ]";
    } else if (spotType === 'globe') {
      m3CodesFound.push("Digit 2: [ 2 ]");
      spotEl.innerText = "🌐 Found Digit 2: [ 2 ]";
    } else if (spotType === 'books') {
      m3CodesFound.push("Digit 3: [ 9 ]");
      spotEl.innerText = "📚 Found Digit 3: [ 9 ]";
    }

    document.getElementById("m3-found-text").innerText = m3CodesFound.join(" | ");
    document.getElementById("hud-codes").innerText = `${m3CodesFound.length}/3`;

    if (m3CodesFound.length === 3) {
      playSound('success');
      setTimeout(() => {
        alert(`📝 Agent ${agentName}, make sure you wrote down 7 - 2 - 9 on your paper! Proceeding to Robot Repair!`);
        updateHUDLocation("ROBOT LAB");
        showScreen("screen-m4");
      }, 1000);
    }
  }
}

// Mission 5 Keypad Logic
function pressKey(numStr) {
  initAudio();
  if (currentEnteredCode.length < 3) {
    currentEnteredCode += numStr;
    playSound('beep');
    document.getElementById("code-input").innerText = currentEnteredCode;

    if (currentEnteredCode.length === 3) {
      if (currentEnteredCode === "729") {
        playSound('success');
        setTimeout(() => showScreen("screen-final"), 800);
      } else {
        playSound('wrong');
        alert("❌ VAULT CODE INCORRECT! Check the paper you wrote 7 - 2 - 9 on!");
        clearKey();
      }
    }
  }
}

function clearKey() {
  currentEnteredCode = "";
  document.getElementById("code-input").innerText = "_ _ _";
}