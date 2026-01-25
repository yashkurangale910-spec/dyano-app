import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';

export default function Navigation() {
    const location = useLocation();
    const isLanding = location.pathname === '/';

    // Significantly simplified nav for Landing page to reduce cognitive load
    const navItems = isLanding
        ? [{ path: '/dashboard', label: 'Go to Dashboard' }]
        : [
            { path: '/dashboard', label: 'Dashboard' },
            { path: '/quiz', label: 'Quiz' },
            { path: '/flashcards', label: 'Flashcards' },
            { path: '/pdf', label: 'PDF Lab' },
            { path: '/progress', label: 'Progress' },
            { path: '/roadmap', label: 'Roadmap' },
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
                    <span className="text-2xl font-display font-bold text-gradient-glow">DYANO</span>
                </Link>

                <div className="flex items-center gap-6">
                    {navItems.map((item) => (
                        <Link
                            key={item.path}
                            to={item.path}
                            className="text-sm font-display font-semibold text-gray-400 hover:text-white transition-colors"
                        >
                            {item.label}
                        </Link>
                    ))}

                    <button className="w-10 h-10 rounded-full bg-gradient-to-r from-cosmic-purple to-cosmic-pink flex items-center justify-center font-bold text-white shadow-lg shadow-purple-500/20">
                        U
                    </button>
                </div>
            </div>
        </motion.nav>
    );
}
