import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { getSetting, saveSetting } from '../utils/storage';

const AccessibilityContext = createContext();

export const useAccessibility = () => useContext(AccessibilityContext);

export function AccessibilityProvider({ children }) {
  const [largeText, setLargeText] = useState(false);
  const [reduceMotion, setReduceMotion] = useState(false);

  useEffect(() => {
    getSetting('largeText').then(v => setLargeText(v || false));
    getSetting('reduceMotion').then(v => setReduceMotion(v || false));
  }, []);

  const toggleLargeText = useCallback((value) => {
    setLargeText(value);
    saveSetting('largeText', value);
  }, []);

  const toggleReduceMotion = useCallback((value) => {
    setReduceMotion(value);
    saveSetting('reduceMotion', value);
  }, []);
  
  const scaleFont = useCallback((size) => (largeText ? size * 1.2 : size), [largeText]);

  const value = { largeText, reduceMotion, toggleLargeText, toggleReduceMotion, scaleFont };

  return (
    <AccessibilityContext.Provider value={value}>
      {children}
    </AccessibilityContext.Provider>
  );
}
