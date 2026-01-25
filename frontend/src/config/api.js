export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3005';

export const API_ENDPOINTS = {
    // Auth
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    REFRESH: '/auth/refresh',

    // Quiz
    GENERATE_QUIZ: '/quiz/generate',
    GET_QUIZZES: '/quiz',
    SUBMIT_QUIZ: '/quiz/submit',

    // Flashcards
    GENERATE_FLASHCARDS: '/flashcards/generate',
    GET_FLASHCARDS: '/flashcards',
    UPDATE_FLASHCARD: '/flashcards/update',

    // Roadmap
    GENERATE_ROADMAP: '/roadmap/generate',
    GET_ROADMAPS: '/roadmap',
    UPDATE_MILESTONE: '/roadmap/milestone',

    // PDF
    UPLOAD_PDF: '/pdf/upload',
    ASK_PDF: '/pdf/ask',
    GET_PDFS: '/pdf',

    // Progress
    GET_STATS: '/progress/stats',
    GET_ACHIEVEMENTS: '/progress/achievements',
};
