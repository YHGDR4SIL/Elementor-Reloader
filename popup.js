const fixesEl = document.getElementById("fixes");
const timeEl  = document.getElementById("time");
const statusEl= document.getElementById("status");

function fmt(seconds) {
  seconds = Math.max(0, Math.floor(seconds));
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  if (h > 0) return `${h.toString().padStart(2,"0")}:${m.toString().padStart(2,"0")}:${s.toString().padStart(2,"0")}`;
  return `${m.toString().padStart(2,"0")}:${s.toString().padStart(2,"0")}`;
}

async function refresh() {
  const { seconds_saved = 0, fixes_count = 0 } = await chrome.storage.local.get({ seconds_saved: 0, fixes_count: 0 });
  fixesEl.textContent = fixes_count;
  timeEl.textContent  = fmt(seconds_saved);
}

refresh();
