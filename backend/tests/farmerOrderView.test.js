const test = require('node:test');
const assert = require('node:assert/strict');
const { buildFarmerOrderView } = require('../utils/orderUtils');

test('buildFarmerOrderView maps real buyer and product data for the farmer portal', () => {
  const orderDoc = {
    _id: 'order-1',
    status: 'Pending',
    quantity: 50,
    createdAt: '2026-01-01T00:00:00.000Z',
    buyer: {
      _id: 'buyer-1',
      fullName: 'Asha Verma',
      email: 'asha@example.com',
      phone: '9876543210',
      address: 'Delhi',
    },
    product: {
      _id: 'product-1',
      productName: 'Premium Wheat',
      price: 1200,
      unit: 'kg',
      location: 'Punjab',
    },
  };

  const view = buildFarmerOrderView(orderDoc);

  assert.equal(view.id, 'order-1');
  assert.equal(view.buyer, 'Asha Verma');
  assert.equal(view.buyerEmail, 'asha@example.com');
  assert.equal(view.buyerPhone, '9876543210');
  assert.equal(view.product, 'Premium Wheat');
  assert.equal(view.quantity, 50);
  assert.equal(view.amount, '₹60,000');
  assert.equal(view.location, 'Punjab');
});
