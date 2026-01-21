# ⚡ QUICK START GUIDE

## 🚀 Get Dyano Running in 5 Minutes

### Step 1: Get Your OpenAI API Key
1. Go to https://platform.openai.com/api-keys
2. Create a new API key
3. Copy it (you'll need it in Step 3)

### Step 2: Install Dependencies

```bash
# Install frontend dependencies
cd frontend
npm install

# Install backend dependencies
cd ../Server/endpoints/pdfanswer
npm install
```

### Step 3: Configure Environment

**Backend (.env):**
```bash
cd Server/endpoints/pdfanswer
cp .env.example .env
```

Edit `.env` and paste your OpenAI API key:
```env
OPENAI_API_KEY=your_key_here
PORT=3005
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
```

**Frontend (.env):**
```bash
cd frontend
# .env already exists with correct values
```

### Step 4: Start the Application

**Terminal 1 - Backend:**
```bash
cd Server/endpoints/pdfanswer
node mainServer.js
```

You should see:
```
🚀 Dyano API Server running on port 3005
📍 Environment: development
🔗 Health check: http://localhost:3005/health
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```

You should see:
```
VITE v4.4.11  ready in XXX ms
➜  Local:   http://localhost:5173/
```

### Step 5: Test It!

1. Open http://localhost:5173 in your browser
2. Enter a topic like "Photosynthesis"
3. Click "Deep Dive"
4. Wait for AI-generated content!

---

## ✅ Verification Checklist

- [ ] Backend running on port 3005
- [ ] Frontend running on port 5173
- [ ] OpenAI API key configured
- [ ] Can generate content successfully
- [ ] Toast notifications appear
- [ ] No console errors

---

## 🐛 Quick Troubleshooting

**"Failed to generate content"**
→ Check your OpenAI API key is valid and has credits

**"Network error"**
→ Make sure backend is running on port 3005

**"CORS error"**
→ Verify FRONTEND_URL in backend .env is http://localhost:5173

**Port already in use**
→ Change PORT in .env to a different number (e.g., 3006)

---

## 🎯 What to Try Next

1. **Generate a Quiz**: Enter a topic, click "Practice Quiz"
2. **Create Flashcards**: Click "Study Flashcards"
3. **Make a Roadmap**: Click "Generate Roadmap"
4. **Upload a PDF**: Go to PDF Lab, upload a PDF, ask questions
5. **Change Language**: Use language selector in header

---

## 📚 Learn More

- Full documentation: See README.md
- All improvements: See IMPROVEMENTS.md
- API endpoints: http://localhost:3005/

---

**Need Help?** Check the troubleshooting section in README.md
