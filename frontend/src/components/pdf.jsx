import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Pdf = () => {
  const [file, setFile] = useState(null);
  const [fileUploaded, setFileUploaded] = useState(false)
  const [question, setQuestion] = useState("")
  const [answer, setAnswer] = useState("")
  const [isHovered, setIsHovered] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
  };

  const handleUpload = async () => {
    try {
      if (!file) {
        alert('Please select a file!');
        return;
      }
      setLoading(true);
      const formData = new FormData();
      formData.append('pdfFile', file);

      const response = await axios.post('http://localhost:3005/pdf/upload', formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      setFileUploaded(true)
    } catch (error) {
      console.error('Error uploading file:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleQuestion = async () => {
    setLoading(true);
    try {
      const response = await axios.post("http://localhost:3005/pdf/question", { question: question }, {
        headers: { "Content-Type": "application/json" }
      })
      setAnswer(response.data.data)
    } finally {
      setLoading(false);
    }
  }

  const handlePdfQuiz = async () => {
    setLoading(true);
    try {
      // First get a summary/context from the PDF
      const contextRes = await axios.post("http://localhost:3005/pdf/question", {
        question: "Provide a 200 word detailed summary of this document for quiz generation."
      });
      const summary = contextRes.data.data;

      // Then generate quiz from summary
      const quizRes = await axios.post('http://localhost:3005/quiz', { "prompt": summary });
      if (quizRes.data.quiz) {
        navigate('/quiz', { state: { questions: quizRes.data.quiz, topic: `PDF: ${file.name}` } });
      }
    } finally {
      setLoading(false);
    }
  }

  const handlePdfFlashcards = async () => {
    setLoading(true);
    try {
      const contextRes = await axios.post("http://localhost:3005/pdf/question", {
        question: "Identify the top 10 key terms and their definitions from this document."
      });
      const context = contextRes.data.data;

      const flashRes = await axios.post('http://localhost:3005/flashcards', { "prompt": context });
      if (flashRes.data.flashcards) {
        navigate('/flashcards', { state: { flashcards: flashRes.data.flashcards, topic: `PDF: ${file.name}` } });
      }
    } finally {
      setLoading(false);
    }
  }

  const handlePdfSummary = async () => {
    setLoading(true);
    try {
      const response = await axios.post("http://localhost:3005/pdf/question", {
        question: "Summarize this document in 5-8 bullet points, highlighting key takeaways, critical concepts, and any important dates or figures."
      });
      setAnswer(response.data.data);
    } finally {
      setLoading(false);
    }
  }

  return (
    !fileUploaded ?
      (
        <div className="mx-14 mt-32 w-100%">
          <div className="max-w-2xl bg-white p-10 rounded-3xl shadow-xl border border-gray-100">
            <h1 className="font-extrabold text-4xl mb-2 text-gray-900">PDF Smart Learning</h1>
            <p className="text-gray-500 mb-8 font-medium">Upload a document to chat with it, generate quizzes, or create flashcards.</p>

            <div className="flex flex-col gap-6">
              <div className="relative border-2 border-dashed border-gray-200 rounded-2xl p-8 flex flex-col items-center hover:border-blue-400 transition-colors bg-gray-50">
                <input type="file" onChange={handleFileChange} className="absolute inset-0 opacity-0 cursor-pointer" />
                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
                <span className="text-gray-600 font-bold">{file ? file.name : "Click to select a PDF"}</span>
              </div>

              <button
                onClick={handleUpload}
                disabled={!file || loading}
                className={`w-full font-extrabold bg-gray-900 text-white py-4 rounded-xl flex items-center justify-center gap-2 hover:bg-black transition-all shadow-lg ${(!file || loading) ? 'opacity-50 grayscale' : ''}`}
              >
                {loading ? "Analyzing..." : "Upload & Process"}
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5m-13.5-9L12 3m0 0 4.5 4.5M12 3v13.5" />
                </svg>
              </button>
            </div>
          </div>
        </div>) : (
        <div className="mx-14 mt-32">
          <div className="flex flex-col lg:flex-row gap-8">
            <div className="flex-1">
              <div className="bg-white p-8 rounded-3xl shadow-xl border border-gray-100 mb-8">
                <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                  <span className="w-2 h-8 bg-blue-600 rounded-full"></span>
                  Document AI Assistant
                </h2>
                <div className="flex gap-4 mb-6">
                  <input
                    value={question}
                    onChange={({ target: { value } }) => setQuestion(value)}
                    placeholder='Ask something about the PDF...'
                    className="flex-1 px-6 py-4 font-bold font-sans rounded-2xl border-2 border-gray-100 focus:border-blue-600 outline-none transition-colors"
                  />
                  <button
                    onClick={handleQuestion}
                    disabled={loading}
                    className="font-extrabold bg-gray-900 text-white px-8 rounded-2xl hover:bg-black transition-all flex items-center"
                  >
                    {loading ? "..." : "Ask AI"}
                  </button>
                </div>
                {answer && (
                  <div className="bg-blue-50 text-blue-900 p-6 rounded-2xl border-l-4 border-blue-600">
                    <p className="font-medium leading-relaxed">{answer}</p>
                  </div>
                )}
              </div>
            </div>

            <div className="lg:w-80 flex flex-col gap-4">
              <div className="bg-gradient-to-br from-indigo-600 to-purple-700 p-6 rounded-3xl shadow-xl text-white">
                <h3 className="text-xl font-bold mb-4">Study Tools</h3>
                <div className="flex flex-col gap-3">
                  <button
                    onClick={handlePdfQuiz}
                    disabled={loading}
                    className="w-full bg-white/20 hover:bg-white/30 py-3 rounded-xl font-bold transition-all text-left px-4 flex items-center justify-between"
                  >
                    Generate Quiz
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                    </svg>
                  </button>
                  <button
                    onClick={handlePdfFlashcards}
                    disabled={loading}
                    className="w-full bg-white/20 hover:bg-white/30 py-3 rounded-xl font-bold transition-all text-left px-4 flex items-center justify-between"
                  >
                    Generate Flashcards
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                    </svg>
                  </button>
                  <button
                    onClick={handlePdfSummary}
                    disabled={loading}
                    className="w-full bg-white/20 hover:bg-white/30 py-3 rounded-xl font-bold transition-all text-left px-4 flex items-center justify-between"
                  >
                    Quick Summary
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                    </svg>
                  </button>
                </div>
              </div>
              <div className="p-4 border-2 border-dashed border-gray-200 rounded-3xl text-center">
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Current Active File</p>
                <p className="text-sm font-bold text-gray-700 truncate">{file?.name}</p>
              </div>
            </div>
          </div>
        </div>
      )
  );
};

export default Pdf;
