// AgriMitra AI - App Context
import React, { createContext, useContext, useState, useEffect } from 'react';
import type { Language, AppState } from '../types';
import { api } from '../services/api';

interface AppContextType extends AppState {
  setLanguage: (lang: Language) => void;
  setSelectedFarmId: (id: string | null) => void;
  setDemoMode: (val: boolean) => void;
  backendOnline: boolean;
  modelAvailable: boolean;
  refreshStatus: () => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    return (localStorage.getItem('agrimitra_lang') as Language) || 'en';
  });
  const [selectedFarmId, setSelectedFarmId] = useState<string | null>(() => {
    return localStorage.getItem('agrimitra_farm_id') || null;
  });
  const [demoMode, setDemoModeState] = useState<boolean>(true);
  const [backendOnline, setBackendOnline] = useState<boolean>(false);
  const [modelAvailable, setModelAvailable] = useState<boolean>(false);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('agrimitra_lang', lang);
  };

  const setDemoMode = (val: boolean) => {
    setDemoModeState(val);
  };

  const checkBackend = async () => {
    try {
      const health = await api.system.health();
      setBackendOnline(health?.status === 'ok');
      setModelAvailable(Boolean(health?.model_available));
    } catch {
      setBackendOnline(false);
      setModelAvailable(false);
    }
  };

  useEffect(() => {
    checkBackend();
    const interval = setInterval(checkBackend, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <AppContext.Provider
      value={{
        language,
        setLanguage,
        selectedFarmId,
        setSelectedFarmId,
        demoMode,
        setDemoMode,
        backendOnline,
        modelAvailable,
        refreshStatus: checkBackend,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within an AppProvider');
  return context;
};
