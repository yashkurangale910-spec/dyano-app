import { useState, useCallback } from 'react';
import axios from 'axios';
import { useTutorContext } from '../context/TutorContext';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3005';

export default function useTutor() {
    const { personality, setPersonality, depth, setDepth, language, setLanguage } = useTutorContext();
    const [status, setStatus] = useState('idle'); // idle | loading | error
    const [error, setError] = useState(null);
    const [sessions, setSessions] = useState([]);
    const [currentSession, setCurrentSession] = useState(null);
    const [progress, setProgress] = useState(null);

    const getAuthHeader = () => {
        try {
            const user = JSON.parse(localStorage.getItem('dyano_user') || 'null');
            if (user?.token) {
                return { Authorization: `Bearer ${user.token}` };
            }
        } catch (e) {
            // Invalid JSON in localStorage
        }
        return {}; // No auth header  if not logged in
    };

    const fetchSessions = useCallback(async (type) => {
        setStatus('loading');
        try {
            const response = await axios.get(`${API_URL}/tutor/sessions${type ? `?type=${type}` : ''}`, {
                headers: getAuthHeader()
            });
            if (response.data.success) {
                setSessions(response.data.sessions);
                setError(null);
            }
            setStatus('idle');
        } catch (error) {
            console.error('Failed to fetch sessions:', error);
            setError(error.message || "Failed to fetch sessions");
            setStatus('error');
        }
    }, []);

    const fetchSessionDetails = useCallback(async (sessionId) => {
        setStatus('loading');
        try {
            const response = await axios.get(`${API_URL}/tutor/sessions/${sessionId}`, {
                headers: getAuthHeader()
            });
            if (response.data.success) {
                setCurrentSession(response.data.session);
                setError(null);
            }
            setStatus('idle');
        } catch (error) {
            console.error('Failed to fetch session details:', error);
            setError(error.message || "Failed to fetch session details");
            setStatus('error');
        }
    }, []);

    const sendMessage = useCallback(async ({ message, image, sessionId, documentId, isDeepContext, debug }) => {
        console.log('🚀 sendMessage triggered', { message, hasImage: !!image });
        setStatus('loading');

        const formData = new FormData();
        formData.append('message', message || "");
        if (image) formData.append('image', image);
        if (personality) formData.append('personality', personality);
        if (depth) formData.append('depth', depth);
        if (sessionId) formData.append('sessionId', sessionId);
        if (documentId) formData.append('documentId', documentId);
        if (isDeepContext !== undefined) formData.append('isDeepContext', isDeepContext);
        if (language) formData.append('language', language);
        // if (framework) formData.append('framework', framework);
        if (debug) formData.append('debug', debug);

        try {
            // CRITICAL: DO NOT set 'Content-Type': 'multipart/form-data' manually with Axios + FormData
            // The browser needs to set it automatically to include the boundary string.
            const response = await axios.post(`${API_URL}/tutor/chat`, formData, {
                headers: {
                    ...getAuthHeader()
                },
                timeout: 60000 // 60 second timeout
            });

            console.log('✅ sendMessage response:', response.data);

            if (response.data.success) {
                setStatus('idle');
                setError(null);
                return response.data;
            } else {
                throw new Error(response.data.message || 'Brain sync failed');
            }
        } catch (error) {
            console.error('❌ Failed to send message:', error);
            setError(error.message || "Failed to communicate with tutor");
            setStatus('error');
            // Ensure status returns to idle after a delay so UI doesn't stay locked if not caught
            setTimeout(() => setStatus('idle'), 3000);
            throw error;
        }
    }, [personality, depth, language]); // Add context values as dependencies

    const gradeEssay = useCallback(async (essay, rubric, framework) => {
        setStatus('loading');
        try {
            const response = await axios.post(`${API_URL}/tutor/grade-essay`, { essay, rubric, language, framework }, {
                headers: getAuthHeader()
            });
            setStatus('idle');
            setError(null);
            return response.data.grading;
        } catch (error) {
            console.error('Failed to grade essay:', error);
            setError(error.message || "Failed to grade essay");
            setStatus('error');
            throw error;
        }
    }, [language]);

    const solveProblem = useCallback(async (problem, subject, framework) => {
        setStatus('loading');
        try {
            const response = await axios.post(`${API_URL}/tutor/solve-problem`, { problem, subject, language, framework }, {
                headers: getAuthHeader()
            });
            setStatus('idle');
            setError(null);
            return response.data.solution;
        } catch (error) {
            console.error('Failed to solve problem:', error);
            setError(error.message || "Failed to solve problem");
            setStatus('error');
            throw error;
        }
    }, [language]);

    const fetchProgress = useCallback(async () => {
        try {
            const response = await axios.get(`${API_URL}/tutor/progress`, {
                headers: getAuthHeader()
            });
            if (response.data.success) {
                setProgress(response.data.progress);
            }
        } catch (error) {
            console.error('Failed to fetch tutor progress:', error);
        }
    }, []);

    // Chat-specific state (for ChatBot component)
    const [messages, setMessages] = useState([]);
    const [selectedPdf, setSelectedPdf] = useState(null);
    const [pdfList, setPdfList] = useState([]);

    return {
        status,
        error,
        sessions,
        currentSession,
        progress,
        fetchSessions,
        fetchSessionDetails,
        sendMessage,
        gradeEssay,
        solveProblem,
        fetchProgress,
        setCurrentSession,
        // Chat component state
        messages,
        setMessages,
        language,
        setLanguage,
        personality,
        setPersonality,
        depth,
        setDepth,
        selectedPdf,
        setSelectedPdf,
        pdfList,
        setPdfList
    };
}
