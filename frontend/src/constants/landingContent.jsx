import { Target, BookOpen, Map, FileText, Flame, Star, Award, TrendingUp, Bot } from 'lucide-react';

// LANDING CONTENT
export const LANDING_FEATURES = [
    {
        id: 'quiz',
        Icon: Target,
        title: 'AI Quiz Lab',
        description: 'Generate intelligent quizzes on any topic with adaptive difficulty that evolves with your mastery level.',
        tag: 'AI-Powered',
        path: '/quiz'
    },
    {
        id: 'flashcards',
        Icon: BookOpen,
        title: 'Smart Flashcards',
        description: 'Spaced repetition powered by advanced algorithms for optimal retention and faster learning.',
        tag: 'Proven Method',
        path: '/flashcards'
    },
    {
        id: 'roadmap',
        Icon: Map,
        title: 'Learning Roadmaps',
        description: 'Personalized learning paths that adapt to your progress with visual milestone tracking.',
        tag: 'Structured',
        path: '/roadmap'
    },
    {
        id: 'pdf',
        Icon: FileText,
        title: 'PDF Intelligence',
        description: 'Upload documents and chat with AI to extract insights, generate summaries, and ask questions.',
        tag: 'Advanced',
        path: '/pdf'
    },
    {
        id: 'tutor',
        Icon: Bot,
        title: 'AI Tutor',
        description: '24/7 intelligent assistant ready to explain concepts, solve problems, and guide your learning.',
        tag: 'Always Ready',
        path: '/chatbot'
    },
    {
        id: 'imagine',
        Icon: Star,
        title: 'Image Generator',
        description: 'Create custom visual aids and diagrams to enhance understanding and memory retention.',
        tag: 'Creative',
        path: '/imagine'
    }
];

export const LANDING_STATS = [
    { value: 10000, label: 'Active Learners', suffix: '+', prefix: '' },
    { value: 50000, label: 'Quizzes Generated', suffix: '+', prefix: '' },
    { value: 100000, label: 'Flashcards Created', suffix: '+', prefix: '' },
    { value: 95, label: 'Success Rate', suffix: '%', prefix: '' }
];

export const HERO_CONTENT = {
    title: 'DYANO',
    subtitle: 'Your Personal Gateway to Knowledge',
    description: 'Master any topic with AI-powered quizzes, smart flashcards, and personalized roadmaps. Now in 10+ languages.',
};

// DASHBOARD CONTENT
export const DASHBOARD_STATS = [
    { id: 'streak', label: 'Daily Streak', value: '12', Icon: Flame, color: 'text-white/40', glow: 'gray' },
    { id: 'points', label: 'Total Points', value: '2,450', Icon: Star, color: 'text-white/40', glow: 'gray' },
    { id: 'achievements', label: 'Achievements', value: '18/30', Icon: Award, color: 'text-white/40', glow: 'gray' },
    { id: 'rank', label: 'Global Rank', value: '#247', Icon: TrendingUp, color: 'text-white/40', glow: 'gray' },
];

export const LEARNING_TOOLS = [
    {
        id: 'quiz',
        Icon: Target,
        title: 'Quiz Lab',
        description: 'Generate AI-powered quizzes on any topic.',
        path: '/quiz',
        color: 'gray',
        stats: { created: 12, completed: 8 }
    },
    {
        id: 'flashcards',
        Icon: BookOpen,
        title: 'Flashcard Space',
        description: 'Master concepts with spaced repetition.',
        path: '/flashcards',
        color: 'gray',
        stats: { sets: 5, mastered: 120 }
    },
    {
        id: 'roadmap',
        Icon: Map,
        title: 'Learning Roadmap',
        description: 'Your personalized path through the stars.',
        path: '/roadmap',
        color: 'gray',
        stats: { active: 3, completed: 1 }
    },
    {
        id: 'pdf',
        Icon: FileText,
        title: 'PDF Lab',
        description: 'Extract intelligence from your documents.',
        path: '/pdf',
        color: 'gray',
        stats: { uploaded: 7, analyzed: 7 }
    },
    {
        id: 'chatbot',
        Icon: Bot,
        title: 'Spark.E Tutor',
        description: 'Vision-aware 24/7 tutor for complex queries.',
        path: '/chatbot',
        color: 'gray',
        stats: { sessions: 0, level: 'Active' }
    },
    {
        id: 'imagine',
        Icon: Star,
        title: 'Neural Visualizer',
        description: 'Convert concepts into high-fidelity optic arrays.',
        path: '/imagine',
        color: 'gray',
        stats: { generated: 0, level: 'Active' }
    },
];

export const RECENT_ACTIVITY = [
    { id: 1, action: 'Completed Quiz', subject: 'Quantum Physics', time: '2 hours ago', score: '85%' },
    { id: 2, action: 'Reviewed Flashcards', subject: 'Machine Learning', time: '5 hours ago', score: '12 cards' },
    { id: 3, action: 'Uploaded PDF', subject: 'Neural Networks.pdf', time: '1 day ago', score: '24 pages' },
];

export const QUIZ_TOPICS = [
    { id: 'os-kernels', title: 'Operating Systems: Kernels', difficulty: 'Expert', questions: 20, duration: '30m', color: 'gray' },
    { id: 'algorithms', title: 'Data Structures & Algorithms', difficulty: 'Advanced', questions: 20, duration: '25m', color: 'gray' },
    { id: 'quantum', title: 'Quantum Mechanics', difficulty: 'Expert', questions: 20, duration: '20m', color: 'gray' },
    { id: 'organic-chem', title: 'Organic Chemistry', difficulty: 'Expert', questions: 20, duration: '20m', color: 'gray' },
    { id: 'thermodynamics', title: 'Thermodynamics: Entropy', difficulty: 'Advanced', questions: 20, duration: '15m', color: 'gray' },
    { id: 'corporate-finance', title: 'Corporate Finance', difficulty: 'Advanced', questions: 20, duration: '18m', color: 'gray' },
    { id: 'neuroscience', title: 'Cognitive Neuroscience', difficulty: 'Expert', questions: 20, duration: '25m', color: 'gray' },
    { id: 'intl-relations', title: 'International Relations', difficulty: 'Intermediate', questions: 20, duration: '15m', color: 'gray' },
    { id: 'discrete-math', title: 'Discrete Math: Graph Theory', difficulty: 'Advanced', questions: 20, duration: '20m', color: 'gray' },
    { id: 'fluid-mechanics', title: 'Fluid Mechanics', difficulty: 'Expert', questions: 20, duration: '20m', color: 'gray' },
    { id: 'bayesian-stats', title: 'Bayesian Inference', difficulty: 'Expert', questions: 20, duration: '20m', color: 'gray' },
    { id: 'calculus-iii', title: 'Multivariable Calculus', difficulty: 'Advanced', questions: 20, duration: '20m', color: 'gray' },
    { id: 'sociology', title: 'Modern Social Theory', difficulty: 'Intermediate', questions: 20, duration: '15m', color: 'gray' },
    { id: 'legal-studies', title: 'Constitutional Law', difficulty: 'Advanced', questions: 20, duration: '25m', color: 'gray' },
    { id: 'anthropology', title: 'Biological Anthropology', difficulty: 'Intermediate', questions: 20, duration: '15m', color: 'gray' },
];

export const MOCK_QUESTIONS = [
    {
        id: 1,
        text: "What is the primary phenomenon that distinguishes quantum mechanics from classical mechanics?",
        options: ["Superposition", "Gravity", "Thermodynamics", "Static Electricity"],
        correctAnswer: 0
    },
    {
        id: 2,
        text: "The 'Event Horizon' is a boundary surrounding which celestial object?",
        options: ["Nebula", "White Dwarf", "Black Hole", "Red Giant"],
        correctAnswer: 2
    }
];

export const MOCK_PDF_STATS = {
    fileName: 'NEURAL_ARCH_v4.pdf',
    fileSize: '4.2 MB',
    pages: 24,
    indexedDate: '2026.01.25',
    summary: 'A deep dive into layered transformer architectures and their application in real-time cosmic mapping.'
};

export const INITIAL_CHAT = [
    { role: 'system', content: 'Neural link established. Document indexed and ready for synthesis.' },
    { role: 'ai', content: 'I have analyzed NEURAL_ARCH_v4.pdf. Where shall we begin our deep scan?' }
];


