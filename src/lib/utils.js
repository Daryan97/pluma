import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export function getBrowserOrigin() {
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
