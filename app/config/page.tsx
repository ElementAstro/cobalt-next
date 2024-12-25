'use client'

import { useEffect } from 'react';
import SettingsInterface from '../components/SettingsInterface';
import { ThemeProvider } from 'next-themes';
import { useSettingsStore } from '../store/settingsStore';

export default function Home() {
  const { fetchSettings } = useSettingsStore();

  useEffect(() => {
    fetchSettings();
  }, [fetchSettings]);

  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <main className="min-h-screen bg-background text-foreground transition-colors duration-300 ease-in-out">
        <SettingsInterface />
      </main>
    </ThemeProvider>
  );
}

