(function (global) {
  "use strict";

  const PRESETS = {
    midnight: {
      id: "midnight",
      name: "Midnight",
      swatch: "#0f1419",
      accent: "#6eb6ff",
      values: {
        pageBg: "#1a1f26",
        toolbarBg: "#12161c",
        surfaceBg: "#1c222b",
        textEmphasis: "#e8eef5",
        accent: "#6eb6ff",
        pageDim: 100,
        uiDim: 94,
        contrast: 105,
        warmth: 8,
      },
    },
    oled: {
      id: "oled",
      name: "OLED Black",
      swatch: "#000000",
      accent: "#a0a0a0",
      values: {
        pageBg: "#0a0a0a",
        toolbarBg: "#000000",
        surfaceBg: "#111111",
        textEmphasis: "#f0f0f0",
        accent: "#c8c8c8",
        pageDim: 100,
        uiDim: 100,
        contrast: 112,
        warmth: 0,
      },
    },
    graphite: {
      id: "graphite",
      name: "Graphite",
      swatch: "#2a2e33",
      accent: "#9aa5b1",
      values: {
        pageBg: "#2c3138",
        toolbarBg: "#22262b",
        surfaceBg: "#32383f",
        textEmphasis: "#e6e9ec",
        accent: "#9aa5b1",
        pageDim: 96,
        uiDim: 88,
        contrast: 100,
        warmth: 4,
      },
    },
    moonlit: {
      id: "moonlit",
      name: "Moonlit Blue",
      swatch: "#0d1b2a",
      accent: "#7eb8da",
      values: {
        pageBg: "#152535",
        toolbarBg: "#0d1b2a",
        surfaceBg: "#1a2d40",
        textEmphasis: "#dceaf5",
        accent: "#7eb8da",
        pageDim: 100,
        uiDim: 92,
        contrast: 106,
        warmth: 14,
      },
    },
    forest: {
      id: "forest",
      name: "Forest Ink",
      swatch: "#0f1f18",
      accent: "#7dba8a",
      values: {
        pageBg: "#162820",
        toolbarBg: "#0f1f18",
        surfaceBg: "#1c3026",
        textEmphasis: "#e2f0e6",
        accent: "#7dba8a",
        pageDim: 100,
        uiDim: 90,
        contrast: 104,
        warmth: 20,
      },
    },
    ember: {
      id: "ember",
      name: "Warm Ember",
      swatch: "#1c1410",
      accent: "#e0a070",
      values: {
        pageBg: "#261c16",
        toolbarBg: "#1c1410",
        surfaceBg: "#2e221a",
        textEmphasis: "#f5ebe0",
        accent: "#e0a070",
        pageDim: 100,
        uiDim: 90,
        contrast: 103,
        warmth: 34,
      },
    },
  };

  const DEFAULT_CUSTOM = {
    pageBg: "#1a1f26",
    toolbarBg: "#12161c",
    surfaceBg: "#1c222b",
    textEmphasis: "#e8eef5",
    accent: "#6eb6ff",
    pageDim: 100,
    uiDim: 94,
    contrast: 105,
    warmth: 8,
  };

  function getPreset(id) {
    return PRESETS[id] || PRESETS.midnight;
  }

  function listPresets() {
    return Object.values(PRESETS);
  }

  function resolveThemeValues(settings) {
    if (settings.presetId === "custom") {
      return { ...DEFAULT_CUSTOM, ...(settings.custom || {}) };
    }
    const preset = getPreset(settings.presetId);
    return { ...preset.values };
  }

  global.GDDMPresets = {
    PRESETS,
    DEFAULT_CUSTOM,
    getPreset,
    listPresets,
    resolveThemeValues,
  };
})(typeof globalThis !== "undefined" ? globalThis : window);
