// src/components/LocalizationContext.js
import { createContext, useState, useEffect } from 'react';

const LocalizationContext = createContext();

const LocalizationProvider = ({ children }) => {
  const [language, setLanguage] = useState(() => {
    const storedLanguage = localStorage.getItem('language');
    return storedLanguage || 'en';
  });

  useEffect(() => {
    localStorage.setItem('language', language);
  }, [language]);

  const switchLanguage = (lang) => {
    setLanguage(lang);
  };

  return (
    <LocalizationContext.Provider value={{ language, switchLanguage }}>
      {children}
    </LocalizationContext.Provider>
  );
};

export { LocalizationProvider, LocalizationContext };