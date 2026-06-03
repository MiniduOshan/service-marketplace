import { createContext, useContext, useEffect, useState } from 'react';
import { apiRequest } from '../lib/api';

const ConfigContext = createContext(null);

export function ConfigProvider({ children }) {
  const [config, setConfig] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadConfig = async () => {
    try {
      const response = await apiRequest('/platform-config');
      setConfig(response.data?.privileges || {});
    } catch (error) {
      console.error('Failed to load platform config', error);
      setConfig({});
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadConfig();
  }, []);

  const refreshConfig = () => {
    loadConfig();
  };

  return (
    <ConfigContext.Provider value={{ config, loading, refreshConfig }}>
      {children}
    </ConfigContext.Provider>
  );
}

export function useConfig() {
  const context = useContext(ConfigContext);
  if (!context) {
    throw new Error('useConfig must be used within a ConfigProvider');
  }
  return context;
}
