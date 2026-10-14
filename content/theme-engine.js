(function (global) {
  "use strict";

  const ROOT_ATTR = "data-gddm";
  const STYLE_ID = "gddm-runtime-vars";

  function clamp(n, min, max) {
    return Math.min(max, Math.max(min, n));
  }

  function hexToRgb(hex) {
    const h = String(hex || "").replace("#", "");
    if (h.length !== 6) return { r: 26, g: 31, b: 38 };
    return {
      r: parseInt(h.slice(0, 2), 16),
      g: parseInt(h.slice(2, 4), 16),
      b: parseInt(h.slice(4, 6), 16),
    };
  }

  function buildCssVars(values) {
    const pageDim = clamp(Number(values.pageDim) || 0, 0, 100);
    const uiDim = clamp(Number(values.uiDim) || 0, 0, 100);
    const contrast = clamp(Number(values.contrast) || 100, 80, 140);
    const warmth = clamp(Number(values.warmth) || 0, 0, 50);

    const invertAmount = (pageDim / 100) * 100;
    const brightness = 1 - pageDim / 100 * 0.08;
    const sepia = warmth / 100;
    const hue = 180 + warmth * 0.35;

    const page = hexToRgb(values.pageBg);
    const toolbar = hexToRgb(values.toolbarBg);
    const surface = hexToRgb(values.surfaceBg);

    return {
      "--gddm-page-bg": values.pageBg,
      "--gddm-toolbar-bg": values.toolbarBg,
      "--gddm-surface-bg": values.surfaceBg,
      "--gddm-text": values.textEmphasis,
      "--gddm-accent": values.accent,
      "--gddm-page-rgb": `${page.r}, ${page.g}, ${page.b}`,
      "--gddm-toolbar-rgb": `${toolbar.r}, ${toolbar.g}, ${toolbar.b}`,
      "--gddm-surface-rgb": `${surface.r}, ${surface.g}, ${surface.b}`,
      "--gddm-ui-opacity": String(clamp(uiDim / 100, 0.4, 1)),
      "--gddm-invert": `${invertAmount}%`,
      "--gddm-hue": `${hue}deg`,
      "--gddm-brightness": String(clamp(brightness, 0.85, 1.05)),
      "--gddm-contrast": `${contrast}%`,
      "--gddm-sepia": String(sepia),
      "--gddm-warm-filter": `sepia(${sepia}) saturate(${1 + warmth / 80})`,
    };
  }

  function ensureStyleEl(doc) {
    let el = doc.getElementById(STYLE_ID);
    if (!el) {
      el = doc.createElement("style");
      el.id = STYLE_ID;
      (doc.documentElement || doc.head || doc).appendChild(el);
    }
    return el;
  }

  function applyToDocument(doc, settings) {
    if (!doc || !doc.documentElement) return;

    const root = doc.documentElement;
    const active = global.GDDMStorage.isEffectivelyEnabled(settings);
    const values = global.GDDMPresets.resolveThemeValues(settings);
    const vars = buildCssVars(values);

    if (!active) {
      root.removeAttribute(ROOT_ATTR);
      root.classList.remove(
        "gddm-on",
        "gddm-scope-both",
        "gddm-scope-page",
        "gddm-scope-ui",
        "gddm-preserve-images",
        "gddm-soften",
        "gddm-reduce-glare"
      );
      const existing = doc.getElementById(STYLE_ID);
      if (existing) existing.textContent = "";
      return;
    }

    root.setAttribute(ROOT_ATTR, "on");
    root.classList.add("gddm-on");
    root.classList.toggle("gddm-scope-both", settings.scope === "both");
    root.classList.toggle("gddm-scope-page", settings.scope === "page");
    root.classList.toggle("gddm-scope-ui", settings.scope === "ui");
    root.classList.toggle("gddm-preserve-images", !!settings.preserveImages);
    root.classList.toggle("gddm-soften", !!settings.softenMenus);
    root.classList.toggle("gddm-reduce-glare", !!settings.reduceGlare);

    const lines = Object.keys(vars)
      .map((key) => `${key}: ${vars[key]};`)
      .join("\n  ");
    ensureStyleEl(doc).textContent = `:root, html {\n  ${lines}\n}`;

    Object.keys(vars).forEach((key) => {
      root.style.setProperty(key, vars[key]);
    });
  }

  global.GDDMTheme = {
    ROOT_ATTR,
    buildCssVars,
    applyToDocument,
  };
})(typeof globalThis !== "undefined" ? globalThis : window);
