import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { Globe, Check } from 'lucide-react';
import { useState } from 'react';

const LANGUAGES = [
    { code: 'en', label: 'English', flag: '🇺🇸' },
    { code: 'es', label: 'Español', flag: '🇪🇸' },
    { code: 'fr', label: 'Français', flag: '🇫🇷' },
    { code: 'de', label: 'Deutsch', flag: '🇩🇪' },
    { code: 'pt', label: 'Português', flag: '🇵🇹' },
    { code: 'hi', label: 'हिन्दी', flag: '🇮🇳' },
    { code: 'mr', label: 'मराठी', flag: '🇮🇳' },
    { code: 'ja', label: '日本語', flag: '🇯🇵' },
    { code: 'ru', label: 'Русский', flag: '🇷🇺' },
    { code: 'zh', label: '中文', flag: '🇨🇳' }
];

export default function LanguageSwitcher() {
    const { i18n } = useTranslation();
    const [isOpen, setIsOpen] = useState(false);

    const toggleLanguage = (code) => {
        i18n.changeLanguage(code);
        setIsOpen(false);
    };

    const currentLang = LANGUAGES.find(l => l.code === i18n.language) || LANGUAGES[0];

    return (
        <div className="relative">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 transition-all group"
                title="Change Language"
            >
                <Globe size={14} className="text-cosmic-cyan group-hover:rotate-12 transition-transform" />
                <span className="text-[10px] font-bold uppercase tracking-widest text-white/70">
                    {currentLang.code}
                </span>
            </button>

            <AnimatePresence>
                {isOpen && (
                    <>
                        <div
                            className="fixed inset-0 z-40"
                            onClick={() => setIsOpen(false)}
                        />
                        <motion.div
                            initial={{ opacity: 0, y: 10, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 10, scale: 0.95 }}
                            className="absolute right-0 top-full mt-3 z-50 min-w-[160px] glass rounded-2xl border border-white/10 p-2 shadow-2xl"
                        >
                            <div className="grid grid-cols-1 gap-1">
                                {LANGUAGES.map((lang) => (
                                    <button
                                        key={lang.code}
                                        onClick={() => toggleLanguage(lang.code)}
                                        className={`flex items-center justify-between px-3 py-2 rounded-xl text-xs transition-all ${i18n.language === lang.code
                                            ? 'bg-cosmic-cyan/20 text-cosmic-cyan font-bold'
                                            : 'hover:bg-white/5 text-gray-400 hover:text-white'
                                            }`}
                                    >
                                        <div className="flex items-center gap-3">
                                            <span className="text-sm">{lang.flag}</span>
                                            <span>{lang.label}</span>
                                        </div>
                                        {i18n.language === lang.code && <Check size={12} />}
                                    </button>
                                ))}
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>
    );
}
