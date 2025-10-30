if (!window.__ELEMENTOR_RELOADER_DETECTOR_LOADED__) {
  window.__ELEMENTOR_RELOADER_DETECTOR_LOADED__ = true;
  (function () {
    const ERROR_TEXT  = "Cannot convert undefined or null to object";
    const HINTS       = ["loopBuilderModule.createDocumentSaveHandles", "onElementorFrontendInit", "Object.entries"];
    const STATE_KEY   = "elementor_reloader_last_trigger_at";
    const COOLDOWN_MS = 30000;

    function extractErrors(input, out = []) {
      if (!input) return out;
      if (Array.isArray(input)) { input.forEach(x => extractErrors(x, out)); return out; }
      const t = typeof input;
      if (t === "string") { out.push({ message: input, stack: "", type: "string" }); return out; }
      if (t === "object") {
        const message = input.message || input.msg || input.reason || input.error?.message || "";
        const stack   = input.stack || input.error?.stack || "";
        const name    = input.name || input.type || input.error?.name || "";
        if (message || stack || name) out.push({ message: String(message||""), stack: String(stack||""), type: String(name||"object") });
        try { for (const k of Object.keys(input)) if (!["message","stack","name","type"].includes(k)) extractErrors(input[k], out); } catch {}
        return out;
      }
      out.push({ message: String(input), stack: "", type: t });
      return out;
    }

    function isMatch(e) {
      const msg = e.message || "";
      const st  = e.stack || "";
      const typ = (e.type || "").toLowerCase();
      if (msg.includes(ERROR_TEXT)) return true;
      if (HINTS.some(h => st.includes(h))) return true;
      if (typ.includes("typeerror") && (msg.includes("Object.entries") || st.includes("Object.entries"))) return true;
      return false;
    }

    function allowTrigger() {
      try {
        const last = Number(sessionStorage.getItem(STATE_KEY) || 0);
        const n = Date.now();
        const ok = !last || (n - last) > COOLDOWN_MS;
        if (ok) sessionStorage.setItem(STATE_KEY, String(n));
        return ok;
      } catch { return true; }
    }

    function postToRelay(payload) {
      window.postMessage({ __elementorReloader__: true, ...payload }, "*");
    }

    function trigger(source, info) {
      if (!allowTrigger()) return;
      postToRelay({ type: "ERROR_DETECTED", details: { source, url: location.href, info } });
    }

    addEventListener("error", (ev) => {
      try {
        const msg = ev?.message || ev?.error?.message || "";
        const st  = ev?.error?.stack || "";
        const e = { message: msg, stack: st, type: ev?.error?.name || "Error" };
        if (isMatch(e)) trigger("window.onerror", e);
      } catch {}
    }, true);

    addEventListener("unhandledrejection", (ev) => {
      try {
        const arr = extractErrors(ev?.reason);
        const hit = arr.find(isMatch);
        if (hit) trigger("unhandledrejection", hit);
      } catch {}
    }, true);

    const origConsoleError = console.error;
    console.error = function (...args) {
      try {
        const extracted = extractErrors(args);
        const hit = extracted.find(isMatch);
        if (hit) trigger("console.error", hit);
      } catch {}
      return origConsoleError.apply(console, args);
    };
  })();
}
