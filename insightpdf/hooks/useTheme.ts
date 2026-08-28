import { useEffect, useState } from 'react';
import { STORAGE_KEYS } from '@/constants';

export type Theme = 'light' | 'dark';

const getInitialTheme = (): Theme => {
  if (typeof window === 'undefined') return 'light';
  const saved = localStorage.getItem(STORAGE_KEYS.THEME);
  if (saved === 'dark' || saved === 'light') return saved;
  // Default to light theme
  return 'light';
};

export const useTheme = () => {
  const [theme, setTheme] = useState<Theme>(getInitialTheme);

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.toggle('dark', theme === 'dark');
    try {
      localStorage.setItem(STORAGE_KEYS.THEME, theme);
    } catch {
      // Storage unavailable (private mode) — theme just won't persist.
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  return { theme, toggleTheme };
};
