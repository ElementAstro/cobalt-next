export interface AchievementStep {
  description: string;
  completed: boolean;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  isUnlocked: boolean;
  progress: number;
  totalRequired: number;
  category: string; // 新增
  points: number; // 新增
  detailedDescription: string;
  steps?: AchievementStep[];
  difficulty: 'easy' | 'medium' | 'hard';
  dateUnlocked?: Date;
  rarity: number; // percentage of users who have unlocked this
}

