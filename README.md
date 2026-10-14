# Docs Noir

### Google Docs, after midnight.

White pages at 1am hit different — and not in a good way. **Docs Noir** turns Google Docs into a proper dark writing cave: page, toolbar, rulers, menus, the whole desk. Seamless. Tunable. A little dramatic on purpose.

No trackers. No “we value your privacy” essay. Just local settings and a darker doc.

---

## Why it exists

Most “dark modes” for Docs just paint the chrome and leave you staring at a blinding white sheet. We don’t do that.

Docs Noir uses a **smart invert** on the real document surface (Docs paints on canvas — you can’t CSS your way into the text nodes), then cleans up the boxy borders and harsh dividers so it feels like one continuous night mode, not a dark frame around a flashlight.

---

## Mood board (presets)

Pick a vibe. Bend it later.

| Preset | Energy |
| --- | --- |
| **Midnight** | Default late-night blue-black. Reliable. |
| **OLED Black** | Crush the blacks. Battery + drama. |
| **Graphite** | Softer gray desk. Less contrast theater. |
| **Moonlit Blue** | Cool ink, quiet focus. |
| **Forest Ink** | Green undertones. Study-session forest. |
| **Warm Ember** | Amber glow. Less clinical, more lamp. |
| **Custom** | You’re the DP now. Sliders + colors. |

---

## The knobs

**Popup (fast):**
- Master on/off
- Preset swatches
- Scope: UI + page · page only · UI only
- Page dim · UI dim · contrast · warmth

**Options (deep cut):**
- Color craft (page / toolbar / surfaces / accent)
- Preserve images & media
- Soften menus, reduce dialog glare
- Schedule: always · follow system · local time window
- Import / export JSON · reset to defaults

Everything syncs through the browser’s storage. Change a slider → the doc updates live.

---

## Install — Chromium crew (Chrome / Edge / Brave)

1. Open `chrome://extensions` (or `edge://extensions`)
2. Flip on **Developer mode** (top right, like a secret handshake)
3. **Load unpacked**
4. Point it at this folder — the one with `manifest.json`
5. Open a Google Doc. Click the Docs Noir icon. Dim the lights.

Reload the extension after pulls. Hard refresh the doc (`Ctrl+Shift+R`) if it looks stuck on an old vibe.

---

## Install — Firefox

1. Open `about:debugging#/runtime/this-firefox`
2. **Load Temporary Add-on…**
3. Pick `manifest.json`
4. Write something. In the dark. Dramatically.

> Firefox temporary add-ons vanish when the browser restarts. Load it again after a reboot — same two clicks, still worth it.
