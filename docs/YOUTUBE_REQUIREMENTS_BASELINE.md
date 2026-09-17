# YouTube Playables Requirements Baseline

Snapshot date: **2026-09-17**

Purpose: engineering baseline for this repository. This is not a substitute for the live official documentation. Re-read the English official requirements before certification because Playables remains an evolving program.

## 1. Access and publishing status

Current official state:

- Playables developer access is described by Google as **early access**.
- Interested developers can submit the Playables interest form.
- The Playables Developer Portal is currently **Private Preview**.
- Portal participation is invitation-only and may require additional agreements.
- Portal access requires manager/editor-level permission on a YouTube channel that has been onboarded to YouTube Playables.
- A release is created from metadata + ZIP bundle + thumbnails, then verified/tested before certification submission.

Engineering consequence: we can build and pre-validate the game now, but public publishing is an external access dependency.

## 2. Required SDK integration

The root of the Playable bundle must contain `index.html`.

The Playables SDK must be loaded before any game code:

```html
<script src="https://www.youtube.com/game_api/v1"></script>
```

Required/relevant lifecycle APIs include:

- `ytgame.game.firstFrameReady()` — must be called before `gameReady()` when the first frame/loading UI is ready to render.
- `ytgame.game.gameReady()` — must be called only when the game is actually interactable; YouTube keeps its loading spinner until this call.
- `ytgame.IN_PLAYABLES_ENV` — detects the Playables environment when the SDK is present.
- `ytgame.game.loadData()` / `ytgame.game.saveData(data)` — cloud save path.
- `ytgame.system.onPause()` / `ytgame.system.onResume()` — mandatory lifecycle integration.
- `ytgame.system.isAudioEnabled()` / `onAudioEnabledChange()` — mandatory if audio is present.

Recommended/relevant APIs include:

- `ytgame.system.getLanguage()`;
- `ytgame.engagement.sendScore({ value })`;
- health logging APIs;
- ad APIs if monetization features are later implemented.

Important integration rules:

- `loadData()` must complete successfully before `saveData()` is called;
- if `sendScore()` is used, the submitted best score must match the best score in the game save;
- after `onPause()` the game must pause execution and resume only after `onResume()`;
- the game **must not use the Page Visibility API or similar web APIs for pause/resume**; the Playables lifecycle callbacks are authoritative.

## 3. Localization

Current official requirements state:

- English support is mandatory.
- A game may use `ytgame.system.getLanguage()` to obtain the YouTube locale.
- The game must **not** use browser locale APIs such as `navigator.language` or `navigator.languages` to determine locale.

Experiment 001 therefore defaults to English locally and reserves YouTube locale detection for the SDK adapter.

## 4. Interaction and responsive design

The game must:

- support touch for all interactions;
- support mouse for all interactions;
- avoid unintentionally delaying or ignoring user input;
- remain playable across changing aspect ratios;
- automatically adapt when viewport dimensions change;
- not lock orientation or posture;
- preserve state/progress when resized;
- render text/graphics clearly across resolutions/densities.

Official examples explicitly include extreme aspect ratios from tall portrait through ultrawide landscape.

Keyboard support for directional/text input is recommended where applicable. Escape handling must not be intercepted with `preventDefault()`.

## 5. Stability and performance limits

Current published values:

- initial bundle: **MUST < 30 MiB**, **SHOULD < 15 MiB**;
- total bundle: **MUST < 250 MiB** by default;
- individual file: **MUST < 30 MiB**, **SHOULD < 512 KiB**;
- cloud save: **MUST < 3 MiB**, **SHOULD < 500 KiB**;
- interactable load time: **SHOULD < 5 seconds**;
- peak JavaScript heap: **MUST NOT exceed 512 MiB**;
- total file count: **MUST <= 8000**;
- bundle file references must use relative paths;
- file names must stay within the allowed alphanumeric / `_` / `-` / `.` character set.

The initial bundle is measured through the point at which the game calls `gameReady()`.

## 6. Privacy and data architecture

Current requirements materially constrain game architecture:

- the game must not make external calls to URLs/services except where required by Google/YouTube technical requirements;
- the game must not attempt to bypass external-call restrictions;
- the game must not collect or prompt for personal information such as name, age, location, username, or password;
- the game must not display login/account-creation UI;
- clipboard access is prohibited except in response to an explicit paste action;
- QR-code-like content is prohibited;
- obfuscation is prohibited, although ordinary minification is allowed;
- Playables must be implemented as single-page applications;
- YouTube may reject games whose code cannot be evaluated because of features such as WASM, `eval()`, or Web Workers.

Experiment 001 therefore uses no backend, analytics service, external asset CDN, login, personal data, WebAssembly, workers, or `eval()`.

## 7. Trust, safety, and rights

Current requirements include:

- follow YouTube Community Guidelines;
- game must not specifically target children or be made/just for kids;
- game must remain suitable for a general 13+ audience;
- uploaded content must be original, authorized, or properly licensed;
- third-party IP, trademark, music, and personality rights must be cleared;
- duplicate/substantially identical Playable uploads are prohibited under the current duplicate-content policy.

Experiment 001 uses programmatic graphics and no music or third-party game assets to minimize rights risk.

## 8. Accessibility

Current guidance asks developers to make a best effort toward WCAG AA and supports Accessible Gaming Initiative (AGI) discovery tags. Accessibility tags must not misrepresent actual game functionality.

Experiment 001 uses native buttons, visible focus states, non-hover-dependent interaction, large touch targets, and text alternatives for panel patterns. Accessibility remains a review item, not a completed certification claim.

## 9. Disallowed/confusing UX elements

Current design requirements include:

- no in-game sharing prompts;
- no clickable links that directly take users to external content;
- no additional in-game user agreement;
- no in-game exit/quit button;
- do not place controls that imitate or conflict with Playables platform controls;
- metadata and thumbnails must not be misleading;
- developer/publisher metadata is required at publishing time;
- thumbnails/title/description must not add prohibited branding/logos under the current design rules.

## 10. Experiment 001 implementation policy

Until official Test Suite access and certification evidence exist, this repository will distinguish clearly between:

- **implemented locally**;
- **locally validated**;
- **official Test Suite validated**;
- **certification submitted**;
- **certified/published**.

No local implementation will be described as “YouTube certified” without official evidence.

## Official sources

- Developer home: https://developers.google.com/youtube/gaming/playables
- Developer Portal: https://developers.google.com/youtube/gaming/playables/developer_portal
- SDK getting started: https://developers.google.com/youtube/gaming/playables/reference/getting_started
- SDK reference: https://developers.google.com/youtube/gaming/playables/reference/sdk
- Certification overview: https://developers.google.com/youtube/gaming/playables/certification/requirements
- Stability/performance: https://developers.google.com/youtube/gaming/playables/certification/requirements_stability
- Integration: https://developers.google.com/youtube/gaming/playables/certification/requirements_integration
- Design: https://developers.google.com/youtube/gaming/playables/certification/requirements_design
- Privacy/data: https://developers.google.com/youtube/gaming/playables/certification/requirements_privacydata
- i18n/L10n: https://developers.google.com/youtube/gaming/playables/certification/requirements_i18n_l10n
- Accessibility: https://developers.google.com/youtube/gaming/playables/certification/requirements_accessibility
- Trust & Safety: https://developers.google.com/youtube/gaming/playables/certification/requirements_trustsafety
- Revision history: https://developers.google.com/youtube/gaming/playables/certification/revisionhistory
