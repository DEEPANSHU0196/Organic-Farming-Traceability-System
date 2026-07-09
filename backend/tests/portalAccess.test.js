const test = require('node:test');
const assert = require('node:assert/strict');
const { isPortalAllowedForRole } = require('../utils/portalAccess');

test('farmer account is allowed only in the farmer portal', () => {
  assert.equal(isPortalAllowedForRole('farmer', 'farmer'), true);
  assert.equal(isPortalAllowedForRole('buyer', 'farmer'), false);
  assert.equal(isPortalAllowedForRole('admin', 'farmer'), false);
});

test('buyer account is allowed only in the buyer portal', () => {
  assert.equal(isPortalAllowedForRole('buyer', 'buyer'), true);
  assert.equal(isPortalAllowedForRole('farmer', 'buyer'), false);
  assert.equal(isPortalAllowedForRole('transporter', 'buyer'), false);
});
