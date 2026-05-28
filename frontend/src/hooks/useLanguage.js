import { useState, useEffect } from 'react';
import { getTranslation } from '../lib/translate';

export default function useLanguage() {
  const [lang, setLang] = useState(() => localStorage.getItem('preferred_language') || 'English');

  useEffect(() => {
    const handleLanguageChange = () => {
      setLang(localStorage.getItem('preferred_language') || 'English');
    };

    window.addEventListener('languageChange', handleLanguageChange);
    return () => {
      window.removeEventListener('languageChange', handleLanguageChange);
    };
  }, []);

  return {
    lang,
    t: getTranslation(lang),
  };
}
