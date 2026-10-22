// Verba for IINA: select a word in the subtitles and add it to Verba.
// Based on kerim/iina-clickable-subtitles (MIT).
const { console, core, menu, mpv, overlay, preferences, utils, event } = iina;

const TAG = "[verba] ";
const DEFAULT_SERVER = "https://verba.s4y.solutions";
const DEFAULT_SHORTCUT = "a";

// ---- pure helpers (no IINA calls) ----

function escapeHTML(text) {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

// IINA puts setContent() HTML inside a JS template literal, so a backtick,
// "${" or a backslash in a subtitle would break it. Neutralise them.
function safeForTemplate(text) {
  return text.replace(/[`\\]/g, "").replace(/\$\{/g, "$ {");
}

function buildAddUrl(server, word) {
  const base = String(server || DEFAULT_SERVER).replace(/\/+$/, "");
  return base + "/words/add?word=" + encodeURIComponent(word);
}

// ---- IINA glue ----

let currentLine = null;
let lastSelection = "";

// Inline handler: simple mode runs no <script>, but inline handlers set with
// innerHTML do run, and IINA gives every overlay page window.iina.postMessage.
const SEND_SELECTION =
  "iina.postMessage('selection', {text: String(window.getSelection()).trim()})";

function log(msg) {
  console.log(TAG + msg);
}

function render() {
  overlay.setContent(
    '<div id="subtitle-container"><div id="subtitle-text" data-clickable onmouseup="' +
      SEND_SELECTION +
      '">' +
      safeForTemplate(escapeHTML(currentLine || "")) +
      "</div></div>"
  );
}

function addToVerba() {
  const word = (lastSelection || currentLine || "").trim();
  if (!word) {
    core.osd("Verba: no subtitle");
    return;
  }
  const server = preferences.get("server_url") || DEFAULT_SERVER;
  const url = buildAddUrl(server, word);
  log("add: " + url);
  if (!utils.open(url)) console.error(TAG + "could not open " + url);
  core.osd("Verba: " + word);
}

event.on("iina.window-loaded", () => {
  overlay.simpleMode();
  overlay.setStyle(`
    body { background: transparent; font-family: -apple-system, sans-serif; }
    #subtitle-container {
      position: absolute; bottom: 10%; left: 0; right: 0;
      display: flex; justify-content: center; pointer-events: none;
    }
    #subtitle-text {
      font-size: 5vh; color: white; text-align: center;
      padding: 8px 16px; max-width: 90%; line-height: 1.3;
      -webkit-text-stroke: 0.7px rgba(0, 0, 0, 0.85);
      text-shadow: 1px 1px 3px rgba(0, 0, 0, 0.75);
      user-select: text; -webkit-user-select: text;
      cursor: text; pointer-events: auto;
    }
    #subtitle-text:empty { display: none; }
  `);
  render();
  // Only after simpleMode(): it clears all overlay listeners.
  overlay.onMessage("selection", (data) => {
    lastSelection = (data && data.text) || "";
  });
  overlay.setClickable(true);
  overlay.show();
  try {
    mpv.set("sub-visibility", false);
  } catch (e) {
    console.error(TAG + "could not hide native subs: " + e);
  }
  setInterval(() => {
    let text = "";
    try {
      text = mpv.getString("sub-text") || "";
    } catch (e) {}
    if (text === currentLine) return;
    currentLine = text;
    lastSelection = "";
    render();
  }, 100);
});

// The key is read once at load; changing it in preferences needs an IINA restart.
let shortcut = DEFAULT_SHORTCUT;
try {
  shortcut = String(preferences.get("shortcut") || "").trim() || DEFAULT_SHORTCUT;
} catch (e) {}
menu.addItem(menu.item("Add to Verba", addToVerba, { keyBinding: shortcut }));
