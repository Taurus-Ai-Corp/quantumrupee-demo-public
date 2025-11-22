#!/bin/bash

# Push QUANTUM_RUPEE Demo to Taurus-Ai-Corp GitHub Organization
# Repository: quantumrupee-demo-public

set -e

echo "🚀 QUANTUM_RUPEE (Q₹) - GitHub Deployment"
echo "=========================================="
echo ""

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

ORG="Taurus-Ai-Corp"
REPO="quantumrupee-demo-public"
REMOTE_URL="https://github.com/${ORG}/${REPO}.git"

echo -e "${BLUE}Organization:${NC} ${ORG}"
echo -e "${BLUE}Repository:${NC} ${REPO}"
echo -e "${BLUE}Remote URL:${NC} ${REMOTE_URL}"
echo ""

# Check if GitHub CLI is installed
if command -v gh &> /dev/null; then
    echo -e "${GREEN}✓ GitHub CLI found${NC}"
    
    # Check authentication
    if gh auth status &> /dev/null; then
        echo -e "${GREEN}✓ GitHub authenticated${NC}"
    else
        echo -e "${YELLOW}⚠ GitHub not authenticated${NC}"
        echo "Running: gh auth login"
        gh auth login
    fi
    
    # Check if repo exists
    if gh repo view "${ORG}/${REPO}" &> /dev/null; then
        echo -e "${GREEN}✓ Repository exists${NC}"
        echo -e "${YELLOW}Updating existing repository...${NC}"
    else
        echo -e "${YELLOW}Repository does not exist. Creating...${NC}"
        gh repo create "${ORG}/${REPO}" \
            --public \
            --description "Interactive web demo for QUANTUM_RUPEE (Q₹) - RBI Harbinger 2025" \
            --license MIT \
            --source=. \
            --remote=origin \
            --push || echo "Repository creation may have failed, continuing..."
    fi
else
    echo -e "${YELLOW}⚠ GitHub CLI not found${NC}"
    echo "Install: brew install gh (macOS) or visit https://cli.github.com"
    echo ""
    echo -e "${YELLOW}Manual setup required:${NC}"
    echo "1. Go to: https://github.com/orgs/${ORG}/repositories"
    echo "2. Click 'New repository'"
    echo "3. Name: ${REPO}"
    echo "4. Description: Interactive web demo for QUANTUM_RUPEE (Q₹) - RBI Harbinger 2025"
    echo "5. Visibility: Public"
    echo "6. License: MIT"
    echo "7. Click 'Create repository'"
    echo ""
    read -p "Press Enter after creating repository..."
fi

# Set remote
echo ""
echo -e "${BLUE}Setting up remote...${NC}"
git remote remove origin 2>/dev/null || true
git remote add origin "${REMOTE_URL}" || git remote set-url origin "${REMOTE_URL}"

# Check current branch
CURRENT_BRANCH=$(git branch --show-current)
if [ "$CURRENT_BRANCH" != "main" ]; then
    echo -e "${YELLOW}Renaming branch to main...${NC}"
    git branch -M main
fi

# Push to GitHub
echo ""
echo -e "${BLUE}Pushing to GitHub...${NC}"
git push -u origin main

echo ""
echo -e "${GREEN}✅ Successfully pushed to GitHub!${NC}"
echo ""
echo -e "${BLUE}Repository URL:${NC} https://github.com/${ORG}/${REPO}"
echo -e "${BLUE}GitHub Pages:${NC} https://${ORG,,}.github.io/${REPO}/"
echo ""
echo -e "${YELLOW}Next Steps:${NC}"
echo "1. Enable GitHub Pages: Settings → Pages → Source: main → / (root)"
echo "2. Test demo: https://${ORG,,}.github.io/${REPO}/"
echo "3. Add to APIX submission"
echo ""

