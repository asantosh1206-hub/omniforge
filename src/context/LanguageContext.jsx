import React, { createContext, useContext } from 'react';
import { useTranslation } from 'react-i18next';
import '../i18n'; // Ensure i18n is initialized

export const useLanguage = () => {
  const { t, i18n } = useTranslation();
  
  const language = i18n.language;
  
  const setLanguage = (lang) => {
    i18n.changeLanguage(lang);
    localStorage.setItem('omniforge-language', lang);
  };

  const toggleLanguage = () => {
    const newLang = language === 'en' ? 'hi' : 'en';
    setLanguage(newLang);
  };

  return { language, setLanguage, toggleLanguage, t };
};

// Dummy provider to maintain backwards compatibility with App.jsx
const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
  return (
    <LanguageContext.Provider value={{}}>
      {children}
    </LanguageContext.Provider>
  );
};
