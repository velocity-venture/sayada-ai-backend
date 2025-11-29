import { FastifyPluginAsync } from 'fastify';
import axios from 'axios';
import { env } from '../config/env';

const inboxRoutes: FastifyPluginAsync = async (fastify) => {
    fastify.post('/process', async (request, reply) => {
        try {
            // Forward payload to n8n webhook
            const response = await axios.post(`${env.N8N_WEBHOOK_BASE_URL}/inbox`, request.body);
            return reply.send(response.data);
        } catch (error: any) {
            fastify.log.error(`Error calling n8n: ${error.message}`);
            if (error.response) {
                fastify.log.error(`n8n response: ${JSON.stringify(error.response.data)}`);
            }
            return reply.status(500).send({ error: 'Failed to process inbox item' });
        }
    });
};

export default inboxRoutes;
