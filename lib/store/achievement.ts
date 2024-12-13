import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Achievement } from "@/types/achievement";
import { achievements as initialAchievements } from "@/data/achievements";

interface AchievementState {
  achievements: Achievement[];
  lastUnlockedAchievement: Achievement | null;
  isMockMode: boolean;
  setAchievements: (achievements: Achievement[]) => void;
  unlockAchievement: (achievementId: string) => void;
  incrementProgress: (achievementId: string, amount: number) => void;
  resetProgress: (achievementId: string) => void;
  resetAllProgress: () => void;
  toggleMockMode: () => void;
  getAchievementById: (achievementId: string) => Achievement | undefined;
  getAchievementsByCategory: (category: string) => Achievement[];
  getTotalPoints: () => number;
  getOverallProgress: () => number;
}

export const useAchievementStore = create<AchievementState>()(
  persist(
    (set, get) => ({
      achievements: initialAchievements,
      lastUnlockedAchievement: null,
      isMockMode: false,
      setAchievements: (achievements) => set({ achievements }),
      unlockAchievement: (achievementId) =>
        set((state) => {
          const updatedAchievements = state.achievements.map((a) =>
            a.id === achievementId
              ? { ...a, isUnlocked: true, progress: a.totalRequired }
              : a
          );
          const unlockedAchievement = updatedAchievements.find(
            (a) => a.id === achievementId
          );
          return {
            achievements: updatedAchievements,
            lastUnlockedAchievement: unlockedAchievement || null,
          };
        }),
      incrementProgress: (achievementId, amount) =>
        set((state) => {
          const updatedAchievements = state.achievements.map((a) =>
            a.id === achievementId
              ? {
                  ...a,
                  progress: Math.min(a.progress + amount, a.totalRequired),
                  isUnlocked: a.progress + amount >= a.totalRequired,
                }
              : a
          );
          const unlockedAchievement = updatedAchievements.find(
            (a) =>
              a.id === achievementId &&
              a.isUnlocked &&
              !state.achievements.find((sa) => sa.id === achievementId)
                ?.isUnlocked
          );
          return {
            achievements: updatedAchievements,
            lastUnlockedAchievement:
              unlockedAchievement || state.lastUnlockedAchievement,
          };
        }),
      resetProgress: (achievementId) =>
        set((state) => ({
          achievements: state.achievements.map((a) =>
            a.id === achievementId
              ? { ...a, progress: 0, isUnlocked: false }
              : a
          ),
        })),
      resetAllProgress: () =>
        set((state) => ({
          achievements: state.achievements.map((a) => ({
            ...a,
            progress: 0,
            isUnlocked: false,
          })),
          lastUnlockedAchievement: null,
        })),
      toggleMockMode: () => set((state) => ({ isMockMode: !state.isMockMode })),
      getAchievementById: (achievementId) =>
        get().achievements.find((a) => a.id === achievementId),
      getAchievementsByCategory: (category) =>
        get().achievements.filter((a) => a.category === category),
      getTotalPoints: () =>
        get().achievements.reduce(
          (sum, a) => sum + (a.isUnlocked ? a.points : 0),
          0
        ),
      getOverallProgress: () => {
        const achievements = get().achievements;
        const unlockedCount = achievements.filter((a) => a.isUnlocked).length;
        return (unlockedCount / achievements.length) * 100;
      },
    }),
    {
      name: "achievement-storage",
    }
  )
);
