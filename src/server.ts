import Fastify from 'fastify';
import cors from '@fastify/cors';
import { env } from './config/env';
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

const server = Fastify({
    logger: {
        transport: {
            target: 'pino-pretty',
        },
    },
});

server.register(cors, {
    origin: '*', // Adjust for production
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

server.get('/health', async () => {
    return { status: 'ok', timestamp: new Date().toISOString() };
});

const start = async () => {
    try {
        await server.listen({ port: parseInt(env.PORT), host: '0.0.0.0' });
        console.log(`🚀 Server running at http://localhost:${env.PORT}`);
    } catch (err) {
        server.log.error(err);
        process.exit(1);
    }
};

start();
