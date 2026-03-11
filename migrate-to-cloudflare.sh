#!/bin/bash

# Sayada.ai Migration to Cloudflare Workers
# Emergency restoration script

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}🚀 Sayada.ai Emergency Migration to Cloudflare Workers${NC}"
echo ""

# Check prerequisites
echo -e "${YELLOW}📋 Checking prerequisites...${NC}"

if ! command -v wrangler &> /dev/null; then
    echo -e "${RED}❌ Wrangler CLI not found${NC}"
    echo "Install with: npm install -g wrangler"
    exit 1
fi

if ! wrangler whoami &> /dev/null; then
    echo -e "${YELLOW}⚠️  Not logged into Cloudflare${NC}"
    echo "Run: wrangler login"
    exit 1
fi

echo -e "${GREEN}✅ Prerequisites met${NC}"

# Navigate to worker directory
cd cloudflare-worker

# Install dependencies
echo -e "${YELLOW}📦 Installing dependencies...${NC}"
npm install

# Environment setup
echo -e "${YELLOW}🔧 Setting up environment variables...${NC}"

# Check if secrets are already set
echo "Checking existing secrets..."

# Set up secrets interactively
echo -e "${BLUE}🔐 Environment Variable Setup${NC}"
echo "You'll need to provide the following from your Vercel deployment:"

read -p "Enter N8N_WEBHOOK_BASE_URL (e.g., https://your-n8n.domain.com/webhook): " N8N_URL
if [ -n "$N8N_URL" ]; then
    echo "$N8N_URL" | wrangler secret put N8N_WEBHOOK_BASE_URL
    echo -e "${GREEN}✅ N8N webhook URL set${NC}"
fi

read -p "Enter API_KEY (minimum 8 characters): " API_KEY_VALUE
if [ -n "$API_KEY_VALUE" ]; then
    echo "$API_KEY_VALUE" | wrangler secret put API_KEY  
    echo -e "${GREEN}✅ API key set${NC}"
fi

read -p "Enter ALLOWED_ORIGINS (comma-separated, e.g., https://app.sayada.ai,https://dashboard.sayada.ai): " ORIGINS
if [ -n "$ORIGINS" ]; then
    echo "$ORIGINS" | wrangler secret put ALLOWED_ORIGINS
    echo -e "${GREEN}✅ Allowed origins set${NC}"
fi

# Deploy to staging first
echo -e "${YELLOW}🚦 Deploying to staging environment...${NC}"
wrangler deploy --name sayada-ai-staging

STAGING_URL=$(wrangler deployments list --name sayada-ai-staging --json | jq -r '.[0].url' 2>/dev/null || echo "")

if [ -n "$STAGING_URL" ]; then
    echo -e "${GREEN}✅ Staging deployed: $STAGING_URL${NC}"
    
    # Test staging deployment
    echo -e "${YELLOW}🧪 Testing staging deployment...${NC}"
    
    HEALTH_RESPONSE=$(curl -s "$STAGING_URL/health" || echo "failed")
    
    if [[ "$HEALTH_RESPONSE" == *"ok"* ]]; then
        echo -e "${GREEN}✅ Health check passed${NC}"
        
        # Test API endpoint (will fail without proper API key, but should return 401, not 500)
        API_RESPONSE=$(curl -s -w "%{http_code}" -o /dev/null "$STAGING_URL/api/faq/ask" || echo "000")
        
        if [[ "$API_RESPONSE" == "401" ]]; then
            echo -e "${GREEN}✅ API authentication working${NC}"
        else
            echo -e "${YELLOW}⚠️  API response: $API_RESPONSE (expected 401)${NC}"
        fi
        
    else
        echo -e "${RED}❌ Health check failed: $HEALTH_RESPONSE${NC}"
        echo "Check the staging deployment before proceeding to production"
        exit 1
    fi
else
    echo -e "${RED}❌ Could not get staging URL${NC}"
    exit 1
fi

# Prompt for production deployment
echo ""
read -p "Staging tests passed. Deploy to production? (y/N): " -n 1 -r
echo

if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo -e "${YELLOW}🚀 Deploying to production...${NC}"
    wrangler deploy --name sayada-ai
    
    PROD_URL=$(wrangler deployments list --name sayada-ai --json | jq -r '.[0].url' 2>/dev/null || echo "")
    
    if [ -n "$PROD_URL" ]; then
        echo -e "${GREEN}🎉 Production deployment successful!${NC}"
        echo ""
        echo -e "${BLUE}📊 Deployment Summary:${NC}"
        echo "  Staging URL: $STAGING_URL"
        echo "  Production URL: $PROD_URL"
        echo ""
        
        # Test production
        echo -e "${YELLOW}🧪 Final production test...${NC}"
        PROD_HEALTH=$(curl -s "$PROD_URL/health" || echo "failed")
        
        if [[ "$PROD_HEALTH" == *"ok"* ]]; then
            echo -e "${GREEN}✅ Production is live and healthy!${NC}"
        else
            echo -e "${RED}❌ Production health check failed${NC}"
        fi
    else
        echo -e "${RED}❌ Production deployment failed${NC}"
        exit 1
    fi
else
    echo -e "${YELLOW}⏸️  Production deployment skipped${NC}"
    echo "You can deploy later with: wrangler deploy --name sayada-ai"
fi

# DNS update instructions
echo ""
echo -e "${BLUE}🌐 DNS Update Instructions:${NC}"
echo "To complete the migration:"
echo ""
echo "1. Update your DNS records to point to the new Worker:"
if [ -n "$PROD_URL" ]; then
    WORKER_DOMAIN=$(echo "$PROD_URL" | sed 's|https://||' | sed 's|/.*||')
    echo "   CNAME api.sayada.ai -> $WORKER_DOMAIN"
fi
echo ""
echo "2. Update any hardcoded URLs in your frontend applications"
echo "3. Update webhook URLs in external services"
echo "4. Monitor the new deployment for 24 hours"
echo ""

# Cleanup instructions
echo -e "${BLUE}🧹 Post-Migration Cleanup:${NC}"
echo "After confirming everything works:"
echo "1. Cancel Vercel subscription to stop charges"
echo "2. Archive Vercel project (don't delete immediately)"
echo "3. Update documentation with new URLs"
echo "4. Set up monitoring alerts in Cloudflare dashboard"
echo ""

# Cost savings summary
echo -e "${GREEN}💰 Cost Impact Summary:${NC}"
echo "  Monthly savings: ~\$15-30 (Vercel elimination)"
echo "  New Cloudflare costs: ~\$0-5 (likely free tier)"
echo "  Net savings: ~\$15-30/month"
echo ""

echo -e "${GREEN}🎊 Migration Complete!${NC}"
echo "Your sayada-ai service is now running on Cloudflare Workers"

cd ..
exit 0