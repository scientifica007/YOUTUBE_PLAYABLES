# Experiment Plan — YouTube Playables Experiment 001

Date established: 2026-09-17

## Research question

Can a single independent creator, using AI-assisted development, move from an original idea to a technically credible YouTube Playables submission candidate with a small, auditable codebase and without a traditional game-development pipeline?

## Experiment 001

Working title: **Inspection Sprint**

Core loop:

1. A board displays several inspection panels.
2. All but one panel follow the same indicator pattern.
3. The player identifies the anomalous panel under time pressure.
4. Correct answers earn points plus a speed bonus; mistakes cost points.
5. Difficulty rises through larger boards and longer patterns.
6. At the end of the run, the best score is retained and can be submitted to YouTube via `sendScore`.

The first prototype intentionally uses abstract visual patterns rather than copyrighted art, music, characters, or third-party assets.

## Why this prototype first

The first experiment is optimized for learning platform constraints rather than maximizing commercial appeal. It gives us a clean way to test:

- SDK load order;
- `firstFrameReady` / `gameReady` lifecycle;
- `loadData` / `saveData`;
- `sendScore`;
- pause/resume behavior;
- touch and mouse interaction;
- responsive layout across extreme aspect ratios;
- bundle size and file-count constraints;
- packaging and certification workflow.

## Stages and gates

### Gate 0 — Platform baseline

Exit criteria:

- current official requirements captured;
- known access limitation documented;
- technical stack selected;
- repository structure established.

Status: **PASS — bootstrap implementation created; official Test Suite not yet run.**

### Gate 1 — Local playable prototype

Exit criteria:

- complete game loop runs locally;
- start → rounds → game-over → replay works;
- mouse and touch work;
- resize does not reset the run;
- pause/resume freezes the timer correctly;
- no external game assets;
- local validator passes.

Status: **IMPLEMENTED, pending physical/browser test.**

### Gate 2 — Gameplay quality

Exit criteria:

- player understands the objective within 10 seconds;
- first useful interaction is immediate;
- difficulty curve is neither trivial nor frustrating;
- at least 10 consecutive test runs complete without a functional defect;
- desktop and Android browser evidence collected.

Status: **NOT STARTED.**

### Gate 3 — Official SDK Test Suite

Exit criteria:

- Playables Test Suite recognizes SDK integration;
- lifecycle checks pass;
- save/load checks pass;
- pause/resume checks pass;
- score integration passes where testable;
- no prohibited/unsupported calls detected.

Status: **NOT STARTED.**

### Gate 4 — Submission candidate

Exit criteria:

- release ZIP built with `index.html` at archive root;
- all certification requirements re-read against latest official revision;
- thumbnails and metadata prepared;
- rights provenance documented;
- performance budget measured;
- candidate build frozen and tagged.

Status: **NOT STARTED.**

### Gate 5 — Developer access / onboarding

Exit criteria:

- Playables interest submission prepared or submitted;
- YouTube channel onboarding status known;
- Developer Portal access obtained if YouTube accepts the project.

Status: **EXTERNAL DEPENDENCY.**

### Gate 6 — Portal certification

Exit criteria:

- bundle uploaded through the Playables Developer Portal;
- Dev Link tested on desktop web, mobile web, Android, and iOS where available;
- certification submission completed;
- YouTube review outcome recorded.

Status: **BLOCKED until Gate 5 access is granted.**

## Quantitative engineering targets for Experiment 001

These are project targets, intentionally tighter than most platform hard limits:

- total prototype game directory: < 1 MiB before compression;
- external game assets: 0;
- third-party runtime dependencies: 0, excluding the required YouTube Playables SDK;
- target interactable time on ordinary broadband: < 1 s locally, while official platform target remains < 5 s;
- JS heap: far below 512 MiB;
- input: 100% playable with touch and mouse;
- supported viewport baseline for manual tests: 320×480 through 1920×1080 plus at least one ultrawide resize;
- no run reset on resize;
- English UI available at all times.

## Evidence to collect

For every gate after Gate 1, record:

- browser/device;
- viewport/orientation;
- build commit SHA;
- observed load behavior;
- defects found;
- pass/fail judgment;
- screenshots or screen recording when useful;
- exact Test Suite output once available.

## Non-goals for Experiment 001

- multiplayer;
- backend services;
- user accounts outside YouTube;
- in-game purchases;
- advertising implementation;
- elaborate art pipeline;
- large asset packs;
- cloning an existing game.

These can be considered only after the platform integration path is proven.
