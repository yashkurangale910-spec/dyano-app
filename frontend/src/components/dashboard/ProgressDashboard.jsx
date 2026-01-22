import { useState, useEffect } from 'react';
import api from '../../config/api';
import './ProgressDashboard.css';

function ProgressDashboard() {
    const [progress, setProgress] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchProgress();
    }, []);

    const fetchProgress = async () => {
        try {
            const response = await api.get('/progress');
            setProgress(response.data.data);
            setLoading(false);
        } catch (error) {
            console.error('Failed to fetch progress:', error);
            setLoading(false);
        }
    };

    if (loading) {
        return <div className="progress-loading">Loading your progress...</div>;
    }

    if (!progress) {
        return <div className="progress-error">Failed to load progress</div>;
    }

    const { progress: userProgress, breakdown } = progress;

    return (
        <div className="progress-dashboard">
            <h1 className="progress-title">📊 Your Learning Journey</h1>

            {/* Streak Card */}
            <div className="streak-card">
                <div className="streak-icon">🔥</div>
                <div className="streak-info">
                    <h2>{userProgress.dailyStreak.count} Day Streak!</h2>
                    <p>Keep it going! Study every day to maintain your streak.</p>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="stats-grid">
                <div className="stat-card quiz-card">
                    <div className="stat-icon">🎯</div>
                    <div className="stat-content">
                        <h3>Quizzes</h3>
                        <div className="stat-number">{breakdown.quizzes.total}</div>
                        <p className="stat-detail">
                            {breakdown.quizzes.completed} completed
                        </p>
                        <p className="stat-detail">
                            Avg Score: {breakdown.quizzes.averageScore}%
                        </p>
                    </div>
                </div>

                <div className="stat-card flashcard-card">
                    <div className="stat-icon">📚</div>
                    <div className="stat-content">
                        <h3>Flashcards</h3>
                        <div className="stat-number">{breakdown.flashcards.totalCards}</div>
                        <p className="stat-detail">
                            {breakdown.flashcards.sets} sets created
                        </p>
                    </div>
                </div>

                <div className="stat-card roadmap-card">
                    <div className="stat-icon">🗺️</div>
                    <div className="stat-content">
                        <h3>Roadmaps</h3>
                        <div className="stat-number">{breakdown.roadmaps.total}</div>
                        <p className="stat-detail">
                            {breakdown.roadmaps.completed} completed
                        </p>
                    </div>
                </div>

                <div className="stat-card time-card">
                    <div className="stat-icon">⏱️</div>
                    <div className="stat-content">
                        <h3>Study Time</h3>
                        <div className="stat-number">
                            {Math.floor(userProgress.stats.studyTimeMinutes / 60)}h
                        </div>
                        <p className="stat-detail">
                            {userProgress.stats.studyTimeMinutes % 60}m total
                        </p>
                    </div>
                </div>
            </div>

            {/* Achievements */}
            <div className="achievements-section">
                <h2>🏆 Achievements</h2>
                <div className="achievements-grid">
                    {userProgress.achievements.slice(0, 6).map((achievement, index) => (
                        <div key={index} className="achievement-badge">
                            <div className="badge-icon">🎖️</div>
                            <div className="badge-name">{achievement.name}</div>
                        </div>
                    ))}
                    {userProgress.achievements.length === 0 && (
                        <p className="no-achievements">
                            Complete activities to unlock achievements!
                        </p>
                    )}
                </div>
            </div>

            {/* Progress Bar */}
            <div className="overall-progress">
                <h3>Overall Progress</h3>
                <div className="progress-bar-container">
                    <div
                        className="progress-bar-fill"
                        style={{
                            width: `${Math.min(
                                ((breakdown.quizzes.total + breakdown.flashcards.sets + breakdown.roadmaps.total) / 30) * 100,
                                100
                            )}%`
                        }}
                    ></div>
                </div>
                <p className="progress-text">
                    {breakdown.quizzes.total + breakdown.flashcards.sets + breakdown.roadmaps.total} / 30 activities completed
                </p>
            </div>
        </div>
    );
}

export default ProgressDashboard;
