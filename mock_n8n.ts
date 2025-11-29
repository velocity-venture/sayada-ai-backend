import Fastify from 'fastify';

const server = Fastify();

server.all('*', async (request, reply) => {
    console.log(`[Mock n8n] Received ${request.method} ${request.url}`);
    console.log('Payload:', request.body);
    return { status: 'Workflow started', executionId: 'mock-exec-123' };
});

server.listen({ port: 5678, host: '0.0.0.0' }, (err, address) => {
    if (err) {
        console.error(err);
        process.exit(1);
    }
    console.log(`Mock n8n server listening at ${address}`);
});
