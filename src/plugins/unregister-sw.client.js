/**
 * Clear leftover service workers from older localhost builds / other apps.
 * Stops browsers from repeatedly requesting /sw.js.
 */
export default defineNuxtPlugin(() => {
  if (typeof navigator === "undefined" || !("serviceWorker" in navigator)) {
    return;
  }

  navigator.serviceWorker.getRegistrations().then((regs) => {
    regs.forEach((reg) => {
      reg.unregister().catch(() => {});
    });
  });

  if (typeof caches !== "undefined") {
    caches.keys().then((keys) => {
      keys.forEach((key) => {
        caches.delete(key).catch(() => {});
      });
    });
  }
});
