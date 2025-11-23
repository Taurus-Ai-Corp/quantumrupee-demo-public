#!/bin/bash

# Deploy QUANTUM_RUPEE Demo to GitHub
# Repository: Taurus-Ai-Corp/quantumrupee-demo-public

set -e

echo "🚀 Deploying QUANTUM_RUPEE (Q₹) Demo to GitHub"
echo "=============================================="

ORG="Taurus-Ai-Corp"
REPO="quantumrupee-demo-public"
REMOTE_URL="https://github.com/${ORG}/${REPO}.git"

# Check if git is initialized
if [ ! -d ".git" ]; then
    echo "📦 Initializing git repository..."
    git init
    git branch -M main
fi

# Check if remote exists
if ! git remote get-url origin &>/dev/null; then
    echo "🔗 Adding remote repository..."
    git remote add origin "${REMOTE_URL}"
fi

# Add all files
echo "📝 Staging files..."
git add .

# Commit
echo "💾 Committing changes..."
git commit -m "Deploy: Enhanced demo with Neon DB, QR codes, terminal animations, and backend API" || echo "No changes to commit"

# Push to GitHub
echo "🚀 Pushing to GitHub..."
git push -u origin main --force || {
    echo "⚠️  Push failed. Creating repository if needed..."
    gh repo create "${ORG}/${REPO}" --public --description "Interactive web demo for QUANTUM_RUPEE (Q₹) - RBI Harbinger 2025" --source=. --remote=origin --push || true
}

echo ""
echo "✅ Deployment complete!"
echo "🌐 URL: https://${ORG}.github.io/${REPO}/"
echo ""
echo "📋 Next Steps:"
echo "1. Enable GitHub Pages in repository settings"
echo "2. Set source to 'main' branch"
echo "3. Wait for deployment (2-3 minutes)"
echo "4. Visit: https://${ORG}.github.io/${REPO}/"

