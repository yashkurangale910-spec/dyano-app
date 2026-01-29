import { useState, useCallback } from 'react';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3005';

export default function useTutor() {
    const [status, setStatus] = useState('idle'); // idle | loading | error
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
            }
            setStatus('idle');
        } catch (error) {
            console.error('Failed to fetch sessions:', error);
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
            }
            setStatus('idle');
        } catch (error) {
            console.error('Failed to fetch session details:', error);
            setStatus('error');
        }
    }, []);

    const sendMessage = useCallback(async ({ message, image, personality, depth, sessionId, documentId, language, framework }) => {
        setStatus('loading');
        const formData = new FormData();
        formData.append('message', message);
        if (image) formData.append('image', image);
        if (personality) formData.append('personality', personality);
        if (depth) formData.append('depth', depth);
        if (sessionId) formData.append('sessionId', sessionId);
        if (documentId) formData.append('documentId', documentId);
        if (language) formData.append('language', language);
        if (framework) formData.append('framework', framework);

        try {
            const response = await axios.post(`${API_URL}/tutor/chat`, formData, {
                headers: {
                    ...getAuthHeader(),
                    'Content-Type': 'multipart/form-data'
                }
            });

            if (response.data.success) {
                setStatus('idle');
                return response.data;
            }
        } catch (error) {
            console.error('Failed to send message:', error);
            setStatus('error');
            throw error;
        }
    }, []);

    const gradeEssay = useCallback(async (essay, rubric, language, framework) => {
        setStatus('loading');
        try {
            const response = await axios.post(`${API_URL}/tutor/grade-essay`, { essay, rubric, language, framework }, {
                headers: getAuthHeader()
            });
            setStatus('idle');
            return response.data.grading;
        } catch (error) {
            console.error('Failed to grade essay:', error);
            setStatus('error');
            throw error;
        }
    }, []);

    const solveProblem = useCallback(async (problem, subject, language, framework) => {
        setStatus('loading');
        try {
            const response = await axios.post(`${API_URL}/tutor/solve-problem`, { problem, subject, language, framework }, {
                headers: getAuthHeader()
            });
            setStatus('idle');
            return response.data.solution;
        } catch (error) {
            console.error('Failed to solve problem:', error);
            setStatus('error');
            throw error;
        }
    }, []);

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

    return {
        status,
        sessions,
        currentSession,
        progress,
        fetchSessions,
        fetchSessionDetails,
        sendMessage,
        gradeEssay,
        solveProblem,
        fetchProgress,
        setCurrentSession
    };
}
