import { FastifyPluginAsync } from 'fastify';
import axios from 'axios';
import { env } from '../config/env';

const onboardingRoutes: FastifyPluginAsync = async (fastify) => {
    fastify.post('/start', async (request, reply) => {
        try {
            const response = await axios.post(`${env.N8N_WEBHOOK_BASE_URL}/onboarding`, request.body);
            return reply.send(response.data);
        } catch (error) {
            fastify.log.error(error);
            return reply.status(500).send({ error: 'Failed to start onboarding' });
        }
    });
};

export default onboardingRoutes;
