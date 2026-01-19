# Dyano - Educational Platform

A React-based educational platform with interactive learning modules, quizzes, and PDF processing capabilities.

## Features

- 📚 **Interactive Learning** - Engaging educational content delivery
- 📝 **Quiz System** - Test knowledge with interactive quizzes
- 📄 **PDF Processing** - Handle and process PDF documents
- 🤖 **AI-Powered** - OpenAI integration for content generation

## Tech Stack

### Frontend
- React 18
- Vite
- React Router DOM
- Tailwind CSS
- Axios

### Backend
- Node.js
- Express
- OpenAI API

## Setup Instructions

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn
- OpenAI API key

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yashkurangale910-spec/dyano-app.git
   cd dyano-app
   ```

2. **Install Frontend Dependencies**
   ```bash
   cd frontend
   npm install
   ```

3. **Install Server Dependencies**
   ```bash
   cd ../Server/endpoints/pdfanswer
   npm install
   ```

4. **Configure Environment Variables**
   
   Create a `.env` file in `Server/endpoints/pdfanswer/`:
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` and add your OpenAI API key:
   ```
   OPENAI_API_KEY="your-openai-api-key-here"
   ```

### Running the Application

1. **Start the Frontend**
   ```bash
   cd frontend
   npm run dev
   ```

2. **Start the Server**
   ```bash
   cd Server/endpoints/pdfanswer
   node server.js
   ```

## Project Structure

```
dyano-app/
├── frontend/          # React frontend application
│   ├── src/
│   │   ├── components/
│   │   │   ├── header/
│   │   │   ├── home/
│   │   │   ├── learn/
│   │   │   ├── login/
│   │   │   ├── quiz/
│   │   │   └── pdf.jsx
│   │   └── App.jsx
│   └── package.json
│
└── Server/            # Node.js backend
    └── endpoints/
        └── pdfanswer/
            ├── final.js
            ├── quiz.js
            └── package.json
```

## Security Note

⚠️ **Important**: Never commit `.env` files or API keys to version control. The `.env` file is already added to `.gitignore`.

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is private and proprietary.

## Contact

Yash Kurangale - [@yashkurangale910-spec](https://github.com/yashkurangale910-spec)
