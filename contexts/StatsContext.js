import React, { createContext, useContext, useState, useEffect } from 'react';
import { getPreparednessStats } from '../utils/storage';

const StatsContext = createContext();

export function StatsProvider({ children }) {
  const [stats, setStats] = useState({ completion: 0, avgScore: 0, drills: 0 });

  const refreshStats = async () => {
    try {
      const newStats = await getPreparednessStats();
      setStats(newStats);
    } catch (error) {
      console.log('Stats refresh error:', error);
    }
  };

  useEffect(() => {
    refreshStats();
  }, []);

  return (
    <StatsContext.Provider value={{ stats, refreshStats }}>
      {children}
    </StatsContext.Provider>
  );
}

export const useStats = () => {
  const context = useContext(StatsContext);
  if (!context) {
    throw new Error('useStats must be used within StatsProvider');
  }
  return context;
};
