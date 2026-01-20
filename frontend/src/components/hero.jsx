import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { useTranslation } from "react-i18next";

const Hero = () => {
    const [ans, setAns] = useState('');
    const [text, setText] = useState('');
    const [imageUrl, setImageUrl] = useState("")
    const [isHovered, setIsHovered] = useState(false);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();
    const { t } = useTranslation();

    // Handle initial topic if passed from Roadmap or other components
    useEffect(() => {
        if (location.state?.initialTopic) {
            setText(location.state.initialTopic);
            // Trigger search automatically
            fetchExplanation(location.state.initialTopic);
        }
    }, [location.state]);

    const fetchExplanation = (topic) => {
        setLoading(true);
        axios.post('http://localhost:3005/img', { "prompt": topic }).then((res) => {
            setAns(res.data.data);
            setImageUrl(res.data.imgUrl)
        }).catch((err) => {
            console.log(err)
        }).finally(() => {
            setLoading(false);
        });
    };

    function handleClick() {
        if (!text) return;
        fetchExplanation(text);
    }

    const handleQuiz = () => {
        setLoading(true);
        axios.post('http://localhost:3005/quiz', { "prompt": text }).then(res => {
            if (res.data.quiz) {
                navigate('/quiz', { state: { questions: res.data.quiz, topic: text } });
            }
        }).catch(err => {
            console.error("Quiz Error:", err);
        }).finally(() => {
            setLoading(false);
        });
    }

    const handleFlashcards = () => {
        setLoading(true);
        axios.post('http://localhost:3005/flashcards', { "prompt": text }).then(res => {
            if (res.data.flashcards) {
                navigate('/flashcards', { state: { flashcards: res.data.flashcards, topic: text } });
            }
        }).catch(err => {
            console.error("Flashcards Error:", err);
        }).finally(() => {
            setLoading(false);
        });
    }

    const handleRoadmap = () => {
        if (!text) {
            alert("Please enter a learning goal first!");
            return;
        }

        setLoading(true);
        axios.post('http://localhost:3005/roadmap', { "prompt": text }).then(res => {
            console.log("Roadmap response:", res.data);
            if (res.data.milestones && res.data.milestones.length > 0) {
                navigate('/roadmap', { state: { roadmap: res.data, topic: text } });
            } else {
                alert("Failed to generate roadmap. Please try again.");
                console.error("Invalid roadmap structure:", res.data);
            }
        }).catch(err => {
            console.error("Roadmap Error:", err);
            alert("Error generating roadmap: " + (err.response?.data?.details || err.message));
        }).finally(() => {
            setLoading(false);
        });
    }

    const handleReadAloud = () => {
        if (!ans) return;
        const utterance = new SpeechSynthesisUtterance(ans);
        window.speechSynthesis.speak(utterance);
    }

    return (
        <div className="mx-14 mt-60 w-100%">
            <div className="ip-area flex w-100%">
                <span className="px-6 font-bold font-sans rounded-l-2xl bg-neutral-200 border-t-4 border-black border-l-4 border-b-2 border-r-2 flex items-center">
                    {t('hero.question')}
                </span>
                <input
                    type="text"
                    placeholder={t('hero.placeholder')}
                    value={text}
                    className="inp px-6 py-4 font-bold font-sans rounded-r-2xl border-t-2 border-black border-b-4 border-r-4 border-l-2 w-1/2"
                    onChange={(e) => {
                        setText(e.target.value);
                    }}
                />
                <button
                    className={`font-extrabold bg-black text-white border ml-7 py-5 px-10 rounded-2xl flex font-si hover:transition-all delay-200 ${loading ? 'opacity-50' : ''}`}
                    onClick={handleClick}
                    disabled={loading}
                    onMouseEnter={() => setIsHovered(true)}
                    onMouseLeave={() => setIsHovered(false)}
                >
                    {loading ? t('hero.processing') : t('hero.deep_dive')}
                    {isHovered && !loading && (
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6 ml-1">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 8.25 21 12m0 0-3.75 3.75M21 12H3" />
                        </svg>
                    )}
                    {!isHovered && !loading && (
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-8 h-6 ml-1">
                            <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
                        </svg>
                    )}
                </button>
            </div>
            <br />
            {ans && (
                <div className="bg-black text-white py-10 px-10 font-sans rounded-3xl shadow-2xl flex flex-col md:flex-row items-center gap-12 border border-white/5">
                    {imageUrl && <img src={imageUrl} alt="AI Representation" className="w-72 h-72 object-cover rounded-2xl border-4 border-white/10 shadow-lg" />}
                    <div className="flex-1">
                        <div className="flex justify-between items-start mb-4">
                            <h2 className="text-2xl font-black text-blue-400 uppercase tracking-tighter">{t('hero.insights')}</h2>
                            <button
                                onClick={handleReadAloud}
                                className="p-2 bg-white/10 hover:bg-white/20 rounded-full transition-colors"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                                </svg>
                            </button>
                        </div>
                        <p className="text-xl leading-relaxed text-gray-200">{ans}</p>
                        <div className="mt-10 flex flex-wrap gap-4">
                            <button
                                className="bg-white text-black font-black py-4 px-8 rounded-xl hover:bg-gray-200 transition-all flex items-center gap-2 shadow-lg"
                                onClick={handleQuiz}
                                disabled={loading}
                            >
                                {t('hero.practice_quiz')}
                            </button>
                            <button
                                className="bg-blue-600 text-white font-black py-4 px-8 rounded-xl hover:bg-blue-700 transition-all flex items-center gap-2 shadow-lg"
                                onClick={handleFlashcards}
                                disabled={loading}
                            >
                                {t('hero.study_flashcards')}
                            </button>
                            <button
                                className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-black py-4 px-8 rounded-xl hover:from-indigo-600 hover:to-purple-700 transition-all flex items-center gap-2 shadow-lg"
                                onClick={handleRoadmap}
                                disabled={loading}
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                                </svg>
                                {t('hero.generate_roadmap')}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Hero;