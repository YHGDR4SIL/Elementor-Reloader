if (!window.__ELEMENTOR_RELOADER_RELAY_LOADED__) {
  window.__ELEMENTOR_RELOADER_RELAY_LOADED__ = true;
  window.addEventListener("message", (event) => {
    try {
      const data = event?.data;
      if (!data || data.__elementorReloader__ !== true) return;
      if (data.type === "ERROR_DETECTED") {
        chrome.runtime.sendMessage({ type: "ERROR_DETECTED", via: "relay", details: data.details }, () => {});
      }
    } catch {}
  });
}
