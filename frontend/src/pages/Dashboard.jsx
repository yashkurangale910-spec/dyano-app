import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import LanguageSwitcher from '../components/common/LanguageSwitcher';
import './Dashboard.css';

function Dashboard() {
    const { t } = useTranslation();
    const { user, logout } = useAuth();
    const { isDark, toggleTheme } = useTheme();
    const [activeTab, setActiveTab] = useState('overview');

    const navItems = [
        { id: 'overview', label: t('nav.dashboard'), icon: '✨' },
        { id: 'quizzes', label: t('nav.quiz'), icon: '🎯' },
        { id: 'flashcards', label: t('nav.flashcards'), icon: '📚' },
        { id: 'roadmaps', label: t('nav.roadmap'), icon: '🗺️' },
        { id: 'documents', label: t('nav.pdf'), icon: '📄' },
    ];

    return (
        <div className={`dashboard-workspace ${isDark ? 'dark-theme' : 'light-theme'}`}>
            {/* Immersive Background */}
            <div className="workspace-bg">
                <div className="mesh-gradient"></div>
                <div className="floating-particles">
                    {[...Array(6)].map((_, i) => (
                        <div key={i} className={`particle p-${i}`}></div>
                    ))}
                </div>
            </div>

            {/* Sidebar Navigation */}
            <aside className="workspace-sidebar glass-morphism">
                <div className="sidebar-brand">
                    <div className="brand-icon">D</div>
                    <h1 className="brand-name">Dyano</h1>
                </div>

                <nav className="sidebar-nav">
                    {navItems.map((item) => (
                        <button
                            key={item.id}
                            className={`nav-item ${activeTab === item.id ? 'active' : ''}`}
                            onClick={() => setActiveTab(item.id)}
                        >
                            <span className="item-icon">{item.icon}</span>
                            <span className="item-label">{item.label}</span>
                            {activeTab === item.id && <span className="active-indicator"></span>}
                        </button>
                    ))}
                </nav>

                <div className="sidebar-footer">
                    <button className="user-profile glass-button">
                        <div className="avatar">{user?.name?.charAt(0) || 'U'}</div>
                        <div className="user-info">
                            <span className="user-name">{user?.name || 'User'}</span>
                            <span className="user-role">Student</span>
                        </div>
                    </button>
                    <button className="logout-action" onClick={logout} title="Logout">
                        🚪
                    </button>
                </div>
            </aside>

            {/* Main Workspace Area */}
            <main className="workspace-content">
                <header className="content-top">
                    <div className="breadcrumb">
                        <span className="bc-root">Workspace</span>
                        <span className="bc-divider">/</span>
                        <span className="bc-current">{activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}</span>
                    </div>

                    <div className="header-actions">
                        <LanguageSwitcher />
                        <button className="theme-toggle glass-button" onClick={toggleTheme}>
                            {isDark ? '☀️' : '🌙'}
                        </button>
                        <div className="notification-bell glass-button">🔔<span className="badge"></span></div>
                    </div>
                </header>

                <div className="workspace-view-container">
                    {activeTab === 'overview' && (
                        <div className="overview-view">
                            <section className="hero-greeting">
                                <h2 className="greeting-text">
                                    Good day, <span className="highlight">{user?.name || 'Explorer'}</span>.
                                </h2>
                                <p className="sub-text">What shall we master today?</p>
                            </section>

                            <div className="dashboard-grid">
                                {/* Primary Actions */}
                                <div className="primary-actions">
                                    <div className="action-card feature-glow quiz-glow">
                                        <div className="card-content">
                                            <span className="card-tag">Neural Assist</span>
                                            <h3>Generate Adaptive Quiz</h3>
                                            <p>Create a test based on your recent activity.</p>
                                        </div>
                                        <button className="action-button">Launch AI 🎯</button>
                                    </div>
                                    <div className="action-card feature-glow flash-glow">
                                        <div className="card-content">
                                            <span className="card-tag">Memory+</span>
                                            <h3>Active Recall Session</h3>
                                            <p>Review 15 cards due for repetition.</p>
                                        </div>
                                        <button className="action-button">Start Deck 📚</button>
                                    </div>
                                </div>

                                {/* Stats & Insights */}
                                <div className="insights-panel glass-morphism">
                                    <h3 className="panel-title">Your Progress</h3>
                                    <div className="stats-list">
                                        <div className="stat-item">
                                            <div className="stat-header">
                                                <span>Daily Goal</span>
                                                <span className="val">85%</span>
                                            </div>
                                            <div className="progress-track"><div className="progress-fill" style={{ width: '85%' }}></div></div>
                                        </div>
                                        <div className="stat-item">
                                            <div className="stat-header">
                                                <span>Active Streak</span>
                                                <span className="val">12 Days</span>
                                            </div>
                                            <div className="progress-track"><div className="progress-fill streak-gradient" style={{ width: '60%' }}></div></div>
                                        </div>
                                    </div>

                                    <div className="recent-activity">
                                        <h4>Recent Milestones</h4>
                                        <div className="activity-item">
                                            <div className="dot"></div>
                                            <div className="text">Mastered <b>Quantum Mechanics</b> Basics</div>
                                            <div className="time">2h ago</div>
                                        </div>
                                        <div className="activity-item">
                                            <div className="dot"></div>
                                            <div className="text">90% Score on <b>React Hooks</b> Quiz</div>
                                            <div className="time">Yesterday</div>
                                        </div>
                                    </div>
                                </div>

                                {/* Quick Tools */}
                                <div className="tools-strip">
                                    <div className="tool-box glass-morphism">
                                        <span className="icon">📄</span>
                                        <div className="info">
                                            <h4>PDF Lab</h4>
                                            <p>Drop file to scan</p>
                                        </div>
                                    </div>
                                    <div className="tool-box glass-morphism">
                                        <span className="icon">🗺️</span>
                                        <div className="info">
                                            <h4>Pathfinder</h4>
                                            <p>Plan new roadmap</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}

export default Dashboard;
