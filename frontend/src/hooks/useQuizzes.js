import { useState, useCallback, useEffect } from 'react';
import { mockGenerateQuiz } from '../utils/quizGenerator';

/**
 * useQuizzes - Manages the lifecycle and state of a quiz session.
 * Updated to handle structured Quiz Packages (Title, Description, Questions).
 */
export default function useQuizzes() {
    const [status, setStatus] = useState('idle'); // idle | generating | active | complete
    const [quizPackage, setQuizPackage] = useState(null);
    const [currentIdx, setCurrentIdx] = useState(0);
    const [answers, setAnswers] = useState({});
    const [results, setResults] = useState(null);
    const [timeLeft, setTimeLeft] = useState(null);
    const [error, setError] = useState(null);

    const startQuiz = useCallback(async (topic, difficulty, framework = 'General') => {
        setStatus('generating');
        setError(null);
        try {
            // Pass framework as separate arg
            const pkg = await mockGenerateQuiz(topic, difficulty, framework);
            setQuizPackage(pkg);
            setCurrentIdx(0);
            setAnswers({});
            setTimeLeft(600); // 10 minutes
            setStatus('active');
        } catch (error) {
            console.error("Neural Synthesis Failed:", error);
            setError(error.message);
            setStatus('idle');
        }
    }, []);

    const submitAnswer = useCallback((questionId, answerIdx) => {
        setAnswers(prev => ({ ...prev, [questionId]: answerIdx }));
    }, []);

    const nextQuestion = useCallback(() => {
        if (currentIdx < quizPackage.questions.length - 1) {
            setCurrentIdx(prev => prev + 1);
        } else {
            completeQuiz();
        }
    }, [currentIdx, quizPackage]);

    const completeQuiz = useCallback(async () => {
        let correct = 0;
        quizPackage.questions.forEach(q => {
            // Frontend indices are 0-based for correct answers
            if (answers[q.id] === q.correctAnswer) correct++;
        });

        const score = Math.round((correct / quizPackage.questions.length) * 100);

        setResults({
            score,
            correct,
            total: quizPackage.questions.length
        });
        setStatus('complete');

        // Persist to backend
        try {
            const user = JSON.parse(localStorage.getItem('dyano_user') || '{}');
            const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3005';

            await fetch(`${API_URL}/quiz/${quizPackage.id}/score`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${user.token}`
                },
                body: JSON.stringify({
                    score,
                    isCompleted: true
                })
            });
        } catch (error) {
            console.error("Failed to persist score:", error);
        }
    }, [answers, quizPackage]);

    // Timer effect
    useEffect(() => {
        let timer;
        if (status === 'active' && timeLeft > 0) {
            timer = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
        } else if (timeLeft === 0 && status === 'active') {
            completeQuiz();
        }
        return () => clearInterval(timer);
    }, [status, timeLeft, completeQuiz]);

    return {
        status,
        quizTitle: quizPackage?.title,
        quizDescription: quizPackage?.description,
        currentQuestion: quizPackage?.questions[currentIdx],
        questions: quizPackage?.questions || [],
        currentIndex: currentIdx,
        totalQuestions: quizPackage?.questions.length || 0,
        answers,
        results,
        timeLeft,
        isLast: currentIdx === (quizPackage?.questions.length || 0) - 1,
        startQuiz,
        submitAnswer,
        nextQuestion,
        resetQuiz: () => {
            setStatus('idle');
            setQuizPackage(null);
        }
    };
}
