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

A final desktop behavioral session supplied three screenshots and explicit owner-reported results for the remaining desktop checks:

8. During active play, the browser was resized to a narrow window while the run remained on Round 9 / 10 with score `902` and best `1487`; gameplay remained rendered and usable.
9. The run subsequently reached Round 10 / 10 at timer `0.0`, with the anomalous panel highlighted, consistent with timeout reveal and automatic progression.
10. The same run completed normally at final score `902` while best score remained `1487`.
11. The project owner explicitly reported: `Wrong answer -35: PASS`, `Timeout reveal + next round: PASS`, `Run again button: PASS`, and `Resize without reset: PASS`.

### Browser behavior verified

- **Desktop local boot:** PASS.
- **Initial UI render:** PASS.
- **Start control becomes usable:** PASS.
- **Game enters active run:** PASS.
- **Round progression:** PASS.
- **Timer display and progress indicator render during play:** PASS.
- **Score/best-score display render:** PASS.
- **Run reaches completion/result screen:** PASS.
- **New best score is reflected in UI at run completion:** PASS.
- **Local best-score persistence across server stop/restart + page reopen:** PASS (`1280` retained).
- **Fresh run resets current score while retaining best score:** PASS (`SCORE 0`, `BEST 1280`).
- **Lower later result does not replace persisted best:** PASS (`1263` final, `1280` best retained).
- **Wrong-answer penalty path:** PASS; owner deliberately selected a wrong panel and verified the `-35` behavior without terminating the round.
- **Timeout reveal + automatic next-round path:** PASS.
- **Direct replay via `Run again`:** PASS.
- **Resize/state preservation:** PASS; active-run state survived narrow/wide resize without reset.

### Local HTTP server evidence

The Python development server returned HTTP 200 for all game resources required by the current prototype during the first uncached load:

- `/`
- `/styles.css`
- `/src/youtube_adapter.js`
- `/src/game.js`

A request for `/favicon.ico` returned HTTP 404. This is **non-blocking** for the game because no favicon is currently included or referenced as a required Playables resource.

On a later reopened session, the same required resources returned HTTP `304 Not Modified`. This is normal browser cache revalidation and is consistent with successful reuse of unchanged resources; it is not a game-loading error.

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

- touch input on a physical Android device;
- Android portrait/landscape behavior and orientation-change state preservation;
- official YouTube Playables Test Suite behavior;
- Playables `onPause` / `onResume` lifecycle behavior;
- YouTube cloud save / score submission inside Playables.

### Gate impact

All required **desktop/local** Gate 1 checks are now PASS: boot, full game loop, wrong-answer and timeout paths, direct replay, local persistence, resize/state preservation, local static validation, and ZIP packaging. Gate 1 remains **RETEST REQUIRED / DEVICE EVIDENCE PENDING** only because the physical Android touch + portrait/landscape checks have not yet been executed. Playables lifecycle/cloud-save verification belongs to Gate 3 in the official environment/Test Suite.
