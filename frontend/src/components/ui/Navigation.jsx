import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
<<<<<<< HEAD
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Menu, X, Search, Activity } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import LanguageSwitcher from './LanguageSwitcher';
import Tooltip from './Tooltip';
=======
import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import LanguageSwitcher from './LanguageSwitcher';
>>>>>>> f37b43085a606618791e2462184fc2d00039b97c

export default function Navigation() {
    const { t } = useTranslation();
    const location = useLocation();
    const isLanding = location.pathname === '/';
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const navItems = isLanding
        ? [{ path: '/dashboard', label: t('nav.dashboard') }]
        : [
            { path: '/dashboard', label: t('nav.dashboard') },
            { path: '/quiz', label: t('nav.quiz') },
<<<<<<< HEAD
            { path: '/roadmap', label: t('nav.roadmap') },
            { path: '/chatbot', label: t('nav.chatbot') },
            { path: '/pdf', label: t('nav.pdf') },
            { path: '/flashcards', label: t('nav.flashcards') },
=======
            { path: '/flashcards', label: t('nav.flashcards') },
            { path: '/pdf', label: t('nav.pdf') },
            { path: '/chatbot', label: t('nav.chatbot') },
            { path: '/progress', label: t('nav.progress') },
            { path: '/roadmap', label: t('nav.roadmap') },
>>>>>>> f37b43085a606618791e2462184fc2d00039b97c
        ];

    return (
        <motion.nav
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            className="fixed top-0 left-0 right-0 z-[100] h-20 bg-black/40 backdrop-blur-3xl border-b border-white/[0.05]"
        >
<<<<<<< HEAD
            <div className="container-cosmic h-full flex items-center justify-between">
                {/* Brand Identity */}
                <Link to="/" className="flex items-center gap-4 group">
                    <div className="relative">
                        <div className="absolute inset-0 bg-cosmic-cyan/20 blur-lg rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
                        <Sparkles className="w-8 h-8 text-white relative z-10 group-hover:text-cosmic-cyan transition-colors" />
                    </div>
                    <div>
                        <span className="text-xl font-display font-black text-white tracking-[-0.05em] uppercase">DYANO</span>
                        <div className="h-[2px] w-full bg-gradient-to-r from-cosmic-cyan to-transparent scale-x-0 group-hover:scale-x-100 transition-transform origin-left" />
                    </div>
                </Link>

                {/* Desktop High-Density Nav */}
                <div className="hidden lg:flex items-center gap-10">
                    <div className="flex items-center gap-1">
=======
            <div className="container-cosmic h-20 flex items-center justify-between">
                <Link to="/" className="flex items-center gap-3">
                    <Sparkles className="w-8 h-8 text-cosmic-cyan" />
                    <span className="text-2xl font-display font-bold text-gradient-glow uppercase tracking-tighter">DYANO</span>
                </Link>

                <div className="flex items-center gap-6">
                    <div className="hidden lg:flex items-center gap-6">
>>>>>>> f37b43085a606618791e2462184fc2d00039b97c
                        {navItems.map((item) => (
                            <Link
                                key={item.path}
                                to={item.path}
<<<<<<< HEAD
                                className={`relative px-4 py-2 text-[10px] uppercase tracking-[0.3em] font-black transition-all ${location.pathname === item.path ? 'text-white' : 'text-gray-600 hover:text-white'
                                    }`}
                            >
                                {item.label}
                                {location.pathname === item.path && (
                                    <motion.div
                                        layoutId="nav-active"
                                        className="absolute bottom-0 left-4 right-4 h-[2px] bg-cosmic-cyan shadow-glow-cyan"
                                    />
                                )}
                            </Link>
                        ))}
                    </div>
=======
                                className="text-[10px] uppercase tracking-[0.2em] font-display font-bold text-white/40 hover:text-cosmic-cyan transition-all"
                            >
                                {item.label}
                            </Link>
                        ))}
                    </div>

                    <div className="h-8 w-px bg-white/10 hidden md:block" />

                    <LanguageSwitcher />
>>>>>>> f37b43085a606618791e2462184fc2d00039b97c

                    <div className="h-4 w-[1px] bg-white/10" />

                    <div className="flex items-center gap-6">
                        {/* Universal Search Hint */}
                        <Tooltip text="Universal Search (Ctrl+K)" position="bottom">
                            <button className="flex items-center gap-3 px-4 py-2 rounded-xl bg-white/[0.03] border border-white/10 hover:bg-white/[0.08] transition-all group">
                                <Search size={14} className="text-gray-600 group-hover:text-cosmic-cyan transition-colors" />
                                <span className="text-[9px] font-mono font-black text-gray-700 uppercase tracking-widest hidden xl:block">^K Search</span>
                            </button>
                        </Tooltip>

                        <LanguageSwitcher />

                        <div className="flex items-center gap-4 pl-4 border-l border-white/10">
                            <div className="text-right hidden sm:block">
                                <div className="text-[8px] font-black text-white uppercase tracking-widest">System Link</div>
                                <div className="flex items-center justify-end gap-1">
                                    <div className="w-1 h-1 bg-green-500 rounded-full animate-pulse" />
                                    <span className="text-[8px] font-mono text-gray-700">NODE_ACTIVE</span>
                                </div>
                            </div>
                            <button className="w-10 h-10 rounded-2xl bg-gradient-to-br from-cosmic-purple to-cosmic-pink border border-white/20 flex items-center justify-center font-black text-white text-xs shadow-2xl hover:scale-105 transition-all outline-none">
                                U
                            </button>
                        </div>
                    </div>
                </div>

                {/* Mobile Trigger */}
                <button
                    className="lg:hidden p-3 rounded-2xl bg-white/5 border border-white/10 text-white/40 hover:text-white transition-all"
                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                >
                    {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
                </button>
            </div>

            {/* Cinematic Mobile Drawer */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, scale: 1.1 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 1.1 }}
                        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                        className="fixed inset-0 top-20 z-[99] lg:hidden bg-black/80 backdrop-blur-3xl"
                    >
                        <div className="container-cosmic py-12 flex flex-col gap-12 text-center h-[calc(100vh-80px)] overflow-y-auto">
                            <div className="flex flex-col gap-4">
                                {navItems.map((item, index) => (
                                    <motion.div
                                        key={item.path}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: index * 0.05 }}
                                    >
                                        <Link
                                            to={item.path}
                                            onClick={() => setIsMobileMenuOpen(false)}
                                            className={`group relative py-6 text-4xl font-display font-black tracking-tighter uppercase transition-all ${location.pathname === item.path ? 'text-cosmic-cyan scale-110' : 'text-white/20 hover:text-white'
                                                }`}
                                        >
                                            {item.label}
                                            {location.pathname === item.path && (
                                                <div className="absolute inset-0 bg-cosmic-cyan/5 blur-3xl rounded-full" />
                                            )}
                                        </Link>
                                    </motion.div>
                                ))}
                            </div>

                            <div className="mt-auto pb-12">
                                <div className="h-[1px] w-12 bg-white/10 mx-auto mb-8" />
                                <div className="flex justify-center gap-12">
                                    <div className="text-center">
                                        <div className="text-[10px] font-black text-gray-700 uppercase tracking-[0.4em] mb-2">Protocol</div>
                                        <div className="text-white font-bold">NODE_01</div>
                                    </div>
                                    <div className="text-center">
                                        <div className="text-[10px] font-black text-gray-700 uppercase tracking-[0.4em] mb-2">Uptime</div>
                                        <div className="text-white font-bold text-gradient-cosmic">99.9%</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.nav>
    );
}
