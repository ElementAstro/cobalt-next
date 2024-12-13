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
}

