import { FastifyPluginAsync } from 'fastify';
import axios from 'axios';
import { env } from '../config/env';
import { PDFService } from '../services/pdf';

const reportingRoutes: FastifyPluginAsync = async (fastify) => {
    fastify.post('/generate', async (request, reply) => {
        try {
            // 1. Get data from n8n
            const n8nResponse = await axios.post(`${env.N8N_WEBHOOK_BASE_URL}/reporting`, request.body);
            const { html } = n8nResponse.data;

            if (!html) {
                return reply.status(400).send({ error: 'No HTML returned from workflow' });
            }

            // 2. Generate PDF
            const pdfBuffer = await PDFService.generatePDF(html);

            // 3. Return PDF
            reply.header('Content-Type', 'application/pdf');
            reply.header('Content-Disposition', 'attachment; filename="report.pdf"');
            return reply.send(pdfBuffer);
        } catch (error) {
            fastify.log.error(error);
            return reply.status(500).send({ error: 'Failed to generate report' });
        }
    });
};

export default reportingRoutes;
