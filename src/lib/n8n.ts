import axios, { AxiosError } from 'axios';
import { FastifyBaseLogger } from 'fastify';
import { env } from '../config/env';

interface N8nCallOptions {
  webhook: string;
  payload: unknown;
  logger: FastifyBaseLogger;
}

interface N8nErrorResponse {
  error: string;
  n8nStatus?: number;
}

/**
 * Forward a payload to an n8n webhook and return the response data.
 * Provides consistent error handling and logging.
 */
export async function callN8n<T = unknown>(
  options: N8nCallOptions
): Promise<T> {
  const { webhook, payload, logger } = options;
  const url = `${env.N8N_WEBHOOK_BASE_URL}/${webhook}`;

  try {
    const response = await axios.post(url, payload, {
      timeout: 30_000,
      headers: { 'Content-Type': 'application/json' },
    });
    return response.data as T;
  } catch (err) {
    const error = err as AxiosError;
    logger.error({ webhook, status: error.response?.status }, 'n8n call failed');

    if (error.response?.data) {
      logger.error({ n8nResponse: error.response.data }, 'n8n error response');
    }

    const n8nError: N8nErrorResponse = {
      error: `Workflow "${webhook}" failed`,
    };
    if (error.response?.status) {
      n8nError.n8nStatus = error.response.status;
    }
    throw n8nError;
  }
}
