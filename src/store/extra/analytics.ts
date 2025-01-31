import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Analytics {
  dailyUsage: Record<string, {
    appId: string;
    duration: number;
    launches: number;
  }>;
  weeklyUsage: Record<string, {
    appId: string;
    duration: number;
    launches: number;
  }>;
  monthlyUsage: Record<string, {
    appId: string;
    duration: number;
    launches: number;
  }>;
  tags: Record<string, string[]>;
  categories: Record<string, {
    totalUsage: number;
    lastUsed: string;
  }>;
  favorites: string[];
}

interface AnalyticsActions {
  trackAppUsage: (appId: string, duration: number) => void;
  addTag: (appId: string, tag: string) => void;
  removeTag: (appId: string, tag: string) => void;
  toggleFavorite: (appId: string) => void;
  clearHistory: () => void;
  exportAnalytics: () => Promise<Analytics>;
  importAnalytics: (data: Analytics) => void;
}

const useAnalyticsStore = create<Analytics & AnalyticsActions>()(
  persist(
    (set, get) => ({
      dailyUsage: {},
      weeklyUsage: {},
      monthlyUsage: {},
      tags: {},
      categories: {},
      favorites: [],

      trackAppUsage: (appId, duration) => {
        const date = new Date().toISOString().split('T')[0];
        set((state) => {
          const daily = { ...state.dailyUsage };
          if (!daily[date]) {
            daily[date] = { appId, duration: 0, launches: 0 };
          }
          daily[date].duration += duration;
          daily[date].launches += 1;

          // 更新周和月的统计
          // ...实现类似的周和月统计逻辑...

          return { dailyUsage: daily };
        });
      },

      addTag: (appId, tag) => {
        set((state) => ({
          tags: {
            ...state.tags,
            [appId]: [...(state.tags[appId] || []), tag],
          },
        }));
      },

      removeTag: (appId, tag) => {
        set((state) => ({
          tags: {
            ...state.tags,
            [appId]: (state.tags[appId] || []).filter((t) => t !== tag),
          },
        }));
      },

      toggleFavorite: (appId) => {
        set((state) => ({
          favorites: state.favorites.includes(appId)
            ? state.favorites.filter((id) => id !== appId)
            : [...state.favorites, appId],
        }));
      },

      clearHistory: () => {
        set((state) => ({
          dailyUsage: {},
          weeklyUsage: {},
          monthlyUsage: {},
        }));
      },

      exportAnalytics: async () => {
        return get();
      },

      importAnalytics: (data) => {
        set(data);
      },
    }),
    {
      name: 'app-analytics',
    }
  )
);

export default useAnalyticsStore;
