'use strict';

const { join } = require('path');
const envSchema = require('env-schema');
const S = require('fluent-json-schema');

const schema = S.object()
  .prop(
    'LOG_LEVEL',
    S.string().enum(['info', 'error', 'debug', 'warn']).default('info'),
  )
  .prop('APP_HOST', S.string().default('localhost'))
  .prop('APP_PORT', S.string().default('3000'))
  .prop('MONGO_HOST', S.string().default('localhost'))
  .prop('MONGO_PORT', S.string().default('27017'))
  .prop('MONGO_DB', S.string().required())
  .prop('ELASTICSEARCH_HOST', S.string().required())
  .prop('ELASTICSEARCH_PORT', S.string().default('9200'));

module.exports = (appPath) =>
  envSchema({
    schema,
    dotenv: { path: join(appPath, '..', '.env') },
  });
