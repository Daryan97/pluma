import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { getRuntimeEnvSync } from "@/lib/runtimeEnv";

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export function getBrowserOrigin() {
  const configuredSiteUrl = getRuntimeEnvSync()?.VITE_SITE_URL?.trim();
  if (configuredSiteUrl) {
    return configuredSiteUrl.replace(/\/+$/, "");
  }

  if (typeof window !== 'undefined') {
    return window.location.origin;
  }

  return '';
}

export function getBrowserUrl() {
  if (typeof window !== 'undefined') {
    return window.location.href;
  }
  return '';
}
