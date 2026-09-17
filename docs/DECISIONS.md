# Engineering Decisions

Decision log for the YouTube Playables experiment.

## D-001 — Use plain web technology for Experiment 001

**Decision:** HTML + CSS + vanilla JavaScript, no game engine and no build step for the first prototype.

**Reason:** The first objective is to validate YouTube Playables integration and certification constraints, not engine capability. A tiny auditable codebase minimizes bundle size, startup time, dependency risk, and debugging ambiguity.

**Revisit when:** gameplay complexity clearly justifies Phaser, Godot, Unity, or another web-exporting engine.

## D-002 — Keep the first prototype asset-free

**Decision:** No external images, fonts, music, sound effects, or runtime libraries in Experiment 001. The required YouTube Playables SDK is the only external script.

**Reason:** This isolates SDK/platform behavior and minimizes intellectual-property and performance variables.

## D-003 — Platform adapter around `ytgame`

**Decision:** Game logic does not call `ytgame` directly. All Playables-specific behavior is isolated in `game/src/youtube_adapter.js`.

**Reason:** The same game must remain testable locally while behaving correctly inside YouTube. This also makes future SDK revisions easier to absorb.

## D-004 — Local persistence is development-only

**Decision:** The adapter may use `localStorage` only when `ytgame.IN_PLAYABLES_ENV` is false. Inside Playables, persistence uses only `ytgame.game.loadData()` and `saveData()`.

**Reason:** The SDK reference explicitly demonstrates environment-specific fallback while certification requires YouTube cloud save for Playables progress.

## D-005 — English is the baseline UI language

**Decision:** Experiment 001 ships English UI first. If localization is added, Playables locale must come from `ytgame.system.getLanguage()`, never `navigator.language(s)`.

**Reason:** Current certification requires English and prohibits browser locale APIs for locale selection.

## D-006 — No audio in Experiment 001

**Decision:** The first prototype contains no sound.

**Reason:** Audio is not necessary to validate the core experiment and would introduce additional mandatory mute-state lifecycle handling. Audio can be added only when it contributes to gameplay.

## D-007 — PR-based repository changes

**Decision:** Substantive work should be prepared on branches and reviewed through pull requests rather than written directly to `main` by default.

**Reason:** We need a traceable engineering experiment with reversible checkpoints and explicit gates.

## D-008 — Separate platform proof from game-market quality

**Decision:** A technically valid prototype does not automatically become the final game concept.

**Reason:** First prove the end-to-end Playables path. Only then decide whether to deepen `Inspection Sprint` or replace it with a more commercially compelling original game while retaining the validated platform architecture.
