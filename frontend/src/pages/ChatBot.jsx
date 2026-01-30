import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Send,
    Bot,
    User,
    Loader2,
    Mic,
    MicOff,
    Volume2,
    VolumeX,
    Image as ImageIcon,
    X,
    FileText,
    Settings,
    Shield,
    Globe,
    Zap,
    PieChart,
    CheckCircle2,
    Microscope,
    Code,
    Sparkles,
    Copy,
    RefreshCw
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import ParticleButton from '../components/ui/ParticleButton';
import NeuralOrb from '../components/three/NeuralOrb';
import useTutor from '../hooks/useTutor';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3005';

const LANGUAGES = [
    { code: 'en', browserCode: 'en-US', label: 'English', voice: 'Google US English', flag: '🇺🇸' },
    { code: 'hi', browserCode: 'hi-IN', label: 'हिन्दी', voice: 'Google हिन्दी', flag: '🇮🇳' },
    { code: 'mr', browserCode: 'mr-IN', label: 'मराठी', voice: 'Google मराठी', flag: '🇮🇳' },
    { code: 'es', browserCode: 'es-ES', label: 'Español', voice: 'Google Español', flag: '🇪🇸' },
    { code: 'fr', browserCode: 'fr-FR', label: 'Français', voice: 'Google Français', flag: '🇫🇷' },
    { code: 'de', browserCode: 'de-DE', label: 'Deutsch', voice: 'Google Deutsch', flag: '🇩🇪' },
    { code: 'pt', browserCode: 'pt-BR', label: 'Português', voice: 'Google Português', flag: '🇵🇹' },
    { code: 'ja', browserCode: 'ja-JP', label: '日本語', voice: 'Google 日本語', flag: '🇯🇵' },
    { code: 'ru', browserCode: 'ru-RU', label: 'Русский', voice: 'Google Русский', flag: '🇷🇺' },
    { code: 'zh', browserCode: 'zh-CN', label: '中文', voice: 'Google 中文', flag: '🇨🇳' },
    { code: 'it', browserCode: 'it-IT', label: 'Italiano', voice: 'Google Italiano', flag: '🇮🇹' },
    { code: 'ko', browserCode: 'ko-KR', label: '한국어', voice: 'Google 한국어', flag: '🇰🇷' },
    { code: 'ar', browserCode: 'ar-SA', label: 'العربية', voice: 'Google العربية', flag: '🇸🇦' },
    { code: 'ta', browserCode: 'ta-IN', label: 'தமிழ்', voice: 'Google தமிழ்', flag: '🇮🇳' },
    { code: 'te', browserCode: 'te-IN', label: 'తెలుగు', voice: 'Google తెలుగు', flag: '🇮🇳' },
    { code: 'bn', browserCode: 'bn-IN', label: 'বাংলা', voice: 'Google বাংলা', flag: '🇮🇳' },
    { code: 'tr', browserCode: 'tr-TR', label: 'Türkçe', voice: 'Google Türkçe', flag: '🇹🇷' },
    { code: 'vi', browserCode: 'vi-VN', label: 'Tiếng Việt', voice: 'Google Tiếng Việt', flag: '🇻🇳' },
    { code: 'nl', browserCode: 'nl-NL', label: 'Nederlands', voice: 'Google Nederlands', flag: '🇳🇱' },
    { code: 'id', browserCode: 'id-ID', label: 'Bahasa Indonesia', voice: 'Google Bahasa Indonesia', flag: '🇮🇩' },
    { code: 'pl', browserCode: 'pl-PL', label: 'Polski', voice: 'Google Polski', flag: '🇵🇱' }
];

const PERSONALITY_THEMES = {
    friendly: { shadow: 'shadow-cosmic-cyan/20', primary: 'cosmic-cyan', secondary: 'cosmic-purple', accent: 'green-500' },
    strict: { shadow: 'shadow-red-500/20', primary: 'red-500', secondary: 'gray-500', accent: 'red-400' },
    creative: { shadow: 'shadow-cosmic-pink/20', primary: 'cosmic-pink', secondary: 'cosmic-cyan', accent: 'yellow-400' },
    socratic: { shadow: 'shadow-cosmic-purple/20', primary: 'cosmic-purple', secondary: 'cosmic-cyan', accent: 'indigo-400' },
    professional: { shadow: 'shadow-blue-500/20', primary: 'blue-500', secondary: 'gray-500', accent: 'blue-400' },
    robotic: { shadow: 'shadow-white/10', primary: 'gray-400', secondary: 'cosmic-cyan', accent: 'cosmic-cyan' }
};

const PERSONALITIES = [
    { id: 'friendly', label: 'Supportive Spark.E', desc: 'Encouraging, simplifies complex topics, focuses on conceptual understanding.', icon: '🌟' },
    { id: 'strict', label: 'Academic Rigor', desc: 'Focuses on accuracy, strict adherence to logic, formal academic tone.', icon: '⚖️' },
    { id: 'creative', label: 'Neural Fusion', desc: 'Uses metaphors, visual analogies, and cross-disciplinary connections.', icon: '🎨' },
    { id: 'socratic', label: 'Socratic Master', desc: 'Never gives direct answers. Guides through questioning.', icon: '🧘' },
    { id: 'professional', label: 'Senior Consultant', desc: 'Formal, structured, and cites theoretical frameworks.', icon: '💼' },
    { id: 'robotic', label: 'Cyborg Unit', desc: 'Direct, logical, and purely computational. Uses mechanical syntax.', icon: '🤖' }
];

const DEPTH_LEVELS = [
    { id: 'brief', label: 'Foundational', desc: 'Assume no prior knowledge. Use common analogies.' },
    { id: 'standard', label: 'Advanced Sync', desc: 'Standard undergraduate level complexity and terminology.' },
    { id: 'detailed', label: 'Singularity', desc: 'Deep dive into research-level nuance and technical complexity.' },
    { id: 'comprehensive', label: 'Universal', desc: 'Masterclass level analysis: Theory -> Derivation -> Edge Cases.' }
];

export default function ChatBot() {
    const { t, i18n } = useTranslation();
    const {
        status,
        messages: tutorMessages,
        progress,
        sendMessage,
        gradeEssay,
        solveProblem,
        fetchProgress
    } = useTutor();

    const [input, setInput] = useState('');
    const [messages, setMessages] = useState([
        {
            role: 'assistant',
            content: "Neural link established. I am Spark.E, your dedicated Dyson-Link tutor. I've analyzed your current trajectory. How shall we accelerate your learning today?",
            timestamp: new Date()
        }
    ]);
    const [image, setImage] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [listening, setListening] = useState(false);
    const [isSpeakEnabled, setIsSpeakEnabled] = useState(true);
    const [activeTab, setActiveTab] = useState('chat'); // chat | essay | solver
    const [language, setLanguage] = useState(i18n.language || 'en');
    const [isSpeaking, setIsSpeaking] = useState(false);
    const [isZenMode, setIsZenMode] = useState(false);
    const [lastActionTime, setLastActionTime] = useState(Date.now());

    // Persist settings
    useEffect(() => {
        localStorage.setItem('sparke_personality', personality);
        localStorage.setItem('sparke_depth', depth);
        localStorage.setItem('sparke_framework', selectedFramework);
        localStorage.setItem('sparke_zen_mode', isZenMode);
    }, [personality, depth, selectedFramework, isZenMode]);

    // Track activity for background juice
    useEffect(() => {
        const interval = setInterval(() => {
            setLastActionTime(prev => prev); // Trigger re-render for bg logic
        }, 5000);
        return () => clearInterval(interval);
    }, []);

    // Sync state with i18n language changes
    useEffect(() => {
        if (i18n.language && i18n.language !== language) {
            setLanguage(i18n.language);
        }
    }, [i18n.language]);

    const handleLanguageChange = (newLang) => {
        setLanguage(newLang);
        i18n.changeLanguage(newLang);
    };

    // Additional state for tools
    const [essayText, setEssayText] = useState('');
    const [gradingResult, setGradingResult] = useState(null);
    const [problemText, setProblemText] = useState('');
    const [solverResult, setSolverResult] = useState(null);

    const messagesEndRef = useRef(null);
    const fileInputRef = useRef(null);
    const recognitionRef = useRef(null);

    // Auto-scroll to bottom
    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, status]);

    useEffect(() => {
        // Fetch PDFs for context
        const fetchPdfs = async () => {
            try {
                const user = JSON.parse(localStorage.getItem('dyano_user') || '{}');
                const res = await fetch(`${API_URL}/pdf/list`, {
                    headers: { 'Authorization': `Bearer ${user.token}` }
                });
                const data = await res.json();
                if (data.success) setPdfList(data.pdfs);
            } catch (err) {
                console.error("Failed to load PDF context library");
            }
        };
        fetchPdfs();
        fetchProgress();
    }, []);

    // Digital Tone Generator
    const playTune = (type = 'success') => {
        const ctx = new (window.AudioContext || window.webkitAudioContext)();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);

        const now = ctx.currentTime;
        if (type === 'success') {
            osc.frequency.setValueAtTime(880, now);
            osc.frequency.exponentialRampToValueAtTime(1760, now + 0.1);
            gain.gain.setValueAtTime(0.1, now);
            gain.gain.exponentialRampToValueAtTime(0.01, now + 0.2);
        } else { // secondary tone for actions like copy
            osc.frequency.setValueAtTime(220, now);
            gain.gain.setValueAtTime(0.1, now);
            gain.gain.exponentialRampToValueAtTime(0.01, now + 0.1);
        }

        osc.start();
        osc.stop(now + 0.2);
    };

    // TTS Setup
    const speak = (text) => {
        if (!isSpeakEnabled) return;
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(text);
        const voices = window.speechSynthesis.getVoices();

        const selectedLangObj = LANGUAGES.find(l => l.code === language) || LANGUAGES[0];
        const browserLang = selectedLangObj.browserCode;

        // Try to find the best voice
        const voice = voices.find(v => v.lang === browserLang) ||
            voices.find(v => v.lang.startsWith(language)) ||
            voices.find(v => v.name.includes(selectedLangObj.voice)) ||
            voices.find(v => v.name.includes('Google')) ||
            voices[0];

        if (voice) utterance.voice = voice;
        utterance.lang = browserLang;

        // Robotic modulation - refined for better clarity
        if (personality === 'robotic') {
            utterance.rate = 0.9;  // Slightly more natural but still mechanical
            utterance.pitch = 0.7; // Less distorted but still deep
        } else {
            utterance.rate = 1.0;
            utterance.pitch = 1.0;
        }

        utterance.onstart = () => setIsSpeaking(true);
        utterance.onend = () => setIsSpeaking(false);
        utterance.onerror = () => setIsSpeaking(false);

        window.speechSynthesis.speak(utterance);
    };

    // STT Setup
    useEffect(() => {
        if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
            const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
            recognitionRef.current = new SpeechRecognition();
            recognitionRef.current.continuous = false;
            recognitionRef.current.interimResults = false;

            const selectedLangObj = LANGUAGES.find(l => l.code === language) || LANGUAGES[0];
            recognitionRef.current.lang = selectedLangObj.browserCode;

            recognitionRef.current.onresult = (event) => {
                const transcript = event.results[0][0].transcript;
                setInput(transcript);
                setListening(false);
            };

            recognitionRef.current.onerror = () => setListening(false);
            recognitionRef.current.onend = () => setListening(false);
        }
    }, [language]);

    const toggleVoice = () => {
        if (listening) {
            recognitionRef.current?.stop();
        } else {
            setListening(true);
            recognitionRef.current?.start();
        }
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImage(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const clearImage = () => {
        setImage(null);
        setImagePreview(null);
        if (fileInputRef.current) fileInputRef.current.value = '';
    };

    const handleChatSubmit = async (e) => {
        if (e) e.preventDefault();

        const isQueryEmpty = !input.trim() && !image;
        if (isQueryEmpty || status === 'loading') {
            console.log('⚠️ Chat submission blocked:', { isQueryEmpty, status });
            return;
        }

        console.log('📝 Submitting chat:', { input, hasImage: !!image });

        const userMsg = {
            role: 'user',
            content: input,
            imageUrl: imagePreview,
            timestamp: new Date()
        };

        // Add user message to UI immediately for feedback
        setMessages(prev => [...prev, userMsg]);

        const currentInput = input;
        const currentImage = image;

        // Reset inputs
        setInput('');
        clearImage();

        try {
            const selectedLangLabel = LANGUAGES.find(l => l.code === language)?.label || 'English';
            const result = await sendMessage({
                message: `STRICT LANGUAGE PROTOCOL: You must respond ONLY in ${selectedLangLabel}. Do not use any English unless it is a technical term that has no equivalent. ${currentInput || (currentImage ? "Analyze this image" : "")}`,
                image: currentImage,
                personality,
                depth,
                sessionId: null,
                documentId: selectedPdf?._id,
                language: language,
                framework: selectedFramework
            });

            if (result && result.success) {
                playTune('success');
                setMessages(prev => [...prev, {
                    role: 'assistant',
                    content: result.response,
                    timestamp: new Date()
                }]);
                fetchProgress();
                if (isSpeakEnabled) speak(result.response);
            }
        } catch (error) {
            console.error('❌ Chat submission error:', error);
            setMessages(prev => [...prev, {
                role: 'assistant',
                content: `Neural sync disrupted: ${error.message || "Please verify connection to the Dyson swarm."}`,
                isError: true,
                timestamp: new Date()
            }]);
        }
    };

    const handleEssaySubmit = async () => {
        if (!essayText.trim() || status === 'loading') return;
        try {
            const result = await gradeEssay(essayText, null, language, selectedFramework);
            setGradingResult(result);
            fetchProgress();
        } catch (err) {
            console.error("Dyson Scan Failed");
        }
    };

    const handleSolverSubmit = async () => {
        if (!problemText.trim() || status === 'loading') return;
        try {
            const result = await solveProblem(problemText, null, language, selectedFramework);
            setSolverResult(result);
            fetchProgress();
        } catch (err) {
            console.error("Computational Engine Failed");
        }
    };

    const clearChat = () => {
        if (window.confirm("Confirm reset of all localized neural weights?")) {
            setMessages([{
                role: 'assistant',
                content: "Local memory purged. Awaiting new instructions.",
                timestamp: new Date()
            }]);
        }
    };

    return (
        <div className="fixed inset-0 z-20 flex bg-[#05010d] overflow-hidden">
            {/* Atmospheric Background Layers - Personality & Activity Aware */}
            <div className={`fixed inset-0 pointer-events-none z-0 transition-all duration-[3000ms] ${isZenMode ? 'opacity-40' : 'opacity-100'}`}>
                <motion.div
                    animate={{
                        scale: [1, 1.1, 1],
                        opacity: [0.15, 0.25, 0.15]
                    }}
                    transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
                    className={`absolute top-[-10%] left-[-10%] w-[70%] h-[70%] blur-[160px] rounded-full bg-${PERSONALITY_THEMES[personality]?.primary || 'cosmic-purple'}`}
                />
                <motion.div
                    animate={{
                        scale: [1, 1.2, 1],
                        opacity: [0.1, 0.2, 0.1]
                    }}
                    transition={{ duration: 12, repeat: Infinity, ease: "easeInOut", delay: 2 }}
                    className={`absolute bottom-[-10%] right-[-10%] w-[70%] h-[70%] blur-[160px] rounded-full bg-${PERSONALITY_THEMES[personality]?.secondary || 'cosmic-cyan'}`}
                />

                {/* Dynamic activity stars */}
                <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(white 1px, transparent 1px)', backgroundSize: '100px 100px' }} />

                {personality === 'robotic' && (
                    <div className="absolute inset-0 opacity-[0.05]" style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)', backgroundSize: '60px 60px' }} />
                )}
            </div>

            {/* left Sidebar - Neural Navigation */}
            <aside className={`transition-all duration-700 ease-in-out ${isZenMode ? 'w-0 opacity-0 -translate-x-full' : 'w-76 opacity-100 translate-x-0'} hidden lg:flex flex-col border-r border-white/5 bg-black/60 backdrop-blur-3xl relative z-10`}>
                <div className="p-6 border-b border-white/5">
                    <div className="flex items-center gap-3 mb-8">
                        <div className="w-10 h-10 bg-gradient-to-tr from-cosmic-cyan to-cosmic-purple rounded-xl flex items-center justify-center shadow-lg shadow-cosmic-cyan/20">
                            <Bot size={22} className="text-white animate-pulse" />
                        </div>
                        <div>
                            <h1 className="text-sm font-bold tracking-tight text-white uppercase">SPARK.E</h1>
                            <div className="flex items-center gap-1.5">
                                <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
                                <span className="text-[9px] text-gray-500 uppercase tracking-widest font-bold">OS V4.2 ACTIVE</span>
                            </div>
                        </div>
                    </div>

                    <NeuralOrb status={status} personality={personality} />

                    <div className="space-y-1">
                        {[
                            { id: 'chat', label: 'Neural Chat', icon: <Bot size={16} />, color: 'cyan' },
                            { id: 'essay', label: 'Essay Lab', icon: <FileText size={16} />, color: 'pink' },
                            { id: 'solver', label: 'Logic Engine', icon: <Sparkles size={16} />, color: 'purple' }
                        ].map(tab => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl transition-all duration-300 text-[10px] font-bold uppercase tracking-[0.2em] relative overflow-hidden group ${activeTab === tab.id
                                    ? `text-white`
                                    : 'text-gray-500 hover:text-white hover:bg-white/5'
                                    }`}
                            >
                                {activeTab === tab.id && (
                                    <motion.div
                                        layoutId="sidebar-active"
                                        className={`absolute inset-0 bg-gradient-to-r from-${tab.color === 'cyan' ? 'cosmic-cyan' : tab.color === 'pink' ? 'cosmic-pink' : 'cosmic-purple'}/20 to-transparent border-l-2 border-${tab.color === 'cyan' ? 'cosmic-cyan' : tab.color === 'pink' ? 'cosmic-pink' : 'cosmic-purple'}`}
                                        initial={false}
                                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                                    />
                                )}
                                <span className={`relative z-10 flex items-center gap-3 ${activeTab === tab.id ? `text-cosmic-${tab.color}` : ''}`}>
                                    {tab.icon} {tab.label}
                                </span>
                            </button>
                        ))}
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto p-4 space-y-6 custom-scrollbar">
                    <div>
                        <p className="px-3 text-[9px] uppercase tracking-[0.3em] font-bold text-gray-600 mb-4">Core Metrics</p>
                        <div className="space-y-3 px-3">
                            <div className="space-y-2">
                                <div className="flex justify-between text-[8px] uppercase font-bold tracking-widest text-gray-500">
                                    <span>Sync Ratio</span>
                                    <span className="text-cosmic-cyan">{progressData?.progress?.stats?.averageScore || 0}%</span>
                                </div>
                                <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                                    <motion.div initial={{ width: 0 }} animate={{ width: `${progressData?.progress?.stats?.averageScore || 0}%` }} className="h-full bg-gradient-to-r from-cosmic-cyan to-cosmic-purple" />
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-2">
                                <div className="p-3 bg-white/5 border border-white/5 rounded-xl">
                                    <div className="text-[7px] text-gray-600 uppercase font-bold mb-1">Solved</div>
                                    <div className="text-sm font-bold text-white">{progressData?.progress?.stats?.totalQuizzesTaken || 0}</div>
                                </div>
                                <div className="p-3 bg-white/5 border border-white/5 rounded-xl">
                                    <div className="text-[7px] text-gray-600 uppercase font-bold mb-1">Graded</div>
                                    <div className="text-sm font-bold text-white">{progressData?.progress?.stats?.totalEssaysGraded || 0}</div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div>
                        <p className="px-3 text-[9px] uppercase tracking-[0.3em] font-bold text-gray-600 mb-4">Session Timeline</p>
                        <div className="space-y-3 px-1">
                            {messages.slice(-3).reverse().map((m, i) => (
                                <div key={i} className="flex gap-3 px-3 py-2 rounded-xl hover:bg-white/5 transition-colors cursor-help group/item">
                                    <div className={`w-1 h-3 rounded-full mt-1.5 transition-all group-hover/item:h-5 ${m.role === 'user' ? 'bg-cosmic-pink' : 'bg-cosmic-cyan'}`} />
                                    <div className="flex-1 overflow-hidden">
                                        <div className="text-[10px] text-white truncate font-medium opacity-60 group-hover/item:opacity-100">{m.content}</div>
                                        <div className="text-[7px] text-gray-600 uppercase font-black tracking-tighter mt-0.5">{m.role} // SYNC</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="p-4 border-t border-white/5 bg-black/20">
                    <button onClick={() => setShowConfig(true)} className="w-full flex items-center gap-3 p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-all group">
                        <div className="w-8 h-8 rounded-lg bg-cosmic-purple/20 flex items-center justify-center text-cosmic-purple group-hover:rotate-45 transition-transform">
                            <Settings size={16} />
                        </div>
                        <div className="text-left">
                            <p className="text-[10px] font-bold text-white uppercase tracking-wider">Interface Config</p>
                            <p className="text-[8px] text-gray-500">Personalize AI Pulse</p>
                        </div>
                    </button>
                </div>
            </aside>

            {/* Main Section */}
            <main className="flex-1 flex flex-col relative overflow-hidden h-screen bg-black/10">
                {/* Header for Mobile/Title */}
                <header className="h-16 px-6 border-b border-white/5 flex items-center justify-between bg-black/40 backdrop-blur-xl shrink-0 z-10">
                    <div className="flex items-center gap-4">
                        <div className="lg:hidden flex items-center gap-2">
                            <Bot size={20} className="text-cosmic-cyan" />
                            <span className="font-bold text-sm tracking-tighter">SPARK.E</span>
                        </div>
                        <div className="hidden lg:block">
                            <h2 className="text-xs font-bold text-gray-400 flex items-center gap-4 uppercase tracking-widest">
                                Neural Synthesis <span className="text-white opacity-40">//</span> <span className="text-white">{activeTab} mode</span>
                                <button
                                    onClick={() => setIsZenMode(!isZenMode)}
                                    className={`px-3 py-1 rounded-full border text-[8px] transition-all ${isZenMode ? 'bg-cosmic-cyan/20 border-cosmic-cyan text-cosmic-cyan' : 'border-white/10 text-gray-500 hover:text-white'}`}
                                >
                                    ZEN {isZenMode ? 'ON' : 'OFF'}
                                </button>
                            </h2>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => window.dispatchEvent(new KeyboardEvent('keydown', { key: 'k', ctrlKey: true }))}
                            className="hidden md:flex items-center gap-2 px-3 py-2 bg-white/[0.03] border border-white/5 rounded-xl text-[9px] font-bold text-gray-500 hover:text-white hover:bg-white/10 transition-all uppercase tracking-widest"
                        >
                            <Search size={12} /> Palette <span className="opacity-30">Ctrl+K</span>
                        </button>
                        <div className="flex items-center gap-3 px-4 py-2 bg-white/[0.03] backdrop-blur-md rounded-full border border-white/10 shadow-inner group transition-all hover:bg-white/[0.06]">
                            <div className="relative">
                                <div className={`w-2 h-2 rounded-full ${status === 'loading' ? 'bg-cosmic-cyan animate-ping' : 'bg-green-500 shadow-glow-cyan'}`} />
                                <div className={`absolute inset-0 w-2 h-2 rounded-full ${status === 'loading' ? 'bg-cosmic-cyan' : 'bg-green-500'}`} />
                            </div>
                            <span className="text-[10px] font-bold text-gray-500 uppercase tracking-[0.2em] group-hover:text-white transition-colors">
                                {status === 'loading' ? 'Syncing...' : 'Link Stable'}
                            </span>
                        </div>
                        <button onClick={clearChat} className="w-10 h-10 rounded-xl flex items-center justify-center bg-white/[0.03] border border-white/5 text-gray-500 hover:text-red-400 hover:border-red-400/20 hover:bg-red-400/5 transition-all duration-300">
                            <X size={16} />
                        </button>
                    </div>
                </header>
                {/* Chat Messages / Viewport Area */}
                <div className="flex-1 overflow-y-auto px-4 md:px-8 py-8 custom-scrollbar relative z-0">
                    <div className="max-w-4xl mx-auto space-y-10">
                        <AnimatePresence mode="wait">
                            {activeTab === 'chat' && (
                                <motion.div key="chat" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-10">
                                    {messages.map((msg, idx) => (
                                        <motion.div
                                            key={idx}
                                            initial={{ opacity: 0, y: 10, scale: 0.98 }}
                                            animate={{ opacity: 1, y: 0, scale: 1 }}
                                            transition={{ duration: 0.4, ease: "easeOut" }}
                                            className={`flex gap-4 md:gap-6 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
                                        >
                                            <div className={`w-10 h-10 md:w-11 md:h-11 rounded-xl flex items-center justify-center shrink-0 shadow-lg border backdrop-blur-md transition-all duration-500 ${msg.role === 'user' ? 'bg-cosmic-pink/20 text-cosmic-pink border-cosmic-pink/30' : `bg-cosmic-${PERSONALITY_THEMES[personality]?.primary}/20 text-cosmic-${PERSONALITY_THEMES[personality]?.primary} border-cosmic-${PERSONALITY_THEMES[personality]?.primary}/30`} ${isSpeaking && msg.role === 'assistant' ? 'animate-pulse scale-110 shadow-glow-cyan overflow-visible' : ''}`}>
                                                {msg.role === 'user' ? <User size={20} /> : <Bot size={20} />}
                                            </div>
                                            <div className={`max-w-[85%] md:max-w-[80%] ${msg.role === 'user' ? 'text-right' : ''}`}>
                                                <div className={`p-5 md:p-6 rounded-2xl text-[13px] leading-relaxed shadow-deep border transition-colors duration-1000 group/msg relative ${msg.role === 'user'
                                                    ? 'bg-gradient-to-br from-cosmic-purple/30 to-cosmic-pink/10 border-cosmic-purple/40 rounded-tr-none text-white'
                                                    : `bg-white/[0.04] backdrop-blur-md border-${PERSONALITY_THEMES[personality]?.primary}/30 rounded-tl-none text-gray-100 shadow-${PERSONALITY_THEMES[personality]?.primary}/5`}`}>

                                                    {/* Message Actions */}
                                                    <div className={`absolute -top-3 ${msg.role === 'user' ? 'right-0' : 'left-0'} flex gap-2 opacity-0 group-hover/msg:opacity-100 transition-opacity z-20`}>
                                                        <button
                                                            onClick={() => { navigator.clipboard.writeText(msg.content); playTune('secondary'); }}
                                                            className="w-7 h-7 bg-black/60 backdrop-blur-xl border border-white/10 rounded-full flex items-center justify-center text-gray-400 hover:text-white"
                                                            title="Copy Sync"
                                                        >
                                                            <Copy size={12} />
                                                        </button>
                                                        {msg.role === 'assistant' && (
                                                            <button
                                                                onClick={() => speak(msg.content)}
                                                                className="w-7 h-7 bg-black/60 backdrop-blur-xl border border-white/10 rounded-full flex items-center justify-center text-gray-400 hover:text-white"
                                                                title="Resonate"
                                                            >
                                                                <Volume2 size={12} />
                                                            </button>
                                                        )}
                                                    </div>

                                                    {msg.imageUrl && <div className="mb-4 rounded-xl overflow-hidden border border-white/10 max-w-sm ml-auto shadow-2xl"><img src={msg.imageUrl} alt="Uploaded" className="w-full h-auto" /></div>}
                                                    <div className="whitespace-pre-wrap selection:bg-cosmic-cyan/30">{msg.content}</div>
                                                </div>
                                                <div className="mt-2 text-[8px] uppercase tracking-widest text-gray-600 font-bold px-3">
                                                    {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} // NODE-{idx.toString().padStart(3, '0')}
                                                </div>
                                            </div>
                                        </motion.div>
                                    ))}
                                    {status === 'loading' && (
                                        <div className="flex gap-4 md:gap-6">
                                            <div className="w-10 h-10 md:w-12 md:h-12 rounded-2xl bg-cosmic-cyan/10 text-cosmic-cyan flex items-center justify-center border border-cosmic-cyan/20">
                                                <Loader2 size={24} className="animate-spin" />
                                            </div>
                                            <div className="flex items-center gap-4 bg-white/5 border border-white/10 px-6 py-4 rounded-3xl rounded-tl-none">
                                                <div className="flex gap-1"><div className="w-1.5 h-1.5 bg-cosmic-cyan rounded-full animate-bounce [animation-delay:-0.3s]" /><div className="w-1.5 h-1.5 bg-cosmic-cyan rounded-full animate-bounce [animation-delay:-0.15s]" /><div className="w-1.5 h-1.5 bg-cosmic-cyan rounded-full animate-bounce" /></div>
                                                <span className="text-[9px] uppercase font-bold tracking-[0.4em] text-cosmic-cyan">{t('tutor.processing')}</span>
                                            </div>
                                        </div>
                                    )}
                                    <div ref={messagesEndRef} />
                                </motion.div>
                            )}

                            {activeTab === 'essay' && (
                                <motion.div key="essay" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="h-full">
                                    {!gradingResult ? (
                                        <div className="flex flex-col gap-6 max-w-3xl mx-auto py-10">
                                            <textarea
                                                value={essayText}
                                                onChange={(e) => setEssayText(e.target.value)}
                                                placeholder="Paste essay here..."
                                                className="w-full h-[400px] bg-white/5 border border-white/10 rounded-3xl p-8 text-white placeholder:text-gray-700 focus:outline-none focus:border-cosmic-pink transition-all resize-none shadow-inner"
                                            />
                                            <ParticleButton onClick={handleEssaySubmit} disabled={!essayText || status === 'loading'} className="w-full py-5 rounded-2xl text-[10px] uppercase tracking-[0.4em] font-bold">
                                                {status === 'loading' ? 'Grading...' : 'Start Neural Grading'}
                                            </ParticleButton>
                                        </div>
                                    ) : (
                                        <div className="space-y-8 py-10">
                                            {/* Grading Result UI (Simplified for full-screen) */}
                                            <div className="flex justify-between items-center bg-white/5 p-8 rounded-3xl border border-white/10">
                                                <div className="text-4xl font-display font-bold text-white">{gradingResult.score}<span className="text-cosmic-pink text-xl">.0</span></div>
                                                <button onClick={() => setGradingResult(null)} className="text-gray-500 hover:text-white">New Grade</button>
                                            </div>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                {gradingResult.rubricBreakdown?.map((r, i) => (
                                                    <div key={i} className="bg-white/5 p-6 rounded-3xl border border-white/5">
                                                        <div className="flex justify-between mb-4"><span className="text-[10px] font-bold text-white uppercase">{r.category}</span><span className="text-cosmic-cyan font-bold">{r.grade}/10</span></div>
                                                        <div className="h-1 bg-white/10 rounded-full overflow-hidden mb-3"><div className="h-full bg-cosmic-cyan" style={{ width: `${r.grade * 10}%` }} /></div>
                                                        <p className="text-[10px] text-gray-500 italic">{r.comments}</p>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </motion.div>
                            )}

                            {activeTab === 'solver' && (
                                <motion.div key="solver" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="h-full">
                                    {!solverResult ? (
                                        <div className="flex flex-col gap-6 max-w-3xl mx-auto py-10">
                                            <textarea
                                                value={problemText}
                                                onChange={(e) => setProblemText(e.target.value)}
                                                placeholder="Enter problem here..."
                                                className="w-full h-[300px] bg-white/5 border border-white/10 rounded-3xl p-8 text-white placeholder:text-gray-700 focus:outline-none focus:border-cosmic-purple transition-all resize-none shadow-inner font-mono"
                                            />
                                            <ParticleButton onClick={handleSolverSubmit} disabled={!problemText || status === 'loading'} className="w-full py-5 rounded-2xl text-[10px] uppercase tracking-[0.4em] font-bold">
                                                {status === 'loading' ? 'Solving...' : 'Initiate Derivation'}
                                            </ParticleButton>
                                        </div>
                                    ) : (
                                        <div className="space-y-6 py-10">
                                            <div className="bg-white/5 p-8 rounded-3xl border border-white/10 mb-8 flex justify-between">
                                                <div><div className="text-[10px] text-cosmic-purple font-bold mb-2 uppercase">Result</div><div className="text-xl font-mono text-white">{solverResult.finalAnswer}</div></div>
                                                <button onClick={() => setSolverResult(null)} className="text-gray-500">Reset</button>
                                            </div>
                                            {solverResult.steps?.map((step, i) => (
                                                <div key={i} className="flex gap-6">
                                                    <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-[10px] font-mono text-cosmic-purple shrink-0">{i + 1}</div>
                                                    <div className="flex-1 bg-white/5 p-6 rounded-3xl border border-white/5">
                                                        <h5 className="text-[11px] font-bold text-white uppercase mb-2">{step.title}</h5>
                                                        <p className="text-[10px] text-gray-500 mb-4">{step.explanation}</p>
                                                        <div className="bg-black/60 p-4 rounded-xl font-mono text-[10px] text-cosmic-cyan">{step.work}</div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>

                {/* Input Bar Layer */}
                <footer className="w-full p-4 md:p-8 bg-gradient-to-t from-[#05010d] via-[#05010d]/95 to-transparent shrink-0 relative z-10">
                    <div className="max-w-4xl mx-auto">
                        {selectedPdf && (
                            <div className="flex items-center gap-2 mb-4 bg-cosmic-cyan/10 border border-cosmic-cyan/20 px-3 py-1.5 rounded-lg w-fit text-[9px] font-bold text-cosmic-cyan uppercase tracking-widest shadow-lg shadow-cosmic-cyan/5">
                                <FileText size={12} /> {selectedPdf.fileName} <button onClick={() => setSelectedPdf(null)} className="ml-2 hover:text-white transition-colors"><X size={10} /></button>
                            </div>
                        )}

                        <div className="relative">
                            {/* Quick Neural Fragments - Action Chips */}
                            {!input && !image && activeTab === 'chat' && (
                                <div className="absolute bottom-full mb-6 flex flex-wrap gap-2 animate-in fade-in slide-in-from-bottom-2 duration-700">
                                    {[
                                        { label: "Summarize this PDF", active: !!selectedPdf, action: () => setInput("Can you provide a high-level summary of the attached document?") },
                                        { label: "Give me a quiz", action: () => setInput("Based on our discussion, generate a 5-question mastery quiz.") },
                                        { label: "Explain like I'm five", action: () => setInput("Simplify the last concept so even a child could understand it.") },
                                        { label: "Code Example", action: () => setInput("Show me a practical code example of this implementation.") }
                                    ].map((chip, i) => (
                                        <button
                                            key={i}
                                            onClick={chip.action}
                                            className={`px-3 py-1.5 rounded-full border text-[9px] font-bold uppercase tracking-widest transition-all ${chip.active ? 'bg-cosmic-cyan/20 border-cosmic-cyan/40 text-cosmic-cyan' : 'bg-white/5 border-white/10 text-gray-500 hover:text-white hover:border-white/20'}`}
                                        >
                                            {chip.label}
                                        </button>
                                    ))}
                                </div>
                            )}

                            {imagePreview && (
                                <div className="absolute bottom-full mb-4 p-2 bg-black/80 backdrop-blur-xl border border-white/10 rounded-xl flex items-center gap-4 shadow-2xl">
                                    <div className="relative">
                                        <img src={imagePreview} alt="Preview" className="w-14 h-14 object-cover rounded-lg" />
                                        <button onClick={clearImage} className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors shadow-lg"><X size={10} /></button>
                                    </div>
                                </div>
                            )}
                            <form onSubmit={handleChatSubmit} className="flex gap-4">
                                <div className="flex-1 relative group bg-white/[0.03] backdrop-blur-2xl border border-white/10 rounded-[2rem] focus-within:border-cosmic-cyan/40 focus-within:bg-white/[0.06] transition-all duration-300 flex items-center pr-36 shadow-2xl overflow-hidden">
                                    <div className="absolute inset-0 bg-gradient-to-r from-cosmic-cyan/5 to-transparent opacity-0 group-focus-within:opacity-100 transition-opacity pointer-events-none" />
                                    <input
                                        type="text"
                                        value={input}
                                        onChange={(e) => setInput(e.target.value)}
                                        placeholder="Command Spark.E..."
                                        className="flex-1 bg-transparent border-none py-6 px-8 text-white text-[14px] focus:outline-none placeholder:text-gray-600 relative z-10"
                                    />
                                    <div className="absolute right-4 flex items-center gap-4 text-gray-500 z-10">
                                        <button type="button" onClick={toggleVoice} title="Neural Recognition" className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${listening ? 'bg-cosmic-cyan/20 text-cosmic-cyan shadow-glow-cyan' : 'hover:bg-white/5 hover:text-white'}`}><Mic size={18} /></button>
                                        <button type="button" onClick={() => setIsSpeakEnabled(!isSpeakEnabled)} title="Neural Synthesis" className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${isSpeakEnabled ? 'text-cosmic-purple bg-cosmic-purple/10' : 'text-gray-700 hover:text-white'}`}><Volume2 size={18} /></button>
                                        <button type="button" onClick={() => fileInputRef.current?.click()} title="External Fragment" className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-white/5 hover:text-white transition-all"><ImageIcon size={18} /></button>
                                    </div>
                                    <input type="file" ref={fileInputRef} onChange={handleImageChange} accept="image/*" className="hidden" />
                                </div>
                                <ParticleButton type="submit" variant={personality} disabled={status === 'loading' || (!input.trim() && !image)} className={`w-16 h-16 rounded-2xl flex items-center justify-center transition-all ${(!input.trim() && !image) ? 'grayscale opacity-30 cursor-not-allowed' : 'opacity-100 hover:scale-[1.02] active:scale-95 shadow-lg shadow-cosmic-cyan/20'}`}>
                                    {status === 'loading' ? <Loader2 className="animate-spin text-black" size={24} /> : <Send size={24} className="text-black" />}
                                </ParticleButton>
                            </form>
                        </div>
                    </div>
                </footer>
            </main>

            {/* Config Overlay - Full Screen Absolute */}
            <AnimatePresence>
                {showConfig && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/95 backdrop-blur-2xl z-[100] p-6 md:p-12 overflow-y-auto">
                        <div className="max-w-2xl mx-auto space-y-12">
                            <div className="flex justify-between items-center border-b border-white/10 pb-6">
                                <div>
                                    <h3 className="text-2xl font-display font-bold text-white uppercase tracking-widest">Neural Config</h3>
                                    <p className="text-[10px] text-gray-500 uppercase tracking-widest font-bold mt-1">Grounding & Language Protocol</p>
                                </div>
                                <button onClick={() => setShowConfig(false)} className="p-3 bg-white/5 rounded-xl text-gray-500 hover:text-white"><X size={24} /></button>
                            </div>

                            <section className="space-y-6">
                                <label className="text-[10px] uppercase tracking-[0.4em] font-bold text-cosmic-cyan">Personality</label>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                                    {PERSONALITIES.map(p => (
                                        <button key={p.id} onClick={() => setPersonality(p.id)} className={`p-4 rounded-2xl border text-left transition-all ${personality === p.id ? 'border-cosmic-cyan bg-cosmic-cyan/10' : 'border-white/5 bg-white/5'}`}>
                                            <div className="text-xl mb-1">{p.icon}</div>
                                            <div className="text-[10px] font-bold text-white mb-1">{p.label}</div>
                                            <div className="text-[8px] text-gray-500 uppercase">{p.desc}</div>
                                        </button>
                                    ))}
                                </div>
                            </section>

                            <section className="space-y-6">
                                <label className="text-[10px] uppercase tracking-[0.4em] font-bold text-cosmic-cyan">Depth</label>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                    {DEPTH_LEVELS.map(d => (
                                        <button key={d.id} onClick={() => setDepth(d.id)} className={`p-4 rounded-2xl border text-center transition-all ${depth === d.id ? 'border-cosmic-cyan bg-cosmic-cyan/10' : 'border-white/5 bg-white/5'}`}>
                                            <div className="text-[10px] font-bold text-white uppercase">{d.label}</div>
                                        </button>
                                    ))}
                                </div>
                            </section>

                            <section className="space-y-6">
                                <label className="text-[10px] uppercase tracking-[0.4em] font-bold text-cosmic-cyan">Language Protocols</label>
                                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
                                    {LANGUAGES.map(l => (
                                        <button
                                            key={l.code}
                                            onClick={() => handleLanguageChange(l.code)}
                                            className={`group relative p-4 rounded-2xl border text-center transition-all duration-300 ${language === l.code ? 'border-cosmic-cyan bg-cosmic-cyan/10 shadow-glow-cyan/20' : 'border-white/5 bg-white/[0.03] hover:bg-white/10 hover:border-white/20'}`}
                                        >
                                            <div className="text-2xl mb-2 transition-transform group-hover:scale-110">{l.flag}</div>
                                            <div className={`text-[10px] font-bold uppercase tracking-widest ${language === l.code ? 'text-white' : 'text-gray-500'}`}>{l.label}</div>
                                            {language === l.code && <div className="absolute top-2 right-2 w-1.5 h-1.5 bg-cosmic-cyan rounded-full animate-pulse" />}
                                        </button>
                                    ))}
                                </div>
                            </section>

                            <button onClick={() => setShowConfig(false)} className="w-full py-5 bg-cosmic-cyan text-black rounded-2xl text-[10px] uppercase font-bold tracking-widest">Apply Synaptic Weights</button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
