const test = require('node:test');
const assert = require('node:assert/strict');
const path = require('path');

const envPath = path.resolve(__dirname, '..', '.env');

function clearCloudinaryEnv() {
  delete process.env.CLOUDINARY_CLOUD_NAME;
  delete process.env.CLOUDINARY_API_KEY;
  delete process.env.CLOUDINARY_API_SECRET;
  delete require.cache[require.resolve('../config/cloudinary')];
}

test('cloudinary config loads credentials from backend .env', () => {
  clearCloudinaryEnv();

  const cloudinary = require('../config/cloudinary');

  assert.ok(cloudinary, 'cloudinary module should load');
  assert.equal(process.env.CLOUDINARY_CLOUD_NAME, 'vhcfsnyz');
  assert.equal(process.env.CLOUDINARY_API_KEY, '477415929982526');
  assert.equal(process.env.CLOUDINARY_API_SECRET, 'uXqogDKqpWB6Hzk0u4p4NnNf3Ho');
});
