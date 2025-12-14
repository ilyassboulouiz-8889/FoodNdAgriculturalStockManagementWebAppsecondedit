// src/utils/url.js
export function toApiUrl(path) {
  if (!path) return "";
  if (path.startsWith("http://") || path.startsWith("https://")) return path;

  const base = import.meta.env.VITE_API_BASE_URL || "http://localhost:8080";
  if (!path.startsWith("/")) path = "/" + path;
  return base + path;
}
