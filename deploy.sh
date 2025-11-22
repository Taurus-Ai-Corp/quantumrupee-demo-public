#!/bin/bash

# QUANTUM_RUPEE (Q₹) Demo Deployment Script
# Quick deployment to multiple platforms

set -e

echo "🚀 QUANTUM_RUPEE (Q₹) Demo Deployment"
echo "======================================"
echo ""

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if in correct directory
if [ ! -f "index.html" ]; then
    echo "❌ Error: index.html not found. Please run from demo-webapp directory."
    exit 1
fi

echo "📋 Deployment Options:"
echo "1. Netlify (Recommended - Easiest)"
echo "2. Vercel (Fast)"
echo "3. GitHub Pages (Free)"
echo "4. All Platforms"
echo ""
read -p "Select option (1-4): " option

case $option in
    1)
        echo -e "${BLUE}Deploying to Netlify...${NC}"
        if command -v netlify &> /dev/null; then
            netlify deploy --prod --dir=.
        else
            echo "Netlify CLI not installed. Installing..."
            npm install -g netlify-cli
            netlify login
            netlify deploy --prod --dir=.
        fi
        ;;
    2)
        echo -e "${BLUE}Deploying to Vercel...${NC}"
        if command -v vercel &> /dev/null; then
            vercel --prod
        else
            echo "Vercel CLI not installed. Installing..."
            npm install -g vercel
            vercel --prod
        fi
        ;;
    3)
        echo -e "${BLUE}Setting up GitHub Pages...${NC}"
        if [ -d ".git" ]; then
            echo "Git repository found."
            read -p "GitHub username: " username
            read -p "Repository name: " repo
            git remote add origin "https://github.com/${username}/${repo}.git" 2>/dev/null || true
            git add .
            git commit -m "Deploy demo" || true
            git push -u origin main || git push -u origin master
            echo -e "${GREEN}✅ Pushed to GitHub. Enable Pages in Settings → Pages${NC}"
        else
            echo "Initializing git repository..."
            git init
            git add .
            git commit -m "Initial commit"
            read -p "GitHub username: " username
            read -p "Repository name: " repo
            git remote add origin "https://github.com/${username}/${repo}.git"
            git push -u origin main
            echo -e "${GREEN}✅ Pushed to GitHub. Enable Pages in Settings → Pages${NC}"
        fi
        ;;
    4)
        echo -e "${YELLOW}Deploying to all platforms...${NC}"
        echo "This will deploy to Netlify, Vercel, and GitHub Pages"
        read -p "Continue? (y/n): " confirm
        if [ "$confirm" = "y" ]; then
            # Netlify
            echo -e "${BLUE}1. Deploying to Netlify...${NC}"
            if command -v netlify &> /dev/null; then
                netlify deploy --prod --dir=. || echo "Netlify deployment skipped"
            fi
            
            # Vercel
            echo -e "${BLUE}2. Deploying to Vercel...${NC}"
            if command -v vercel &> /dev/null; then
                vercel --prod || echo "Vercel deployment skipped"
            fi
            
            # GitHub Pages
            echo -e "${BLUE}3. Setting up GitHub Pages...${NC}"
            if [ -d ".git" ]; then
                git add .
                git commit -m "Deploy demo" || true
                git push || echo "GitHub push skipped"
            fi
        fi
        ;;
    *)
        echo "Invalid option"
        exit 1
        ;;
esac

echo ""
echo -e "${GREEN}✅ Deployment complete!${NC}"
echo ""
echo "📝 Next Steps:"
echo "1. Test your deployed demo"
echo "2. Share URL with team"
echo "3. Add to APIX submission"
echo ""

