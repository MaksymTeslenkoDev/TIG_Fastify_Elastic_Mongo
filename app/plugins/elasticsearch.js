'use strict';

const fp = require('fastify-plugin');
const { Client } = require('@elastic/elasticsearch');
const path = require('node:path');
const fs = require('node:fs');
const { parse, format } = require('date-fns');

async function elasticsearch(fastify, options) {
  const client = new Client({ node: options.url });

  const indices = {
    MOVIES: 'movies',
  };

  await client.ping();
  await configureIndices(client, indices);
  fastify.log.info('Connection to Elasticsearch established');

  const dataExists = await checkDataExists(client, indices.MOVIES);
  if (!dataExists) {
    fastify.log.info('Uploading initial data');
    await uploadInitialData({
      client,
      index: indices.MOVIES,
      dataPath: path.join(fastify.mockPath, 'movies.json'),
    });
    fastify.log.info('Initial data uploaded');
  }

  fastify.decorate('elastic', client);
  fastify.decorate('indices', indices);

  fastify.addHook('onClose', (instance, done) => {
    if (!opts.testing) {
      instance.elastic.close(done);
    } else {
      done();
    }
  });
}

async function checkDataExists(client, index) {
  const response = await client.search({
    index,
    body: {
      query: {
        match_all: {},
      },
      size: 1,
    },
  });

  return response.hits.total.value > 0;
}


async function configureIndices(client, indices) {
  let result = await client.indices.exists({ index: indices.MOVIES });
  if (!result) {
    await client.indices.create({
      index: indices.MOVIES,
      mappings: {
        properties: {
          name: { type: 'text' },
          genre: { type: 'keyword' },
          author: { type: 'text' },
          published: { type: 'date' },
        },
      },
    });
  }
}

async function uploadInitialData({ client, index, dataPath }) {
  const stream = fs.createReadStream(dataPath, { encoding: 'utf8' });
  let jsonString = '';

  for await (const chunk of stream) {
    jsonString += chunk;
  }

  let dataArray;
  try {
    dataArray = JSON.parse(jsonString);
  } catch (error) {
    console.error('Error parsing JSON:', error);
    return;
  }

  const bulk = [];

  dataArray.forEach((data) => {
    if (data.published) {
      const parsedDate = parse(data.published, 'M/dd/yyyy', new Date());
      data.published = format(parsedDate, 'yyyy-MM-dd');
    }
    bulk.push({ index: { _index: index } });
    bulk.push(data);
  });

  if (bulk.length > 0) {
    try {
      const response = await client.bulk({ body: bulk });
      if (response.errors) {
        response.items.forEach((item, index) => {
          if (item.index && item.index.error) {
            console.error(`Error indexing document ${index}:`, item.index.error);
          }
        });
      }
    } catch (error) {
      console.error('Error bulk indexing:', error);
    }
  }
}

module.exports = fp(elasticsearch);
