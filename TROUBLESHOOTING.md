# 🔧 DYANO - Troubleshooting Guide

**Last Updated:** January 29, 2026

---

## 🚨 **Common Issues & Solutions**

### **Issue #1: Login Page Not Working**

**Symptoms:**
- Login button doesn't respond
- "Connection error" message appears
- Page hangs on login attempt

**Root Cause:**
Backend server not running

**Solution:**
```bash
# Terminal 1: Start Backend Server
cd Server/endpoints/pdfanswer
node mainServer.js

# Terminal 2: Start Frontend Server
cd frontend
npm run dev
```

**Verification:**
- Backend should show: `🚀 Dyano API Server running on port 3005`
- Frontend should show: `➜ Local: http://localhost:5173/`
- Test backend: Open `http://localhost:3005/health` in browser

---

### **Issue #2: "Cannot connect to database" Error**

**Symptoms:**
- Backend starts but shows MongoDB connection errors
- Features don't save data

**Root Cause:**
MongoDB not installed or not running

**Solution:**
The app uses **in-memory MongoDB** as fallback, so it should work automatically. If you see this error:

```bash
# Option 1: Use in-memory MongoDB (automatic)
# Just restart the server - it will use MongoMemoryServer

# Option 2: Install MongoDB locally
# Download from: https://www.mongodb.com/try/download/community
# Then update .env:
MONGODB_URI=mongodb://localhost:27017/dyano

# Option 3: Use MongoDB Atlas (cloud)
# Create free cluster at: https://www.mongodb.com/cloud/atlas
# Then update .env:
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/dyano
```

---

### **Issue #3: AI Features Not Working**

**Symptoms:**
- Quiz generation fails
- Flashcards don't generate
- PDF Q&A returns errors

**Root Cause:**
Missing or invalid OpenAI API key

**Solution:**
```bash
# 1. Get API key from: https://platform.openai.com/api-keys

# 2. Add to Server/endpoints/pdfanswer/.env:
OPENAI_API_KEY=sk-your-actual-key-here

# 3. Restart backend server
```

**Verification:**
```bash
# Test with curl:
curl -X POST http://localhost:3005/quiz \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{"prompt":"JavaScript","difficulty":"medium"}'
```

---

### **Issue #4: CORS Errors in Browser Console**

**Symptoms:**
- Browser console shows: `Access to fetch blocked by CORS policy`
- API calls fail with network errors

**Root Cause:**
Frontend URL not whitelisted in backend CORS config

**Solution:**
```bash
# Update Server/endpoints/pdfanswer/.env:
FRONTEND_URL=http://localhost:5173

# If using different port, update accordingly:
FRONTEND_URL=http://localhost:3000
```

**Verification:**
Check browser Network tab - should see `Access-Control-Allow-Origin` header in responses

---

### **Issue #5: Protected Routes Redirect to Login**

**Symptoms:**
- Can't access Dashboard, Quiz Lab, etc.
- Immediately redirected to /login

**Root Cause:**
Not logged in or JWT token expired

**Solution:**
```bash
# 1. Register a new account at /register
# 2. Login at /login
# 3. Token is stored in localStorage as 'dyano_user'

# To check token in browser console:
localStorage.getItem('dyano_user')

# To manually clear and re-login:
localStorage.removeItem('dyano_user')
```

---

### **Issue #6: Command Palette (Ctrl+K) Not Working**

**Symptoms:**
- Pressing Ctrl+K does nothing
- Command palette doesn't appear

**Root Cause:**
Browser extension or OS shortcut conflict

**Solution:**
```bash
# Try alternative:
# - Windows/Linux: Ctrl + K
# - Mac: Cmd + K

# If still not working, check:
# 1. Browser console for JavaScript errors
# 2. Disable browser extensions temporarily
# 3. Try in incognito mode
```

**Manual Navigation:**
Use the top navigation bar or direct URLs:
- Dashboard: `http://localhost:5173/dashboard`
- Quiz Lab: `http://localhost:5173/quiz`
- Flashcards: `http://localhost:5173/flashcards`
- Roadmap: `http://localhost:5173/roadmap`
- PDF Lab: `http://localhost:5173/pdf`

---

### **Issue #7: PDF Upload Fails**

**Symptoms:**
- File upload hangs
- "Upload failed" error
- PDF not processing

**Root Cause:**
File too large or missing dependencies

**Solution:**
```bash
# 1. Check file size (max 10MB)
# Reduce PDF size if needed

# 2. Ensure dependencies installed:
cd Server/endpoints/pdfanswer
npm install multer pdf-parse langchain faiss-node

# 3. Check backend logs for specific error
```

---

### **Issue #8: Slow AI Generation**

**Symptoms:**
- Quiz takes 10+ seconds to generate
- Flashcards timeout
- Roadmap generation hangs

**Root Cause:**
OpenAI API rate limits or slow connection

**Solution:**
```bash
# 1. Check OpenAI API status:
# https://status.openai.com/

# 2. Verify API tier (free tier has lower rate limits)

# 3. Add timeout handling in frontend:
# Already implemented - shows loading states

# 4. Consider upgrading OpenAI plan for faster responses
```

---

## 🔍 **Debugging Checklist**

### **Before Reporting Issues:**

- [ ] Both servers running (backend on 3005, frontend on 5173)
- [ ] `.env` file exists in `Server/endpoints/pdfanswer/`
- [ ] `OPENAI_API_KEY` is set and valid
- [ ] Browser console shows no errors
- [ ] Network tab shows successful API calls
- [ ] Logged in with valid account
- [ ] Token exists in localStorage

### **Quick Health Check:**

```bash
# 1. Backend health
curl http://localhost:3005/health

# Expected response:
# {"status":"healthy","uptime":123.45,...}

# 2. Frontend accessible
curl http://localhost:5173

# Expected: HTML response

# 3. Database connection
# Check backend terminal for:
# "📡 MongoDB Connected" or "⚠️ Using In-Memory MongoDB"
```

---

## 📝 **Environment Variables Reference**

### **Backend (.env)**
```env
# Required
OPENAI_API_KEY=sk-your-key-here
JWT_SECRET=your-secret-key-min-32-chars

# Optional (with defaults)
PORT=3005
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
MONGODB_URI=mongodb://localhost:27017/dyano
JWT_EXPIRES_IN=7d
REFRESH_TOKEN_EXPIRES_IN=30d
```

### **Frontend (.env)**
```env
# Optional (with default)
VITE_API_URL=http://localhost:3005
```

---

## 🚀 **Quick Start (Fresh Install)**

```bash
# 1. Clone/Download project
cd d:/Games/Implementation

# 2. Install backend dependencies
cd Server/endpoints/pdfanswer
npm install

# 3. Create .env file
# Copy .env.example to .env and fill in values

# 4. Install frontend dependencies
cd ../../../frontend
npm install

# 5. Start backend (Terminal 1)
cd ../Server/endpoints/pdfanswer
node mainServer.js

# 6. Start frontend (Terminal 2)
cd ../../frontend
npm run dev

# 7. Open browser
# Navigate to: http://localhost:5173
```

---

## 🆘 **Getting Help**

### **Check Logs:**

**Backend Logs:**
- Terminal running `node mainServer.js`
- Look for error messages, stack traces

**Frontend Logs:**
- Browser Developer Console (F12)
- Network tab for failed requests
- Console tab for JavaScript errors

### **Common Error Messages:**

| Error | Meaning | Solution |
|-------|---------|----------|
| `ECONNREFUSED` | Backend not running | Start backend server |
| `401 Unauthorized` | Not logged in | Login or check token |
| `429 Too Many Requests` | Rate limit hit | Wait or upgrade API tier |
| `500 Internal Server Error` | Backend crash | Check backend logs |
| `CORS error` | CORS misconfigured | Check FRONTEND_URL in .env |

---

## 📚 **Additional Resources**

- **API Documentation:** `API_DOCUMENTATION.md`
- **Feature Guide:** `FEATURE_UPDATES_JAN_2026.md`
- **Quick Reference:** `QUICK_REFERENCE.md`
- **Project Summary:** `PROJECT_SUMMARY.md`

---

**Built with ❤️ - If issues persist, check the documentation or create an issue on GitHub**
