# 🚀 **DEPLOYMENT GUIDE - DYANO**

Complete guide to deploy Dyano to production.

---

## 📋 **PRE-DEPLOYMENT CHECKLIST**

### **✅ Code Quality**
- [x] All tests passing (16/16)
- [x] No console errors
- [x] Environment variables validated
- [x] API documentation complete
- [x] Error handling implemented
- [x] Security measures in place

### **✅ Performance**
- [x] Response compression enabled
- [x] Caching implemented
- [x] Rate limiting configured
- [x] Code splitting done
- [x] Lazy loading implemented

### **✅ Security**
- [x] JWT authentication
- [x] Password hashing
- [x] Helmet headers
- [x] CORS configured
- [x] Rate limiting
- [x] Input validation

---

## 🌐 **DEPLOYMENT OPTIONS**

### **Option 1: Vercel + Railway (Recommended)**
- **Frontend:** Vercel (Free tier)
- **Backend:** Railway (Free tier)
- **Database:** MongoDB Atlas (Free tier)

### **Option 2: Netlify + Render**
- **Frontend:** Netlify
- **Backend:** Render
- **Database:** MongoDB Atlas

### **Option 3: AWS/Azure/GCP**
- Full cloud deployment
- More control, higher cost

---

## 🚀 **STEP-BY-STEP DEPLOYMENT**

### **Step 1: MongoDB Atlas Setup**

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create free account
3. Create new cluster (M0 Free tier)
4. Create database user
5. Whitelist IP: `0.0.0.0/0` (allow from anywhere)
6. Get connection string:
   ```
   mongodb+srv://username:password@cluster.mongodb.net/dyano
   ```

### **Step 2: Backend Deployment (Railway)**

1. **Install Railway CLI:**
   ```bash
   npm install -g @railway/cli
   ```

2. **Login to Railway:**
   ```bash
   railway login
   ```

3. **Initialize Project:**
   ```bash
   cd Server/endpoints/pdfanswer
   railway init
   ```

4. **Set Environment Variables:**
   ```bash
   railway variables set OPENAI_API_KEY=your_key
   railway variables set JWT_SECRET=your_secret_min_32_chars
   railway variables set MONGODB_URI=your_atlas_uri
   railway variables set NODE_ENV=production
   railway variables set FRONTEND_URL=https://your-frontend.vercel.app
   ```

5. **Deploy:**
   ```bash
   railway up
   ```

6. **Get Backend URL:**
   ```bash
   railway domain
   ```
   Example: `https://dyano-backend.railway.app`

### **Step 3: Frontend Deployment (Vercel)**

1. **Install Vercel CLI:**
   ```bash
   npm install -g vercel
   ```

2. **Update API URL:**
   Edit `frontend/src/config/api.js`:
   ```javascript
   const API_URL = import.meta.env.VITE_API_URL || 'https://dyano-backend.railway.app';
   ```

3. **Create `.env.production`:**
   ```bash
   cd frontend
   echo "VITE_API_URL=https://dyano-backend.railway.app" > .env.production
   ```

4. **Deploy:**
   ```bash
   vercel --prod
   ```

5. **Get Frontend URL:**
   Example: `https://dyano.vercel.app`

6. **Update Backend CORS:**
   Update Railway environment variable:
   ```bash
   railway variables set FRONTEND_URL=https://dyano.vercel.app
   ```

---

## 🔧 **PRODUCTION CONFIGURATION**

### **Backend (`mainServer.js`)**

Already configured for production:
- ✅ Environment validation
- ✅ Compression enabled
- ✅ Security headers (Helmet)
- ✅ Rate limiting
- ✅ Error handling
- ✅ Graceful shutdown

### **Frontend Build**

Create `frontend/vite.config.js`:
```javascript
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist',
    sourcemap: false,
    minify: 'terser',
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom', 'react-router-dom'],
          query: ['@tanstack/react-query']
        }
      }
    }
  }
});
```

---

## 📝 **ENVIRONMENT VARIABLES**

### **Backend (Railway):**
```env
OPENAI_API_KEY=sk-...
JWT_SECRET=min_32_characters_random_string
JWT_EXPIRES_IN=7d
REFRESH_TOKEN_EXPIRES_IN=30d
MONGODB_URI=mongodb+srv://...
NODE_ENV=production
FRONTEND_URL=https://dyano.vercel.app
PORT=3005
```

### **Frontend (Vercel):**
```env
VITE_API_URL=https://dyano-backend.railway.app
```

---

## 🔍 **POST-DEPLOYMENT VERIFICATION**

### **1. Test Backend Health:**
```bash
curl https://dyano-backend.railway.app/health
```

Expected response:
```json
{
  "status": "healthy",
  "uptime": 123.45,
  "environment": "production"
}
```

### **2. Test Authentication:**
```bash
curl -X POST https://dyano-backend.railway.app/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test","email":"test@test.com","password":"test123"}'
```

### **3. Test Frontend:**
- Visit `https://dyano.vercel.app`
- Register account
- Generate quiz
- Check progress dashboard

---

## 📊 **MONITORING**

### **Railway Dashboard:**
- View logs: `railway logs`
- Monitor metrics
- Check deployments

### **Vercel Dashboard:**
- View analytics
- Monitor performance
- Check build logs

### **MongoDB Atlas:**
- Monitor database usage
- Check connection stats
- View slow queries

---

## 🐛 **TROUBLESHOOTING**

### **Backend won't start:**
1. Check Railway logs: `railway logs`
2. Verify environment variables
3. Check MongoDB connection string

### **Frontend can't connect to backend:**
1. Verify `VITE_API_URL` is correct
2. Check CORS settings on backend
3. Verify backend is running

### **Database connection fails:**
1. Check MongoDB Atlas IP whitelist
2. Verify connection string
3. Check database user permissions

---

## 🔒 **SECURITY CHECKLIST**

- [ ] Change default JWT_SECRET (min 32 chars)
- [ ] Use strong MongoDB password
- [ ] Enable MongoDB Atlas IP whitelist
- [ ] Set up SSL/TLS (automatic on Vercel/Railway)
- [ ] Configure proper CORS origins
- [ ] Enable rate limiting (already done)
- [ ] Set secure cookie flags
- [ ] Regular security audits

---

## 📈 **SCALING CONSIDERATIONS**

### **When to Scale:**
- More than 1000 daily active users
- Response times > 1 second
- Database queries slow
- High memory usage

### **How to Scale:**
1. **Database:** Upgrade MongoDB Atlas tier
2. **Backend:** Railway auto-scales, or use multiple instances
3. **Frontend:** Vercel auto-scales
4. **Caching:** Add Redis for better performance

---

## 💰 **COST ESTIMATION**

### **Free Tier (0-1000 users):**
- MongoDB Atlas: Free (M0)
- Railway: Free ($5 credit/month)
- Vercel: Free
- **Total: $0/month**

### **Paid Tier (1000-10000 users):**
- MongoDB Atlas: $9/month (M2)
- Railway: $20/month
- Vercel: Free (or $20/month Pro)
- **Total: $29-49/month**

---

## 🎯 **NEXT STEPS AFTER DEPLOYMENT**

1. **Set up custom domain** (optional)
2. **Configure CI/CD** with GitHub Actions
3. **Add monitoring** (Sentry for errors)
4. **Set up analytics** (Google Analytics)
5. **Create backup strategy**
6. **Plan for scaling**

---

## 📚 **USEFUL COMMANDS**

### **Railway:**
```bash
railway login          # Login
railway init           # Initialize project
railway up             # Deploy
railway logs           # View logs
railway variables      # Manage env vars
railway domain         # Get URL
```

### **Vercel:**
```bash
vercel login           # Login
vercel                 # Deploy preview
vercel --prod          # Deploy production
vercel logs            # View logs
vercel env             # Manage env vars
```

---

## ✅ **DEPLOYMENT COMPLETE!**

Your app is now live at:
- **Frontend:** `https://dyano.vercel.app`
- **Backend:** `https://dyano-backend.railway.app`

**Congratulations! 🎉**

---

**Last Updated:** January 21, 2026
