import { Achievement } from "@/types/achievement";

export const achievements: Achievement[] = [
  {
    id: "first-login",
    title: "First Login",
    description: "Log in for the first time",
    icon: "🔑",
    isUnlocked: false,
    progress: 0,
    totalRequired: 1,
    category: "Onboarding",
    points: 10,
  },
  {
    id: "complete-profile",
    title: "Profile Perfectionist",
    description: "Complete your user profile",
    icon: "👤",
    isUnlocked: false,
    progress: 0,
    totalRequired: 1,
    category: "Onboarding",
    points: 20,
  },
  {
    id: "make-friends",
    title: "Social Butterfly",
    description: "Make 5 friends",
    icon: "🦋",
    isUnlocked: false,
    progress: 0,
    totalRequired: 5,
    category: "Social",
    points: 50,
  },
  {
    id: "post-streak",
    title: "Consistent Contributor",
    description: "Post for 7 consecutive days",
    icon: "🔥",
    isUnlocked: false,
    progress: 0,
    totalRequired: 7,
    category: "Engagement",
    points: 100,
  },
  {
    id: "popular-post",
    title: "Viral Sensation",
    description: "Get 1000 likes on a single post",
    icon: "🌟",
    isUnlocked: false,
    progress: 0,
    totalRequired: 1000,
    category: "Engagement",
    points: 200,
  },
];