import { FastifyPluginAsync } from 'fastify';
import axios from 'axios';
import { env } from '../config/env';

const callRoutes: FastifyPluginAsync = async (fastify) => {
    fastify.post('/missed', async (request, reply) => {
        try {
            const response = await axios.post(`${env.N8N_WEBHOOK_BASE_URL}/calls`, request.body);
            return reply.send(response.data);
        } catch (error) {
            fastify.log.error(error);
            return reply.status(500).send({ error: 'Failed to handle missed call' });
        }
    });
};

export default callRoutes;
