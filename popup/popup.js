(function () {
  "use strict";

  const els = {
    enabled: document.getElementById("enabled"),
    presets: document.getElementById("presets"),
    presetName: document.getElementById("preset-name"),
    scope: document.getElementById("scope"),
    pageDim: document.getElementById("pageDim"),
    uiDim: document.getElementById("uiDim"),
    contrast: document.getElementById("contrast"),
    warmth: document.getElementById("warmth"),
    openOptions: document.getElementById("open-options"),
  };

  let settings = null;
  let saveTimer = null;

  function valLabel(id, value) {
    const node = document.getElementById(`${id}-val`);
    if (node) node.textContent = String(value);
  }

  function themeValues() {
    return GDDMPresets.resolveThemeValues(settings);
  }

  function renderPresets() {
    els.presets.innerHTML = "";
    GDDMPresets.listPresets().forEach((preset) => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "preset";
      btn.title = preset.name;
      btn.style.setProperty("--swatch", preset.swatch);
      btn.dataset.id = preset.id;
      btn.setAttribute("role", "option");
      btn.setAttribute("aria-label", preset.name);
      if (settings.presetId === preset.id) btn.classList.add("active");
      btn.addEventListener("click", () => {
        settings.presetId = preset.id;
        Object.assign(settings.custom, preset.values);
        syncControlsFromSettings();
        persist();
      });
      els.presets.appendChild(btn);
    });

    const custom = document.createElement("button");
    custom.type = "button";
    custom.className = "preset custom";
    custom.title = "Custom";
    custom.dataset.id = "custom";
    custom.setAttribute("aria-label", "Custom");
    if (settings.presetId === "custom") custom.classList.add("active");
    custom.addEventListener("click", () => {
      settings.presetId = "custom";
      syncControlsFromSettings();
      persist();
    });
    els.presets.appendChild(custom);
  }

  function syncControlsFromSettings() {
    const values = themeValues();
    els.enabled.checked = !!settings.enabled;
    els.pageDim.value = values.pageDim;
    els.uiDim.value = values.uiDim;
    els.contrast.value = values.contrast;
    els.warmth.value = values.warmth;
    valLabel("pageDim", values.pageDim);
    valLabel("uiDim", values.uiDim);
    valLabel("contrast", values.contrast);
    valLabel("warmth", values.warmth);

    const name =
      settings.presetId === "custom"
        ? "Custom"
        : GDDMPresets.getPreset(settings.presetId).name;
    els.presetName.textContent = name;

    els.scope.querySelectorAll("button").forEach((btn) => {
      btn.classList.toggle("active", btn.dataset.scope === settings.scope);
    });

    renderPresets();
  }

  function persist() {
    clearTimeout(saveTimer);
    saveTimer = setTimeout(() => {
      GDDMStorage.setSettings(settings).then((next) => {
        settings = next;
      });
    }, 80);
  }

  function markCustomFromSliders() {
    settings.presetId = "custom";
    settings.custom = {
      ...settings.custom,
      pageDim: Number(els.pageDim.value),
      uiDim: Number(els.uiDim.value),
      contrast: Number(els.contrast.value),
      warmth: Number(els.warmth.value),
    };
  }

  ["pageDim", "uiDim", "contrast", "warmth"].forEach((id) => {
    els[id].addEventListener("input", () => {
      valLabel(id, els[id].value);
      markCustomFromSliders();
      els.presetName.textContent = "Custom";
      els.presets.querySelectorAll(".preset").forEach((btn) => {
        btn.classList.toggle("active", btn.dataset.id === "custom");
      });
      persist();
    });
  });

  els.enabled.addEventListener("change", () => {
    settings.enabled = els.enabled.checked;
    persist();
  });

  els.scope.addEventListener("click", (event) => {
    const btn = event.target.closest("button[data-scope]");
    if (!btn) return;
    settings.scope = btn.dataset.scope;
    syncControlsFromSettings();
    persist();
  });

  els.openOptions.addEventListener("click", (event) => {
    event.preventDefault();
    const api =
      (typeof GDDMBrowser !== "undefined" && GDDMBrowser.api) ||
      (typeof chrome !== "undefined" ? chrome : null);
    if (api && api.runtime && api.runtime.openOptionsPage) {
      api.runtime.openOptionsPage();
    } else if (api && api.runtime) {
      window.open(api.runtime.getURL("options/options.html"));
    }
  });

  GDDMStorage.getSettings().then((loaded) => {
    settings = loaded;
    syncControlsFromSettings();
  });
})();
