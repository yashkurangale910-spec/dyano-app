/**
 * USER_ENTERED_TOPIC_QUIZ_ENGINE
 * 
 * This module implements the Step 1 & Step 2 Domain Analysis and
 * adaptation for custom user topics.
 */

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3005';

export const generateQuiz = async (topic, difficulty) => {
    // We expect a token to be in localStorage if the user is logged in
    const user = JSON.parse(localStorage.getItem('dyano_user') || '{}');
    const token = user.token; // In a real app, this should be consistent

    const response = await fetch(`${API_URL}/quiz`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
            prompt: topic,
            difficulty: difficulty.toLowerCase()
        })
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to generate quiz');
    }

    const data = await response.json();
    const quiz = data.quiz;

    // Adapt backend structure to frontend expectation
    return {
        id: quiz._id,
        title: quiz.title,
        description: quiz.topicFraming || `Analyzing ${topic} using adaptive assessment models.`,
        questions: quiz.questions.map((q, idx) => ({
            id: q._id || idx + 1,
            text: q.questionText,
            options: q.options,
            correctAnswer: q.options.indexOf(q.correctAnswer),
            explanation: q.explanation
        }))
    };
};

// For backward compatibility if needed
export const mockGenerateQuiz = generateQuiz;
