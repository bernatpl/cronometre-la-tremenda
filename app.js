const laps = [
  { seconds: 15 * 60, speed: "4 km/h" },
  { seconds: 12 * 60, speed: "5 km/h" },
  { seconds: 9 * 60, speed: "6,6 km/h" },
  { seconds: 6 * 60, speed: "10 km/h" },
  { seconds: 5 * 60, speed: "12 km/h" },
  { seconds: 4 * 60 + 30, speed: "13,3 km/h" },
  { seconds: 4 * 60, speed: "15 km/h" },
  { seconds: 3 * 60 + 45, speed: "16 km/h" },
  { seconds: 3 * 60 + 30, speed: "17,1 km/h" },
  { seconds: 3 * 60 + 15, speed: "18,4 km/h" },
  { seconds: 3 * 60, speed: "20 km/h" },
  { seconds: 2 * 60 + 45, speed: "21,8 km/h" },
];

const restSeconds = 3 * 60;
const countdownSeconds = 10;
const totalLapCount = 12;
const popularLapCount = 5;

const state = {
  lapIndex: 0,
  phase: "ready",
  running: false,
  remainingMs: laps[0].seconds * 1000,
  durationMs: laps[0].seconds * 1000,
  endAt: null,
  tickId: null,
  sound: true,
  warned: new Set(),
  audioContext: null,
  countdownFromRest: false,
  autoTransition: true,
};

const els = {
  timerPanel: document.querySelector(".timer-panel"),
  phaseLabel: document.querySelector("#phaseLabel"),
  speedLabel: document.querySelector("#speedLabel"),
  roundLabel: document.querySelector("#roundLabel"),
  roundTotal: document.querySelector("#roundTotal"),
  clock: document.querySelector("#clock"),
  limitLabel: document.querySelector("#limitLabel"),
  nextLabel: document.querySelector("#nextLabel"),
  phaseProgress: document.querySelector("#phaseProgress"),
  progressTrack: document.querySelector(".progress-track"),
  lapDots: document.querySelector("#lapDots"),
  scheduleList: document.querySelector("#scheduleList"),
  startPauseButton: document.querySelector("#startPauseButton"),
  nextButton: document.querySelector("#nextButton"),
  resetButton: document.querySelector("#resetButton"),
  soundButton: document.querySelector("#soundButton"),
  fullscreenButton: document.querySelector("#fullscreenButton"),
  adjustButtons: Array.from(document.querySelectorAll("[data-adjust]")),
};

function formatTime(totalSeconds) {
  const seconds = Math.max(0, Math.ceil(totalSeconds));
  const minutes = Math.floor(seconds / 60);
  const rest = seconds % 60;
  return `${minutes}:${String(rest).padStart(2, "0")}`;
}

function phaseName() {
  if (state.phase === "ready") return "Preparats";
  if (state.phase === "countdown") return "SORTIDA";
  if (state.phase === "lap") return "Volta en marxa";
  if (state.phase === "rest") return "Descans";
  if (state.phase === "finished") return "Final";
  return "Pausat";
}

function setPhase(phase, seconds) {
  state.phase = phase;
  state.running = false;
  state.durationMs = seconds * 1000;
  state.remainingMs = state.durationMs;
  state.endAt = null;
  state.warned.clear();
  clearInterval(state.tickId);
  state.tickId = null;
  render();
}

function start() {
  if (state.phase === "finished") return;
  if (state.phase === "ready") {
    state.phase = "countdown";
    state.durationMs = countdownSeconds * 1000;
    state.remainingMs = state.durationMs;
  }
  state.running = true;
  state.endAt = Date.now() + state.remainingMs;
  clearInterval(state.tickId);
  state.tickId = setInterval(tick, 120);
  beep(620, 0.11);
  render();
}

function pause() {
  state.running = false;
  state.remainingMs = Math.max(0, state.endAt - Date.now());
  state.endAt = null;
  clearInterval(state.tickId);
  state.tickId = null;
  render();
}

function tick() {
  state.remainingMs = Math.max(0, state.endAt - Date.now());
  const secondsLeft = Math.ceil(state.remainingMs / 1000);

  // Countdown beeps: more dramatic feedback
  if (state.phase === "countdown" && [10, 5, 4, 3, 2, 1].includes(secondsLeft) && !state.warned.has(secondsLeft)) {
    state.warned.add(secondsLeft);
    const freq = secondsLeft <= 3 ? 1100 : secondsLeft <= 5 ? 900 : 700;
    beep(freq, 0.12);
  }

  // Lap beeps
  if (state.phase === "lap" && [10, 5, 4, 3, 2, 1].includes(secondsLeft) && !state.warned.has(secondsLeft)) {
    state.warned.add(secondsLeft);
    beep(secondsLeft <= 5 ? 920 : 720, 0.08);
  }

  if (state.remainingMs <= 0) {
    if (state.phase === "countdown") {
      beep(1200, 0.25);
    } else {
      beep(240, 0.28);
    }
    advance();
    return;
  }

  render();
}

function advance() {
  if (state.phase === "finished") return;
  
  if (state.phase === "ready") {
    state.phase = "countdown";
    state.durationMs = countdownSeconds * 1000;
    state.remainingMs = state.durationMs;
    render();
    return;
  }

  if (state.phase === "countdown") {
    state.phase = "lap";
    state.durationMs = laps[state.lapIndex].seconds * 1000;
    state.remainingMs = state.durationMs;
    if (state.autoTransition) {
      // Auto: comença la volta automàticament
      clearInterval(state.tickId);
      state.endAt = Date.now() + state.remainingMs;
      state.running = true;
      state.tickId = setInterval(tick, 120);
      beep(880, 0.2);
    } else {
      // Manual: pausa fins que l'usuari cliqui play
      state.running = false;
    }
    render();
    return;
  }

  if (state.phase === "lap") {
    if (state.lapIndex >= totalLapCount - 1) {
      state.phase = "finished";
      state.remainingMs = 0;
      state.durationMs = 1;
      render();
      return;
    }
    state.phase = "rest";
    state.durationMs = restSeconds * 1000;
    state.remainingMs = state.durationMs;
    if (state.autoTransition) {
      // Auto: comença el descans
      clearInterval(state.tickId);
      state.endAt = Date.now() + state.remainingMs;
      state.running = true;
      state.tickId = setInterval(tick, 120);
      beep(760, 0.15);
    } else {
      // Manual: pausa
      state.running = false;
    }
    render();
    return;
  }

  if (state.phase === "rest") {
    state.lapIndex += 1;
    if (state.lapIndex >= totalLapCount) {
      state.phase = "finished";
      state.running = false;
      clearInterval(state.tickId);
      state.tickId = null;
      beep(1200, 0.3);
      render();
      return;
    }
    state.phase = "countdown";
    state.durationMs = countdownSeconds * 1000;
    state.remainingMs = state.durationMs;
    if (state.autoTransition) {
      // Auto: comença countdown de la següent volta
      clearInterval(state.tickId);
      state.endAt = Date.now() + state.remainingMs;
      state.running = true;
      state.warned.clear();
      state.tickId = setInterval(tick, 120);
      beep(620, 0.11);
    } else {
      // Manual: pausa en countdown
      state.running = false;
      state.warned.clear();
    }
    render();
  }

  if (state.phase === "finished") {
    reset();
  }
}

function reset() {
  clearInterval(state.tickId);
  state.lapIndex = 0;
  state.phase = "ready";
  state.running = false;
  state.remainingMs = laps[0].seconds * 1000;
  state.durationMs = laps[0].seconds * 1000;
  state.endAt = null;
  state.tickId = null;
  state.warned.clear();
  render();
}

function adjust(seconds) {
  if (state.phase === "finished") return;
  state.remainingMs = Math.max(0, state.remainingMs + seconds * 1000);
  if (state.running) state.endAt = Date.now() + state.remainingMs;
  render();
}

function beep(frequency, duration) {
  if (!state.sound) return;
  const AudioContext = window.AudioContext || window.webkitAudioContext;
  if (!AudioContext) return;
  state.audioContext ||= new AudioContext();
  const ctx = state.audioContext;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.frequency.value = frequency;
  osc.type = "square";
  gain.gain.setValueAtTime(0.0001, ctx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.12, ctx.currentTime + 0.01);
  gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + duration);
  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.start();
  osc.stop(ctx.currentTime + duration + 0.02);
}

function renderDots() {
  els.lapDots.innerHTML = "";
  for (let i = 0; i < 12; i += 1) {
    const dot = document.createElement("div");
    dot.className = "lap-dot";
    dot.textContent = i + 1;
    if (i < state.lapIndex || state.phase === "finished") dot.classList.add("done");
    if (i === state.lapIndex && state.phase !== "finished") dot.classList.add("current");
    if (i === popularLapCount - 1) dot.title = "Fi participants populars";
    els.lapDots.appendChild(dot);
  }
}

function renderSchedule() {
  els.scheduleList.innerHTML = "";
  laps.forEach((lap, index) => {
    const item = document.createElement("li");
    item.innerHTML = `<strong>${index + 1}</strong><span>${formatTime(lap.seconds)}</span><span>${lap.speed}</span>`;
    if (index < state.lapIndex || state.phase === "finished") item.classList.add("done");
    if (index === state.lapIndex && state.phase !== "finished") item.classList.add("current");
    if (index === popularLapCount - 1) item.classList.add("popular-finish");
    
    // Fer la ronda clicable per saltar a ella
    item.style.cursor = "pointer";
    item.dataset.lapIndex = index;
    
    els.scheduleList.appendChild(item);
  });
}

// Event delegation per a les rondes (un sol listener en lloc de crear-ne un per cada render)
els.scheduleList.addEventListener("click", (e) => {
  const item = e.target.closest("li");
  if (item && item.dataset.lapIndex !== undefined) {
    jumpToLap(Number(item.dataset.lapIndex));
  }
});

function jumpToLap(lapIndex) {
  if (lapIndex < 0 || lapIndex >= totalLapCount) return;
  clearInterval(state.tickId);
  state.tickId = null;
  state.running = false;
  state.endAt = null;
  state.lapIndex = lapIndex;
  state.phase = "countdown";
  state.durationMs = countdownSeconds * 1000;
  state.remainingMs = state.durationMs;
  state.warned.clear();
  render();
}

function render() {
  const currentLap = laps[state.lapIndex];
  const secondsLeft = state.remainingMs / 1000;
  const progress = state.phase === "finished" ? 100 : 100 - (state.remainingMs / state.durationMs) * 100;
  const dataPhase = state.phase === "countdown" && state.running ? "countdown" : state.phase === "lap" && secondsLeft <= 10 && state.running ? "warning" : state.phase;

  els.timerPanel.dataset.phase = dataPhase;
  els.phaseLabel.textContent = phaseName();
  els.speedLabel.textContent = state.phase === "countdown" ? "10 segons" : state.phase === "rest" ? "Recuperació" : currentLap.speed;
  els.roundLabel.textContent = state.phase === "countdown" ? "COMPTE ENRERE" : state.phase === "rest" ? "Descans" : state.phase === "finished" ? "Final" : `Volta ${state.lapIndex + 1}`;
  els.roundTotal.textContent = state.phase === "countdown" ? "" : state.phase === "rest" ? `abans de la ${state.lapIndex + 2}` : `/ ${totalLapCount}`;
  els.clock.textContent = formatTime(secondsLeft);
  els.limitLabel.textContent = state.phase === "countdown" ? "Prepareu-vos per sortir!" : state.phase === "rest" ? "Descans: 3:00" : `Temps límit: ${formatTime(currentLap.seconds)}`;
  els.nextLabel.textContent = nextText();
  els.phaseProgress.style.width = `${Math.min(100, Math.max(0, progress))}%`;
  els.startPauseButton.textContent = state.running ? "Pausa" : state.phase === "ready" ? "Comença" : "Continua";
  if (state.phase === "finished") els.startPauseButton.textContent = "Acabat";
  els.startPauseButton.disabled = state.phase === "finished";
  els.soundButton.textContent = state.sound ? "So activat" : "So silenciat";
  els.soundButton.classList.toggle("active", state.sound);
  const autoTransitionBtn = document.querySelector("#autoTransitionButton");
  if (autoTransitionBtn) {
    autoTransitionBtn.textContent = state.autoTransition ? "Auto: ON" : "Auto: OFF";
    autoTransitionBtn.classList.toggle("active", state.autoTransition);
  }
  renderDots();
  renderSchedule();
}

function nextText() {
  if (state.phase === "ready") return "Següent: compte enrere 10 s";
  if (state.phase === "countdown") return "Sortida imminent!";
  if (state.phase === "lap" && state.lapIndex < totalLapCount - 1) return "Després: descans 3:00";
  if (state.phase === "lap") return "Última volta";
  if (state.phase === "rest") return `Següent: volta ${state.lapIndex + 2}`;
  return "Cursa completada";
}

els.startPauseButton.addEventListener("click", () => {
  if (state.running) pause();
  else start();
});

els.nextButton.addEventListener("click", advance);
els.resetButton.addEventListener("click", reset);

els.adjustButtons.forEach((button) => {
  button.addEventListener("click", () => adjust(Number(button.dataset.adjust)));
});

els.soundButton.addEventListener("click", () => {
  state.sound = !state.sound;
  render();
});

els.fullscreenButton.addEventListener("click", () => {
  if (document.fullscreenElement) {
    document.exitFullscreen().catch(() => {});
  } else {
    document.documentElement.requestFullscreen({ navigationUI: "hide" }).catch(() => {});
  }
});

const autoTransitionButton = document.querySelector("#autoTransitionButton");
if (autoTransitionButton) {
  autoTransitionButton.addEventListener("click", () => {
    state.autoTransition = !state.autoTransition;
    render();
  });
}

document.addEventListener("mousemove", (event) => {
  const showControls = event.clientX > window.innerWidth - 72;
  if (showControls) document.body.classList.add("controls-visible");
});

els.timerPanel.addEventListener("mouseenter", () => {
  document.body.classList.remove("controls-visible");
});

// Click a lap dots - DESACTIVAT: usar menú dret en lloc seu
// els.lapDots.addEventListener("click", (e) => { ... });

// Click a barra de progrés - DESACTIVAT: no necessari per a aquesta versió
// els.phaseProgress.addEventListener("click", (e) => { ... });

document.querySelector(".control-dock").addEventListener("mouseleave", () => {
  document.body.classList.remove("controls-visible");
});

document.addEventListener("keydown", (event) => {
  if (event.code === "Space") {
    event.preventDefault();
    // Desfocar qualsevol botó que tingui focus per evitar dobles activacions
    if (document.activeElement && document.activeElement.tagName === "BUTTON") {
      document.activeElement.blur();
    }
    if (state.running) pause();
    else start();
  } else if (event.key.toLowerCase() === "n") {
    event.preventDefault();
    advance();
  } else if (event.key.toLowerCase() === "r") {
    event.preventDefault();
    reset();
  } else if (event.key.toLowerCase() === "f") {
    event.preventDefault();
    els.fullscreenButton.click();
  }
});

render();
