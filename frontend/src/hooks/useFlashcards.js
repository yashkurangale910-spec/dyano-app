import { useState, useCallback, useEffect } from 'react';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3005';

export default function useFlashcards() {
    const [status, setStatus] = useState('idle'); // idle | loading | generating
    const [flashcardSets, setFlashcardSets] = useState([]);
    const [currentSet, setCurrentSet] = useState(null);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isFlipped, setIsFlipped] = useState(false);
    const [sessionComplete, setSessionComplete] = useState(false);

    const fetchSets = useCallback(async () => {
        setStatus('loading');
        try {
            const user = JSON.parse(localStorage.getItem('dyano_user') || '{}');
            const response = await axios.get(`${API_URL}/flashcards`, {
                headers: { Authorization: `Bearer ${user.token}` }
            });
            if (response.data.success) {
                setFlashcardSets(response.data.flashcardSets);
                if (response.data.flashcardSets.length > 0 && !currentSet) {
                    setCurrentSet(response.data.flashcardSets[0]);
                }
            }
            setStatus('idle');
        } catch (error) {
            console.error("Failed to fetch flashcards:", error);
            setStatus('idle');
        }
    }, [currentSet]);

    const generateSet = useCallback(async (topic) => {
        setStatus('generating');
        try {
            const user = JSON.parse(localStorage.getItem('dyano_user') || '{}');
            const response = await axios.post(`${API_URL}/flashcards`,
                { prompt: topic },
                { headers: { Authorization: `Bearer ${user.token}` } }
            );
            if (response.data.success) {
                setFlashcardSets(prev => [response.data.flashcards, ...prev]);
                setCurrentSet(response.data.flashcards);
                setCurrentIndex(0);
                setStatus('idle');
                return response.data.flashcards;
            }
        } catch (error) {
            console.error("Failed to generate flashcards:", error);
            setStatus('idle');
            throw error;
        }
    }, []);

    const flip = useCallback(() => setIsFlipped(prev => !prev), []);

    const rate = useCallback((grade) => {
        setIsFlipped(false);
        setTimeout(() => {
            if (currentIndex < (currentSet?.cards?.length || 0) - 1) {
                setCurrentIndex(prev => prev + 1);
            } else {
                setSessionComplete(true);
            }
        }, 300);
    }, [currentIndex, currentSet]);

    useEffect(() => {
        fetchSets();
    }, [fetchSets]);

    return {
        status,
        flashcardSets,
        currentSet,
        currentCard: currentSet?.cards?.[currentIndex],
        currentIndex,
        total: currentSet?.cards?.length || 0,
        isFlipped,
        sessionComplete,
        flip,
        rate,
        setCurrentSet,
        generateSet,
        reset: () => {
            setCurrentIndex(0);
            setIsFlipped(false);
            setSessionComplete(false);
        }
    };
}

