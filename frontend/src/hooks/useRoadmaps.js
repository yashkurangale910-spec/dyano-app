import { useState, useCallback, useEffect } from 'react';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3005';

export default function useRoadmaps() {
    const [status, setStatus] = useState('idle'); // idle | generating | error
    const [userRoadmaps, setUserRoadmaps] = useState([]);

    const fetchRoadmaps = useCallback(async () => {
        try {
            const user = JSON.parse(localStorage.getItem('dyano_user') || '{}');
            const response = await axios.get(`${API_URL}/roadmap`, {
                headers: { Authorization: `Bearer ${user.token}` }
            });
            if (response.data.success) {
                setUserRoadmaps(response.data.roadmaps);
            }
        } catch (error) {
            console.error("Failed to fetch roadmaps:", error);
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
        userRoadmaps,
        generateRoadmap,
        refresh: fetchRoadmaps
    };
}
