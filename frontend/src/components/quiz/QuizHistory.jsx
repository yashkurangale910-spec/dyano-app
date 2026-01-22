import { useState, useEffect } from 'react';
import api from '../../config/api';
import './QuizHistory.css';

function QuizHistory() {
    const [quizzes, setQuizzes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all'); // all, completed, incomplete

    useEffect(() => {
        fetchQuizzes();
    }, []);

    const fetchQuizzes = async () => {
        try {
            const response = await api.get('/quiz');
            setQuizzes(response.data.quizzes || []);
            setLoading(false);
        } catch (error) {
            console.error('Failed to fetch quizzes:', error);
            setLoading(false);
        }
    };

    const filteredQuizzes = quizzes.filter(quiz => {
        if (filter === 'completed') return quiz.isCompleted;
        if (filter === 'incomplete') return !quiz.isCompleted;
        return true;
    });

    const getScoreColor = (score, total) => {
        const percentage = (score / total) * 100;
        if (percentage >= 80) return '#43e97b';
        if (percentage >= 60) return '#f5576c';
        return '#667eea';
    };

    if (loading) {
        return (
            <div className="quiz-history">
                <div className="skeleton" style={{ height: '200px', marginBottom: '1rem' }}></div>
                <div className="skeleton" style={{ height: '200px', marginBottom: '1rem' }}></div>
                <div className="skeleton" style={{ height: '200px' }}></div>
            </div>
        );
    }

    return (
        <div className="quiz-history fade-in">
            <div className="history-header">
                <h1>📚 Quiz History</h1>
                <div className="filter-buttons">
                    <button
                        className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
                        onClick={() => setFilter('all')}
                    >
                        All ({quizzes.length})
                    </button>
                    <button
                        className={`filter-btn ${filter === 'completed' ? 'active' : ''}`}
                        onClick={() => setFilter('completed')}
                    >
                        Completed ({quizzes.filter(q => q.isCompleted).length})
                    </button>
                    <button
                        className={`filter-btn ${filter === 'incomplete' ? 'active' : ''}`}
                        onClick={() => setFilter('incomplete')}
                    >
                        In Progress ({quizzes.filter(q => !q.isCompleted).length})
                    </button>
                </div>
            </div>

            {filteredQuizzes.length === 0 ? (
                <div className="empty-state">
                    <div className="empty-icon">📝</div>
                    <h3>No quizzes found</h3>
                    <p>Start generating quizzes to see your history here!</p>
                </div>
            ) : (
                <div className="quiz-grid">
                    {filteredQuizzes.map((quiz) => (
                        <div key={quiz._id} className="quiz-card card">
                            <div className="quiz-header">
                                <h3>{quiz.title}</h3>
                                <span className={`status-badge ${quiz.isCompleted ? 'completed' : 'pending'}`}>
                                    {quiz.isCompleted ? '✓ Completed' : '⏳ In Progress'}
                                </span>
                            </div>

                            <div className="quiz-meta">
                                <span className="topic-tag">{quiz.topic}</span>
                                <span className="difficulty-tag">{quiz.difficulty || 'medium'}</span>
                            </div>

                            <div className="quiz-stats">
                                <div className="stat">
                                    <span className="stat-label">Questions</span>
                                    <span className="stat-value">{quiz.totalQuestions}</span>
                                </div>
                                <div className="stat">
                                    <span className="stat-label">Score</span>
                                    <span
                                        className="stat-value"
                                        style={{ color: getScoreColor(quiz.score || 0, quiz.totalQuestions) }}
                                    >
                                        {quiz.score || 0}/{quiz.totalQuestions}
                                    </span>
                                </div>
                                <div className="stat">
                                    <span className="stat-label">Percentage</span>
                                    <span className="stat-value">
                                        {quiz.totalQuestions > 0
                                            ? Math.round((quiz.score || 0) / quiz.totalQuestions * 100)
                                            : 0}%
                                    </span>
                                </div>
                            </div>

                            <div className="quiz-date">
                                Created: {new Date(quiz.createdAt).toLocaleDateString()}
                            </div>

                            {quiz.isCompleted && quiz.score / quiz.totalQuestions >= 0.8 && (
                                <div className="achievement-badge">
                                    🏆 High Score!
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}

            {/* Summary Stats */}
            {quizzes.length > 0 && (
                <div className="summary-stats card mt-4">
                    <h3>📊 Overall Statistics</h3>
                    <div className="stats-grid">
                        <div className="summary-stat">
                            <div className="stat-number">{quizzes.length}</div>
                            <div className="stat-label">Total Quizzes</div>
                        </div>
                        <div className="summary-stat">
                            <div className="stat-number">
                                {quizzes.filter(q => q.isCompleted).length}
                            </div>
                            <div className="stat-label">Completed</div>
                        </div>
                        <div className="summary-stat">
                            <div className="stat-number">
                                {quizzes.length > 0
                                    ? Math.round(
                                        quizzes.reduce((sum, q) => sum + (q.score || 0), 0) /
                                        quizzes.reduce((sum, q) => sum + q.totalQuestions, 0) * 100
                                    )
                                    : 0}%
                            </div>
                            <div className="stat-label">Average Score</div>
                        </div>
                        <div className="summary-stat">
                            <div className="stat-number">
                                {quizzes.reduce((sum, q) => sum + q.totalQuestions, 0)}
                            </div>
                            <div className="stat-label">Total Questions</div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default QuizHistory;
