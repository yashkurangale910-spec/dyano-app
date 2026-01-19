import { useState } from 'react';
import { Link } from 'react-router-dom';

export const Quiz = () => {
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [score, setScore] = useState(0);
    const [showScore, setShowScore] = useState(false);
    const [selectedAnswer, setSelectedAnswer] = useState(null);
    const [answeredQuestions, setAnsweredQuestions] = useState([]);

    // Sample quiz data - you can replace this with your own questions
    const questions = [
        {
            question: "What is the capital of France?",
            options: ["London", "Berlin", "Paris", "Madrid"],
            correctAnswer: 2
        },
        {
            question: "Which planet is known as the Red Planet?",
            options: ["Venus", "Mars", "Jupiter", "Saturn"],
            correctAnswer: 1
        },
        {
            question: "What is 2 + 2?",
            options: ["3", "4", "5", "6"],
            correctAnswer: 1
        },
        {
            question: "Who wrote 'Romeo and Juliet'?",
            options: ["Charles Dickens", "William Shakespeare", "Jane Austen", "Mark Twain"],
            correctAnswer: 1
        },
        {
            question: "What is the largest ocean on Earth?",
            options: ["Atlantic Ocean", "Indian Ocean", "Arctic Ocean", "Pacific Ocean"],
            correctAnswer: 3
        }
    ];

    const handleAnswerClick = (selectedIndex) => {
        setSelectedAnswer(selectedIndex);
    };

    const handleNextQuestion = () => {
        if (selectedAnswer === null) return;

        const isCorrect = selectedAnswer === questions[currentQuestion].correctAnswer;
        
        setAnsweredQuestions([
            ...answeredQuestions,
            {
                question: questions[currentQuestion].question,
                selectedAnswer: selectedAnswer,
                correctAnswer: questions[currentQuestion].correctAnswer,
                isCorrect: isCorrect
            }
        ]);

        if (isCorrect) {
            setScore(score + 1);
        }

        const nextQuestion = currentQuestion + 1;
        if (nextQuestion < questions.length) {
            setCurrentQuestion(nextQuestion);
            setSelectedAnswer(null);
        } else {
            setShowScore(true);
        }
    };

    const handleRestartQuiz = () => {
        setCurrentQuestion(0);
        setScore(0);
        setShowScore(false);
        setSelectedAnswer(null);
        setAnsweredQuestions([]);
    };

    const getScoreMessage = () => {
        const percentage = (score / questions.length) * 100;
        if (percentage === 100) return "Perfect! Outstanding work! 🎉";
        if (percentage >= 80) return "Excellent! Great job! 🌟";
        if (percentage >= 60) return "Good effort! Keep it up! 👍";
        if (percentage >= 40) return "Not bad! Room for improvement. 📚";
        return "Keep practicing! You'll get better! 💪";
    };

    return (
        <div className="min-h-screen bg-gray-100 py-10 px-4">
            <div className="max-w-3xl mx-auto">
                {showScore ? (
                    <div className="bg-white rounded-lg shadow-lg p-8">
                        <h2 className="text-4xl font-bold text-center mb-4" style={{ color: 'var(--clr-1)' }}>
                            Quiz Complete!
                        </h2>
                        <div className="text-center mb-6">
                            <p className="text-2xl mb-2">
                                Your Score: <span className="font-bold text-blue-600">{score}</span> out of {questions.length}
                            </p>
                            <p className="text-xl text-gray-600">{getScoreMessage()}</p>
                            <div className="mt-4">
                                <div className="w-full bg-gray-200 rounded-full h-4">
                                    <div
                                        className="bg-blue-600 h-4 rounded-full transition-all duration-500"
                                        style={{ width: `${(score / questions.length) * 100}%` }}
                                    ></div>
                                </div>
                                <p className="text-sm text-gray-500 mt-2">
                                    {Math.round((score / questions.length) * 100)}% Correct
                                </p>
                            </div>
                        </div>

                        <div className="mb-6">
                            <h3 className="text-2xl font-bold mb-4" style={{ color: 'var(--clr-1)' }}>Review Answers:</h3>
                            {answeredQuestions.map((item, index) => (
                                <div key={index} className="mb-4 p-4 border rounded-lg" style={{ 
                                    backgroundColor: item.isCorrect ? '#d4edda' : '#f8d7da',
                                    borderColor: item.isCorrect ? '#c3e6cb' : '#f5c6cb'
                                }}>
                                    <p className="font-semibold mb-2">Q{index + 1}: {item.question}</p>
                                    <p className="text-sm">
                                        Your answer: <span className={item.isCorrect ? 'text-green-700 font-semibold' : 'text-red-700 font-semibold'}>
                                            {questions[index].options[item.selectedAnswer]}
                                        </span>
                                    </p>
                                    {!item.isCorrect && (
                                        <p className="text-sm text-green-700">
                                            Correct answer: <span className="font-semibold">{questions[index].options[item.correctAnswer]}</span>
                                        </p>
                                    )}
                                </div>
                            ))}
                        </div>

                        <div className="flex gap-4 justify-center">
                            <button onClick={handleRestartQuiz} className="card px-8">
                                Retry Quiz
                            </button>
                            <Link to="/learn">
                                <button className="card px-8">
                                    Back to Learn
                                </button>
                            </Link>
                        </div>
                    </div>
                ) : (
                    <div className="bg-white rounded-lg shadow-lg p-8">
                        <div className="mb-6">
                            <div className="flex justify-between items-center mb-4">
                                <span className="text-lg font-semibold" style={{ color: 'var(--clr-1)' }}>
                                    Question {currentQuestion + 1} of {questions.length}
                                </span>
                                <span className="text-lg font-semibold text-blue-600">
                                    Score: {score}
                                </span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                                <div
                                    className="h-2 rounded-full transition-all duration-300"
                                    style={{ 
                                        width: `${((currentQuestion + 1) / questions.length) * 100}%`,
                                        background: 'var(--clr-3)'
                                    }}
                                ></div>
                            </div>
                        </div>

                        <h2 className="text-2xl font-bold mb-6" style={{ color: 'var(--clr-1)' }}>
                            {questions[currentQuestion].question}
                        </h2>

                        <div className="space-y-3 mb-6">
                            {questions[currentQuestion].options.map((option, index) => (
                                <button
                                    key={index}
                                    onClick={() => handleAnswerClick(index)}
                                    className={`w-full p-4 text-left rounded-lg border-2 transition-all duration-200 ${
                                        selectedAnswer === index
                                            ? 'border-blue-600 bg-blue-50 shadow-md'
                                            : 'border-gray-300 hover:border-blue-400 hover:bg-gray-50'
                                    }`}
                                >
                                    <span className="font-semibold mr-2">{String.fromCharCode(65 + index)}.</span>
                                    {option}
                                </button>
                            ))}
                        </div>

                        <div className="flex justify-between items-center">
                            <Link to="/learn">
                                <button className="px-6 py-2 text-gray-600 hover:text-gray-800 font-semibold">
                                    ← Back
                                </button>
                            </Link>
                            <button
                                onClick={handleNextQuestion}
                                disabled={selectedAnswer === null}
                                className={`card px-8 ${selectedAnswer === null ? 'opacity-50 cursor-not-allowed' : ''}`}
                            >
                                {currentQuestion === questions.length - 1 ? 'Finish' : 'Next'}
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};
