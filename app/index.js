const fastify = require('fastify');
const { StreamForLogger } = require('./src/logger.js');
const path = require('path');
const elasticsearch = require('./plugins/elasticsearch.js');

const LOG_FOLDER_PATH = './log';

async function buildServer(config) {
  const streamForLogger = new StreamForLogger(LOG_FOLDER_PATH);
  const server = fastify({
    logger: { level: config.LOG_LEVEL, stream: streamForLogger },
  });

  // Decorators
  server.decorate('mockPath', path.join(config.appPath, 'mock'));

  // Plugins
  await server.register(require('@fastify/mongodb'), {
    forceClose: true,
    url: `mongodb://${config.MONGO_HOST}:${config.MONGO_PORT}/${config.MONGO_DB}`,
  });

  server.register(elasticsearch, {
    url: `http://${config.ELASTICSEARCH_HOST}:${config.ELASTICSEARCH_PORT}`,
    appPath: config.appPath,
  });

  // Routes
  await server.register(require('./routes/users.js'));
  await server.register(require('./routes/movies.js'));

  return server;
}

module.exports = buildServer;
