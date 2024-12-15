import { create } from "zustand";

interface Equipment {
  id: string;
  name: string;
  focalLength: number;
  aperture: number;
  type: "telescope" | "camera" | "barlow" | "reducer";
}

interface AstronomyState {
  theme: "light" | "dark";
  isMetric: boolean;
  equipment: Equipment[];
  selectedEquipment: string[];
  toggleTheme: () => void;
  toggleUnit: () => void;
  addEquipment: (equipment: Equipment) => void;
  removeEquipment: (id: string) => void;
  selectEquipment: (id: string) => void;
  deselectEquipment: (id: string) => void;
  importEquipment: (equipmentList: Equipment[]) => void;
}

export const useAstronomyStore = create<AstronomyState>((set) => ({
  theme: "light",
  isMetric: true,
  equipment: [],
  selectedEquipment: [],
  toggleTheme: () =>
    set((state) => ({ theme: state.theme === "light" ? "dark" : "light" })),
  toggleUnit: () => set((state) => ({ isMetric: !state.isMetric })),
  addEquipment: (equipment) =>
    set((state) => ({ equipment: [...state.equipment, equipment] })),
  removeEquipment: (id) =>
    set((state) => ({
      equipment: state.equipment.filter((e) => e.id !== id),
      selectedEquipment: state.selectedEquipment.filter((eId) => eId !== id),
    })),
  selectEquipment: (id) =>
    set((state) => ({
      selectedEquipment: [...state.selectedEquipment, id],
    })),
  deselectEquipment: (id) =>
    set((state) => ({
      selectedEquipment: state.selectedEquipment.filter((eId) => eId !== id),
    })),
  importEquipment: (equipmentList) =>
    set((state) => ({
      equipment: [...state.equipment, ...equipmentList],
    })),
}));
