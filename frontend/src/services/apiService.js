import api from '../config/api';

export const quizService = {
    /**
     * Generate a quiz based on a topic
     * @param {string} topic - The topic for quiz generation
     * @returns {Promise} Quiz data
     */
    generateQuiz: async (topic) => {
        try {
            const response = await api.post('/quiz', { prompt: topic });
            return response.data;
        } catch (error) {
            throw new Error(error.response?.data?.error || 'Failed to generate quiz');
        }
    },
};

export const flashcardService = {
    /**
     * Generate flashcards based on a topic
     * @param {string} topic - The topic for flashcard generation
     * @returns {Promise} Flashcard data
     */
    generateFlashcards: async (topic) => {
        try {
            const response = await api.post('/flashcards', { prompt: topic });
            return response.data;
        } catch (error) {
            throw new Error(error.response?.data?.error || 'Failed to generate flashcards');
        }
    },
};

export const roadmapService = {
    /**
     * Generate a learning roadmap
     * @param {string} topic - The topic for roadmap generation
     * @returns {Promise} Roadmap data
     */
    generateRoadmap: async (topic) => {
        try {
            const response = await api.post('/roadmap', { prompt: topic });
            return response.data;
        } catch (error) {
            throw new Error(error.response?.data?.error || 'Failed to generate roadmap');
        }
    },
};

export const pdfService = {
    /**
     * Upload a PDF file
     * @param {File} file - The PDF file to upload
     * @returns {Promise} Upload response
     */
    uploadPDF: async (file) => {
        try {
            const formData = new FormData();
            formData.append('pdfFile', file);

            const response = await api.post('/pdf/upload', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            return response.data;
        } catch (error) {
            throw new Error(error.response?.data?.error || 'Failed to upload PDF');
        }
    },

    /**
     * Ask a question about the uploaded PDF
     * @param {string} question - The question to ask
     * @returns {Promise} Answer data
     */
    askQuestion: async (question) => {
        try {
            const response = await api.post('/pdf/question', { question });
            return response.data;
        } catch (error) {
            throw new Error(error.response?.data?.error || 'Failed to get answer');
        }
    },
};

export const contentService = {
    /**
     * Generate explanation for a topic
     * @param {string} topic - The topic to explain
     * @returns {Promise} Explanation data
     */
    generateExplanation: async (topic) => {
        try {
            const response = await api.post('/img', { prompt: topic });
            return response.data;
        } catch (error) {
            throw new Error(error.response?.data?.error || 'Failed to generate explanation');
        }
    },
};
