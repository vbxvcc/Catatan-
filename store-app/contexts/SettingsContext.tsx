'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { StoreSettings } from '@/types';
import { getSettings, updateSettings as saveSettings } from '@/lib/storage';

interface SettingsContextType {
  settings: StoreSettings;
  updateSettings: (updates: Partial<StoreSettings>) => void;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export const SettingsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useState<StoreSettings>(getSettings());

  useEffect(() => {
    const loadedSettings = getSettings();
    setSettings(loadedSettings);
    
    if (loadedSettings.theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, []);

  const updateSettings = (updates: Partial<StoreSettings>) => {
    const newSettings = { ...settings, ...updates };
    setSettings(newSettings);
    saveSettings(updates);
    
    if (updates.theme) {
      if (updates.theme === 'dark') {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    }
  };

  return (
    <SettingsContext.Provider value={{ settings, updateSettings }}>
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
};
