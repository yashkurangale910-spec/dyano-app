import { useTranslation } from 'react-i18next';
import './LanguageSwitcher.css';

const languages = [
    { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'es', name: 'Español', flag: '🇪🇸' },
    { code: 'fr', name: 'Français', flag: '🇫🇷' },
    { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
    { code: 'hi', name: 'हिन्दी', flag: '🇮🇳' },
    { code: 'zh', name: '中文', flag: '🇨🇳' },
    { code: 'ja', name: '日本語', flag: '🇯🇵' },
    { code: 'ar', name: 'العربية', flag: '🇦🇪' },
];

function LanguageSwitcher() {
    const { i18n } = useTranslation();

    const changeLanguage = (lng) => {
        i18n.changeLanguage(lng);
        // Set document direction for RTL languages
        document.documentElement.dir = lng === 'ar' ? 'rtl' : 'ltr';
    };

    return (
        <div className="language-switcher">
            <button className="language-button">
                <span className="current-flag">
                    {languages.find(l => l.code === i18n.language)?.flag || '🌐'}
                </span>
                <span className="language-text">
                    {languages.find(l => l.code === i18n.language)?.name || 'Language'}
                </span>
                <span className="dropdown-arrow">▼</span>
            </button>

            <div className="language-dropdown">
                {languages.map((lang) => (
                    <button
                        key={lang.code}
                        className={`language-option ${i18n.language === lang.code ? 'active' : ''}`}
                        onClick={() => changeLanguage(lang.code)}
                    >
                        <span className="flag">{lang.flag}</span>
                        <span className="name">{lang.name}</span>
                        {i18n.language === lang.code && <span className="checkmark">✓</span>}
                    </button>
                ))}
            </div>
        </div>
    );
}

export default LanguageSwitcher;
