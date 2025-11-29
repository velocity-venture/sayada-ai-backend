import { FastifyPluginAsync } from 'fastify';
import axios from 'axios';
import { env } from '../config/env';

const salesRoutes: FastifyPluginAsync = async (fastify) => {
    fastify.post('/proposal', async (request, reply) => {
        try {
            const response = await axios.post(`${env.N8N_WEBHOOK_BASE_URL}/proposal`, request.body);
            return reply.send(response.data);
        } catch (error) {
            fastify.log.error(error);
            return reply.status(500).send({ error: 'Failed to generate proposal' });
        }
    });
};

export default salesRoutes;
