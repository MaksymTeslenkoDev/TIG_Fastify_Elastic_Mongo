module.exports = async (fastify) => {
  fastify.get('/movies', async function (request, reply) {
    const { year } = request.query;
    
    const query = {
      bool: {
        filter: [],
      },
    };
  
    if (year) {
      const range = {
        gte: `${year}-01-01`,
        lte: `${year}-12-31`,
        format: 'yyyy-MM-dd',
      };
  
      query.bool.filter.push({
        range: {
          published: range,
        },
      });
    } else {
      query.bool.filter.push({
        match_all: {},
      });
    }
  
    const res = await fastify.elastic.search({
      index: fastify.indices.MOVIES,
      body: {
        query,
        sort: [
          {
            published: {
              order: 'asc',
            },
          },
        ],
        size: 100,
      },
    });

    return res.hits.hits.map((hit) => hit._source);
  });
};
