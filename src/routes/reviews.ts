import { FastifyPluginAsync } from 'fastify';
import { callN8n } from '../lib/n8n';

const reviewRoutes: FastifyPluginAsync = async (fastify) => {
  fastify.post('/monitor', async (request, reply) => {
    try {
      const data = await callN8n({
        webhook: 'reviews',
        payload: request.body,
        logger: fastify.log,
      });
      return reply.send(data);
    } catch (error) {
      return reply.status(500).send(error);
    }
  });
};

export default reviewRoutes;
