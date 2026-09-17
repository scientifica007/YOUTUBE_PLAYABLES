# Test Evidence — Experiment 001

This file records observed evidence for gate decisions. A result is marked PASS only for behavior directly evidenced or explicitly executed.

## Session 2026-09-17 — Desktop local browser

Branch: `bootstrap/experiment-001`

Observed environment from supplied screenshots:

- Ubuntu desktop.
- Brave browser.
- Game served locally at `0.0.0.0:8080`.
- Runtime badge displayed `Local mode` / `Ready. Local development mode.`

### Evidence received

Four screenshots were supplied by the project owner during the test session:

1. Start screen rendered successfully with enabled `Start inspection` control and `Local mode` runtime state.
2. Active Round 1 / 10 rendered with timer, score, best score, progress bar, and 3×3 panel board.
3. Active Round 3 / 10 rendered after progression, confirming the run advanced between rounds without page reload.
4. Result screen rendered after Run 1 completion with final score `625`, best score `625`, message `New best score saved.`, and `Run again` control.

### Verified in this session

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

### Not yet verified by this evidence

The screenshots do **not** prove the following and no PASS should be inferred for them yet:

- deliberate wrong-answer penalty behavior;
- timeout reveal behavior;
- replay starts a clean second run;
- persistence survives page reload;
- resize/state preservation;
- Playables pause/resume callbacks;
- touch input;
- Android portrait/landscape behavior;
- local validator result;
- ZIP packaging result;
- official YouTube Playables Test Suite behavior;
- YouTube cloud save / score submission inside Playables.

### Gate impact

Gate 1 is now **PARTIALLY EVIDENCED / RETEST REQUIRED** rather than merely untested. Desktop boot and one complete local run have direct visual evidence, but Gate 1 remains open until the remaining mandatory checks in `MANUAL_TEST_PROTOCOL.md` are completed.

