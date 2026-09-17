# Manual Test Protocol — Experiment 001

Use this protocol before accepting Gate 1.

Record the tested commit SHA with every result. Do not report “PASS” for a device/browser that was not actually tested.

## A. Desktop local launch

From repository root:

```bash
python3 -m http.server 8080 --directory game
```

Open `http://localhost:8080` in a current desktop browser.

### A1 — Boot

Expected:

- page renders without a blank screen;
- runtime badge says `Local mode`;
- Start button becomes enabled;
- saved best score loads if a previous local run exists;
- no visible error is shown.

### A2 — Complete game loop

1. Start a run.
2. Complete all 10 rounds.
3. Deliberately choose at least one wrong panel.
4. Allow at least one round to time out.
5. Complete the run and select `Run again`.

Expected:

- score increases on correct choices;
- wrong choice subtracts points but cannot make score negative;
- timed-out round reveals the anomaly and advances;
- run reaches result screen;
- replay starts a clean run;
- best score remains visible.

### A3 — Persistence

1. Finish a run with a non-zero best score.
2. Reload the page.

Expected:

- local development best score is restored.

Note: local persistence uses `localStorage` only outside Playables. This test does not validate YouTube cloud save.

## B. Resize/state preservation

During an active round:

1. resize desktop browser from narrow to wide and back;
2. if available, test approximately 320×480, 768×1024, 1366×768, 1920×1080;
3. test an ultrawide window shape.

Expected:

- current round does not restart;
- score does not reset;
- timer continues normally;
- all panels remain tappable/clickable;
- no page-level horizontal overflow blocks play.

## C. Pause/resume

During an active round in local mode:

1. switch to another browser tab long enough to notice the timer pause;
2. return to the game tab.

Expected:

- timer does not consume hidden-tab time;
- round resumes from approximately the remaining time;
- no duplicate round advance occurs.

Repeat once immediately after a correct answer, during the short transition before the next round.

Expected:

- game does not begin timing the next round while paused;
- exactly one next round appears after resume.

## D. Mouse and touch

### Desktop mouse

Expected: every game action is possible with pointer click.

### Android browser

Serve the game from a network-reachable local server or another temporary test host and open it on Android.

Expected:

- all game actions work by touch;
- no hover-only interaction is required;
- buttons are comfortably tappable;
- portrait and landscape both remain playable;
- orientation change does not reset the run.

## E. Local static preflight

Run:

```bash
python3 tools/validate_bundle.py game
```

Expected:

- process exits with code 0;
- result is `PASS`;
- no hard-limit errors.

Then package:

```bash
python3 tools/package_game.py
```

Expected:

- validation runs first;
- ZIP is created at `build/inspection-sprint-exp001.zip`;
- `index.html` is at the ZIP archive root, not nested under `game/`.

## F. Gate 1 verdict

Gate 1 can be marked **PASS** only after all of the following are evidenced:

- desktop boot PASS;
- full loop PASS;
- persistence PASS;
- resize/state PASS;
- local pause/resume PASS;
- mouse PASS;
- Android touch/orientation PASS;
- validator PASS;
- ZIP packaging PASS.

Official YouTube SDK Test Suite compliance belongs to Gate 3 and must not be inferred from these local tests.
