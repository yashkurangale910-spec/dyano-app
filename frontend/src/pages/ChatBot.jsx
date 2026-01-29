import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
import { useTranslation } from 'react-i18next';
import {
    Send, Sparkles, Image as ImageIcon, Loader2, Bot, User,
    Settings, MessageSquare, BookOpen, Calculator, PieChart,
    Upload, X, CheckCircle2, AlertCircle, ArrowRight, FileText, Code,
    Dna, Zap, Shield, Microscope, Mic, MicOff, Volume2, VolumeX, Globe
} from 'lucide-react';
import GlassCard from '../components/ui/GlassCard';
import ParticleButton from '../components/ui/ParticleButton';
import useTutor from '../hooks/useTutor';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3005';

const LANGUAGES = [
    { code: 'en', label: 'English', voice: 'Google US English', flag: '🇺🇸' },
    { code: 'es', label: 'Español', voice: 'Google español', flag: '🇪🇸' },
    { code: 'fr', label: 'Français', voice: 'Google français', flag: '🇫🇷' },
    { code: 'de', label: 'Deutsch', voice: 'Google Deutsch', flag: '🇩🇪' },
    { code: 'pt', label: 'Português', voice: 'Google português', flag: '🇵🇹' },
    { code: 'hi', label: 'हिन्दी', voice: 'Google हिन्दी', flag: '🇮🇳' },
    { code: 'mr', label: 'मराठी', voice: 'Google मराठी', flag: '🇮🇳' },
    { code: 'ja', label: '日本語', voice: 'Google 日本語', flag: '🇯🇵' },
    { code: 'ru', label: 'Русский', voice: 'Google русский', flag: '🇷🇺' },
    { code: 'zh', label: '中文', voice: 'Google 普通话（中国大陆）', flag: '🇨🇳' }
];

const PERSONALITIES = [
    { id: 'friendly', label: 'Friendly Guide', icon: '🌟', color: 'cosmic-cyan', desc: 'Encouraging, patient, and analogy-driven.' },
    { id: 'strict', label: 'Strict Coach', icon: '⚖️', color: 'cosmic-pink', desc: 'Direct, rigorous, and precision-focused.' },
    { id: 'socratic', label: 'Socratic Tutor', icon: '🤔', color: 'cosmic-purple', desc: 'Question-led discovery and critical thinking.' },
    { id: 'professional', label: 'Academic Pro', icon: '🎓', color: 'white', desc: 'Structured, formal, and theory-heavy.' }
];

const DEPTHS = [
    { id: 'brief', label: 'Brief', desc: '2-3 sentences max.' },
    { id: 'standard', label: 'Standard', desc: 'Core explanation + example.' },
    { id: 'detailed', label: 'Detailed', desc: 'Deep dive + misconceptions.' },
    { id: 'comprehensive', label: 'In-Depth', desc: 'Mastery-level analysis.' }
];

export default function SparkEAgent() {
    const { t, i18n } = useTranslation();
    const {
        status, sendMessage, gradeEssay, solveProblem, progress, fetchProgress
    } = useTutor();

    const [activeTab, setActiveTab] = useState('chat');
    const [messages, setMessages] = useState([
        {
            role: 'assistant',
            content: t('common.welcome'),
            timestamp: new Date()
        }
    ]);

    // Config States
    const [personality, setPersonality] = useState('friendly');
    const [depth, setDepth] = useState('standard');
    const [selectedFramework, setSelectedFramework] = useState('General');
    const [showConfig, setShowConfig] = useState(false);
    const [pdfList, setPdfList] = useState([]);
    const [selectedPdf, setSelectedPdf] = useState(null);

    // Input States
    const [input, setInput] = useState('');
    const [selectedImage, setSelectedImage] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [essayText, setEssayText] = useState('');
    const [problemText, setProblemText] = useState('');

    // Result States
    const [gradingResult, setGradingResult] = useState(null);
    const [solverResult, setSolverResult] = useState(null);
    const [sessionId, setSessionId] = useState(null);

    const messagesEndRef = useRef(null);
    const fileInputRef = useRef(null);

    // VOICE SYNC
    const [isVoiceActive, setIsVoiceActive] = useState(false);
    const [isSpeakEnabled, setIsSpeakEnabled] = useState(true);
    const {
        transcript,
        listening,
        resetTranscript,
        browserSupportsSpeechRecognition
    } = useSpeechRecognition();

    // Sync transcript to input
    useEffect(() => {
        if (transcript) setInput(transcript);
    }, [transcript]);

    const toggleVoice = () => {
        if (listening) {
            SpeechRecognition.stopListening();
            setIsVoiceActive(false);
        } else {
            resetTranscript();
            SpeechRecognition.startListening({ continuous: true, language: i18n.language });
            setIsVoiceActive(true);
        }
    };

    const speak = (text) => {
        if (!isSpeakEnabled || !window.speechSynthesis) return;
        window.speechSynthesis.cancel();

        const utterance = new SpeechSynthesisUtterance(text);

        // Language matching logic
        const langConfig = LANGUAGES.find(l => l.code === i18n.language);
        if (langConfig) {
            utterance.lang = langConfig.code;
            const voices = window.speechSynthesis.getVoices();
            const preferredVoice = voices.find(v => v.name.includes(langConfig.voice));
            if (preferredVoice) utterance.voice = preferredVoice;
        }

        utterance.rate = 0.9;
        utterance.pitch = 1.1;
        window.speechSynthesis.speak(utterance);
    };

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        if (activeTab === 'chat') scrollToBottom();
    }, [messages, activeTab]);

    useEffect(() => {
        fetchProgress();
        fetchPdfs();
    }, [fetchProgress]);

    const fetchPdfs = async () => {
        try {
            const user = JSON.parse(localStorage.getItem('dyano_user') || '{}');
            const response = await axios.get(`${API_URL}/pdf/list`, {
                headers: { Authorization: `Bearer ${user.token}` }
            });
            if (response.data.success) {
                setPdfList(response.data.documents);
            }
        } catch (error) {
            console.error("Failed to fetch PDFs for tutor:", error);
        }
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setSelectedImage(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const clearImage = () => {
        setSelectedImage(null);
        setImagePreview(null);
    };

    const handleChatSubmit = async (e) => {
        e.preventDefault();
        if ((!input.trim() && !selectedImage) || status === 'loading') return;

        const userMessage = {
            role: 'user',
            content: input.trim() || "Analyze this image",
            hasImage: !!selectedImage,
            imageUrl: imagePreview,
            timestamp: new Date()
        };

        setMessages(prev => [...prev, userMessage]);
        const currentInput = input;
        const currentImage = selectedImage;

        setInput('');
        clearImage();

        // Stop listening on send
        if (listening) {
            SpeechRecognition.stopListening();
            setIsVoiceActive(false);
        }

        try {
            const result = await sendMessage({
                message: currentInput || "Analyze this image",
                image: currentImage,
                personality,
                depth,
                sessionId,
                documentId: selectedPdf?._id,
                language: i18n.language,
                framework: selectedFramework
            });

            if (result.success) {
                setMessages(prev => [...prev, {
                    role: 'assistant',
                    content: result.response,
                    timestamp: new Date()
                }]);
                if (result.sessionId) setSessionId(result.sessionId);
                fetchProgress();

                // Voice out
                speak(result.response);
            }
        } catch (error) {
            setMessages(prev => [...prev, {
                role: 'assistant',
                content: "Neural sync disrupted. Please verify connection to the Dyson swarm.",
                isError: true,
                timestamp: new Date()
            }]);
        }
    };

    const handleEssaySubmit = async () => {
        if (!essayText.trim() || status === 'loading') return;
        try {
            const result = await gradeEssay(essayText, null, i18n.language, selectedFramework);
            setGradingResult(result);
            fetchProgress();
        } catch (error) {
            console.error(error);
        }
    };

    const handleSolverSubmit = async () => {
        if (!problemText.trim() || status === 'loading') return;
        try {
            const result = await solveProblem(problemText, null, i18n.language, selectedFramework);
            setSolverResult(result);
            fetchProgress();
        } catch (error) {
            console.error(error);
        }
    };

    const clearChat = () => {
        setMessages([{
            role: 'assistant',
            content: "Memory buffer cleared. Spark.E initial state resumed.",
            timestamp: new Date()
        }]);
        setSessionId(null);
    };

    return (
        <div className="container-cosmic py-12 min-h-[95vh] flex flex-col">
            {/* Top Toolbar */}
            <header className="mb-10 flex flex-col md:flex-row md:items-center justify-between gap-8">
                <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
                    <div className="flex items-center gap-5 mb-3">
                        <div className="relative">
                            <div className="p-4 bg-cosmic-cyan/10 rounded-2xl border border-cosmic-cyan/20">
                                <Dna className="w-8 h-8 text-cosmic-cyan animate-pulse" />
                            </div>
                            <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-black animate-pulse" />
                        </div>
                        <div>
                            <h1 className="text-4xl font-display font-bold text-gradient-glow uppercase tracking-tighter">
                                {t('common.title')}
                            </h1>
                            <div className="flex items-center gap-3 mt-1">
                                <span className="text-[9px] uppercase font-bold tracking-[0.3em] text-gray-500">v3.0 // RAG-Core Intelligence</span>
                                <div className="h-1 bg-white/10 w-24 rounded-full overflow-hidden">
                                    <div className="h-full bg-cosmic-cyan w-full shadow-[0_0_10px_rgba(34,211,238,0.5)]" />
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.div>

                {progress && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="flex gap-8 px-8 py-5 glass border border-white/5 rounded-[2.5rem]"
                    >
                        <div className="flex items-center gap-4">
                            <Zap className="text-cosmic-pink w-5 h-5" />
                            <div className="text-center">
                                <div className="text-[9px] uppercase tracking-widest text-gray-600 font-bold mb-1">Knowledge Nodes</div>
                                <div className="text-2xl font-display font-bold text-white">{progress.totalSessions}</div>
                            </div>
                        </div>
                        <div className="w-[1px] h-10 bg-white/5" />
                        <div className="flex items-center gap-4">
                            <Shield className="text-cosmic-cyan w-5 h-5" />
                            <div className="text-center">
                                <div className="text-[9px] uppercase tracking-widest text-gray-600 font-bold mb-1">{t('tutor.mastery')}</div>
                                <div className="text-2xl font-display font-bold text-cosmic-cyan">{progress.averageEssayScore || 0}%</div>
                            </div>
                        </div>
                    </motion.div>
                )}
            </header>

            <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-10">
                {/* Lateral Control Bar */}
                <div className="lg:col-span-1 flex flex-col gap-4">
                    {[
                        { id: 'chat', label: t('tutor.tabs.chat'), icon: MessageSquare, color: 'cyan' },
                        { id: 'essay', label: t('tutor.tabs.essay'), icon: BookOpen, color: 'pink' },
                        { id: 'solver', label: t('tutor.tabs.solver'), icon: Calculator, color: 'purple' }
                    ].map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`group relative w-16 h-16 rounded-2xl flex items-center justify-center transition-all duration-500 ${activeTab === tab.id
                                ? `bg-cosmic-${tab.color}/20 text-cosmic-${tab.color} border border-cosmic-${tab.color}/30 shadow-[0_0_30px_rgba(0,0,0,0.3)]`
                                : 'bg-white/5 text-gray-500 hover:text-gray-300 border border-transparent'
                                }`}
                        >
                            <tab.icon size={24} strokeWidth={activeTab === tab.id ? 2 : 1.5} />
                            <div className="hidden group-hover:block absolute left-20 bg-black/80 text-white text-[10px] py-2 px-4 rounded-lg whitespace-nowrap z-50 uppercase font-bold tracking-widest border border-white/10">
                                {tab.label}
                            </div>
                        </button>
                    ))}
                    <div className="mt-auto flex flex-col gap-4">
                        <button
                            onClick={() => setShowConfig(true)}
                            className={`w-16 h-16 rounded-2xl flex items-center justify-center transition-all bg-white/5 text-gray-500 hover:text-cosmic-cyan hover:bg-cosmic-cyan/10 border border-transparent hover:border-cosmic-cyan/20`}
                        >
                            <Settings size={24} strokeWidth={1.5} />
                        </button>
                        <button
                            onClick={clearChat}
                            className={`w-16 h-16 rounded-2xl flex items-center justify-center transition-all bg-white/5 text-gray-500 hover:text-red-400 hover:bg-red-400/10 border border-transparent hover:border-red-400/20`}
                        >
                            <X size={24} strokeWidth={1.5} />
                        </button>
                    </div>
                </div>

                {/* Main Viewport */}
                <div className="lg:col-span-8 flex flex-col">
                    <GlassCard className="flex-1 flex flex-col p-10 overflow-hidden relative shadow-2xl" glow glowColor={personality === 'friendly' ? 'cyan' : personality === 'strict' ? 'pink' : 'purple'}>
                        <AnimatePresence mode="wait">
                            {/* CHAT TAB */}
                            {activeTab === 'chat' && (
                                <motion.div key="chat" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex-1 flex flex-col">
                                    <div className="flex-1 overflow-y-auto space-y-10 pr-4 custom-scrollbar mb-8">
                                        {messages.map((msg, idx) => (
                                            <div key={idx} className={`flex gap-6 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                                                <div className={`w-12 h-12 rounded-[1.25rem] flex items-center justify-center shrink-0 shadow-lg ${msg.role === 'user' ? 'bg-cosmic-pink/10 text-cosmic-pink border border-cosmic-pink/20' : 'bg-cosmic-cyan/10 text-cosmic-cyan border border-cosmic-cyan/20'
                                                    }`}>
                                                    {msg.role === 'user' ? <User size={24} /> : <Bot size={24} />}
                                                </div>
                                                <div className={`max-w-[85%] ${msg.role === 'user' ? 'text-right' : ''}`}>
                                                    <div className={`p-8 rounded-[2rem] text-sm leading-relaxed shadow-xl ${msg.role === 'user'
                                                        ? 'bg-cosmic-pink/5 border border-cosmic-pink/10 rounded-tr-none text-gray-200'
                                                        : 'bg-white/[0.03] border border-white/5 rounded-tl-none text-gray-100'
                                                        }`}>
                                                        {msg.imageUrl && (
                                                            <div className="mb-6 rounded-2xl overflow-hidden border border-white/10 max-w-sm ml-auto shadow-2xl">
                                                                <img src={msg.imageUrl} alt="Uploaded" className="w-full" />
                                                            </div>
                                                        )}
                                                        <div className="markdown-content">
                                                            {msg.content.split('\n').map((line, i) => (
                                                                <p key={i} className={line.startsWith('#') ? 'text-cosmic-cyan font-bold uppercase tracking-widest mt-4 mb-2' : 'mb-3'}>
                                                                    {line}
                                                                </p>
                                                            ))}
                                                        </div>
                                                    </div>
                                                    <div className="mt-3 text-[10px] uppercase tracking-widest text-gray-600 font-bold px-4">
                                                        {new Date(msg.timestamp).toLocaleTimeString()} // ID: {idx.toString().padStart(3, '0')}
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                        {status === 'loading' && (
                                            <div className="flex gap-6">
                                                <div className="w-12 h-12 rounded-[1.25rem] bg-cosmic-cyan/10 text-cosmic-cyan flex items-center justify-center border border-cosmic-cyan/20">
                                                    <Loader2 size={24} className="animate-spin" />
                                                </div>
                                                <div className="flex items-center gap-4 glass border border-white/5 px-8 py-5 rounded-[2rem] rounded-tl-none">
                                                    <span className="flex gap-1">
                                                        <span className="w-1.5 h-1.5 bg-cosmic-cyan rounded-full animate-bounce [animation-delay:-0.3s]" />
                                                        <span className="w-1.5 h-1.5 bg-cosmic-cyan rounded-full animate-bounce [animation-delay:-0.15s]" />
                                                        <span className="w-1.5 h-1.5 bg-cosmic-cyan rounded-full animate-bounce" />
                                                    </span>
                                                    <span className="text-[10px] uppercase font-bold tracking-[0.4em] text-cosmic-cyan">{t('tutor.processing')}</span>
                                                </div>
                                            </div>
                                        )}
                                        <div ref={messagesEndRef} />
                                    </div>

                                    {/* Chat Input */}
                                    <div className="pt-6 border-t border-white/5">
                                        {selectedPdf && (
                                            <div className="flex items-center gap-3 mb-4 px-4 py-2 bg-cosmic-cyan/10 border border-cosmic-cyan/20 rounded-xl w-fit">
                                                <FileText size={14} className="text-cosmic-cyan" />
                                                <span className="text-[10px] font-bold text-cosmic-cyan uppercase tracking-wider">{t('tutor.source')}: {selectedPdf.fileName}</span>
                                                <button onClick={() => setSelectedPdf(null)} className="text-gray-500 hover:text-white"><X size={12} /></button>
                                            </div>
                                        )}
                                        <div className="relative">
                                            {imagePreview && (
                                                <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="absolute bottom-full left-0 mb-6 p-4 glass border border-cosmic-cyan/30 rounded-3xl flex items-center gap-5 z-20 shadow-2xl">
                                                    <img src={imagePreview} alt="Preview" className="w-16 h-16 object-cover rounded-xl shadow-lg" />
                                                    <div>
                                                        <div className="text-[11px] uppercase tracking-wider text-cosmic-cyan font-bold">{t('tutor.scan_active')}</div>
                                                        <div className="text-[9px] text-gray-500 mt-1 uppercase font-bold">{t('tutor.image_ready')}</div>
                                                    </div>
                                                    <button onClick={clearImage} className="p-2 hover:bg-white/10 rounded-xl text-gray-500"><X size={18} /></button>
                                                </motion.div>
                                            )}
                                            <form onSubmit={handleChatSubmit} className="flex gap-6">
                                                <div className="flex-1 relative group">
                                                    <input
                                                        type="text"
                                                        value={input}
                                                        onChange={(e) => setInput(e.target.value)}
                                                        placeholder={t('common.placeholder')}
                                                        className="w-full bg-white/[0.03] border border-white/10 rounded-[1.5rem] px-8 py-6 text-white placeholder:text-gray-700 focus:outline-none focus:border-cosmic-cyan/40 focus:bg-white/[0.06] transition-all pr-40 text-sm shadow-inner"
                                                    />
                                                    <div className="absolute right-6 top-1/2 -translate-y-1/2 flex items-center gap-5 text-gray-600">
                                                        <button
                                                            type="button"
                                                            onClick={toggleVoice}
                                                            className={`${listening ? 'text-cosmic-cyan animate-pulse shadow-[0_0_15px_rgba(34,211,238,0.5)]' : 'hover:text-cosmic-cyan'} transition-all transform hover:scale-110 active:scale-95 p-1 rounded-full`}
                                                            title={listening ? t('common.stop_listen') : t('common.listen')}
                                                        >
                                                            {listening ? <Mic size={22} strokeWidth={2} /> : <MicOff size={22} strokeWidth={1.5} />}
                                                        </button>
                                                        <button
                                                            type="button"
                                                            onClick={() => {
                                                                if (isSpeakEnabled) {
                                                                    window.speechSynthesis.cancel();
                                                                }
                                                                setIsSpeakEnabled(!isSpeakEnabled);
                                                            }}
                                                            className={`${isSpeakEnabled ? 'text-cosmic-purple' : 'text-gray-700'} hover:text-cosmic-cyan transition-all transform hover:scale-110 active:scale-95`}
                                                            title={isSpeakEnabled ? t('common.mute') : t('common.unmute')}
                                                        >
                                                            {isSpeakEnabled ? <Volume2 size={22} strokeWidth={1.5} /> : <VolumeX size={22} strokeWidth={1.5} />}
                                                        </button>
                                                        <button type="button" onClick={() => fileInputRef.current?.click()} className="hover:text-cosmic-cyan transition-colors transform hover:scale-110 active:scale-95">
                                                            <ImageIcon size={22} strokeWidth={1.5} />
                                                        </button>
                                                        <button type="button" onClick={() => setShowConfig(true)} className="hover:text-cosmic-cyan transition-colors transform hover:scale-110 active:scale-95">
                                                            <Microscope size={22} strokeWidth={1.5} />
                                                        </button>
                                                    </div>
                                                    <input type="file" ref={fileInputRef} onChange={handleImageChange} accept="image/*" className="hidden" />
                                                </div>
                                                <ParticleButton type="submit" disabled={status === 'loading'} className="px-10 py-6 rounded-2xl flex items-center justify-center min-w-[100px] shadow-2xl">
                                                    {status === 'loading' ? <Loader2 className="animate-spin" /> : <Send size={24} />}
                                                </ParticleButton>
                                            </form>
                                        </div>
                                    </div>
                                </motion.div>
                            )}

                            {/* ESSAY / SOLVER TABS MAINTAINED WITH IMPROVED STYLING */}
                            {activeTab === 'essay' && (
                                <motion.div key="essay" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="flex-1 flex flex-col gap-10">
                                    {!gradingResult ? (
                                        <div className="flex-1 flex flex-col gap-8">
                                            <div className="flex justify-between items-end px-4">
                                                <div>
                                                    <h3 className="text-2xl font-display font-bold text-white uppercase tracking-tight">Academic Essay Scan</h3>
                                                    <p className="text-xs text-gray-500 mt-1 uppercase tracking-widest font-bold">Rubric-based neural evaluation</p>
                                                </div>
                                                <span className="text-[10px] text-gray-600 font-bold uppercase tracking-widest">{essayText.length} CNS CHARS</span>
                                            </div>
                                            <textarea
                                                value={essayText}
                                                onChange={(e) => setEssayText(e.target.value)}
                                                placeholder="Paste your thesis or essay here for a multi-category structural analysis..."
                                                className="flex-1 bg-white/[0.03] border border-white/10 rounded-[2rem] p-10 text-gray-200 placeholder:text-gray-800 focus:outline-none focus:border-cosmic-pink/30 transition-all resize-none text-sm leading-8 shadow-inner font-light"
                                            />
                                            <ParticleButton onClick={handleEssaySubmit} disabled={!essayText || status === 'loading'} className="w-full py-8 rounded-[1.5rem] text-[11px] uppercase tracking-[0.5em] font-bold shadow-2xl">
                                                {status === 'loading' ? 'Synthesizing Grade Matrix...' : 'Initiate Neural Grading'}
                                            </ParticleButton>
                                        </div>
                                    ) : (
                                        <div className="flex-1 overflow-y-auto space-y-12 pr-4 custom-scrollbar">
                                            <div className="flex justify-between items-start bg-white/[0.02] p-10 rounded-[2.5rem] border border-white/5">
                                                <div className="space-y-4">
                                                    <button onClick={() => setGradingResult(null)} className="text-cosmic-cyan text-[10px] uppercase font-bold tracking-[0.3em] flex items-center gap-2 hover:opacity-70 transition-opacity">
                                                        <ArrowRight className="rotate-180" size={14} /> {t('tutor.new_analysis')}
                                                    </button>
                                                    <div className="space-y-1">
                                                        <div className="text-[10px] uppercase tracking-widest text-gray-500 font-bold">{t('tutor.cognitive_perf')}</div>
                                                        <div className="text-4xl font-display font-bold text-gradient-glow uppercase">{t('tutor.grade')}: {gradingResult.grade}</div>
                                                    </div>
                                                </div>
                                                <div className="text-right">
                                                    <div className="text-6xl font-display font-bold text-white mb-2">{gradingResult.score}<span className="text-lg text-gray-600 font-normal">/100</span></div>
                                                    <div className="text-[10px] text-gray-500 uppercase font-bold tracking-[0.2em]">{t('tutor.compliance')}</div>
                                                </div>
                                            </div>

                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                                <section className="space-y-6">
                                                    <h4 className="text-[11px] uppercase tracking-[0.4em] text-cosmic-cyan font-bold px-4 flex items-center gap-3">
                                                        <CheckCircle2 size={16} /> {t('tutor.merits')}
                                                    </h4>
                                                    <div className="space-y-4">
                                                        {gradingResult.strengths.map((s, i) => (
                                                            <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1 }} key={i} className="p-6 glass rounded-2xl border-l-[4px] border-l-green-500/50 bg-green-500/[0.02] text-xs text-gray-400 font-light leading-relaxed">
                                                                {s}
                                                            </motion.div>
                                                        ))}
                                                    </div>
                                                </section>
                                                <section className="space-y-6">
                                                    <h4 className="text-[11px] uppercase tracking-[0.4em] text-cosmic-pink font-bold px-4 flex items-center gap-3">
                                                        <AlertCircle size={16} /> {t('tutor.errors')}
                                                    </h4>
                                                    <div className="space-y-4">
                                                        {gradingResult.weaknesses.map((w, i) => (
                                                            <motion.div initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1 }} key={i} className="p-6 glass rounded-2xl border-l-[4px] border-l-red-500/50 bg-red-500/[0.02] text-xs text-gray-400 font-light leading-relaxed">
                                                                {w}
                                                            </motion.div>
                                                        ))}
                                                    </div>
                                                </section>
                                            </div>
                                        </div>
                                    )}
                                </motion.div>
                            )}

                            {activeTab === 'solver' && (
                                <motion.div key="solver" initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} className="flex-1 flex flex-col gap-10 justify-center">
                                    {!solverResult ? (
                                        <div className="max-w-3xl mx-auto w-full space-y-10 text-center">
                                            <div className="relative inline-block">
                                                <div className="w-24 h-24 bg-cosmic-purple/10 rounded-[2rem] flex items-center justify-center border border-cosmic-purple/20 mx-auto">
                                                    <Calculator size={48} className="text-cosmic-purple animate-pulse" />
                                                </div>
                                                <div className="absolute -bottom-2 -right-2 bg-cosmic-cyan p-2 rounded-xl shadow-lg border border-white/20">
                                                    <Zap size={16} className="text-black" />
                                                </div>
                                            </div>
                                            <div className="space-y-4">
                                                <h3 className="text-4xl font-display font-bold text-white tracking-tighter">Quantum Logic Engine</h3>
                                                <p className="text-gray-500 font-light text-lg">Input any complex problem for a step-by-step neural derivation.</p>
                                            </div>
                                            <textarea
                                                value={problemText}
                                                onChange={(e) => setProblemText(e.target.value)}
                                                placeholder="Example: How does the Schwarzschild radius relate to stellar mass?"
                                                className="w-full h-48 bg-white/[0.03] border border-white/10 rounded-[2.5rem] p-10 text-white placeholder:text-gray-800 focus:outline-none focus:border-cosmic-purple/40 transition-all resize-none text-base shadow-inner font-mono leading-loose"
                                            />
                                            <ParticleButton onClick={handleSolverSubmit} disabled={!problemText || status === 'loading'} className="w-full py-8 rounded-[1.5rem] text-[11px] uppercase tracking-[0.6em] font-bold">
                                                {status === 'loading' ? 'Computing Logical Synapses...' : 'Initiate Derivation'}
                                            </ParticleButton>
                                        </div>
                                    ) : (
                                        <div className="flex-1 overflow-y-auto space-y-12 pr-4 custom-scrollbar">
                                            <div className="flex justify-between items-center bg-white/[0.03] p-10 rounded-[2.5rem] border border-white/10 shadow-inner">
                                                <div>
                                                    <div className="text-[10px] uppercase font-bold tracking-[0.4em] text-cosmic-purple mb-3">{t('tutor.conclusion')}</div>
                                                    <div className="text-3xl font-mono text-white tracking-tighter border-l-4 border-cosmic-purple pl-6 py-2">{solverResult.finalAnswer}</div>
                                                </div>
                                                <button onClick={() => setSolverResult(null)} className="p-4 bg-white/5 hover:bg-white/10 rounded-2xl transition-all text-gray-500 hover:text-white">
                                                    <X size={28} />
                                                </button>
                                            </div>
                                            <div className="space-y-8">
                                                {solverResult.steps.map((step, i) => (
                                                    <div key={i} className="relative pl-16 group">
                                                        <div className="absolute left-6 top-16 bottom-0 w-[1px] bg-white/5 group-last:hidden" />
                                                        <div className="absolute left-0 top-0 w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-xs font-mono font-bold text-gray-600 transition-all group-hover:bg-cosmic-purple/20 group-hover:text-cosmic-purple group-hover:border-cosmic-purple/30 group-hover:scale-110">
                                                            P{step.stepNumber}
                                                        </div>
                                                        <div className="glass p-10 rounded-[2rem] border border-white/5 group-hover:border-white/10 transition-all shadow-xl">
                                                            <h5 className="text-[11px] font-bold text-white mb-4 uppercase tracking-[0.4em]">{step.title}</h5>
                                                            <p className="text-sm text-gray-500 font-light leading-relaxed mb-8">{step.explanation}</p>
                                                            <div className="bg-black/40 p-10 rounded-2xl font-mono text-sm text-cosmic-cyan border border-white/5 overflow-x-auto shadow-inner leading-8">
                                                                {step.work}
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {/* CONFIG OVERLAY (UPGRADED) */}
                        <AnimatePresence>
                            {showConfig && (
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.95 }}
                                    className="absolute inset-0 bg-black/80 backdrop-blur-2xl z-50 p-12 overflow-y-auto custom-scrollbar"
                                >
                                    <div className="max-w-4xl mx-auto space-y-12">
                                        <div className="flex justify-between items-center pb-8 border-b border-white/10">
                                            <div>
                                                <h3 className="text-3xl font-display font-bold text-white uppercase tracking-tighter">Spark.E Core Configuration</h3>
                                                <p className="text-[10px] text-gray-500 uppercase tracking-widest font-bold mt-2">Adjust neural weights and knowledge grounding</p>
                                            </div>
                                            <button onClick={() => setShowConfig(false)} className="p-3 bg-white/5 rounded-2xl text-gray-500 hover:text-white transition-all"><X size={28} /></button>
                                        </div>

                                        {/* KNOWLEDGE SELECTION (RAG) */}
                                        <section className="space-y-6">
                                            <div className="flex items-center gap-3">
                                                <FileText className="text-cosmic-cyan" size={20} />
                                                <label className="text-[11px] uppercase tracking-[0.4em] font-bold text-cosmic-cyan">Neural Grounding (Course Materials)</label>
                                            </div>
                                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                                {pdfList.map(pdf => (
                                                    <button
                                                        key={pdf._id}
                                                        onClick={() => setSelectedPdf(selectedPdf?._id === pdf._id ? null : pdf)}
                                                        className={`p-5 rounded-2xl border text-left transition-all group ${selectedPdf?._id === pdf._id
                                                            ? 'border-cosmic-cyan bg-cosmic-cyan/10 ring-2 ring-cosmic-cyan/20'
                                                            : 'border-white/5 bg-white/5 hover:bg-white/[0.08]'
                                                            }`}
                                                    >
                                                        <FileText size={18} className={`mb-3 ${selectedPdf?._id === pdf._id ? 'text-cosmic-cyan' : 'text-gray-600'}`} />
                                                        <div className={`text-[11px] font-bold truncate ${selectedPdf?._id === pdf._id ? 'text-white' : 'text-gray-500'}`}>{pdf.fileName}</div>
                                                        <div className="text-[9px] uppercase tracking-widest text-gray-700 font-bold mt-1">{(pdf.fileSize / 1024 / 1024).toFixed(2)} MB // Index Ready</div>
                                                    </button>
                                                ))}
                                                {pdfList.length === 0 && (
                                                    <div className="col-span-full py-10 border border-dashed border-white/10 rounded-2xl text-center">
                                                        <div className="text-[10px] uppercase tracking-[0.3em] text-gray-600 font-bold">No course materials uploaded yet. Visit PDF Lab.</div>
                                                    </div>
                                                )}
                                            </div>
                                        </section>

                                        {/* LANGUAGE SELECTION */}
                                        <section className="space-y-6">
                                            <div className="flex items-center gap-3">
                                                <Globe className="text-cosmic-cyan" size={20} />
                                                <label className="text-[11px] uppercase tracking-[0.4em] font-bold text-cosmic-cyan">Communication Protocol</label>
                                            </div>
                                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                                {LANGUAGES.map(lang => (
                                                    <button
                                                        key={lang.code}
                                                        onClick={() => i18n.changeLanguage(lang.code)}
                                                        className={`p-4 rounded-2xl border text-center transition-all group ${i18n.language === lang.code
                                                            ? 'border-cosmic-cyan bg-cosmic-cyan/10 ring-2 ring-cosmic-cyan/20'
                                                            : 'border-white/5 bg-white/5 hover:bg-white/[0.08]'
                                                            }`}
                                                    >
                                                        <div className="text-2xl mb-2">{lang.flag}</div>
                                                        <div className={`text-[11px] font-bold ${i18n.language === lang.code ? 'text-white' : 'text-gray-500'}`}>{lang.label}</div>
                                                    </button>
                                                ))}
                                            </div>
                                        </section>

                                        {/* FRAMEWORK SELECTION */}
                                        <section className="space-y-6">
                                            <div className="flex items-center gap-3">
                                                <Code className="text-cosmic-cyan" size={20} />
                                                <label className="text-[11px] uppercase tracking-[0.4em] font-bold text-cosmic-cyan">
                                                    {t('tutor.config.framework_label') || "Framework Specialization"}
                                                </label>
                                            </div>
                                            <p className="text-[10px] text-gray-500 uppercase tracking-widest font-bold -mt-2">
                                                {t('tutor.config.framework_hint') || "Tailors neural responses to specific ecosystems"}
                                            </p>
                                            <div className="flex flex-wrap gap-2">
                                                {['General', 'React', 'Vue', 'Next.js', 'Node.js', 'Flutter', 'Django', 'Spring Boot'].map(tech => (
                                                    <button
                                                        key={tech}
                                                        onClick={() => setSelectedFramework(tech)}
                                                        className={`px-6 py-3 rounded-xl border text-[11px] font-bold uppercase tracking-widest transition-all ${selectedFramework === tech
                                                            ? 'bg-cosmic-cyan text-black border-cosmic-cyan shadow-lg shadow-cosmic-cyan/20'
                                                            : 'bg-white/5 text-gray-500 border-white/5 hover:bg-white/10'
                                                            }`}
                                                    >
                                                        {tech}
                                                    </button>
                                                ))}
                                            </div>
                                        </section>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                                            {/* PERSONALITIES */}
                                            <section className="space-y-8">
                                                <label className="text-[11px] uppercase tracking-[0.4em] font-bold text-gray-500">Synapse Personality</label>
                                                <div className="grid grid-cols-1 gap-4">
                                                    {PERSONALITIES.map(pers => (
                                                        <button
                                                            key={pers.id}
                                                            onClick={() => setPersonality(pers.id)}
                                                            className={`p-6 rounded-2xl border text-left flex items-start gap-6 transition-all ${personality === pers.id
                                                                ? `border-${pers.color} bg-${pers.color}/10 shadow-lg`
                                                                : 'border-white/5 bg-white/5 text-gray-500 grayscale opacity-40 hover:opacity-70 hover:grayscale-0'
                                                                }`}
                                                        >
                                                            <span className="text-3xl bg-white/5 p-4 rounded-xl">{pers.icon}</span>
                                                            <div>
                                                                <span className={`text-[11px] uppercase font-bold tracking-widest block mb-2 ${personality === pers.id ? 'text-white' : ''}`}>
                                                                    {pers.label}
                                                                </span>
                                                                <p className="text-[10px] font-light leading-relaxed">{pers.desc}</p>
                                                            </div>
                                                        </button>
                                                    ))}
                                                </div>
                                            </section>

                                            {/* DEPTHS */}
                                            <section className="space-y-8">
                                                <label className="text-[11px] uppercase tracking-[0.4em] font-bold text-gray-500">Knowledge Depth Buffer</label>
                                                <div className="grid grid-cols-1 gap-4">
                                                    {DEPTHS.map(d => (
                                                        <button
                                                            key={d.id}
                                                            onClick={() => setDepth(d.id)}
                                                            className={`p-6 rounded-2xl border text-left flex items-center justify-between transition-all ${depth === d.id
                                                                ? 'border-cosmic-pink bg-cosmic-pink/10 shadow-lg'
                                                                : 'border-white/5 bg-white/5 text-gray-500 opacity-40 hover:opacity-70'
                                                                }`}
                                                        >
                                                            <div>
                                                                <span className={`text-[11px] uppercase font-bold tracking-widest block mb-1 ${depth === d.id ? 'text-white' : ''}`}>
                                                                    {d.label}
                                                                </span>
                                                                <p className="text-[10px] font-light">{d.desc}</p>
                                                            </div>
                                                            {depth === d.id && <CheckCircle2 size={20} className="text-cosmic-pink" />}
                                                        </button>
                                                    ))}
                                                </div>
                                            </section>
                                        </div>

                                        <div className="pt-12 border-t border-white/10 flex justify-between items-center">
                                            <div className="flex items-center gap-4 text-[9px] uppercase tracking-widest text-gray-600 font-bold">
                                                <Shield size={14} className="text-green-500" /> Neural integrity secured // Dyson-Link Stable
                                            </div>
                                            <button
                                                onClick={() => setShowConfig(false)}
                                                className="px-14 py-6 bg-cosmic-cyan text-black rounded-2xl text-[11px] uppercase font-bold tracking-[0.5em] hover:scale-105 active:scale-95 transition-all shadow-[0_0_30px_rgba(34,211,238,0.4)]"
                                            >
                                                Apply Parameters
                                            </button>
                                        </div>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </GlassCard>
                </div>

                {/* Progress / Info sidebar maintained but polished */}
                <div className="lg:col-span-3 space-y-10">
                    <GlassCard className="p-10" glow glowColor="pink">
                        <h4 className="text-[11px] uppercase tracking-[0.5em] font-bold text-cosmic-pink mb-10 flex items-center gap-3">
                            <PieChart size={18} /> Neural Metrics
                        </h4>
                        <div className="space-y-10">
                            <div className="space-y-5">
                                <div className="flex justify-between text-[10px] uppercase font-bold tracking-[0.2em] text-gray-400 px-1">
                                    <span>Sync Ratio</span>
                                    <span className="text-cosmic-cyan">92%</span>
                                </div>
                                <div className="h-2 bg-white/5 rounded-full overflow-hidden shadow-inner">
                                    <motion.div
                                        initial={{ width: 0 }}
                                        animate={{ width: '92%' }}
                                        className="h-full bg-gradient-to-r from-cosmic-cyan via-cosmic-purple to-cosmic-pink shadow-[0_0_20px_rgba(34,211,238,0.4)]"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-6">
                                <div className="p-6 glass border border-white/5 rounded-[1.5rem] shadow-lg">
                                    <div className="text-[10px] uppercase font-bold text-gray-600 tracking-widest mb-3">Logic Solved</div>
                                    <div className="text-3xl font-display font-bold text-white leading-none">{progress?.problemsSolved || 0}</div>
                                </div>
                                <div className="p-6 glass border border-white/5 rounded-[1.5rem] shadow-lg">
                                    <div className="text-[10px] uppercase font-bold text-gray-600 tracking-widest mb-3">Analyst Grades</div>
                                    <div className="text-3xl font-display font-bold text-white leading-none">{progress?.essaysGraded || 0}</div>
                                </div>
                            </div>
                        </div>
                    </GlassCard>

                    <GlassCard className="p-10 border-none bg-gradient-to-br from-cosmic-purple/10 to-transparent">
                        <div className="flex items-center gap-3 mb-8">
                            <Zap className="text-gray-500" size={16} />
                            <h4 className="text-[11px] uppercase tracking-[0.4em] font-bold text-gray-500">Quick Synapses</h4>
                        </div>
                        <div className="space-y-5">
                            {[
                                "Explain this diagram's logic",
                                "Grade my thesis structure",
                                "Solve the derivative of x^2",
                                "Find contradictions in my text"
                            ].map((p, i) => (
                                <button
                                    key={i}
                                    onClick={() => setInput(p)}
                                    className="w-full text-left p-5 glass border border-white/5 rounded-2xl text-[10px] text-gray-500 hover:text-white hover:border-cosmic-cyan/30 transition-all font-light leading-relaxed group"
                                >
                                    <span className="text-cosmic-cyan/50 group-hover:text-cosmic-cyan transition-colors mr-2">➹</span> {p}
                                </button>
                            ))}
                        </div>
                    </GlassCard>

                    <div className="p-10 border-l border-white/5 space-y-4 opacity-40">
                        <p className="text-[10px] uppercase tracking-[0.4em] font-bold text-gray-700 leading-loose">
                            SPARK.E // TUTOR NODE OS <br />
                            STABLE SYNC // 0.04ms LATENCY <br />
                            DYSON LINK // ACTIVE
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
