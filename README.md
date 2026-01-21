# Dyano - AI-Powered Educational Platform

<div align="center">

![React](https://img.shields.io/badge/React-18.2.0-61dafb?style=for-the-badge&logo=react&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-4.4.11-646cff?style=for-the-badge&logo=vite&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-16+-339933?style=for-the-badge&logo=node.js&logoColor=white)
![OpenAI](https://img.shields.io/badge/OpenAI-GPT--3.5-412991?style=for-the-badge&logo=openai&logoColor=white)
![License](https://img.shields.io/badge/License-Private-red?style=for-the-badge)

[![GitHub Stars](https://img.shields.io/github/stars/yashkurangale910-spec/dyano-app?style=social)](https://github.com/yashkurangale910-spec/dyano-app)
[![GitHub Forks](https://img.shields.io/github/forks/yashkurangale910-spec/dyano-app?style=social)](https://github.com/yashkurangale910-spec/dyano-app/fork)

</div>

---

A comprehensive React-based educational platform with interactive learning modules, AI-powered content generation, quizzes, flashcards, roadmaps, and PDF processing capabilities.

## 🌟 Features

- 📚 **Interactive Learning** - AI-generated explanations with visual content
- 📝 **Quiz System** - Intelligent quiz generation on any topic
- 🎴 **Flashcards** - Interactive flip-card study system with spaced repetition
- 🗺️ **Learning Roadmaps** - Personalized learning paths with milestones
- 📄 **PDF Intelligence** - Upload PDFs and ask questions using RAG (Retrieval-Augmented Generation)
- 🤖 **AI-Powered** - OpenAI GPT integration for content generation
- 🌍 **Multi-Language Support** - English, Hindi, and Spanish
- 🎨 **Modern UI/UX** - Kinetic abstract design with smooth animations
- 🔔 **Toast Notifications** - Real-time feedback for user actions
- ⚡ **Error Handling** - Comprehensive error boundaries and validation

## 🏗️ Tech Stack

### Frontend
- **React 18** - Modern React with hooks
- **Vite** - Lightning-fast build tool
- **React Router DOM** - Client-side routing
- **i18next** - Internationalization framework
- **Tailwind CSS** - Utility-first CSS framework
- **Axios** - HTTP client with interceptors

### Backend
- **Node.js** - JavaScript runtime
- **Express** - Web application framework
- **OpenAI API** - GPT-3.5-turbo and DALL-E 2
- **LangChain** - Document processing and RAG
- **FAISS** - Vector similarity search
- **Multer** - File upload handling

## 🚀 Setup Instructions

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- OpenAI API key ([Get one here](https://platform.openai.com/api-keys))

### ⚠️ IMPORTANT SECURITY NOTICE

**Before starting, you MUST:**
1. **Never commit `.env` files** to version control
2. **Rotate your API keys** if they were previously exposed
3. **Keep your OpenAI API key secure** - it can incur charges

### Installation

#### 1. Clone the repository
```bash
git clone https://github.com/yashkurangale910-spec/dyano-app.git
cd dyano-app
```

#### 2. Install Frontend Dependencies
```bash
cd frontend
npm install
```

#### 3. Install Server Dependencies
```bash
cd ../Server/endpoints/pdfanswer
npm install
```

#### 4. Configure Environment Variables

**Backend Configuration:**
```bash
cd Server/endpoints/pdfanswer
cp .env.example .env
```

Edit `.env` and add your OpenAI API key:
```env
OPENAI_API_KEY=your_actual_openai_api_key_here
PORT=3005
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
```

**Frontend Configuration:**
```bash
cd frontend
cp .env.example .env
```

The frontend `.env` should contain:
```env
VITE_API_URL=http://localhost:3005
VITE_ENV=development
```

### Running the Application

#### Start the Backend Server
```bash
cd Server/endpoints/pdfanswer
node mainServer.js
```

The server will run on `http://localhost:3005`

#### Start the Frontend
```bash
cd frontend
npm run dev
```

The frontend will run on `http://localhost:5173`

### 🧪 Testing the Setup

1. Visit `http://localhost:3005/health` - Should return server health status
2. Visit `http://localhost:5173` - Should load the application
3. Try generating content to test OpenAI integration

## 📁 Project Structure

```
dyano-app/
├── frontend/                    # React frontend
│   ├── src/
│   │   ├── components/
│   │   │   ├── dashboard/       # Dashboard component
│   │   │   ├── header/          # Navigation header
│   │   │   ├── hero.jsx         # Main learning interface
│   │   │   ├── Flashcards.jsx   # Flashcard viewer
│   │   │   ├── Roadmap.jsx      # Learning roadmap
│   │   │   ├── pdf.jsx          # PDF upload/query
│   │   │   ├── quiz/            # Quiz system
│   │   │   ├── ErrorBoundary.jsx # Error handling
│   │   │   ├── Toast.jsx        # Notification system
│   │   │   └── Loading.jsx      # Loading component
│   │   ├── services/
│   │   │   └── apiService.js    # API abstraction layer
│   │   ├── config/
│   │   │   └── api.js           # Axios configuration
│   │   ├── locales/             # i18n translations
│   │   │   ├── en.json
│   │   │   ├── hi.json
│   │   │   └── es.json
│   │   ├── i18n.js              # i18n configuration
│   │   ├── App.jsx              # Main app component
│   │   └── main.jsx             # Entry point
│   ├── .env                     # Environment variables (DO NOT COMMIT)
│   ├── .env.example             # Environment template
│   └── package.json
│
└── Server/                      # Node.js backend
    └── endpoints/
        └── pdfanswer/
            ├── mainServer.js    # Main server (USE THIS)
            ├── server.js        # PDF router
            ├── quiz.js          # Quiz generation
            ├── flashcards.js    # Flashcard generation
            ├── roadmap.js       # Roadmap generation
            ├── final.js         # Content + image generation
            ├── uploads/         # PDF storage
            ├── img/             # Generated images
            ├── .env             # Environment variables (DO NOT COMMIT)
            ├── .env.example     # Environment template
            └── package.json
```

## 🔒 Security Features

- ✅ CORS configuration with origin whitelist
- ✅ Request size limits (10MB max)
- ✅ File type validation (PDF only)
- ✅ Input validation and sanitization
- ✅ Error handling without exposing internals
- ✅ Graceful shutdown handling
- ✅ Environment-based configuration

## 🎯 API Endpoints

### Health Check
- `GET /health` - Server health status

### Content Generation
- `POST /img` - Generate explanation + image

### Quiz
- `POST /quiz` - Generate quiz questions

### Flashcards
- `POST /flashcards` - Generate flashcard deck

### Roadmap
- `POST /roadmap` - Generate learning roadmap

### PDF Processing
- `POST /pdf/upload` - Upload PDF file
- `POST /pdf/question` - Ask question about uploaded PDF

## 🌍 Multi-Language Support

The application supports:
- **English** (en)
- **Hindi** (hi)
- **Spanish** (es)

Switch languages using the language selector in the header.

## 🐛 Troubleshooting

### Common Issues

**"Failed to generate content"**
- Check if OpenAI API key is valid
- Ensure you have credits in your OpenAI account
- Check server logs for detailed error messages

**"Network error"**
- Ensure backend server is running on port 3005
- Check CORS configuration
- Verify frontend .env has correct API URL

**PDF upload fails**
- Ensure file is a valid PDF
- Check file size is under 10MB
- Verify uploads/ directory exists and is writable

## 📊 Cost Management

**OpenAI API Usage:**
- GPT-3.5-turbo: ~$0.002 per 1K tokens
- DALL-E 2 (512x512): ~$0.020 per image

**Tips to reduce costs:**
- Use caching for repeated queries
- Implement rate limiting
- Monitor usage in OpenAI dashboard
- Set up billing alerts

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is private and proprietary.

## 👨‍💻 Contact

Yash Kurangale - [@yashkurangale910-spec](https://github.com/yashkurangale910-spec)

Project Link: [https://github.com/yashkurangale910-spec/dyano-app](https://github.com/yashkurangale910-spec/dyano-app)

## 🙏 Acknowledgments

- OpenAI for GPT and DALL-E APIs
- LangChain for document processing
- React team for the amazing framework
- All open-source contributors

---

**⚠️ Remember:** Never commit `.env` files or API keys to version control!
