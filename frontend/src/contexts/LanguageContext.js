import React, { createContext, useState, useContext } from 'react';
import { translations } from '../translations';

const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState('en');

  const translate = (key) => {
    try {
      const keys = key.split('.');
      let translation = translations[language];
      
      for (const k of keys) {
        if (translation && translation[k]) {
          translation = translation[k];
        } else {
          console.warn(`Translation missing for key: ${key}`);
          return translations['en'][key] || key; // Fallback to English or key
        }
      }
      
      return translation;
    } catch (error) {
      console.error(`Error translating key: ${key}`, error);
      return key;
    }
  };

  const t = (key, params = {}) => {
    try {
      let translation = translate(key);
      
      // Replace parameters in the translation string
      Object.keys(params).forEach(param => {
        translation = translation.replace(`{${param}}`, params[param]);
      });
      
      return translation;
    } catch (error) {
      console.error(`Error processing translation for key: ${key}`, error);
      return key;
    }
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}; 