
import { useEffect, useState } from 'react';

type Theme = 'light' | 'dark';

export const useTheme = () => {
  const [theme, setTheme] = useState<Theme>(() => {
    const savedTheme = localStorage.getItem('neurai-theme');
    if (savedTheme) return savedTheme as Theme;
    // Default to dark unless the system explicitly prefers light
    const prefersLight = window.matchMedia('(prefers-color-scheme: light)').matches;
    return prefersLight ? 'light' : 'dark';
  });

  useEffect(() => {
    const root = window.document.documentElement;
    
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    
    localStorage.setItem('neurai-theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === 'light' ? 'dark' : 'light'));
  };

  const setThemeValue = (value: Theme | 'system') => {
    if (value === 'system') {
      // remove explicit preference so system preference is used
      localStorage.removeItem('neurai-theme');
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      const newTheme = prefersDark ? 'dark' : 'light';
      setTheme(newTheme);
      const root = window.document.documentElement;
      if (newTheme === 'dark') root.classList.add('dark'); else root.classList.remove('dark');
      return;
    }

    localStorage.setItem('neurai-theme', value);
    setTheme(value);
  };

  // Expose a global setter so other modules (like Settings) can call it if needed
  (window as any).__setThemeFromSettings = setThemeValue;

  return { theme, toggleTheme, setTheme: setThemeValue };
};

export default useTheme;
