const test = require('node:test');
const assert = require('node:assert/strict');

const {
  mineBlock,
  validateBlockSequence,
} = require('../utils/traceBlockchain');

test('blockchain mines blocks with proof-of-work and validates the full chain', () => {
  const genesis = mineBlock({
    index: 0,
    productId: 'product-1',
    eventType: 'PRODUCT_REGISTERED',
    payload: { name: 'Golden Harvest' },
    actorId: 'user-1',
    actorRole: 'farmer',
    previousHash: 'GENESIS',
  });

  const shipment = mineBlock({
    index: 1,
    productId: 'product-1',
    eventType: 'SHIPMENT_UPDATED',
    payload: { location: 'Warehouse A' },
    actorId: 'user-2',
    actorRole: 'transporter',
    previousHash: genesis.hash,
  });

  assert.equal(genesis.index, 0);
  assert.equal(genesis.previousHash, 'GENESIS');
  assert.equal(genesis.difficulty, 2);
  assert.match(genesis.hash, /^0{2}/);

  const chain = validateBlockSequence([genesis, shipment]);
  assert.equal(chain.valid, true);
  assert.equal(chain.blockCount, 2);
  assert.equal(chain.latestHash, shipment.hash);
});
