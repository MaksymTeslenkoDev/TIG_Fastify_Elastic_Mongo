const path = require('path');
const APPLICATION_PATH = path.join(process.cwd(), '../app');
const config = require(`./config.js`)(APPLICATION_PATH);
const buildServer = require('./index.js');

(async () => {
  try {
    const server = await buildServer({ ...config, appPath: APPLICATION_PATH });
    await server.listen({ port: config.APP_PORT, host: config.APP_HOST });
  } catch (err) {
    console.log('Error starting server', err);
    process.exit(1);
  }
})();
