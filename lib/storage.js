(function (global) {
  "use strict";

  const SCHEMA_VERSION = 1;

  const DEFAULTS = {
    schemaVersion: SCHEMA_VERSION,
    enabled: true,
    presetId: "midnight",
    custom: { ...(global.GDDMPresets ? global.GDDMPresets.DEFAULT_CUSTOM : {}) },
    scope: "both",
    preserveImages: true,
    softenMenus: true,
    reduceGlare: true,
    schedule: {
      mode: "always",
      start: "20:00",
      end: "07:00",
    },
  };

  function getApi() {
    if (global.GDDMBrowser && global.GDDMBrowser.api) {
      return global.GDDMBrowser.api;
    }
    return typeof chrome !== "undefined" && chrome.storage
      ? chrome
      : typeof browser !== "undefined"
        ? browser
        : null;
  }

  function mergeDefaults(raw) {
    const data = raw && typeof raw === "object" ? raw : {};
    const merged = {
      ...DEFAULTS,
      ...data,
      custom: { ...DEFAULTS.custom, ...(data.custom || {}) },
      schedule: { ...DEFAULTS.schedule, ...(data.schedule || {}) },
      schemaVersion: SCHEMA_VERSION,
    };
    return merged;
  }

  function storageAreas(api) {
    if (!api || !api.storage) return [];
    const areas = [];
    if (api.storage.sync) areas.push(api.storage.sync);
    if (api.storage.local) areas.push(api.storage.local);
    return areas;
  }

  function areaGet(area) {
    return new Promise((resolve) => {
      try {
        area.get(null, (items) => {
          const api = getApi();
          if (api && api.runtime && api.runtime.lastError) {
            resolve(null);
            return;
          }
          resolve(items || {});
        });
      } catch (_) {
        resolve(null);
      }
    });
  }

  function areaSet(area, data) {
    return new Promise((resolve) => {
      try {
        area.set(data, () => resolve());
      } catch (_) {
        resolve();
      }
    });
  }

  function areaClear(area) {
    return new Promise((resolve) => {
      try {
        area.clear(() => resolve());
      } catch (_) {
        resolve();
      }
    });
  }

  function getSettings() {
    const api = getApi();
    const areas = storageAreas(api);
    if (!areas.length) {
      return Promise.resolve(mergeDefaults({}));
    }
    return areaGet(areas[0]).then((primary) => {
      if (primary && Object.keys(primary).length) {
        return mergeDefaults(primary);
      }
      if (areas[1]) {
        return areaGet(areas[1]).then((fallback) => mergeDefaults(fallback || {}));
      }
      return mergeDefaults({});
    });
  }

  function setSettings(partial) {
    const api = getApi();
    const areas = storageAreas(api);
    if (!areas.length) {
      return Promise.resolve(mergeDefaults(partial || {}));
    }
    return getSettings().then((current) => {
      const next = mergeDefaults({
        ...current,
        ...partial,
        custom: { ...current.custom, ...(partial.custom || {}) },
        schedule: { ...current.schedule, ...(partial.schedule || {}) },
      });
      return Promise.all(areas.map((area) => areaSet(area, next))).then(() => next);
    });
  }

  function resetSettings() {
    const api = getApi();
    const areas = storageAreas(api);
    if (!areas.length) {
      return Promise.resolve(mergeDefaults({}));
    }
    const fresh = mergeDefaults({});
    return Promise.all(areas.map((area) => areaClear(area))).then(() =>
      Promise.all(areas.map((area) => areaSet(area, fresh))).then(() => fresh)
    );
  }

  function exportSettings(settings) {
    return JSON.stringify(settings, null, 2);
  }

  function importSettings(jsonText) {
    const parsed = JSON.parse(jsonText);
    if (!parsed || typeof parsed !== "object") {
      throw new Error("Invalid settings JSON");
    }
    return setSettings(mergeDefaults(parsed));
  }

  function parseTimeToMinutes(hhmm) {
    const parts = String(hhmm || "00:00").split(":");
    const h = Number(parts[0]) || 0;
    const m = Number(parts[1]) || 0;
    return h * 60 + m;
  }

  function isWithinScheduleWindow(schedule, date) {
    if (!schedule || schedule.mode === "always") return true;
    if (schedule.mode === "system") {
      if (typeof window !== "undefined" && window.matchMedia) {
        return window.matchMedia("(prefers-color-scheme: dark)").matches;
      }
      return true;
    }
    if (schedule.mode !== "window") return true;
    const now = date || new Date();
    const mins = now.getHours() * 60 + now.getMinutes();
    const start = parseTimeToMinutes(schedule.start);
    const end = parseTimeToMinutes(schedule.end);
    if (start === end) return true;
    if (start < end) return mins >= start && mins < end;
    return mins >= start || mins < end;
  }

  function isEffectivelyEnabled(settings, date) {
    if (!settings.enabled) return false;
    return isWithinScheduleWindow(settings.schedule, date);
  }

  global.GDDMStorage = {
    SCHEMA_VERSION,
    DEFAULTS,
    getSettings,
    setSettings,
    resetSettings,
    exportSettings,
    importSettings,
    isWithinScheduleWindow,
    isEffectivelyEnabled,
    mergeDefaults,
  };
})(typeof globalThis !== "undefined" ? globalThis : window);
