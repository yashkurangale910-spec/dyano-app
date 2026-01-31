import { useState, useCallback, useEffect } from 'react';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3005';

export default function useProgress() {
    const [status, setStatus] = useState('idle');
    const [progressData, setProgressData] = useState(null);
    const [achievements, setAchievements] = useState([]);
    const [neuralDensity, setNeuralDensity] = useState({});

    const fetchProgress = useCallback(async () => {
        setStatus('loading');
        try {
            const user = JSON.parse(localStorage.getItem('dyano_user') || '{}');
            const response = await axios.get(`${API_URL}/progress`, {
                headers: { Authorization: `Bearer ${user.token}` }
            });
            if (response.data.success) {
                setProgressData(response.data.data);
            }
            setStatus('idle');
        } catch (error) {
            console.error("Failed to fetch progress:", error);
            setStatus('error');
        }
    }, []);

    const fetchNeuralDensity = useCallback(async () => {
        try {
            const user = JSON.parse(localStorage.getItem('dyano_user') || '{}');
            const response = await axios.get(`${API_URL}/progress/neural-density`, {
                headers: { Authorization: `Bearer ${user.token}` }
            });
            if (response.data.success) {
                setNeuralDensity(response.data.data);
            }
        } catch (error) {
            console.error("Failed to fetch neural density:", error);
        }
    }, []);

    const fetchAchievements = useCallback(async () => {
        try {
            const user = JSON.parse(localStorage.getItem('dyano_user') || '{}');
            const response = await axios.get(`${API_URL}/progress/achievements`, {
                headers: { Authorization: `Bearer ${user.token}` }
            });
            if (response.data.success) {
                setAchievements(response.data.data);
            }
        } catch (error) {
            console.error("Failed to fetch achievements:", error);
        }
    }, []);

    useEffect(() => {
        fetchProgress();
        fetchAchievements();
        fetchNeuralDensity();
    }, [fetchProgress, fetchAchievements, fetchNeuralDensity]);

    return {
        status,
        progressData,
        achievements,
        neuralDensity,
        refresh: () => {
            fetchProgress();
            fetchAchievements();
            fetchNeuralDensity();
        }
    };
}
