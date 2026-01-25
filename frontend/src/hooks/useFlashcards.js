import { useState, useCallback } from 'react';

const MOCK_DECK = [
    { id: 1, front: "What is Superposition?", back: "A fundamental principle of quantum mechanics where a physical system exists in all its theoretically possible states simultaneously.", level: 'moderate' },
    { id: 2, front: "What is the 'Transformer' in AI?", back: "A deep learning model that adopts the mechanism of self-attention, differentially weighting the significance of each part of the input data.", level: 'hard' },
    { id: 3, front: "Define 'Event Horizon'.", back: "The boundary around a black hole beyond which no light or other radiation can escape.", level: 'easy' },
];

export default function useFlashcards() {
    const [deck, setDeck] = useState(MOCK_DECK);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isFlipped, setIsFlipped] = useState(false);
    const [sessionComplete, setSessionComplete] = useState(false);

    const flip = useCallback(() => setIsFlipped(prev => !prev), []);

    const rate = useCallback((grade) => {
        setIsFlipped(false);

        // Wait for flip back before switching
        setTimeout(() => {
            if (currentIndex < deck.length - 1) {
                setCurrentIndex(prev => prev + 1);
            } else {
                setSessionComplete(true);
            }
        }, 300);
    }, [currentIndex, deck.length]);

    return {
        currentCard: deck[currentIndex],
        currentIndex,
        total: deck.length,
        isFlipped,
        sessionComplete,
        flip,
        rate,
        reset: () => {
            setCurrentIndex(0);
            setIsFlipped(false);
            setSessionComplete(false);
        }
    };
}
