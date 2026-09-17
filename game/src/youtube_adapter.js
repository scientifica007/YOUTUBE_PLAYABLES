(() => {
  "use strict";

  const LOCAL_SAVE_KEY = "inspection-sprint-save-v1";
  const sdk = typeof window.ytgame !== "undefined" ? window.ytgame : null;
  const inPlayables = Boolean(sdk && sdk.IN_PLAYABLES_ENV);
  let loadCompleted = !inPlayables;

  function reportWarning() {
    if (inPlayables && sdk.health && typeof sdk.health.logWarning === "function") {
      try {
        sdk.health.logWarning();
      } catch (_) {
        // Health logging is best effort only.
      }
    }
  }

  function reportError() {
    if (inPlayables && sdk.health && typeof sdk.health.logError === "function") {
      try {
        sdk.health.logError();
      } catch (_) {
        // Health logging is best effort only.
      }
    }
  }

  async function loadData() {
    if (inPlayables) {
      try {
        const value = await sdk.game.loadData();
        loadCompleted = true;
        return typeof value === "string" ? value : "";
      } catch (_) {
        loadCompleted = true;
        reportWarning();
        return "";
      }
    }

    loadCompleted = true;
    try {
      return window.localStorage.getItem(LOCAL_SAVE_KEY) || "";
    } catch (_) {
      return "";
    }
  }

  async function saveData(value) {
    const data = String(value);

    if (inPlayables) {
      if (!loadCompleted) {
        reportWarning();
        return false;
      }
      try {
        await sdk.game.saveData(data);
        return true;
      } catch (_) {
        reportWarning();
        return false;
      }
    }

    try {
      window.localStorage.setItem(LOCAL_SAVE_KEY, data);
      return true;
    } catch (_) {
      return false;
    }
  }

  async function sendScore(value) {
    if (!inPlayables || !sdk.engagement || typeof sdk.engagement.sendScore !== "function") {
      return false;
    }

    const normalized = Math.max(0, Math.floor(Number(value) || 0));
    try {
      await sdk.engagement.sendScore({ value: normalized });
      return true;
    } catch (_) {
      reportWarning();
      return false;
    }
  }

  async function getLanguage() {
    if (!inPlayables || !sdk.system || typeof sdk.system.getLanguage !== "function") {
      return "en";
    }

    try {
      return await sdk.system.getLanguage();
    } catch (_) {
      reportWarning();
      return "en";
    }
  }

  function firstFrameReady() {
    if (inPlayables && sdk.game && typeof sdk.game.firstFrameReady === "function") {
      try {
        sdk.game.firstFrameReady();
      } catch (_) {
        reportError();
      }
    }
  }

  function gameReady() {
    if (inPlayables && sdk.game && typeof sdk.game.gameReady === "function") {
      try {
        sdk.game.gameReady();
      } catch (_) {
        reportError();
      }
    }
  }

  function installLifecycleHandlers(onPause, onResume) {
    const unsubscribers = [];

    if (inPlayables && sdk.system) {
      if (typeof sdk.system.onPause === "function") {
        try {
          const unsubscribePause = sdk.system.onPause(onPause);
          if (typeof unsubscribePause === "function") unsubscribers.push(unsubscribePause);
        } catch (_) {
          reportWarning();
        }
      }

      if (typeof sdk.system.onResume === "function") {
        try {
          const unsubscribeResume = sdk.system.onResume(onResume);
          if (typeof unsubscribeResume === "function") unsubscribers.push(unsubscribeResume);
        } catch (_) {
          reportWarning();
        }
      }
    } else {
      const onVisibilityChange = () => {
        if (document.visibilityState === "hidden") onPause();
        if (document.visibilityState === "visible") onResume();
      };
      document.addEventListener("visibilitychange", onVisibilityChange);
      unsubscribers.push(() => document.removeEventListener("visibilitychange", onVisibilityChange));
    }

    return () => {
      for (const unsubscribe of unsubscribers) {
        try {
          unsubscribe();
        } catch (_) {
          // Cleanup must never interrupt gameplay.
        }
      }
    };
  }

  window.PlayablesPlatform = Object.freeze({
    inPlayables,
    sdkVersion: sdk && typeof sdk.SDK_VERSION === "string" ? sdk.SDK_VERSION : null,
    firstFrameReady,
    gameReady,
    loadData,
    saveData,
    sendScore,
    getLanguage,
    installLifecycleHandlers,
    reportWarning,
    reportError,
  });
})();
