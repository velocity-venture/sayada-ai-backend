import Fastify from 'fastify';
import cors from '@fastify/cors';
import rateLimit from '@fastify/rate-limit';
import { env } from './config/env';
import { authenticateApiKey } from './middleware/auth';
import { PDFService } from './services/pdf';

// Route imports
import inboxRoutes from './routes/inbox';
import calendarRoutes from './routes/calendar';
import meetingRoutes from './routes/meetings';
import callRoutes from './routes/calls';
import faqRoutes from './routes/faq';
import socialRoutes from './routes/social';
import reviewRoutes from './routes/reviews';
import financeRoutes from './routes/finance';
import onboardingRoutes from './routes/onboarding';
import inventoryRoutes from './routes/inventory';
import leadRoutes from './routes/leads';
import strategyRoutes from './routes/strategy';
import reportingRoutes from './routes/reporting';
import crmRoutes from './routes/crm';
import salesRoutes from './routes/sales';
import hrRoutes from './routes/hr';
import legalRoutes from './routes/legal';
import workflowRoutes from './routes/workflows';

const server = Fastify({
  logger: {
    transport: {
      target: 'pino-pretty',
    },
  },
  bodyLimit: 1_048_576, // 1 MB
  requestTimeout: 60_000,
});

// CORS — restrict origins in production
const allowedOrigins = env.ALLOWED_ORIGINS
  ? env.ALLOWED_ORIGINS.split(',').map((o) => o.trim())
  : ['http://localhost:3000'];

server.register(cors, {
  origin: allowedOrigins,
  methods: ['GET', 'POST'],
});

// Rate limiting — 60 requests per minute per IP
server.register(rateLimit, {
  max: 60,
  timeWindow: '1 minute',
});

// API key auth on all /api/* routes
server.addHook('onRequest', async (request, reply) => {
  if (request.url.startsWith('/api/')) {
    await authenticateApiKey(request, reply);
  }
});

// Register Routes
server.register(inboxRoutes, { prefix: '/api/inbox' });
server.register(calendarRoutes, { prefix: '/api/calendar' });
server.register(meetingRoutes, { prefix: '/api/meetings' });
server.register(callRoutes, { prefix: '/api/calls' });
server.register(faqRoutes, { prefix: '/api/faq' });
server.register(socialRoutes, { prefix: '/api/social' });
server.register(reviewRoutes, { prefix: '/api/reviews' });
server.register(financeRoutes, { prefix: '/api/finance' });
server.register(onboardingRoutes, { prefix: '/api/onboarding' });
server.register(inventoryRoutes, { prefix: '/api/inventory' });
server.register(leadRoutes, { prefix: '/api/leads' });
server.register(strategyRoutes, { prefix: '/api/strategy' });
server.register(reportingRoutes, { prefix: '/api/reporting' });
server.register(crmRoutes, { prefix: '/api/crm' });
server.register(salesRoutes, { prefix: '/api/sales' });
server.register(hrRoutes, { prefix: '/api/hr' });
server.register(legalRoutes, { prefix: '/api/legal' });
server.register(workflowRoutes, { prefix: '/api/workflows' });

// Health check (no auth required)
server.get('/health', async () => {
  return {
    status: 'ok',
    timestamp: new Date().toISOString(),
    version: '1.0.0',
  };
});

// Graceful shutdown
const shutdown = async (signal: string) => {
  server.log.info(`Received ${signal}, shutting down...`);
  await server.close();
  await PDFService.close();
  process.exit(0);
};

process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT', () => shutdown('SIGINT'));

const start = async () => {
  try {
    await server.listen({ port: parseInt(env.PORT), host: '0.0.0.0' });
    server.log.info(`Server running at http://localhost:${env.PORT}`);
  } catch (err) {
    server.log.error(err);
    process.exit(1);
  }
};

start();
