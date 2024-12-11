import { create } from "zustand";
import { persist } from "zustand/middleware";

interface ChartData {
  label: string;
  value: number;
}

interface StatusBarState {
  theme: "dark" | "light";
  showNFC: boolean;
  showBluetooth: boolean;
  showMoonMode: boolean;
  showWifi: boolean;
  show4G: boolean;
  show5G: boolean;
  showChart: boolean;
  animationDuration: number;
  isMuted: boolean;
  batteryLevel: number;
  isCharging: boolean;
  wifiStrength: number;
  cellularStrength: number;
  chartData: ChartData[];
  isFullScreen: boolean;
  setTheme: (theme: "dark" | "light") => void;
  toggleFeature: (feature: string) => void;
  setAnimationDuration: (duration: number) => void;
  setMuted: (muted: boolean) => void;
  setBatteryLevel: (level: number) => void;
  setCharging: (charging: boolean) => void;
  setWifiStrength: (strength: number) => void;
  setCellularStrength: (strength: number) => void;
  setChartData: (data: ChartData[]) => void;
  setFullScreen: (isFullScreen: boolean) => void;
}

export const useStatusBarStore = create<StatusBarState>()(
  persist(
    (set) => ({
      theme: "dark",
      showNFC: true,
      showBluetooth: true,
      showMoonMode: true,
      showWifi: true,
      show4G: true,
      show5G: true,
      showChart: false,
      animationDuration: 300,
      isMuted: false,
      batteryLevel: 100,
      isCharging: false,
      wifiStrength: 3,
      cellularStrength: 4,
      chartData: [
        { label: "A", value: 10 },
        { label: "B", value: 20 },
        { label: "C", value: 15 },
        { label: "D", value: 25 },
      ],
      isFullScreen: false,
      setTheme: (theme) => set({ theme }),
      toggleFeature: (feature) =>
        set((state) => ({
          [feature]: !state[feature as keyof StatusBarState],
        })),
      setAnimationDuration: (duration) => set({ animationDuration: duration }),
      setMuted: (muted) => set({ isMuted: muted }),
      setBatteryLevel: (level) => set({ batteryLevel: level }),
      setCharging: (charging) => set({ isCharging: charging }),
      setWifiStrength: (strength) => set({ wifiStrength: strength }),
      setCellularStrength: (strength) => set({ cellularStrength: strength }),
      setChartData: (data) => set({ chartData: data }),
      setFullScreen: (isFullScreen) => set({ isFullScreen }),
    }),
    {
      name: "status-bar-storage",
    }
  )
);
