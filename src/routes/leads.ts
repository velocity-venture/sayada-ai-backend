import { FastifyPluginAsync } from 'fastify';
import axios from 'axios';
import { env } from '../config/env';

const leadRoutes: FastifyPluginAsync = async (fastify) => {
    fastify.post('/qualify', async (request, reply) => {
        try {
            const response = await axios.post(`${env.N8N_WEBHOOK_BASE_URL}/leads`, request.body);
            return reply.send(response.data);
        } catch (error) {
            fastify.log.error(error);
            return reply.status(500).send({ error: 'Failed to qualify lead' });
        }
    });
};

export default leadRoutes;
