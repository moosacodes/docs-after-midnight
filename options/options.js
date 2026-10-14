(function () {
  "use strict";

  const els = {
    enabled: document.getElementById("enabled"),
    presets: document.getElementById("presets"),
    pageBg: document.getElementById("pageBg"),
    toolbarBg: document.getElementById("toolbarBg"),
    surfaceBg: document.getElementById("surfaceBg"),
    textEmphasis: document.getElementById("textEmphasis"),
    accent: document.getElementById("accent"),
    pageDim: document.getElementById("pageDim"),
    uiDim: document.getElementById("uiDim"),
    contrast: document.getElementById("contrast"),
    warmth: document.getElementById("warmth"),
    scope: document.getElementById("scope"),
    preserveImages: document.getElementById("preserveImages"),
    softenMenus: document.getElementById("softenMenus"),
    reduceGlare: document.getElementById("reduceGlare"),
    scheduleMode: document.getElementById("scheduleMode"),
    scheduleStart: document.getElementById("scheduleStart"),
    scheduleEnd: document.getElementById("scheduleEnd"),
    timeRow: document.getElementById("time-row"),
    exportBtn: document.getElementById("exportBtn"),
    importBtn: document.getElementById("importBtn"),
    resetBtn: document.getElementById("resetBtn"),
    io: document.getElementById("io"),
    status: document.getElementById("status"),
  };

  let settings = null;
  let saveTimer = null;

  function setStatus(msg) {
    els.status.textContent = msg || "";
  }

  function valLabel(id, value) {
    const node = document.getElementById(`${id}-val`);
    if (node) node.textContent = String(value);
  }

  function themeValues() {
    return GDDMPresets.resolveThemeValues(settings);
  }

  function persist(partial) {
    clearTimeout(saveTimer);
    saveTimer = setTimeout(() => {
      GDDMStorage.setSettings(partial || settings).then((next) => {
        settings = next;
        setStatus("Saved");
        setTimeout(() => {
          if (els.status.textContent === "Saved") setStatus("");
        }, 1200);
      });
    }, 60);
  }

  function renderPresets() {
    els.presets.innerHTML = "";
    GDDMPresets.listPresets().forEach((preset) => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "preset-card";
      if (settings.presetId === preset.id) btn.classList.add("active");
      btn.innerHTML =
        `<span class="preset-swatch" style="background:${preset.swatch}"></span>` +
        `<strong>${preset.name}</strong>` +
        `<span>${preset.accent}</span>`;
      btn.addEventListener("click", () => {
        settings.presetId = preset.id;
        settings.custom = { ...preset.values };
        syncFromSettings();
        persist();
      });
      els.presets.appendChild(btn);
    });

    const custom = document.createElement("button");
    custom.type = "button";
    custom.className = "preset-card";
    if (settings.presetId === "custom") custom.classList.add("active");
    custom.innerHTML =
      `<span class="preset-swatch" style="background:conic-gradient(from 180deg,#6eb6ff,#7dba8a,#e0a070,#6eb6ff)"></span>` +
      `<strong>Custom</strong><span>Your mix</span>`;
    custom.addEventListener("click", () => {
      settings.presetId = "custom";
      syncFromSettings();
      persist();
    });
    els.presets.appendChild(custom);
  }

  function syncFromSettings() {
    const values = themeValues();
    els.enabled.checked = !!settings.enabled;
    els.pageBg.value = values.pageBg;
    els.toolbarBg.value = values.toolbarBg;
    els.surfaceBg.value = values.surfaceBg;
    els.textEmphasis.value = values.textEmphasis;
    els.accent.value = values.accent;
    els.pageDim.value = values.pageDim;
    els.uiDim.value = values.uiDim;
    els.contrast.value = values.contrast;
    els.warmth.value = values.warmth;
    valLabel("pageDim", values.pageDim);
    valLabel("uiDim", values.uiDim);
    valLabel("contrast", values.contrast);
    valLabel("warmth", values.warmth);
    els.scope.value = settings.scope || "both";
    els.preserveImages.checked = !!settings.preserveImages;
    els.softenMenus.checked = !!settings.softenMenus;
    els.reduceGlare.checked = !!settings.reduceGlare;
    els.scheduleMode.value = settings.schedule.mode || "always";
    els.scheduleStart.value = settings.schedule.start || "20:00";
    els.scheduleEnd.value = settings.schedule.end || "07:00";
    els.timeRow.classList.toggle("is-hidden", els.scheduleMode.value !== "window");
    renderPresets();
  }

  function pullCustomColors() {
    settings.presetId = "custom";
    settings.custom = {
      ...settings.custom,
      pageBg: els.pageBg.value,
      toolbarBg: els.toolbarBg.value,
      surfaceBg: els.surfaceBg.value,
      textEmphasis: els.textEmphasis.value,
      accent: els.accent.value,
      pageDim: Number(els.pageDim.value),
      uiDim: Number(els.uiDim.value),
      contrast: Number(els.contrast.value),
      warmth: Number(els.warmth.value),
    };
  }

  ["pageBg", "toolbarBg", "surfaceBg", "textEmphasis", "accent"].forEach((id) => {
    els[id].addEventListener("input", () => {
      pullCustomColors();
      syncFromSettings();
      persist();
    });
  });

  ["pageDim", "uiDim", "contrast", "warmth"].forEach((id) => {
    els[id].addEventListener("input", () => {
      valLabel(id, els[id].value);
      pullCustomColors();
      renderPresets();
      persist();
    });
  });

  els.enabled.addEventListener("change", () => {
    settings.enabled = els.enabled.checked;
    persist();
  });

  els.scope.addEventListener("change", () => {
    settings.scope = els.scope.value;
    persist();
  });

  ["preserveImages", "softenMenus", "reduceGlare"].forEach((id) => {
    els[id].addEventListener("change", () => {
      settings[id] = els[id].checked;
      persist();
    });
  });

  els.scheduleMode.addEventListener("change", () => {
    settings.schedule.mode = els.scheduleMode.value;
    els.timeRow.classList.toggle("is-hidden", els.scheduleMode.value !== "window");
    persist();
  });

  els.scheduleStart.addEventListener("change", () => {
    settings.schedule.start = els.scheduleStart.value;
    persist();
  });

  els.scheduleEnd.addEventListener("change", () => {
    settings.schedule.end = els.scheduleEnd.value;
    persist();
  });

  els.exportBtn.addEventListener("click", () => {
    els.io.value = GDDMStorage.exportSettings(settings);
    setStatus("Exported to the box below");
  });

  els.importBtn.addEventListener("click", () => {
    try {
      GDDMStorage.importSettings(els.io.value).then((next) => {
        settings = next;
        syncFromSettings();
        setStatus("Imported settings");
      });
    } catch (err) {
      setStatus(err.message || "Import failed");
    }
  });

  els.resetBtn.addEventListener("click", () => {
    if (!confirm("Reset Docs Noir to defaults?")) return;
    GDDMStorage.resetSettings().then((next) => {
      settings = next;
      syncFromSettings();
      setStatus("Defaults restored");
    });
  });

  GDDMStorage.getSettings().then((loaded) => {
    settings = loaded;
    syncFromSettings();
  });
})();
