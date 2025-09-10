import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { getSetting, saveSetting } from '../utils/storage';

// --- THEME DEFINITIONS ---
const lightTheme = {
  background: '#f2f2f7', cardBackground: '#ffffff', text: '#000000', textSecondary: '#6d6d6d',
  textTertiary: '#999999', primary: '#007aff', secondary: '#5856d6', success: '#34c759',
  warning: '#ff9500', error: '#ff3b30', info: '#5ac8fa', purple: '#af52de', orange: '#ff9500',
  cardShadow: 'rgba(0,0,0,0.04)', drawerBg: '#ffffff', headerBg: 'rgba(248,248,248,0.94)', separator: '#c6c6c8',
};

const darkTheme = {
  background: '#000000', cardBackground: '#1c1c1e', text: '#ffffff', textSecondary: '#ebebf5',
  textTertiary: '#8e8e93', primary: '#0a84ff', secondary: '#5e5ce6', success: '#30d158',
  warning: '#ff9f0a', error: '#ff453a', info: '#64d2ff', purple: '#bf5af2', orange: '#ff9f0a',
  cardShadow: 'rgba(255,255,255,0.04)', drawerBg: '#1c1c1e', headerBg: 'rgba(28,28,30,0.94)', separator: '#38383a',
};

const highContrastLightTheme = {
  ...lightTheme, background: '#ffffff', text: '#000000', textSecondary: '#000000',
  cardBackground: '#ffffff', separator: '#000000', primary: '#0000ff', error: '#d40000',
};

const highContrastDarkTheme = {
  ...darkTheme, background: '#000000', text: '#ffffff', textSecondary: '#ffffff',
  cardBackground: '#000000', separator: '#ffffff', primary: '#ffff00', success: '#00ff00',
};

// --- CONTEXT & PROVIDER ---
const ThemeContext = createContext();

export const useTheme = () => useContext(ThemeContext);

export function ThemeProvider({ children }) {
  const [isDark, setIsDark] = useState(false);
  const [highContrast, setHighContrast] = useState(false);

  useEffect(() => {
    getSetting('darkTheme').then(v => setIsDark(v || false));
    getSetting('highContrast').then(v => setHighContrast(v || false));
  }, []);

  const toggleTheme = useCallback(() => {
    setIsDark(prev => {
      const newTheme = !prev;
      saveSetting('darkTheme', newTheme);
      return newTheme;
    });
  }, []);

  const toggleHighContrast = useCallback((value) => {
    setHighContrast(value);
    saveSetting('highContrast', value);
  }, []);

  const theme = highContrast 
    ? (isDark ? highContrastDarkTheme : highContrastLightTheme) 
    : (isDark ? darkTheme : lightTheme);

  const value = { theme, isDark, toggleTheme, highContrast, toggleHighContrast };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}
