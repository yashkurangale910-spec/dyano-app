import { createContext, useContext, useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

const TutorContext = createContext();

export const TutorProvider = ({ children }) => {
    const { i18n } = useTranslation();
    const [personality, setPersonality] = useState('friendly');
    const [depth, setDepth] = useState('standard');
    const [language, setLanguage] = useState(i18n.language || 'en');

    // Automatically sync context language when i18next language changes
    useEffect(() => {
        if (i18n.language && i18n.language !== language) {
            setLanguage(i18n.language.split('-')[0]); // Handle codes like 'en-US'
        }
    }, [i18n.language]);

    // Update i18next when context language is changed explicitly
    const changeLanguage = (newLang) => {
        setLanguage(newLang);
        i18n.changeLanguage(newLang);
    };

    return (
        <TutorContext.Provider value={{
            personality,
            setPersonality,
            depth,
            setDepth,
            language,
            setLanguage: changeLanguage
        }}>
            {children}
        </TutorContext.Provider>
    );
};

export const useTutorContext = () => {
    const context = useContext(TutorContext);
    if (!context) {
        throw new Error('useTutorContext must be used within a TutorProvider');
    }
    return context;
};
