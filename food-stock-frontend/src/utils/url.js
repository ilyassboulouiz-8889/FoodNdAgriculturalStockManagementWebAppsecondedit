// src/utils/url.js
const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:8080";

export function toApiUrl(pathOrUrl) {
  if (!pathOrUrl) return null;
  if (pathOrUrl.startsWith("http://") || pathOrUrl.startsWith("https://")) {
    return pathOrUrl;
  }
  if (!pathOrUrl.startsWith("/")) {
    return `${API_BASE}/${pathOrUrl}`;
  }
  return `${API_BASE}${pathOrUrl}`;
}

