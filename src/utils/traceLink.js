// Turns whatever a QR holds into an in-app trace path. AgroVerse QRs hold a full
// /trace/<id> URL; only the path is kept so labels printed against another host
// (e.g. a different dev port) still open here. A bare batch ID is accepted too.
export function traceTargetFromQr(text) {
  const raw = String(text || '').trim();
  if (!raw) return null;
  try {
    const url = new URL(raw);
    const match = url.pathname.match(/\/trace\/([^/?#]+)/);
    return match ? `/trace/${match[1]}` : null;
  } catch {
    return /^[\w-]{4,64}$/.test(raw) ? `/trace/${encodeURIComponent(raw)}` : null;
  }
}
