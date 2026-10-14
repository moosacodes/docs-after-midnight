(function (global) {
  "use strict";

  // Prefer chrome.* (available in Chromium and Firefox WebExtensions).
  const api = typeof chrome !== "undefined" && chrome.runtime ? chrome : global.browser;

  global.GDDMBrowser = {
    api,
    storage: api && api.storage,
    runtime: api && api.runtime,
  };
})(typeof globalThis !== "undefined" ? globalThis : window);
