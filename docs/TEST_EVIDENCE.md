# Test Evidence — Experiment 001

This file records observed evidence for gate decisions. A result is marked PASS only for behavior directly evidenced or explicitly executed.

## Session 2026-09-17 — Desktop local browser

Branch: `bootstrap/experiment-001`

Observed environment from supplied screenshots and terminal output:

- Ubuntu desktop.
- Brave browser.
- Game served locally at `0.0.0.0:8080`.
- Runtime badge displayed `Local mode` / `Ready. Local development mode.`

### Browser evidence received

Four screenshots were supplied by the project owner during the test session:

1. Start screen rendered successfully with enabled `Start inspection` control and `Local mode` runtime state.
2. Active Round 1 / 10 rendered with timer, score, best score, progress bar, and 3×3 panel board.
3. Active Round 3 / 10 rendered after progression, confirming the run advanced between rounds without page reload.
4. Result screen rendered after Run 1 completion with final score `625`, best score `625`, message `New best score saved.`, and `Run again` control.

### Browser behavior verified

- **Desktop local boot:** PASS.
- **Initial UI render:** PASS.
- **Start control becomes usable:** PASS.
- **Game enters active run:** PASS.
- **Round progression at least from Round 1 to Round 3:** PASS.
- **Timer display and progress indicator render during play:** PASS.
- **Score/best-score display render:** PASS.
- **Run reaches completion/result screen:** PASS.
- **New best score is reflected in UI at run completion:** PASS.
- **Replay control is present:** PASS for rendering only; replay execution not yet evidenced.

### Local HTTP server evidence

The Python development server returned HTTP 200 for all game resources required by the current prototype:

- `/`
- `/styles.css`
- `/src/youtube_adapter.js`
- `/src/game.js`

A request for `/favicon.ico` returned HTTP 404. This is **non-blocking** for the game because no favicon is currently included or referenced as a required Playables resource.

### Static bundle validation

Command executed:

```bash
python3 tools/validate_bundle.py game
```

Observed result: **PASS**.

Recorded measurements:

- files: `4 / 8000`;
- uncompressed bundle size: `24.9 KiB / 250 MiB`;
- no forbidden locale/Page Visibility patterns found;
- no unexpected external URLs found in text bundle files;
- validator correctly stated that this is not an official YouTube Test Suite/certification result.

Verdict: **Local static preflight — PASS.**

### ZIP packaging

Command executed:

```bash
python3 tools/package_game.py
```

Observed result:

- preflight validation ran first and passed;
- archive created at `build/inspection-sprint-exp001.zip`;
- archive files: `4`;
- archive size: `7956 bytes`.

Verdict: **Local ZIP packaging — PASS.**

This evidence proves that the local packaging path executes successfully. It does not yet prove Developer Portal upload or official certification acceptance.

### Not yet verified by this evidence

The supplied evidence does **not** yet prove the following and no PASS should be inferred for them:

- deliberate wrong-answer penalty behavior;
- timeout reveal behavior;
- replay starts a clean second run;
- persistence survives page reload;
- resize/state preservation;
- Playables pause/resume callbacks;
- touch input;
- Android portrait/landscape behavior;
- official YouTube Playables Test Suite behavior;
- YouTube cloud save / score submission inside Playables.

### Gate impact

Gate 1 remains **PARTIALLY EVIDENCED / RETEST REQUIRED**, but two additional Gate 1 checks are now closed: local static validation and ZIP packaging are both PASS. The remaining mandatory local checks are behavioral: wrong-answer/timeout paths, replay, persistence after reload, resize/state preservation, and Android touch/orientation evidence. Playables lifecycle verification belongs to Gate 3 in the official environment/Test Suite.
