import { Target, BookOpen, Map, FileText, Flame, Star, Award, TrendingUp } from 'lucide-react';

// LANDING CONTENT
export const LANDING_FEATURES = [
    {
        id: 'quiz',
        Icon: Target,
        title: 'AI Quiz Generator',
        description: 'Generate intelligent quizzes on any topic with adaptive difficulty.',
        path: '/quiz'
    },
    {
        id: 'flashcards',
        Icon: BookOpen,
        title: 'Smart Flashcards',
        description: 'Spaced repetition powered by advanced algorithms for optimal retention.',
        path: '/flashcards'
    },
    {
        id: 'roadmap',
        Icon: Map,
        title: 'Learning Roadmaps',
        description: 'Personalized learning paths that adapt to your progress.',
        path: '/roadmap'
    }
];

export const LANDING_STATS = [
    { id: 'learners', value: '10K+', label: 'Active Learners' },
    { id: 'quizzes', value: '50K+', label: 'Quizzes Generated' },
    { id: 'cards', value: '100K+', label: 'Flashcards Created' },
    { id: 'success', value: '95%', label: 'Success Rate' }
];

export const HERO_CONTENT = {
    title: 'DYANO',
    subtitle: 'Navigate the Universe of Knowledge',
    description: 'AI-powered quizzes, flashcards, and personalized learning paths that adapt to your cosmic journey.',
};

// DASHBOARD CONTENT
export const DASHBOARD_STATS = [
    { id: 'streak', label: 'Daily Streak', value: '12', Icon: Flame, color: 'text-cosmic-gold', glow: 'gold' },
    { id: 'points', label: 'Total Points', value: '2,450', Icon: Star, color: 'text-cosmic-cyan', glow: 'cyan' },
    { id: 'achievements', label: 'Achievements', value: '18/30', Icon: Award, color: 'text-cosmic-pink', glow: 'pink' },
    { id: 'rank', label: 'Global Rank', value: '#247', Icon: TrendingUp, color: 'text-cosmic-purple', glow: 'purple' },
];

export const LEARNING_TOOLS = [
    {
        id: 'quiz',
        Icon: Target,
        title: 'Quiz Lab',
        description: 'Generate AI-powered quizzes on any topic.',
        path: '/quiz',
        color: 'purple',
        stats: { created: 12, completed: 8 }
    },
    {
        id: 'flashcards',
        Icon: BookOpen,
        title: 'Flashcard Space',
        description: 'Master concepts with spaced repetition.',
        path: '/flashcards',
        color: 'cyan',
        stats: { sets: 5, mastered: 120 }
    },
    {
        id: 'roadmap',
        Icon: Map,
        title: 'Learning Roadmap',
        description: 'Your personalized path through the stars.',
        path: '/roadmap',
        color: 'pink',
        stats: { active: 3, completed: 1 }
    },
    {
        id: 'pdf',
        Icon: FileText,
        title: 'PDF Lab',
        description: 'Extract intelligence from your documents.',
        path: '/pdf',
        color: 'purple',
        stats: { uploaded: 7, analyzed: 7 }
    },
];

export const RECENT_ACTIVITY = [
    { id: 1, action: 'Completed Quiz', subject: 'Quantum Physics', time: '2 hours ago', score: '85%' },
    { id: 2, action: 'Reviewed Flashcards', subject: 'Machine Learning', time: '5 hours ago', score: '12 cards' },
    { id: 3, action: 'Uploaded PDF', subject: 'Neural Networks.pdf', time: '1 day ago', score: '24 pages' },
];

export const QUIZ_TOPICS = [
    { id: 'os-kernels', title: 'Operating Systems: Kernels', difficulty: 'Expert', questions: 20, duration: '30m', color: 'cyan' },
    { id: 'algorithms', title: 'Data Structures & Algorithms', difficulty: 'Advanced', questions: 20, duration: '25m', color: 'pink' },
    { id: 'quantum', title: 'Quantum Mechanics', difficulty: 'Expert', questions: 20, duration: '20m', color: 'purple' },
    { id: 'organic-chem', title: 'Organic Chemistry', difficulty: 'Expert', questions: 20, duration: '20m', color: 'cyan' },
    { id: 'thermodynamics', title: 'Thermodynamics: Entropy', difficulty: 'Advanced', questions: 20, duration: '15m', color: 'pink' },
    { id: 'corporate-finance', title: 'Corporate Finance', difficulty: 'Advanced', questions: 20, duration: '18m', color: 'purple' },
    { id: 'neuroscience', title: 'Cognitive Neuroscience', difficulty: 'Expert', questions: 20, duration: '25m', color: 'cyan' },
    { id: 'intl-relations', title: 'International Relations', difficulty: 'Intermediate', questions: 20, duration: '15m', color: 'pink' },
    { id: 'discrete-math', title: 'Discrete Math: Graph Theory', difficulty: 'Advanced', questions: 20, duration: '20m', color: 'purple' },
    { id: 'fluid-mechanics', title: 'Fluid Mechanics', difficulty: 'Expert', questions: 20, duration: '20m', color: 'cyan' },
    { id: 'bayesian-stats', title: 'Bayesian Inference', difficulty: 'Expert', questions: 20, duration: '20m', color: 'pink' },
    { id: 'calculus-iii', title: 'Multivariable Calculus', difficulty: 'Advanced', questions: 20, duration: '20m', color: 'purple' },
    { id: 'sociology', title: 'Modern Social Theory', difficulty: 'Intermediate', questions: 20, duration: '15m', color: 'cyan' },
    { id: 'legal-studies', title: 'Constitutional Law', difficulty: 'Advanced', questions: 20, duration: '25m', color: 'pink' },
    { id: 'anthropology', title: 'Biological Anthropology', difficulty: 'Intermediate', questions: 20, duration: '15m', color: 'purple' },
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


