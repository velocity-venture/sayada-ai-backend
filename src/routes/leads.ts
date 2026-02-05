import { FastifyPluginAsync } from 'fastify';
import { callN8n } from '../lib/n8n';

const leadRoutes: FastifyPluginAsync = async (fastify) => {
  fastify.post('/qualify', async (request, reply) => {
    try {
      const data = await callN8n({
        webhook: 'leads',
        payload: request.body,
        logger: fastify.log,
      });
      return reply.send(data);
    } catch (error) {
      return reply.status(500).send(error);
    }
  });
};

export default leadRoutes;
