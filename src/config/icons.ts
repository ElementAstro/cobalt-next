import {
  Aperture,
  Camera,
  Image,
  Video,
  Film,
  Settings,
  Star,
  Moon,
  Sun,
  CloudMoon,
  Telescope,
  Compass,
  Map,
  Navigation,
  Mountain,
  Clock,
  Calendar,
  BookOpen,
  ChartBar,
  Database,
  FileImage,
  Folders,
  Ghost,
  Laptop,
  Lightbulb,
  Palette,
  PenTool,
  Sparkles,
  Target,
  Zap,
  type LucideIcon
} from 'lucide-react';

export const categoryIcons: Record<string, LucideIcon> = {
  camera: Camera,
  image: Image,
  video: Video,
  film: Film,
  settings: Settings,
  telescope: Telescope,
  navigation: Navigation,
  chart: ChartBar,
  database: Database,
  folder: Folders,
  tools: PenTool,
  effects: Sparkles
};

export const themeIcons = {
  light: Sun,
  dark: Moon,
  system: CloudMoon
};

export const animationVariants = {
  icon: {
    hover: { 
      scale: 1.1,
      rotate: 5,
      transition: { type: "spring", stiffness: 400 }
    },
    tap: { 
      scale: 0.95,
      rotate: -5 
    },
    initial: {
      scale: 1,
      rotate: 0
    }
  },
  card: {
    hover: {
      y: -5,
      transition: {
        type: "spring",
        stiffness: 300
      }
    }
  },
  container: {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        staggerChildren: 0.1
      }
    }
  }
};
