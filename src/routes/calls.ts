import { FastifyPluginAsync } from 'fastify';
import { callN8n } from '../lib/n8n';

const callRoutes: FastifyPluginAsync = async (fastify) => {
  fastify.post('/missed', async (request, reply) => {
    try {
      const data = await callN8n({
        webhook: 'calls',
        payload: request.body,
        logger: fastify.log,
      });
      return reply.send(data);
    } catch (error) {
      return reply.status(500).send(error);
    }
  });
};

export default callRoutes;
