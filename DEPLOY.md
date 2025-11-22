# Deployment Guide
## QUANTUM_RUPEE (Q₹) Demo - Quick Deployment

---

## 🚀 Quick Deploy (Choose One)

### Option 1: Netlify (Easiest - 2 minutes)

1. **Go to:** https://netlify.com
2. **Sign up** (free account)
3. **Drag & drop** this `demo-webapp` folder
4. **Get instant URL** (e.g., `quantumrupee-demo.netlify.app`)
5. **Done!** ✅

**Or use CLI:**
```bash
npm install -g netlify-cli
netlify login
netlify deploy --prod --dir=.
```

---

### Option 2: Vercel (Fast - 2 minutes)

1. **Go to:** https://vercel.com
2. **Sign up** (free account)
3. **Import Git repository** OR **Upload folder**
4. **Get instant URL** (e.g., `quantumrupee-demo.vercel.app`)
5. **Done!** ✅

**Or use CLI:**
```bash
npm install -g vercel
vercel --prod
```

---

### Option 3: GitHub Pages (Free - 5 minutes)

1. **Push to GitHub:**
```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/YOUR_USERNAME/quantumrupee-demo-public.git
git push -u origin main
```

2. **Enable Pages:**
   - Go to: `Settings → Pages`
   - Source: `main branch` → `/ (root)`
   - Save

3. **Get URL:** `https://YOUR_USERNAME.github.io/quantumrupee-demo-public/`

---

## 📋 Pre-Deployment Checklist

- [ ] Test locally (`open index.html`)
- [ ] Check all links work
- [ ] Verify mobile responsiveness
- [ ] Test interactive demos
- [ ] Review content accuracy
- [ ] Check file sizes (optimize if needed)

---

## 🔧 Custom Domain (Optional)

### Netlify
1. Go to: `Domain settings`
2. Add custom domain
3. Update DNS records
4. SSL auto-enabled

### Vercel
1. Go to: `Settings → Domains`
2. Add domain
3. Update DNS records
4. SSL auto-enabled

---

## 📊 Performance Optimization

### Before Deploy:
- [ ] Minify CSS (optional)
- [ ] Minify JS (optional)
- [ ] Optimize images (if any)
- [ ] Enable compression

### After Deploy:
- [ ] Test page speed (PageSpeed Insights)
- [ ] Check mobile performance
- [ ] Verify CDN is working

---

## 🔄 Auto-Deploy Setup

### Netlify + GitHub
1. Connect GitHub repo to Netlify
2. Auto-deploys on every push
3. Preview deployments for PRs

### Vercel + GitHub
1. Import GitHub repo to Vercel
2. Auto-deploys on every push
3. Preview deployments for PRs

---

## 📱 Mobile Testing

After deployment, test on:
- [ ] iPhone Safari
- [ ] Android Chrome
- [ ] iPad
- [ ] Desktop browsers

---

## 🔗 Share Your Demo

Once deployed, share:
- **Demo URL:** [Your deployed URL]
- **GitHub:** [Your repo URL]
- **Documentation:** [Your docs URL]

---

## 🆘 Troubleshooting

### Issue: Page not loading
- Check file paths (use relative paths)
- Verify `index.html` is in root
- Check browser console for errors

### Issue: Styles not applying
- Check CSS file path
- Verify file is uploaded
- Clear browser cache

### Issue: JavaScript not working
- Check browser console for errors
- Verify JS file path
- Check for syntax errors

---

## ✅ Post-Deployment

After successful deployment:
1. ✅ Test all features
2. ✅ Share URL with team
3. ✅ Add to APIX submission
4. ✅ Monitor analytics (if enabled)
5. ✅ Set up custom domain (optional)

---

**Status:** Ready for Deployment
**Estimated Time:** 2-5 minutes
**Cost:** Free (all platforms)

