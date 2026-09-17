(() => {
  "use strict";

  const platform = window.PlayablesPlatform;

  const ROUND_COUNT = 10;
  const ROUND_DURATION_MS = 7000;
  const WRONG_PENALTY = 35;
  const BASE_POINTS = 100;

  const els = {
    menu: document.getElementById("menu-screen"),
    game: document.getElementById("game-screen"),
    result: document.getElementById("result-screen"),
    start: document.getElementById("start-button"),
    replay: document.getElementById("replay-button"),
    bootStatus: document.getElementById("boot-status"),
    score: document.getElementById("score-value"),
    best: document.getElementById("best-value"),
    finalScore: document.getElementById("final-score"),
    resultSummary: document.getElementById("result-summary"),
    roundLabel: document.getElementById("round-label"),
    timer: document.getElementById("timer-value"),
    progress: document.getElementById("progress-bar"),
    board: document.getElementById("board"),
    feedback: document.getElementById("round-feedback"),
    runtimeBadge: document.getElementById("runtime-badge"),
  };

  const state = {
    score: 0,
    bestScore: 0,
    totalRuns: 0,
    round: 0,
    active: false,
    paused: false,
    acceptingInput: false,
    anomalyIndex: -1,
    deadline: 0,
    remainingMs: ROUND_DURATION_MS,
    timerHandle: null,
    saveVersion: 1,
  };

  function randomInt(maxExclusive) {
    return Math.floor(Math.random() * maxExclusive);
  }

  function patternKey(pattern) {
    return pattern.join("");
  }

  function makeBasePattern(length) {
    let pattern;
    do {
      pattern = Array.from({ length }, () => (Math.random() >= 0.5 ? 1 : 0));
      const onCount = pattern.reduce((sum, value) => sum + value, 0);
      if (onCount > 0 && onCount < length) return pattern;
    } while (true);
  }

  function makeAnomaly(base) {
    const anomaly = [...base];
    const changeIndex = randomInt(base.length);
    anomaly[changeIndex] = anomaly[changeIndex] === 1 ? 0 : 1;
    return anomaly;
  }

  function roundConfig(roundNumber) {
    if (roundNumber <= 3) {
      return { panelCount: 9, patternLength: 4, desktopColumns: 3, mobileColumns: 3 };
    }
    if (roundNumber <= 6) {
      return { panelCount: 12, patternLength: 5, desktopColumns: 4, mobileColumns: 3 };
    }
    return { panelCount: 16, patternLength: 6, desktopColumns: 4, mobileColumns: 4 };
  }

  function setScreen(name) {
    els.menu.hidden = name !== "menu";
    els.game.hidden = name !== "game";
    els.result.hidden = name !== "result";
  }

  function updateScore() {
    els.score.textContent = String(state.score);
    els.best.textContent = String(state.bestScore);
  }

  function setFeedback(message, kind = "") {
    els.feedback.textContent = message;
    els.feedback.className = `feedback${kind ? ` ${kind}` : ""}`;
  }

  function serializeSave() {
    return JSON.stringify({
      version: state.saveVersion,
      bestScore: state.bestScore,
      totalRuns: state.totalRuns,
    });
  }

  async function persistMeta() {
    await platform.saveData(serializeSave());
  }

  function applySave(raw) {
    if (!raw) return;
    try {
      const parsed = JSON.parse(raw);
      if (!parsed || parsed.version !== 1) return;
      const best = Number(parsed.bestScore);
      const runs = Number(parsed.totalRuns);
      if (Number.isFinite(best) && best >= 0) state.bestScore = Math.floor(best);
      if (Number.isFinite(runs) && runs >= 0) state.totalRuns = Math.floor(runs);
    } catch (_) {
      platform.reportWarning();
    }
  }

  function renderPanel(index, pattern, isAnomaly) {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "panel-button";
    button.dataset.index = String(index);
    button.dataset.anomaly = isAnomaly ? "true" : "false";
    button.setAttribute("aria-label", `Panel ${index + 1}, pattern ${pattern.join(" ")}`);

    const strip = document.createElement("span");
    strip.className = "indicator-strip";
    strip.style.setProperty("--cells", String(pattern.length));
    strip.setAttribute("aria-hidden", "true");

    pattern.forEach((value) => {
      const cell = document.createElement("span");
      cell.className = `indicator-cell${value ? " on" : ""}`;
      strip.appendChild(cell);
    });

    button.appendChild(strip);
    button.addEventListener("click", () => handlePanelChoice(button));
    return button;
  }

  function buildBoard() {
    const roundNumber = state.round + 1;
    const config = roundConfig(roundNumber);
    const base = makeBasePattern(config.patternLength);
    const anomaly = makeAnomaly(base);
    const anomalyKey = patternKey(anomaly);

    state.anomalyIndex = randomInt(config.panelCount);
    els.board.innerHTML = "";
    els.board.style.setProperty("--columns", String(config.desktopColumns));
    els.board.style.setProperty("--mobile-columns", String(config.mobileColumns));

    for (let index = 0; index < config.panelCount; index += 1) {
      const isAnomaly = index === state.anomalyIndex;
      const pattern = isAnomaly ? anomaly : base;
      const button = renderPanel(index, pattern, isAnomaly);
      button.dataset.patternKey = isAnomaly ? anomalyKey : patternKey(base);
      els.board.appendChild(button);
    }
  }

  function stopTimer() {
    if (state.timerHandle !== null) {
      clearInterval(state.timerHandle);
      state.timerHandle = null;
    }
  }

  function renderTimer() {
    const safeMs = Math.max(0, state.remainingMs);
    els.timer.textContent = (safeMs / 1000).toFixed(1);
    const scale = Math.max(0, Math.min(1, safeMs / ROUND_DURATION_MS));
    els.progress.style.transform = `scaleX(${scale})`;
  }

  function timerTick() {
    if (!state.active || state.paused) return;
    state.remainingMs = Math.max(0, state.deadline - performance.now());
    renderTimer();
    if (state.remainingMs <= 0) {
      stopTimer();
      onRoundTimeout();
    }
  }

  function startTimer(durationMs = ROUND_DURATION_MS) {
    stopTimer();
    state.remainingMs = durationMs;
    state.deadline = performance.now() + durationMs;
    renderTimer();
    state.timerHandle = window.setInterval(timerTick, 100);
  }

  function disableBoard() {
    state.acceptingInput = false;
    els.board.querySelectorAll("button").forEach((button) => {
      button.disabled = true;
    });
  }

  function revealAnomaly() {
    const target = els.board.querySelector(`[data-index="${state.anomalyIndex}"]`);
    if (target) target.classList.add("reveal");
  }

  function handlePanelChoice(button) {
    if (!state.active || state.paused || !state.acceptingInput) return;

    const chosen = Number(button.dataset.index);
    if (chosen === state.anomalyIndex) {
      state.acceptingInput = false;
      stopTimer();
      const speedBonus = Math.max(0, Math.ceil(state.remainingMs / 70));
      const earned = BASE_POINTS + speedBonus;
      state.score += earned;
      button.classList.add("correct");
      setFeedback(`Correct. +${earned} points.`, "good");
      updateScore();
      window.setTimeout(advanceRound, 420);
      return;
    }

    state.score = Math.max(0, state.score - WRONG_PENALTY);
    button.classList.add("wrong");
    button.disabled = true;
    setFeedback(`Not that one. -${WRONG_PENALTY} points.`, "bad");
    updateScore();
  }

  function onRoundTimeout() {
    if (!state.active || !state.acceptingInput) return;
    disableBoard();
    revealAnomaly();
    setFeedback("Time expired. The anomaly is highlighted.", "bad");
    window.setTimeout(advanceRound, 700);
  }

  function renderRound() {
    const roundNumber = state.round + 1;
    state.acceptingInput = true;
    state.paused = false;
    els.roundLabel.textContent = `Round ${roundNumber} / ${ROUND_COUNT}`;
    setFeedback("");
    buildBoard();
    startTimer();
  }

  function advanceRound() {
    if (!state.active) return;
    state.round += 1;
    if (state.round >= ROUND_COUNT) {
      finishRun();
      return;
    }
    renderRound();
  }

  async function finishRun() {
    stopTimer();
    state.active = false;
    state.acceptingInput = false;
    state.totalRuns += 1;

    const previousBest = state.bestScore;
    if (state.score > state.bestScore) {
      state.bestScore = state.score;
    }

    updateScore();
    els.finalScore.textContent = String(state.score);
    els.resultSummary.textContent = state.score > previousBest
      ? "New best score. It has been saved."
      : `Best score: ${state.bestScore}.`;
    setScreen("result");

    await persistMeta();
    if (state.bestScore > previousBest) {
      await platform.sendScore(state.bestScore);
    }
  }

  function startRun() {
    state.score = 0;
    state.round = 0;
    state.active = true;
    state.paused = false;
    state.acceptingInput = true;
    updateScore();
    setScreen("game");
    renderRound();
  }

  function pauseRun() {
    if (!state.active || state.paused) return;
    state.paused = true;
    state.remainingMs = Math.max(0, state.deadline - performance.now());
    stopTimer();
    setFeedback("Paused by platform.");
    void persistMeta();
  }

  function resumeRun() {
    if (!state.active || !state.paused) return;
    state.paused = false;
    setFeedback("");
    startTimer(state.remainingMs);
  }

  function installEvents() {
    els.start.addEventListener("click", startRun);
    els.replay.addEventListener("click", startRun);

    window.addEventListener("keydown", (event) => {
      if (event.key === "Escape") {
        // Intentionally do not preventDefault: Playables design guidance reserves Esc behavior.
        return;
      }
    });

    platform.installLifecycleHandlers(pauseRun, resumeRun);
  }

  async function initialize() {
    els.runtimeBadge.textContent = platform.inPlayables
      ? `YouTube Playables${platform.sdkVersion ? ` · SDK ${platform.sdkVersion}` : ""}`
      : "Local mode";

    installEvents();

    await new Promise((resolve) => window.requestAnimationFrame(resolve));
    platform.firstFrameReady();

    els.bootStatus.textContent = "Loading saved progress…";
    const rawSave = await platform.loadData();
    applySave(rawSave);
    updateScore();

    // Locale is obtained only through the Playables SDK. English remains the baseline UI.
    await platform.getLanguage();

    els.start.disabled = false;
    els.start.textContent = "Start inspection";
    els.bootStatus.textContent = platform.inPlayables
      ? "Ready inside YouTube Playables."
      : "Ready. Local development mode.";

    platform.gameReady();
  }

  initialize().catch(() => {
    platform.reportError();
    els.bootStatus.textContent = "Initialization failed. Reload to retry.";
  });
})();
