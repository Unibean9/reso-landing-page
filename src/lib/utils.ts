import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: string) {
  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

const SAFE_IMAGE_HOSTS = new Set([
  "images.unsplash.com",
  "i.pravatar.cc",
  "firebasestorage.googleapis.com",
]);

export function safeImage(
  src: string | null | undefined,
  fallback = "/assets/aisaas_template.png",
) {
  if (!src) return fallback;

  if (src.startsWith("/")) return src;

  try {
    const url = new URL(src);
    if (url.protocol === "https:" && SAFE_IMAGE_HOSTS.has(url.hostname)) {
      return src;
    }
  } catch {
    return fallback;
  }

  return fallback;
}
