import { Link, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useState } from "react";

export const Header = () => {
    const location = useLocation();
    const { t, i18n } = useTranslation();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    const changeLanguage = (lng) => {
        i18n.changeLanguage(lng);
    };

    const navItems = [
        { name: 'Dashboard', path: '/dashboard', icon: '📊' },
        { name: 'Learn', path: '/learn', icon: '🚀' },
        { name: 'PDF Lab', path: '/pdflab', icon: '📄' }
    ];

    return (
        <header className="fixed top-0 left-0 w-full z-50 glass-card-dark border-b border-white/10">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-20">

                    {/* Logo */}
                    <Link to="/dashboard" className="flex items-center gap-3 group">
                        <div className="relative">
                            <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-purple-500/50 transition-all duration-300 group-hover:scale-110">
                                <span className="text-2xl font-black text-white">D</span>
                            </div>
                            <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-gray-900 animate-pulse"></div>
                        </div>
                        <div>
                            <span className="text-2xl font-black text-white tracking-tight" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
                                Dyano
                            </span>
                            <div className="text-xs text-white/40 font-medium">AI Learning Platform</div>
                        </div>
                    </Link>

                    {/* Desktop Navigation */}
                    <nav className="hidden md:flex items-center gap-2">
                        {navItems.map((item) => {
                            const active = location.pathname === item.path ||
                                (item.path === '/learn' && location.pathname === '/');
                            return (
                                <Link
                                    key={item.name}
                                    to={item.path}
                                    className={`
                                        px-4 py-2 rounded-lg font-semibold text-sm transition-all duration-300
                                        ${active
                                            ? 'bg-white/20 text-white shadow-lg'
                                            : 'text-white/60 hover:text-white hover:bg-white/10'
                                        }
                                    `}
                                >
                                    <span className="mr-2">{item.icon}</span>
                                    {item.name}
                                </Link>
                            );
                        })}
                    </nav>

                    {/* Right Actions */}
                    <div className="hidden md:flex items-center gap-4">
                        {/* Language Selector */}
                        <div className="relative">
                            <select
                                onChange={(e) => changeLanguage(e.target.value)}
                                value={i18n.language}
                                className="appearance-none bg-white/10 text-white text-sm font-semibold px-4 py-2 pr-8 rounded-lg cursor-pointer hover:bg-white/20 transition-all outline-none border border-white/20"
                            >
                                <option value="en" className="bg-gray-900">🇬🇧 English</option>
                                <option value="hi" className="bg-gray-900">🇮🇳 हिंदी</option>
                                <option value="es" className="bg-gray-900">🇪🇸 Español</option>
                            </select>
                            <svg className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-white pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                        </div>

                        {/* CTA Button */}
                        <Link
                            to="/learn"
                            className="btn btn-primary"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                            </svg>
                            Start Learning
                        </Link>
                    </div>

                    {/* Mobile Menu Button */}
                    <button
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        className="md:hidden p-2 rounded-lg bg-white/10 text-white hover:bg-white/20 transition-all"
                    >
                        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            {mobileMenuOpen ? (
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            ) : (
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                            )}
                        </svg>
                    </button>
                </div>

                {/* Mobile Menu */}
                {mobileMenuOpen && (
                    <div className="md:hidden py-4 border-t border-white/10 animate-fade-in">
                        <nav className="flex flex-col gap-2">
                            {navItems.map((item) => {
                                const active = location.pathname === item.path;
                                return (
                                    <Link
                                        key={item.name}
                                        to={item.path}
                                        onClick={() => setMobileMenuOpen(false)}
                                        className={`
                                            px-4 py-3 rounded-lg font-semibold text-sm transition-all
                                            ${active
                                                ? 'bg-white/20 text-white'
                                                : 'text-white/60 hover:text-white hover:bg-white/10'
                                            }
                                        `}
                                    >
                                        <span className="mr-2">{item.icon}</span>
                                        {item.name}
                                    </Link>
                                );
                            })}
                        </nav>
                        <div className="mt-4 flex flex-col gap-3">
                            <select
                                onChange={(e) => changeLanguage(e.target.value)}
                                value={i18n.language}
                                className="bg-white/10 text-white text-sm font-semibold px-4 py-3 rounded-lg cursor-pointer outline-none border border-white/20"
                            >
                                <option value="en" className="bg-gray-900">🇬🇧 English</option>
                                <option value="hi" className="bg-gray-900">🇮🇳 हिंदी</option>
                                <option value="es" className="bg-gray-900">🇪🇸 Español</option>
                            </select>
                            <Link
                                to="/learn"
                                className="btn btn-primary w-full justify-center"
                                onClick={() => setMobileMenuOpen(false)}
                            >
                                Start Learning
                            </Link>
                        </div>
                    </div>
                )}
            </div>
        </header>
    );
};