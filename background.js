const SECONDS_PER_FIX = 10;

chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  if (msg && msg.type === "ERROR_DETECTED" && sender?.tab?.id && sender?.tab?.url) {
    (async () => {
      try {
        const removed = await clearCookiesForUrl(sender.tab.url);
        await incrementTimeSaved(SECONDS_PER_FIX);
        await chrome.tabs.reload(sender.tab.id, { bypassCache: true });
        sendResponse({ ok: true, removed });
      } catch (e) {
        sendResponse({ ok: false, error: String(e) });
      }
    })();
    return true;
  }
});

async function clearCookiesForUrl(pageUrl) {
  const u = new URL(pageUrl);
  const cookies = await chrome.cookies.getAll({ domain: u.hostname });
  let removedCount = 0;
  await Promise.all(cookies.map(async (c) => {
    try {
      const cookieUrl =
        (c.secure ? "https://" : "http://") +
        (c.domain && c.domain.startsWith(".") ? c.domain.slice(1) : (c.domain || u.hostname)) +
        (c.path || "/");
      const res = await chrome.cookies.remove({
        url: cookieUrl,
        name: c.name,
        storeId: c.storeId
      });
      if (res) removedCount++;
    } catch {}
  }));
  return { count: removedCount };
}

async function incrementTimeSaved(seconds) {
  const cur = await chrome.storage.local.get({ seconds_saved: 0, fixes_count: 0 });
  await chrome.storage.local.set({
    seconds_saved: (cur.seconds_saved || 0) + seconds,
    fixes_count: (cur.fixes_count || 0) + 1
  });
}
