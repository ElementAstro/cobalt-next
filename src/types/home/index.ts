import { LucideIcon } from "lucide-react";

export interface Site {
  id: string;
  name: string;
  url: string;
  icon: string | LucideIcon;
  category: string;
}

export interface MouseFollowerProps {
  color?: string;
  size?: number;
  blur?: number;
  trail?: number;
  trailColor?: string;
  trailBlur?: number;
  animationDuration?: number;
  animationType?: "spring" | "tween";
  springStiffness?: number;
  springDamping?: number;
  scaleOnTouch?: boolean;
  rotateOnMove?: boolean;
}
