export interface DiskInfo {
  id: string;
  name: string;
  letter: string;
  total: number;
  used: number;
  isSystem?: boolean;
  health: "good" | "fair" | "poor";
  lastChecked: string;
}
