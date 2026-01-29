import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import LanguageSwitcher from './LanguageSwitcher';

export default function Navigation() {
    const { t } = useTranslation();
    const location = useLocation();
    const isLanding = location.pathname === '/';

    // Significantly simplified nav for Landing page to reduce cognitive load
    const navItems = isLanding
        ? [{ path: '/dashboard', label: t('nav.dashboard') }]
        : [
            { path: '/dashboard', label: t('nav.dashboard') },
            { path: '/quiz', label: t('nav.quiz') },
            { path: '/flashcards', label: t('nav.flashcards') },
            { path: '/pdf', label: t('nav.pdf') },
            { path: '/chatbot', label: t('nav.chatbot') },
            { path: '/progress', label: t('nav.progress') },
            { path: '/roadmap', label: t('nav.roadmap') },
        ];

    return (
        <motion.nav
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            className="fixed top-0 left-0 right-0 z-50 glass border-b border-white/10"
        >
            <div className="container-cosmic h-20 flex items-center justify-between">
                <Link to="/" className="flex items-center gap-3">
                    <Sparkles className="w-8 h-8 text-cosmic-cyan" />
                    <span className="text-2xl font-display font-bold text-gradient-glow uppercase tracking-tighter">DYANO</span>
                </Link>

                <div className="flex items-center gap-6">
                    <div className="hidden lg:flex items-center gap-6">
                        {navItems.map((item) => (
                            <Link
                                key={item.path}
                                to={item.path}
                                className="text-[10px] uppercase tracking-[0.2em] font-display font-bold text-white/40 hover:text-cosmic-cyan transition-all"
                            >
                                {item.label}
                            </Link>
                        ))}
                    </div>

                    <div className="h-8 w-px bg-white/10 hidden md:block" />

                    <LanguageSwitcher />

                    <button className="w-10 h-10 rounded-full bg-gradient-to-r from-cosmic-purple to-cosmic-pink flex items-center justify-center font-bold text-white shadow-lg shadow-purple-500/20">
                        U
                    </button>
                </div>
            </div>
        </motion.nav>
    );
}
