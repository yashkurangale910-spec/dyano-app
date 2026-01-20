import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';

export const Quiz = () => {
    const location = useLocation();
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [score, setScore] = useState(0);
    const [showScore, setShowScore] = useState(false);
    const [selectedAnswer, setSelectedAnswer] = useState(null);
    const [answeredQuestions, setAnsweredQuestions] = useState([]);

    // Default questions if none are passed via state
    const defaultQuestions = [
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
        }
    ];

    const questions = location.state?.questions || defaultQuestions;
    const topic = location.state?.topic || "General Knowledge";

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
                isCorrect: isCorrect,
                options: questions[currentQuestion].options
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

            // Update stats
            const stats = JSON.parse(localStorage.getItem('dyano_stats') || '{"quizzesCompleted":0,"flashcardsCreated":0,"roadmapsStarted":0,"streak":1}');
            stats.quizzesCompleted += 1;
            localStorage.setItem('dyano_stats', JSON.stringify(stats));
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
        <div className="min-h-screen bg-gray-50 py-20 px-4">
            <div className="max-w-3xl mx-auto">
                <div className="mb-8 text-center">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Quiz: {topic}</h1>
                    <div className="h-1 w-20 bg-blue-600 mx-auto rounded-full"></div>
                </div>

                {showScore ? (
                    <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
                        <h2 className="text-4xl font-bold text-center mb-4 text-gray-800">
                            Quiz Complete!
                        </h2>
                        <div className="text-center mb-8">
                            <p className="text-2xl mb-2 text-gray-600">
                                Your Score: <span className="font-bold text-blue-600">{score}</span> out of {questions.length}
                            </p>
                            <p className="text-xl text-gray-500 italic">{getScoreMessage()}</p>
                            <div className="mt-6 max-w-sm mx-auto">
                                <div className="w-full bg-gray-100 rounded-full h-4 overflow-hidden">
                                    <div
                                        className="bg-gradient-to-r from-blue-500 to-indigo-600 h-4 rounded-full transition-all duration-1000"
                                        style={{ width: `${(score / questions.length) * 100}%` }}
                                    ></div>
                                </div>
                                <p className="text-sm font-semibold text-gray-400 mt-2">
                                    {Math.round((score / questions.length) * 100)}% Proficiency
                                </p>
                            </div>
                        </div>

                        <div className="space-y-4 mb-8 max-h-[400px] overflow-y-auto pr-2">
                            <h3 className="text-xl font-bold text-gray-800">Review Summary:</h3>
                            {answeredQuestions.map((item, index) => (
                                <div key={index} className={`p-5 rounded-xl border-l-4 ${item.isCorrect ? 'bg-green-50 border-green-500' : 'bg-red-50 border-red-500'
                                    }`}>
                                    <p className="font-bold text-gray-800 mb-2">{index + 1}. {item.question}</p>
                                    <div className="flex flex-col gap-1 text-sm">
                                        <p>
                                            <span className="text-gray-500">Your answer: </span>
                                            <span className={item.isCorrect ? 'text-green-600 font-bold' : 'text-red-600 font-bold'}>
                                                {item.options[item.selectedAnswer]}
                                            </span>
                                        </p>
                                        {!item.isCorrect && (
                                            <p>
                                                <span className="text-gray-500">Correct answer: </span>
                                                <span className="text-green-600 font-bold">{item.options[item.correctAnswer]}</span>
                                            </p>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="flex flex-wrap gap-4 justify-center pt-4 border-t border-gray-100">
                            <button onClick={handleRestartQuiz} className="px-8 py-3 bg-gray-900 text-white rounded-xl font-bold hover:bg-gray-800 transition-all shadow-lg">
                                Retry Quiz
                            </button>
                            <Link to="/learn">
                                <button className="px-8 py-3 bg-white text-gray-900 border-2 border-gray-200 rounded-xl font-bold hover:border-gray-900 transition-all">
                                    Back to Learn
                                </button>
                            </Link>
                        </div>
                    </div>
                ) : (
                    <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
                        <div className="mb-8">
                            <div className="flex justify-between items-center mb-4 text-sm font-bold text-gray-400 tracking-wider uppercase">
                                <span>Question {currentQuestion + 1} / {questions.length}</span>
                                <span className="bg-blue-50 text-blue-600 px-3 py-1 rounded-full">Current Score: {score}</span>
                            </div>
                            <div className="w-full bg-gray-100 rounded-full h-2">
                                <div
                                    className="h-2 rounded-full transition-all duration-300 bg-blue-600"
                                    style={{
                                        width: `${((currentQuestion + 1) / questions.length) * 100}%`
                                    }}
                                ></div>
                            </div>
                        </div>

                        <h2 className="text-2xl font-bold text-gray-800 mb-8 leading-snug">
                            {questions[currentQuestion].question}
                        </h2>

                        <div className="grid grid-cols-1 gap-4 mb-10">
                            {questions[currentQuestion].options.map((option, index) => (
                                <button
                                    key={index}
                                    onClick={() => handleAnswerClick(index)}
                                    className={`group relative w-full p-5 text-left rounded-xl border-2 transition-all duration-200 ${selectedAnswer === index
                                        ? 'border-blue-600 bg-blue-50 shadow-md ring-2 ring-blue-600 ring-opacity-10'
                                        : 'border-gray-100 hover:border-blue-300 hover:bg-gray-50 shadow-sm'
                                        }`}
                                >
                                    <div className="flex items-center">
                                        <span className={`flex items-center justify-center w-8 h-8 rounded-lg mr-4 text-sm font-bold transition-colors ${selectedAnswer === index ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-500 group-hover:bg-blue-100 group-hover:text-blue-600'
                                            }`}>
                                            {String.fromCharCode(65 + index)}
                                        </span>
                                        <span className={`font-semibold ${selectedAnswer === index ? 'text-blue-900' : 'text-gray-700'}`}>
                                            {option}
                                        </span>
                                    </div>
                                </button>
                            ))}
                        </div>

                        <div className="flex justify-between items-center pt-6 border-t border-gray-100">
                            <Link to="/learn">
                                <button className="px-6 py-2 text-gray-400 hover:text-gray-900 font-bold transition-colors">
                                    Skip Quiz
                                </button>
                            </Link>
                            <button
                                onClick={handleNextQuestion}
                                disabled={selectedAnswer === null}
                                className={`px-10 py-4 bg-blue-600 text-white rounded-xl font-bold shadow-lg transition-all ${selectedAnswer === null ? 'opacity-50 cursor-not-allowed grayscale' : 'hover:bg-blue-700 hover:-translate-y-1 active:translate-y-0'
                                    }`}
                            >
                                {currentQuestion === questions.length - 1 ? 'See Results' : 'Next Question'}
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};
