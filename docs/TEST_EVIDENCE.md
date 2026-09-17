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

Four screenshots were supplied by the project owner during the first desktop run:

1. Start screen rendered successfully with enabled `Start inspection` control and `Local mode` runtime state.
2. Active Round 1 / 10 rendered with timer, score, best score, progress bar, and 3×3 panel board.
3. Active Round 3 / 10 rendered after progression, confirming the run advanced between rounds without page reload.
4. Result screen rendered after Run 1 completion with final score `625`, best score `625`, message `New best score saved.`, and `Run again` control.

A later desktop session supplied three further screenshots plus an explicit observation from the project owner:

5. Before closing the game, best score had reached `1280`; after stopping and restarting the local server and reopening the game, the start screen still displayed `BEST 1280` while current `SCORE` was `0`.
6. A new Round 1 / 10 started with `SCORE 0` and `BEST 1280`, confirming a fresh run does not reset the persisted best score.
7. The later run completed with final score `1263` while best score remained `1280`, confirming a lower subsequent run does not overwrite the saved best.

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
- **Local best-score persistence across server stop/restart + page reopen:** PASS (`1280` retained).
- **Fresh run resets current score while retaining best score:** PASS (`SCORE 0`, `BEST 1280`).
- **Lower later result does not replace persisted best:** PASS (`1263` final, `1280` best retained).
- **Replay control is present:** PASS for rendering only; direct execution specifically through the `Run again` control is not yet separately evidenced.

### Local HTTP server evidence

The Python development server returned HTTP 200 for all game resources required by the current prototype during the first uncached load:

- `/`
- `/styles.css`
- `/src/youtube_adapter.js`
- `/src/game.js`

A request for `/favicon.ico` returned HTTP 404. This is **non-blocking** for the game because no favicon is currently included or referenced as a required Playables resource.

On the later reopened session, the same required resources returned HTTP `304 Not Modified`. This is normal browser cache revalidation and is consistent with successful reuse of unchanged resources; it is not a game-loading error.

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
- direct replay execution specifically through the `Run again` button;
- resize/state preservation;
- Playables pause/resume callbacks;
- touch input;
- Android portrait/landscape behavior;
- official YouTube Playables Test Suite behavior;
- YouTube cloud save / score submission inside Playables.

### Gate impact

Gate 1 remains **PARTIALLY EVIDENCED / RETEST REQUIRED**. Local static validation, ZIP packaging, desktop boot/full-run behavior, and local best-score persistence across a server stop/restart and page reopen are PASS. The remaining mandatory local checks are wrong-answer/timeout paths, direct `Run again` replay execution, resize/state preservation, and Android touch/orientation evidence. Playables lifecycle verification belongs to Gate 3 in the official environment/Test Suite.
