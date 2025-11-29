import { FastifyPluginAsync } from 'fastify';
import axios from 'axios';
import { env } from '../config/env';

const hrRoutes: FastifyPluginAsync = async (fastify) => {
    fastify.post('/payroll', async (request, reply) => {
        try {
            const response = await axios.post(`${env.N8N_WEBHOOK_BASE_URL}/payroll`, request.body);
            return reply.send(response.data);
        } catch (error) {
            fastify.log.error(error);
            return reply.status(500).send({ error: 'Failed to prepare payroll' });
        }
    });
};

export default hrRoutes;
