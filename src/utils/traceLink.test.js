import test from 'node:test';
import assert from 'node:assert/strict';
import { traceTargetFromQr } from './traceLink.js';

test('keeps only the trace path from a full QR URL', () => {
  assert.equal(traceTargetFromQr('http://localhost:5175/trace/665f1c2ab1'), '/trace/665f1c2ab1');
  assert.equal(traceTargetFromQr('https://agroverse.in/trace/abc123?src=qr'), '/trace/abc123');
});

test('accepts a bare batch ID', () => {
  assert.equal(traceTargetFromQr(' BATCH-1001 '), '/trace/BATCH-1001');
});

test('rejects foreign URLs and junk', () => {
  assert.equal(traceTargetFromQr('https://example.com/menu'), null);
  assert.equal(traceTargetFromQr('hi'), null);
  assert.equal(traceTargetFromQr(''), null);
  assert.equal(traceTargetFromQr('<script>'), null);
});
