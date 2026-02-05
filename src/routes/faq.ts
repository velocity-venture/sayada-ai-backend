import { FastifyPluginAsync } from 'fastify';
import { callN8n } from '../lib/n8n';

const faqRoutes: FastifyPluginAsync = async (fastify) => {
  fastify.post('/ask', async (request, reply) => {
    try {
      const data = await callN8n({
        webhook: 'faq',
        payload: request.body,
        logger: fastify.log,
      });
      return reply.send(data);
    } catch (error) {
      return reply.status(500).send(error);
    }
  });
};

export default faqRoutes;
