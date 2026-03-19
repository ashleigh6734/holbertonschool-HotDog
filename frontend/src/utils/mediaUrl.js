export function resolveApiImageUrl(rawUrl, apiBase = import.meta.env.VITE_API_URL) {
  if (!rawUrl) return "";

  const normalizedBase = (apiBase || "").replace(/\/$/, "");

  try {
    const parsed = new URL(rawUrl, "http://placeholder.local");
    const path = parsed.pathname || "";
    const filename = path.split("/").pop() || "";

    // Always serve app static assets from the configured backend host.
    if (path.startsWith("/static/") && normalizedBase) {
      return `${normalizedBase}${path}`;
    }

    // Migrate legacy postimg-hosted provider logos to backend static files.
    if (filename.startsWith("Logo-") && normalizedBase) {
      return `${normalizedBase}/static/images/${filename}`;
    }

    // Non-static absolute URLs (e.g. CDN) can pass through.
    if (/^https?:\/\//i.test(rawUrl)) {
      return rawUrl;
    }

    // Relative path fallback.
    if (rawUrl.startsWith("/") && normalizedBase) {
      return `${normalizedBase}${rawUrl}`;
    }
  } catch {
    // Fall through to best-effort return below.
  }

  return rawUrl;
}
