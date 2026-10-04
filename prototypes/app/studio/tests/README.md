# Studio tests

Two Playwright scripts, run in a browser against a local static server at the site root.

| File | What it checks |
|---|---|
| `regression.js` | The 38 checks V1 passed (drawing by touch, mouse and stylus; undo, redo, eraser, colour, size; clear and its question; save and reopen; leaving with unsaved work; Hebrew RTL and English LTR; six screen sizes). Runs against V1 or V2. |
| `v2.js` | V2 only: the toolbar follows the activity; the activity's proportions on every screen and in rotation; "Back" accepts only a path inside the site; labels not cut at 360px; the 0.6 fade while drawing; the V2 save format. |

```
# from the site root
python3 -m http.server 8766

# in prototypes/studio-v2/tests (Playwright must be installed: npm i playwright, or a global install via NODE_PATH)
STUDIO_URL=http://localhost:8766/prototypes/studio-v2/index.html node regression.js
STUDIO_URL=http://localhost:8766/prototypes/studio-v1/index.html node regression.js   # V1, for comparison
STUDIO_URL=http://localhost:8766/prototypes/studio-v2/index.html node v2.js
```

Optional: `CHROMIUM_PATH` (a Chromium binary), `SHOTS` (a folder for screenshots, regression.js).
Each script prints PASS / FAIL per check and ends with a non-zero exit code if any check fails.
