# YOUTUBE_PLAYABLES

Experimental repository for designing, building, testing, and eventually submitting an original game to **YouTube Playables**.

## Current objective

Build a real, browser-playable prototype that is structured from day one around the current YouTube Playables technical and certification requirements. The first experiment is deliberately small so that we can learn the platform constraints before investing in a larger game.

**Experiment 001:** `Inspection Sprint`

A short pattern-inspection game: one panel violates the standard and the player must identify it quickly. It is original, self-contained, touch/mouse friendly, and does not depend on external game assets.

## Current status

- Repository baseline established.
- Official YouTube Playables requirements snapshot recorded in `docs/YOUTUBE_REQUIREMENTS_BASELINE.md`.
- Experiment plan recorded in `docs/EXPERIMENT_PLAN.md`.
- Technical decisions recorded in `docs/DECISIONS.md`.
- First playable browser prototype added under `game/`.
- YouTube Playables SDK adapter included with local fallback behavior.
- Local bundle validator added under `tools/`.

This is a **technical prototype**, not yet a submission candidate.

## Run locally

From the repository root:

```bash
python3 -m http.server 8080 --directory game
```

Then open:

```text
http://localhost:8080
```

The official Playables SDK is loaded before the game code. According to the YouTube documentation, the SDK behaves as a no-op when the game is served locally, so the prototype remains locally testable.

## Validate the bundle

```bash
python3 tools/validate_bundle.py game
```

The validator checks the local hard limits we can verify without the YouTube Developer Portal/Test Suite: file count, individual file size, total uncompressed size, filename characters, root `index.html`, and SDK-before-game-code ordering.

## Repository structure

```text
.
├── README.md
├── CHANGELOG.md
├── docs/
│   ├── DECISIONS.md
│   ├── EXPERIMENT_PLAN.md
│   └── YOUTUBE_REQUIREMENTS_BASELINE.md
├── game/
│   ├── index.html
│   ├── styles.css
│   └── src/
│       ├── game.js
│       └── youtube_adapter.js
└── tools/
    └── validate_bundle.py
```

## Important platform reality

YouTube currently describes Playables developer access as **early access**. The Playables Developer Portal remains a **private preview**, participation is invitation-only, and the target YouTube channel must be onboarded before portal publishing is available. Therefore this project separates two tracks:

1. **Engineering track:** build and validate a Playables-ready game now.
2. **Access/publishing track:** apply for consideration and use the Developer Portal when YouTube grants access.

## Authoritative external references

- YouTube Playables developer home: https://developers.google.com/youtube/gaming/playables
- SDK getting started: https://developers.google.com/youtube/gaming/playables/reference/getting_started
- SDK reference: https://developers.google.com/youtube/gaming/playables/reference/sdk
- Certification requirements: https://developers.google.com/youtube/gaming/playables/certification/requirements
- Developer Portal guide: https://developers.google.com/youtube/gaming/playables/developer_portal

Before any future certification submission, these requirements must be re-read because the program is still evolving.
