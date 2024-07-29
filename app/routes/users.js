module.exports = async (fastify) => {
  fastify.get('/users', async function (request, reply) {
    const users = fastify.mongo.db.collection('users');

    const { page = 1 } = request.query;
    const limit = 100;
    const maxPage = 10;

    const pageNumber = parseInt(page);
    if (isNaN(pageNumber) || pageNumber < 1 || pageNumber > maxPage) {
      reply.code(400).send('Invalid page number');
      return;
    }

    const skip = (pageNumber - 1) * limit;

    const userList = await users
      .find()
      .sort({ id: 1 })
      .skip(skip)
      .limit(limit)
      .toArray();

    return userList;
  });
};
