/**
 * Sayada.ai Backend - Cloudflare Workers Migration
 * Enterprise-Grade AI Business Automation Suite
 */

import { Router } from 'itty-router';

export interface Env {
  N8N_WEBHOOK_BASE_URL: string;
  API_KEY: string;
  ALLOWED_ORIGINS?: string;
  NODE_ENV?: string;
}

// CORS headers
const corsHeaders = {
  'Access-Control-Allow-Origin': '*', // Will be dynamically set
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-API-Key',
};

// API key authentication middleware
async function authenticateApiKey(request: Request, env: Env): Promise<Response | null> {
  const apiKey = request.headers.get('X-API-Key') || request.headers.get('Authorization')?.replace('Bearer ', '');
  
  if (!apiKey || apiKey !== env.API_KEY) {
    return new Response('Unauthorized', { 
      status: 401,
      headers: corsHeaders 
    });
  }
  
  return null; // Continue processing
}

// N8N webhook caller
async function callN8n(webhook: string, payload: any, env: Env): Promise<any> {
  const url = `${env.N8N_WEBHOOK_BASE_URL}/${webhook}`;
  
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error(`N8N webhook failed: ${response.status} ${response.statusText}`);
  }

  return await response.json();
}

// Router setup
const router = Router();

// CORS preflight
router.options('*', () => new Response(null, { headers: corsHeaders }));

// Health check (no auth required)
router.get('/health', () => {
  return Response.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    version: '1.0.0',
    platform: 'cloudflare-workers'
  });
});

// API routes with authentication middleware
const apiRoutes = [
  { path: '/api/inbox/process', webhook: 'inbox' },
  { path: '/api/calendar/sync', webhook: 'calendar' },
  { path: '/api/meetings/schedule', webhook: 'meetings' },
  { path: '/api/calls/log', webhook: 'calls' },
  { path: '/api/faq/ask', webhook: 'faq' },
  { path: '/api/social/post', webhook: 'social' },
  { path: '/api/reviews/analyze', webhook: 'reviews' },
  { path: '/api/finance/process', webhook: 'finance' },
  { path: '/api/onboarding/start', webhook: 'onboarding' },
  { path: '/api/inventory/update', webhook: 'inventory' },
  { path: '/api/leads/qualify', webhook: 'leads' },
  { path: '/api/strategy/analyze', webhook: 'strategy' },
  { path: '/api/reporting/generate', webhook: 'reporting' },
  { path: '/api/crm/sync', webhook: 'crm' },
  { path: '/api/sales/process', webhook: 'sales' },
  { path: '/api/hr/process', webhook: 'hr' },
  { path: '/api/legal/review', webhook: 'legal' },
  { path: '/api/workflows/trigger', webhook: 'workflows' },
];

// Register API routes
apiRoutes.forEach(({ path, webhook }) => {
  router.post(path, async (request, env: Env) => {
    // Authenticate
    const authError = await authenticateApiKey(request, env);
    if (authError) return authError;

    try {
      const body = await request.json();
      const data = await callN8n(webhook, body, env);
      
      return Response.json(data, {
        headers: corsHeaders
      });
    } catch (error) {
      console.error(`Error in ${path}:`, error);
      return Response.json(
        { error: 'Internal server error', message: error instanceof Error ? error.message : 'Unknown error' },
        { 
          status: 500,
          headers: corsHeaders 
        }
      );
    }
  });
});

// Fallback route
router.all('*', () => new Response('Not Found', { status: 404, headers: corsHeaders }));

export default {
  async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    // Set dynamic CORS origin
    const origin = request.headers.get('Origin');
    const allowedOrigins = env.ALLOWED_ORIGINS ? env.ALLOWED_ORIGINS.split(',') : ['http://localhost:3000'];
    
    if (origin && allowedOrigins.includes(origin)) {
      corsHeaders['Access-Control-Allow-Origin'] = origin;
    }

    try {
      return router.handle(request, env, ctx);
    } catch (error) {
      console.error('Worker error:', error);
      return new Response('Internal Server Error', { 
        status: 500,
        headers: corsHeaders 
      });
    }
  },
};