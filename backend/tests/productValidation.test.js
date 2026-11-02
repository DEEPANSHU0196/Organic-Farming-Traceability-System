const test = require('node:test');
const assert = require('node:assert/strict');
const Product = require('../models/Product');

test('product creation does not require location to be provided', () => {
  const product = new Product({
    farmer: '64f000000000000000000000',
    name: 'Test Product',
    category: 'Wheat',
    quantity: 10,
    price: 120,
  });

  const error = product.validateSync();
  assert.equal(error, undefined);
  assert.equal(product.organicCertified, false);
  assert.equal(product.certificationVerified, false);
});
