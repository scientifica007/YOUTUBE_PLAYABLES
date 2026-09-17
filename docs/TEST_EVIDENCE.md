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

## Session 2026-09-17 — Android physical browser

The project owner tested the local server from an Android phone over the same LAN using both **Brave** and **Chrome**. The server log shows the phone successfully fetched `/`, `/styles.css`, `/src/youtube_adapter.js`, and `/src/game.js` with HTTP `200`, so network delivery and resource loading were successful. The repeated `/favicon.ico` `404` remained non-blocking.

A Google Drive evidence folder supplied by the owner contains the Android screenshots from this session. Visual review shows that landscape gameplay is usable, while portrait layout consumes excessive vertical space; the start screen extends below the visible area and later denser rounds do not present the complete board within the usable portrait viewport.

Owner-reported device results:

- **Network/page resource load:** PASS — the page and all required game resources load on the phone.
- **Touch controls:** PASS.
- **Portrait gameplay layout:** **FAIL** — only the upper portion of the game/board is visible on denser rounds, with insufficient usable vertical space; the owner reports that the lower content cannot be practically reached, negatively affecting play.
- **Start/menu portrait layout:** **FAIL** — the initial screen is too tall; the primary action can fall below the visible viewport.
- **Landscape layout:** PASS.
- **Orientation change without state reset:** PASS.
- **Cross-browser reproduction:** portrait problem observed during testing with both Brave and Chrome, so it is treated as an application responsive-layout defect rather than a single-browser defect.

### Corrective implementation after Android failure

A narrow responsive-layout correction was committed on the same experiment branch after reviewing the Android evidence:

- explicit vertical scrolling fallback on the document;
- `100dvh`-based shell sizing for mobile browser dynamic viewports;
- compact portrait top bar and score chips;
- reduced portrait intro/result padding and typography footprint;
- compact round header, timer, progress track, and feedback spacing;
- smaller but still touch-sized portrait panel targets;
- reduced indicator-cell minimum width/gap so six-cell patterns fit narrow four-column boards;
- mobile portrait footer hidden to reserve gameplay space;
- extra narrow-device adjustment at `<= 360px`.

Correction commit: `ed65f07b87438f502578c8962726dac3e18b1a36`.

This correction is **not accepted yet**. The exact Android portrait scenarios must be rerun from the updated branch before Gate 1 can pass.

### Current Gate 1 impact

All required desktop/local checks remain PASS. Android touch, landscape, and state preservation are PASS. Android portrait is a confirmed blocking defect in the previously tested build and has been corrected in code but is **RETEST REQUIRED**.

Gate 1 status: **RETEST REQUIRED — ANDROID PORTRAIT FIX PENDING PHYSICAL VERIFICATION.**

## Deferred to Gate 3

The evidence above does **not** prove and must not be used to infer:

- official YouTube Playables Test Suite behavior;
- Playables `onPause` / `onResume` lifecycle behavior;
- YouTube cloud save/load behavior;
- `sendScore` behavior inside Playables.
