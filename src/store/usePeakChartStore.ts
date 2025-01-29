import { create } from 'zustand';

interface PeakChartStore {
  height: number;
  width: number; 
  strokeColor: string;
  strokeWidth: number;
  showGrid: boolean;
  
  setHeight: (height: number) => void;
  setWidth: (width: number) => void;
  setStrokeColor: (color: string) => void;
  setStrokeWidth: (width: number) => void;
  setShowGrid: (show: boolean) => void;
}

export const usePeakChartStore = create<PeakChartStore>((set) => ({
  height: 200,
  width: 600,
  strokeColor: '#ffffff',
  strokeWidth: 2,
  showGrid: true,
  
  setHeight: (height) => set({ height }),
  setWidth: (width) => set({ width }),
  setStrokeColor: (strokeColor) => set({ strokeColor }),
  setStrokeWidth: (strokeWidth) => set({ strokeWidth }), 
  setShowGrid: (showGrid) => set({ showGrid })
}));
