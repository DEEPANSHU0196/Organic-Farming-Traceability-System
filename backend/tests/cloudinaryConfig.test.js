const test = require('node:test');
const assert = require('node:assert/strict');

test('cloudinary config maps environment values without loading backend secrets', () => {
  const variableNames = [
    'CLOUDINARY_CLOUD_NAME',
    'CLOUDINARY_API_KEY',
    'CLOUDINARY_API_SECRET',
  ];
  const previousValues = Object.fromEntries(
    variableNames.map((name) => [name, process.env[name]]),
  );
  const dotenv = require('dotenv');
  const originalDotenvConfig = dotenv.config;
  const cloudinarySdk = require('cloudinary').v2;
  const originalCloudinaryConfig = cloudinarySdk.config();

  process.env.CLOUDINARY_CLOUD_NAME = 'test-cloud';
  process.env.CLOUDINARY_API_KEY = 'test-api-key';
  process.env.CLOUDINARY_API_SECRET = 'test-api-secret';
  dotenv.config = () => ({ parsed: {} });
  delete require.cache[require.resolve('../config/cloudinary')];

  try {
    const cloudinary = require('../config/cloudinary');
    const configured = cloudinary.config();
    assert.equal(configured.cloud_name, 'test-cloud');
    assert.equal(configured.api_key, 'test-api-key');
    assert.equal(configured.api_secret, 'test-api-secret');
  } finally {
    dotenv.config = originalDotenvConfig;
    cloudinarySdk.config(originalCloudinaryConfig);
    delete require.cache[require.resolve('../config/cloudinary')];
    for (const name of variableNames) {
      if (previousValues[name] === undefined) delete process.env[name];
      else process.env[name] = previousValues[name];
    }
  }
});
