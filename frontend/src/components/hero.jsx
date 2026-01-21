import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { contentService, quizService, flashcardService, roadmapService } from '../services/apiService';
import { useToast } from './Toast';
import Loading from './Loading';

const Hero = () => {
    const [ans, setAns] = useState('');
    const [text, setText] = useState('');
    const [imageUrl, setImageUrl] = useState("")
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();
    const { t } = useTranslation();
    const toast = useToast();

    // Handle initial topic if passed from Roadmap or other components
    useEffect(() => {
        if (location.state?.initialTopic) {
            setText(location.state.initialTopic);
            fetchExplanation(location.state.initialTopic);
        }
    }, [location.state]);

    const fetchExplanation = async (topic) => {
        setLoading(true);
        try {
            const res = await contentService.generateExplanation(topic);
            setAns(res.data);
            setImageUrl(res.imgUrl);
            toast.success('Content generated successfully!');
        } catch (err) {
            toast.error(err.message || 'Failed to generate explanation');
        } finally {
            setLoading(false);
        }
    };

    function handleClick() {
        if (!text) {
            toast.warning('Please enter a topic first!');
            return;
        }
        fetchExplanation(text);
    }

    const handleQuiz = async () => {
        if (!text) {
            toast.warning('Please enter a topic first!');
            return;
        }
        setLoading(true);
        try {
            const res = await quizService.generateQuiz(text);
            if (res.quiz && res.quiz.length > 0) {
                navigate('/quiz', { state: { questions: res.quiz, topic: text } });
                toast.success('Quiz generated!');
            } else {
                toast.error('No quiz questions generated');
            }
        } catch (err) {
            toast.error(err.message || 'Failed to generate quiz');
        } finally {
            setLoading(false);
        }
    }

    const handleFlashcards = async () => {
        if (!text) {
            toast.warning('Please enter a topic first!');
            return;
        }
        setLoading(true);
        try {
            const res = await flashcardService.generateFlashcards(text);
            if (res.flashcards && res.flashcards.length > 0) {
                navigate('/flashcards', { state: { flashcards: res.flashcards, topic: text } });
                toast.success('Flashcards created!');
            } else {
                toast.error('No flashcards generated');
            }
        } catch (err) {
            toast.error(err.message || 'Failed to generate flashcards');
        } finally {
            setLoading(false);
        }
    }

    const handleRoadmap = async () => {
        if (!text) {
            toast.warning('Please enter a learning goal first!');
            return;
        }

        setLoading(true);
        try {
            const res = await roadmapService.generateRoadmap(text);
            if (res.milestones && res.milestones.length > 0) {
                navigate('/roadmap', { state: { roadmap: res, topic: text } });
                toast.success('Roadmap generated!');
            } else {
                toast.error('Failed to generate roadmap. Please try again.');
            }
        } catch (err) {
            toast.error(err.message || 'Error generating roadmap');
        } finally {
            setLoading(false);
        }
    }

    const handleReadAloud = () => {
        if (!ans) return;
        const utterance = new SpeechSynthesisUtterance(ans);
        window.speechSynthesis.speak(utterance);
    }

    return (
        <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-6xl mx-auto">
                {/* Hero Section */}
                <div className="text-center mb-12 animate-fade-in">
                    <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold mb-6 gradient-text text-shadow" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
                        {t('hero.question')}
                    </h1>
                    <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
                        Unlock knowledge with AI-powered learning. Enter any topic and let's explore together! 🚀
                    </p>
                </div>

                {/* Search Box */}
                <div className="glass-card p-8 mb-8 animate-slide-in">
                    <div className="flex flex-col sm:flex-row gap-4">
                        <div className="flex-1">
                            <input
                                type="text"
                                placeholder={t('hero.placeholder')}
                                value={text}
                                onChange={(e) => setText(e.target.value)}
                                onKeyPress={(e) => e.key === 'Enter' && handleClick()}
                                className="input-premium"
                                disabled={loading}
                            />
                        </div>
                        <button
                            className="btn btn-primary px-8 py-4 text-base"
                            onClick={handleClick}
                            disabled={loading}
                        >
                            {loading ? (
                                <>
                                    <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    {t('hero.processing')}
                                </>
                            ) : (
                                <>
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                    </svg>
                                    {t('hero.deep_dive')}
                                </>
                            )}
                        </button>
                    </div>
                </div>

                {/* Loading State */}
                {loading && !ans && (
                    <div className="glass-card p-12 text-center">
                        <Loading size="lg" text="AI is thinking..." />
                    </div>
                )}

                {/* Results */}
                {ans && (
                    <div className="glass-card-dark p-8 mb-8 animate-fade-in">
                        <div className="flex flex-col lg:flex-row gap-8">
                            {/* Image */}
                            {imageUrl && (
                                <div className="lg:w-1/3">
                                    <div className="relative group">
                                        <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl blur opacity-75 group-hover:opacity-100 transition duration-1000"></div>
                                        <img
                                            src={imageUrl}
                                            alt="AI Generated"
                                            className="relative rounded-2xl w-full h-auto object-cover shadow-2xl animate-float"
                                        />
                                    </div>
                                </div>
                            )}

                            {/* Content */}
                            <div className="flex-1">
                                <div className="flex justify-between items-start mb-6">
                                    <div>
                                        <span className="inline-block px-4 py-2 bg-white/10 rounded-full text-sm font-semibold text-white/80 mb-3">
                                            ✨ {t('hero.insights')}
                                        </span>
                                        <h2 className="text-3xl font-bold text-white mb-2" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
                                            {text}
                                        </h2>
                                    </div>
                                    <button
                                        onClick={handleReadAloud}
                                        className="p-3 bg-white/10 hover:bg-white/20 rounded-full transition-all hover-lift"
                                        title="Read Aloud"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                                        </svg>
                                    </button>
                                </div>

                                <p className="text-lg text-white/90 leading-relaxed mb-8">
                                    {ans}
                                </p>

                                {/* Action Buttons */}
                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                    <button
                                        className="btn btn-gradient-ocean"
                                        onClick={handleQuiz}
                                        disabled={loading}
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                        </svg>
                                        {t('hero.practice_quiz')}
                                    </button>

                                    <button
                                        className="btn btn-gradient-sunset"
                                        onClick={handleFlashcards}
                                        disabled={loading}
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                                        </svg>
                                        {t('hero.study_flashcards')}
                                    </button>

                                    <button
                                        className="btn btn-success"
                                        onClick={handleRoadmap}
                                        disabled={loading}
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                                        </svg>
                                        {t('hero.generate_roadmap')}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Features Grid */}
                {!ans && !loading && (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
                        <div className="glass-card p-6 hover-lift">
                            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center mb-4">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                </svg>
                            </div>
                            <h3 className="text-xl font-bold mb-2" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>AI-Powered</h3>
                            <p className="text-gray-600">Get instant explanations powered by advanced AI technology</p>
                        </div>

                        <div className="glass-card p-6 hover-lift">
                            <div className="w-12 h-12 bg-gradient-to-br from-pink-500 to-orange-600 rounded-xl flex items-center justify-center mb-4">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                                </svg>
                            </div>
                            <h3 className="text-xl font-bold mb-2" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>Interactive Learning</h3>
                            <p className="text-gray-600">Quizzes, flashcards, and roadmaps for effective learning</p>
                        </div>

                        <div className="glass-card p-6 hover-lift">
                            <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-teal-600 rounded-xl flex items-center justify-center mb-4">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 21v-4m0 0V5a2 2 0 012-2h6.5l1 1H21l-3 6 3 6h-8.5l-1-1H5a2 2 0 00-2 2zm9-13.5V9" />
                                </svg>
                            </div>
                            <h3 className="text-xl font-bold mb-2" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>Visual Content</h3>
                            <p className="text-gray-600">AI-generated images to enhance understanding</p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default Hero;