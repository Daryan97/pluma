/**
 * Register a small offline MDI subset so common icons render immediately.
 * Do NOT import @iconify-json/mdi here — that pack is ~3MB and OOMs the dev server.
 */
import { addIcon } from "@iconify/vue";
import { mdiSubset } from "../lib/mdi-icons-subset.js";

export default defineNuxtPlugin(() => {
  for (const [name, data] of Object.entries(mdiSubset)) {
    addIcon(`mdi:${name}`, data);
  }
});
