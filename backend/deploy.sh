#!/bin/bash

# Deploy QUANTUM_RUPEE Backend to Railway
# Quick deployment script

set -e

echo "🚀 Deploying QUANTUM_RUPEE Backend API"
echo "========================================"

cd "$(dirname "$0")"

# Check if Railway CLI is installed
if ! command -v railway &> /dev/null; then
    echo "📦 Installing Railway CLI..."
    npm install -g @railway/cli
fi

# Check if logged in
if ! railway whoami &> /dev/null; then
    echo "🔐 Please login to Railway..."
    railway login
fi

# Initialize project if needed
if [ ! -f "railway.json" ]; then
    echo "📝 Initializing Railway project..."
    railway init
fi

# Set environment variables
echo "🔧 Setting environment variables..."
railway variables set DATABASE_URL="postgresql://neondb_owner:npg_zoHWV1QdmY0A@ep-raspy-king-aeqkp587-pooler.c-2.us-east-2.aws.neon.tech/neondb?sslmode=require&channel_binding=require"
railway variables set PORT=3000
railway variables set NODE_ENV=production

# Deploy
echo "🚀 Deploying to Railway..."
railway up

# Get URL
echo ""
echo "✅ Deployment complete!"
echo "🌐 Getting deployment URL..."
railway domain

echo ""
echo "📋 Next Steps:"
echo "1. Copy the Railway URL"
echo "2. Update API_URL in script.js:"
echo "   const API_BASE_URL = 'https://your-railway-url.railway.app/api';"
echo "3. Test: curl https://your-railway-url.railway.app/api/health"

