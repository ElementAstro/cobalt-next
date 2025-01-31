import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface Statistics {
  appUsage: Record<string, {
    launchCount: number;
    totalDuration: number;
    lastUsed: string;
  }>;
  addUsage: (appId: string, duration: number) => void;
  getTopApps: (limit?: number) => Array<{
    appId: string;
    stats: { launchCount: number; totalDuration: number; lastUsed: string };
  }>;
}

export const useStatistics = create<Statistics>()(
  persist(
    (set, get) => ({
      appUsage: {},
      addUsage: (appId, duration) => {
        set((state) => ({
          appUsage: {
            ...state.appUsage,
            [appId]: {
              launchCount: (state.appUsage[appId]?.launchCount || 0) + 1,
              totalDuration: (state.appUsage[appId]?.totalDuration || 0) + duration,
              lastUsed: new Date().toISOString(),
            },
          },
        }));
      },
      getTopApps: (limit = 5) => {
        const { appUsage } = get();
        return Object.entries(appUsage)
          .map(([appId, stats]) => ({ appId, stats }))
          .sort((a, b) => b.stats.launchCount - a.stats.launchCount)
          .slice(0, limit);
      },
    }),
    {
      name: 'app-statistics',
    }
  )
);
