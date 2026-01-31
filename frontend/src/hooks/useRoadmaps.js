import { useState, useCallback, useEffect } from 'react';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3005';

export default function useRoadmaps() {
    const [status, setStatus] = useState('idle'); // idle | generating | loading | error
    const [error, setError] = useState(null);
    const [userRoadmaps, setUserRoadmaps] = useState([]);

    const fetchRoadmaps = useCallback(async () => {
        try {
            const user = JSON.parse(localStorage.getItem('dyano_user') || '{}');
            if (user.token) {
                const response = await axios.get(`${API_URL}/roadmap`, {
                    headers: { Authorization: `Bearer ${user.token}` }
                });
                if (response.data.success) {
                    setUserRoadmaps(response.data.roadmaps);
                    setError(null);
                }
            }
        } catch (error) {
            console.error("Failed to fetch roadmaps:", error);
            setError(error.response?.data?.message || "Failed to load roadmaps");
            setStatus('error');
        }
    }, []);

    const generateRoadmap = useCallback(async (topic) => {
        setStatus('generating');
        try {
            const user = JSON.parse(localStorage.getItem('dyano_user') || '{}');
            const response = await axios.post(`${API_URL}/roadmap`,
                { prompt: topic },
                { headers: { Authorization: `Bearer ${user.token}` } }
            );
            if (response.data.success) {
                setUserRoadmaps(prev => [response.data.roadmap, ...prev]);
                setStatus('idle');
                return response.data.roadmap;
            }
        } catch (error) {
            console.error("Failed to generate roadmap:", error);
            setStatus('error');
            throw error;
        }
    }, []);

    useEffect(() => {
        fetchRoadmaps();
    }, [fetchRoadmaps]);

    return {
        status,
        error,
        userRoadmaps,
        generateRoadmap,
        refresh: fetchRoadmaps
    };
}
