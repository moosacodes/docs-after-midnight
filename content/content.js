(function () {
  "use strict";

  const CACHE_KEY = "gddm:settings-cache";
  let currentSettings = null;
  let lastHref = location.href;
  let scheduleTimer = null;

  function readCache() {
    try {
      const raw = localStorage.getItem(CACHE_KEY);
      if (!raw) return null;
      return GDDMStorage.mergeDefaults(JSON.parse(raw));
    } catch (_) {
      return null;
    }
  }

  function writeCache(settings) {
    try {
      localStorage.setItem(CACHE_KEY, JSON.stringify(settings));
    } catch (_) {
      /* ignore quota / privacy mode */
    }
  }

  function apply(settings) {
    currentSettings = settings;
    GDDMTheme.applyToDocument(document, settings);
  }

  // Prefer last-known settings for an early paint; fall back to defaults.
  apply(readCache() || GDDMStorage.mergeDefaults({}));

  function refresh() {
    return GDDMStorage.getSettings().then((settings) => {
      writeCache(settings);
      apply(settings);
      return settings;
    });
  }

  function startScheduleWatch() {
    if (scheduleTimer) clearInterval(scheduleTimer);
    scheduleTimer = setInterval(() => {
      if (!currentSettings) return;
      GDDMTheme.applyToDocument(document, currentSettings);
    }, 30000);
  }

  function watchSpa() {
    const tick = () => {
      if (location.href !== lastHref) {
        lastHref = location.href;
        if (currentSettings) {
          GDDMTheme.applyToDocument(document, currentSettings);
        } else {
          refresh();
        }
      }
    };

    const obs = new MutationObserver(tick);
    const start = () => {
      if (document.documentElement) {
        obs.observe(document.documentElement, {
          childList: true,
          subtree: true,
        });
      }
    };
    start();

    window.addEventListener("popstate", tick);
    window.addEventListener("hashchange", tick);

    const wrap = (type) => {
      const orig = history[type];
      if (typeof orig !== "function") return;
      history[type] = function () {
        const ret = orig.apply(this, arguments);
        tick();
        return ret;
      };
    };
    try {
      wrap("pushState");
      wrap("replaceState");
    } catch (_) {
      /* ignore */
    }
  }

  function watchSystemTheme() {
    if (!window.matchMedia) return;
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const onChange = () => {
      if (currentSettings && currentSettings.schedule && currentSettings.schedule.mode === "system") {
        GDDMTheme.applyToDocument(document, currentSettings);
      }
    };
    if (mq.addEventListener) mq.addEventListener("change", onChange);
    else if (mq.addListener) mq.addListener(onChange);
  }

  refresh().then(() => {
    startScheduleWatch();
    watchSpa();
    watchSystemTheme();
  });

  const api =
    (typeof GDDMBrowser !== "undefined" && GDDMBrowser.api) ||
    (typeof chrome !== "undefined" ? chrome : null);

  if (api && api.storage && api.storage.onChanged) {
    api.storage.onChanged.addListener((_changes, area) => {
      if (area !== "sync" && area !== "local") return;
      refresh();
    });
  }
})();
