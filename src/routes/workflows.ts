import { FastifyPluginAsync } from 'fastify';
import axios from 'axios';
import { env } from '../config/env';

const workflowRoutes: FastifyPluginAsync = async (fastify) => {
    fastify.post('/custom', async (request, reply) => {
        try {
            const response = await axios.post(`${env.N8N_WEBHOOK_BASE_URL}/custom`, request.body);
            return reply.send(response.data);
        } catch (error) {
            fastify.log.error(error);
            return reply.status(500).send({ error: 'Failed to execute custom workflow' });
        }
    });
};

export default workflowRoutes;
