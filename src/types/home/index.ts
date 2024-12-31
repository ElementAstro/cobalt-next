import { LucideIcon } from "lucide-react";

export interface Site {
  id: string;
  name: string;
  url: string;
  icon: string | LucideIcon;
  category: string;
}
