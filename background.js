"use strict";

importScripts("lib/browser.js", "lib/presets.js", "lib/storage.js");

const api = typeof chrome !== "undefined" && chrome.runtime ? chrome : browser;

api.runtime.onInstalled.addListener((details) => {
  if (details.reason === "install") {
    api.storage.sync.set(GDDMStorage.DEFAULTS);
  } else if (details.reason === "update") {
    GDDMStorage.getSettings().then((settings) => {
      api.storage.sync.set(settings);
    });
  }
});

api.runtime.onMessage.addListener((message, _sender, sendResponse) => {
  if (message && message.type === "gddm:getSettings") {
    GDDMStorage.getSettings().then((settings) => {
      sendResponse({ settings });
    });
    return true;
  }
  if (message && message.type === "gddm:setSettings") {
    GDDMStorage.setSettings(message.partial || {}).then((settings) => {
      sendResponse({ settings });
    });
    return true;
  }
  return false;
});
