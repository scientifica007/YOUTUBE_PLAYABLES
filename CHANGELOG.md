# Changelog

All notable project changes are recorded here.

## 2026-09-17 — Experiment 001 bootstrap

- Established the project baseline from current official YouTube Playables documentation.
- Added a first original technical prototype: **Inspection Sprint**.
- Added YouTube Playables SDK integration through a small platform adapter.
- Added local cloud-save fallback for development only; Playables runtime uses YouTube `loadData` / `saveData`.
- Added pause/resume hooks, `firstFrameReady`, `gameReady`, and best-score submission support.
- Added responsive touch/mouse UI with no external game assets or engine dependency.
- Added a local bundle validator.
- Added engineering plan, current requirements snapshot, and architecture decisions.

No claim is made that this build has passed the official YouTube Playables Test Suite or certification; portal access is still external to this repository.

## 2026-09-17 — Android physical test and portrait correction

- Physical Android testing completed in Brave and Chrome.
- Touch controls, landscape layout, and orientation-state preservation passed.
- Portrait layout failed because the start screen and denser boards consumed too much vertical space on the phone viewport.
- Added a narrow responsive correction in `game/styles.css`: dynamic-viewport sizing, portrait compaction, smaller touch-safe board cells, reduced indicator spacing, compact top bar/score/timer UI, portrait footer removal, and vertical-scroll fallback.
- Recorded the device evidence and the blocking portrait defect in `docs/TEST_EVIDENCE.md`.
- Gate 1 remains **RETEST REQUIRED** until the corrected portrait build passes on the physical Android device.
