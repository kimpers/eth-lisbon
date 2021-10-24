import { useEffect, useState } from 'react';

type ThemeModes = 'light' | 'dark';

const useDarkMode = () => {
  const [theme, setTheme] = useState<ThemeModes>('light');
  const setMode = (mode: ThemeModes) => {
    window.localStorage.setItem('theme', mode);
    setTheme(mode);
  };
  const toggleTheme = () => {
    theme === 'light' ? setMode('dark') : setMode('light');
  };
  useEffect(() => {
    const localTheme = window.localStorage.getItem('theme');
    if (localTheme === 'light' || localTheme === 'dark') {
      setTheme(localTheme);
    } else {
      setMode('light');
    }
  }, []);
  return { theme, toggleTheme };
};

export { useDarkMode };
