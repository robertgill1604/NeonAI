"use client";

import { useState, useEffect, useCallback } from 'react';

type Theme = 'light' | 'dark';

export function useTheme(defaultTheme: Theme = 'dark') {
  const [theme, setTheme] = useState<Theme | undefined>(undefined);

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') as Theme | null;
    setTheme(savedTheme || defaultTheme);
  }, [defaultTheme]);

  useEffect(() => {
    if (theme === undefined) return;
    const root = window.document.documentElement;
    root.classList.remove('light', 'dark');
    root.classList.add(theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = useCallback(() => {
    setTheme((prevTheme) => (prevTheme === 'light' ? 'dark' : 'light'));
  }, []);

  return { theme: theme || defaultTheme, toggleTheme };
}
