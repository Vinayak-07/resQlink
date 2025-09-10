import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { getSetting, saveSetting } from '../utils/storage';
import { LANG, strings } from '../constants/content';

const LangContext = createContext();

export const useLang = () => useContext(LangContext);

export function LangProvider({ children }) {
  const [lang, setLang] = useState(LANG.EN);

  useEffect(() => {
    getSetting('lang').then(v => setLang(v || LANG.EN));
  }, []);

  const switchLang = useCallback((newLang) => {
    setLang(newLang);
    saveSetting('lang', newLang);
  }, []);

  return (
    <LangContext.Provider value={{ lang, switchLang, strings: strings[lang] }}>
      {children}
    </LangContext.Provider>
  );
}
