# Backend Deployment Guide

## 🚀 Deploy QUANTUM_RUPEE Backend API

### Option 1: Railway (Recommended - Easiest)

1. **Install Railway CLI:**
```bash
npm install -g @railway/cli
railway login
```

2. **Deploy:**
```bash
cd backend
railway init
railway up
```

3. **Set Environment Variables:**
```bash
railway variables set DATABASE_URL="postgresql://neondb_owner:npg_zoHWV1QdmY0A@ep-raspy-king-aeqkp587-pooler.c-2.us-east-2.aws.neon.tech/neondb?sslmode=require&channel_binding=require"
railway variables set PORT=3000
```

4. **Get URL:**
```bash
railway domain
```

---

### Option 2: Render

1. **Go to:** https://render.com
2. **New → Web Service**
3. **Connect GitHub:** Select `quantumrupee-demo-public`
4. **Settings:**
   - Root Directory: `backend`
   - Build Command: `npm install`
   - Start Command: `node server.js`
   - Environment Variables:
     - `DATABASE_URL`: (Neon connection string)
     - `PORT`: `3000`

---

### Option 3: Heroku

1. **Install Heroku CLI:**
```bash
brew install heroku/brew/heroku
heroku login
```

2. **Deploy:**
```bash
cd backend
heroku create quantumrupee-api
heroku addons:create heroku-postgresql:hobby-dev
git subtree push --prefix backend heroku main
```

3. **Set Environment Variables:**
```bash
heroku config:set DATABASE_URL="postgresql://neondb_owner:npg_zoHWV1QdmY0A@ep-raspy-king-aeqkp587-pooler.c-2.us-east-2.aws.neon.tech/neondb?sslmode=require&channel_binding=require"
```

---

### Option 4: Vercel (Serverless)

1. **Install Vercel CLI:**
```bash
npm install -g vercel
```

2. **Deploy:**
```bash
cd backend
vercel
```

3. **Set Environment Variables:**
- Go to Vercel Dashboard → Project → Settings → Environment Variables
- Add `DATABASE_URL`

---

## 🔧 Update Frontend API URL

After deploying backend, update `script.js`:

```javascript
const API_BASE_URL = 'https://your-backend-url.railway.app/api';
// or
const API_BASE_URL = 'https://quantumrupee-api.herokuapp.com/api';
```

---

## ✅ Test Backend

```bash
curl https://your-backend-url/api/health
```

Should return:
```json
{
  "status": "healthy",
  "database": "connected",
  "timestamp": "..."
}
```

---

**Backend deployment is optional - frontend works offline with fallback simulation!**

