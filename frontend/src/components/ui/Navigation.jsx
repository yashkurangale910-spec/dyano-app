import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Search, Terminal } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import LanguageSwitcher from './LanguageSwitcher';
import Tooltip from './Tooltip';

export default function Navigation() {
    const { t } = useTranslation();
    const location = useLocation();
    const isLanding = location.pathname === '/';
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const navItems = isLanding
        ? [{ path: '/dashboard', label: 'Dashboard' }]
        : [
            { path: '/dashboard', label: 'Terminal' },
            { path: '/quiz', label: 'Quiz' },
            { path: '/pdf', label: 'Docs' },
            { path: '/roadmap', label: 'Path' },
            { path: '/chatbot', label: 'Tutor' },
            { path: '/flashcards', label: 'Cards' },
            { path: '/imagine', label: 'Visual' },
        ];

    return (
        <motion.nav
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="fixed top-0 left-0 right-0 z-[100] h-16 bg-bg-main/60 backdrop-blur-xl border-b border-white/[0.05]"
        >
            <div className="max-w-7xl mx-auto h-full px-6 flex items-center justify-between">
                {/* Brand */}
                <Link to="/" className="flex items-center gap-3 group">
                    <div className="w-8 h-8 rounded-lg bg-white flex-center text-black group-hover:scale-105 transition-transform">
                        <Terminal size={18} strokeWidth={3} />
                    </div>
                    <span className="text-xl font-black text-white tracking-tighter uppercase">DYANO.</span>
                </Link>

                {/* Desktop Nav */}
                <div className="hidden lg:flex items-center gap-8">
                    <div className="flex items-center gap-1">
                        {navItems.map((item) => (
                            <Link
                                key={item.path}
                                to={item.path}
                                className={`relative px-4 py-2 text-[10px] uppercase tracking-[0.2em] font-black transition-all ${location.pathname === item.path ? 'text-white' : 'text-text-muted hover:text-white'
                                    }`}
                            >
                                {item.label}
                                {location.pathname === item.path && (
                                    <motion.div
                                        layoutId="nav-active"
                                        className="absolute -bottom-[21px] left-0 right-0 h-[2px] bg-accent-cyan"
                                    />
                                )}
                            </Link>
                        ))}
                    </div>

                    <div className="h-4 w-[1px] bg-white/10" />

                    <div className="flex items-center gap-6">
                        <Tooltip text="Search Tool" position="bottom">
                            <button className="text-text-muted hover:text-white transition-colors">
                                <Search size={16} />
                            </button>
                        </Tooltip>

                        <LanguageSwitcher />

                        <div className="flex items-center gap-4 pl-4 border-l border-white/10">
                            <div className="w-8 h-8 rounded-md bg-bg-surface-light border border-white/10 flex-center text-[10px] font-bold text-white uppercase italic">
                                S
                            </div>
                        </div>
                    </div>
                </div>

                {/* Mobile Trigger */}
                <button
                    className="lg:hidden p-2 text-white/40 hover:text-white transition-all"
                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                >
                    {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
                </button>
            </div>

            {/* Mobile Drawer */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        className="fixed inset-0 top-16 z-[99] lg:hidden bg-bg-main p-6"
                    >
                        <div className="flex flex-col gap-6">
                            {navItems.map((item) => (
                                <Link
                                    key={item.path}
                                    to={item.path}
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className="text-3xl font-black text-white tracking-tighter uppercase"
                                >
                                    {item.label}
                                </Link>
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.nav>
    );
}
