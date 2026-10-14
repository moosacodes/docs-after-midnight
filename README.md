# Docs Noir — Google Docs Dark Mode

A polished, customizable dark mode for Google Docs. Presets, live sliders, color craft, schedule modes, and local-only settings. Works on Chromium browsers and Firefox (Manifest V3).

## Features

- Full dark theme for Docs chrome (menus, toolbars, dialogs, comments)
- Controlled canvas invert for the document page (not a crude site-wide invert)
- Image/media color preservation
- Presets: Midnight, OLED Black, Graphite, Moonlit Blue, Forest Ink, Warm Ember, Custom
- Popup quick controls + full options page
- Scope: UI + page, page only, or UI only
- Schedule: always, follow system dark mode, or local time window
- Import / export JSON settings
- No tracking — `storage.sync` only

## Install (Chrome / Edge / Brave)

1. Open `chrome://extensions` (or `edge://extensions`).
2. Turn on **Developer mode**.
3. Click **Load unpacked**.
4. Select this project folder (the one containing `manifest.json`).
5. Open a Google Doc and use the toolbar popup to tune the theme.

## Install (Firefox)

1. Open `about:debugging#/runtime/this-firefox`.
2. Click **Load Temporary Add-on…**.
3. Select `manifest.json` in this folder.
4. Open a Google Doc and use the Docs Noir popup.

> Temporary add-ons in Firefox are removed when the browser restarts. Reload via `about:debugging` after restarting.

## Usage

- Click the extension icon for enable/disable, presets, scope, and intensity sliders.
- Open **Full options** for colors, advanced toggles, schedule, and backup.

## Permissions

- `storage` — save your theme preferences
- Host access to `https://docs.google.com/document/*` — inject theme CSS/JS on Docs editors only

## Project layout

```
manifest.json
background.js
content/          theme CSS + engine + content script
popup/            quick controls
options/          full settings
lib/              presets + storage helpers
icons/
```

## Notes

- Google Docs paints pages on a canvas, so the document surface uses a filter stack (`invert` + `hue-rotate` + brightness/contrast/warmth). UI chrome is styled with targeted CSS variables.
- If Google changes class names, canvas selectors in `content/docs-theme.css` may need a light refresh.
