# Technical details

## Source and packaging

The source was imported from the user-tested `google-translate-image-clear-v1.1.1-flat.zip`. `manifest.json`, `content.js`, and `content.css` are unchanged. The original ZIP is available under `downloads/` without modification; it contains the original installation README.

The v1.1.1 filename identifies the flat packaging correction. The manifest inside still identifies the extension as **Google Translate Image Clear**, version **1.1.0**. The repository's display name is **Google Translate Eraser**.

## How it works

- A Manifest V3 content script runs at `document_idle` on `https://translate.google.com/*` only.
- The shortcut listens for the physical `Backquote` key. Ctrl, Alt, Meta, and repeated keydown events are ignored. Shift is not excluded, so Shift+Backquote also triggers it outside editable fields.
- Inputs, textareas, and ancestors explicitly marked `contenteditable="true"` or `contenteditable="plaintext-only"` are excluded.
- Image mode is detected from `op=images` in the URL or an active Images control.
- On an empty Images page, a short “Ready for a new image” toast appears.
- Otherwise, the script searches for Google's clear/remove/close control and clicks it. If the empty upload screen is not detected after 450 ms, the page reloads. A missing clear control also causes an immediate reload.

There is no build step, package manager, background worker, or external dependency.

## Privacy and permissions

The extension declares no additional permissions. Its content script can read and interact with the matched Google Translate page. It does not read the clipboard, store images, send network requests, or include analytics. Pasting and translation are handled by Google Translate itself and remain subject to Google's own data handling.

## Browser support and validation

The user confirmed the extracted package works in Edge. Brave and Firefox are intended targets of the same WebExtensions package, but were not independently tested during this publication. Firefox's documented install path here is temporary and must be repeated after restarting the browser; this repository does not supply a signed Firefox add-on.

Publication checks cover JavaScript syntax, manifest references, byte-for-byte preservation of runtime files and the original ZIP, and local README asset links. The screenshots show the supplied loaded-image and empty-upload states; they are not an automated browser test recording.

## Troubleshooting

**“Manifest file is missing or unreadable”**

Extract the ZIP first. Select the exact folder directly containing `manifest.json`, `content.js`, and `content.css`. The download under `downloads/` has these files at its root. If you download the whole repository instead, select the extracted repository root, which also contains the manifest.

**Nothing happens**

Refresh Google Translate after loading the extension, open the Images tab at `https://translate.google.com/?op=images`, click outside text fields, and press the physical backtick key. Regional Translate domains are not matched by this version. Disable older copies of the extension to avoid duplicate shortcut handling.

**The page reloads**

Reloading is the fallback when the clear control or empty screen cannot be recognized. Detection uses English UI labels and some position heuristics. Other interface languages, layout changes, or a slow reset can invoke the fallback even after a successful click.

## Repository layout

| Path | Purpose |
| --- | --- |
| `manifest.json` | Extension metadata and page match |
| `content.js` | Keyboard shortcut and image reset |
| `content.css` | Empty-screen toast styling |
| `assets/` | README branding and supplied screenshots |
| `downloads/` | Original flat installation ZIP |
| `README.md` | Visual introduction and short installation guide |
| `TECHNICAL_DETAILS.md` | Implementation, validation, and troubleshooting |
