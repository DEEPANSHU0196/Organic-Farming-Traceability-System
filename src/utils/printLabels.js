// Opens a print-ready sheet of QR labels (A4, 2 × 4 per page) for one or more
// batches. The browser's print dialog can send it to a printer or save a PDF.

const escapeHtml = (value) =>
  String(value ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

const formatDate = (value) => {
  if (!value) return '';
  const d = new Date(value);
  return Number.isNaN(d.getTime()) ? '' : d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
};

function labelHtml(product, farmerName) {
  const id = product.traceabilityId || product._id || product.id;
  const harvest = formatDate(product.harvestDate);
  return `
    <article class="label">
      <img src="${escapeHtml(product.qrCode)}" alt="" />
      <div class="info">
        <p class="brand">AgroVerse · Organic trace</p>
        <h2>${escapeHtml(product.name)}</h2>
        <dl>
          ${farmerName ? `<dt>Farm</dt><dd>${escapeHtml(farmerName)}</dd>` : ''}
          ${product.location ? `<dt>From</dt><dd>${escapeHtml(product.location)}</dd>` : ''}
          ${harvest ? `<dt>Harvest</dt><dd>${escapeHtml(harvest)}</dd>` : ''}
        </dl>
        <p class="id">${escapeHtml(id)}</p>
        <p class="cta">Scan to see this batch’s journey</p>
      </div>
    </article>`;
}

/**
 * @param {Array<object>} products  products that already have a `qrCode` data URL
 * @param {{ copies?: number, farmerName?: string }} options
 * @returns {boolean} false if nothing printable or the popup was blocked
 */
export function printQrLabels(products, { copies = 8, farmerName = '' } = {}) {
  // Only server-generated QR images; every text field below is HTML-escaped.
  const printable = products.filter((p) => typeof p?.qrCode === 'string' && p.qrCode.startsWith('data:image/'));
  if (!printable.length) return false;

  const labels = printable.flatMap((p) => Array.from({ length: Math.max(1, copies) }, () => labelHtml(p, farmerName))).join('');
  const win = window.open('', '_blank', 'width=900,height=1000');
  if (!win) return false;

  win.document.write(`<!doctype html>
<html><head><meta charset="utf-8" /><title>AgroVerse QR labels</title>
<style>
  @page { size: A4; margin: 10mm; }
  * { box-sizing: border-box; }
  body { margin: 0; font-family: 'DM Sans', system-ui, sans-serif; color: #13261B; }
  .sheet { display: grid; grid-template-columns: 1fr 1fr; gap: 6mm; }
  .label { display: flex; gap: 4mm; align-items: center; height: 64mm; padding: 5mm; border: 0.4mm dashed #b9b09d; border-radius: 3mm; break-inside: avoid; }
  .label img { width: 40mm; height: 40mm; flex: none; image-rendering: pixelated; }
  .info { min-width: 0; }
  .brand { margin: 0; font-size: 7pt; letter-spacing: .12em; text-transform: uppercase; color: #2F6B45; font-weight: 700; }
  h2 { margin: 1.5mm 0 2mm; font-size: 13pt; line-height: 1.15; }
  dl { display: grid; grid-template-columns: auto 1fr; gap: .6mm 2mm; margin: 0; font-size: 8pt; }
  dt { color: #6f7768; } dd { margin: 0; font-weight: 600; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
  .id { margin: 2.5mm 0 0; font-family: ui-monospace, Menlo, monospace; font-size: 7pt; word-break: break-all; }
  .cta { margin: 1mm 0 0; font-size: 7pt; color: #D98A2B; font-weight: 700; }
  .toolbar { position: sticky; top: 0; display: flex; justify-content: space-between; align-items: center; padding: 10px 14px; margin-bottom: 12px; background: #F6F1E7; border-bottom: 1px solid #D9D0BD; font-size: 14px; }
  .toolbar button { border: 0; border-radius: 999px; padding: 10px 18px; background: #13261B; color: #F6F1E7; font-weight: 600; cursor: pointer; }
  @media print { .toolbar { display: none; } }
</style></head>
<body>
  <div class="toolbar"><span>${printable.length} batch${printable.length > 1 ? 'es' : ''} · ${copies} label${copies > 1 ? 's' : ''} each</span><button onclick="window.print()">Print / Save as PDF</button></div>
  <main class="sheet">${labels}</main>
  <script>window.addEventListener('load', () => setTimeout(() => window.print(), 300));</script>
</body></html>`);
  win.document.close();
  return true;
}
