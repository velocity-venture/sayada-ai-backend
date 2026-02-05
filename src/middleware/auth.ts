import { FastifyRequest, FastifyReply } from 'fastify';
import { env } from '../config/env';

/**
 * API key authentication hook.
 * Checks for x-api-key header on all protected routes.
 */
export async function authenticateApiKey(
  request: FastifyRequest,
  reply: FastifyReply
): Promise<void> {
  const apiKey = request.headers['x-api-key'];

  if (!apiKey || apiKey !== env.API_KEY) {
    reply.status(401).send({ error: 'Unauthorized: invalid or missing API key' });
    return;
  }
}
