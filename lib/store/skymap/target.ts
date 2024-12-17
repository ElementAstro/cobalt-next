import { IDSOFramingObjectInfo } from "@/types/skymap/find-object";
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface TwilightData {
  evening: {
    sun_set_time: Date;
    evening_astro_time: Date;
  };
  morning: {
    sun_rise_time: Date;
    morning_astro_time: Date;
  };
}

interface TargetListState {
  targets: IDSOFramingObjectInfo[];
  focusTargetId: string | null;
  twilight_data: TwilightData;
  addTarget: (target: IDSOFramingObjectInfo) => void;
  setFocusTarget: (id: string) => void;
  addTargetAndFocus: (target: IDSOFramingObjectInfo) => void;
  saveAllTargets: () => void;
  changeFocusTarget: (target: IDSOFramingObjectInfo) => void;
  loading: boolean;
  error: string | null;

  removeTarget: (name: string) => void;
  updateTarget: (target: IDSOFramingObjectInfo) => void;
  clearTargets: () => void;
  setLoading: (status: boolean) => void;
  setError: (error: string | null) => void;

  all_tags: string[];
  all_flags: string[];
  setTargetFlag: (params: { index: number; update_string: string }) => void;
  setTargetTag: (params: { index: number; update_string: string }) => void;
  renameTarget: (params: { index: number; update_string: string }) => void;
  checkOneTarget: (index: number) => void;
  clearAllChecked: () => void;
}

export const useGlobalStore = create<TargetListState>()(
  persist(
    (set, get) => ({
      targets: [],
      focusTargetId: null,
      twilight_data: {
        evening: {
          sun_set_time: new Date(),
          evening_astro_time: new Date(),
        },
        morning: {
          sun_rise_time: new Date(),
          morning_astro_time: new Date(),
        },
      },
      addTarget: (target) =>
        set((state) => ({
          targets: [...state.targets, target],
        })),
      setFocusTarget: (id) =>
        set({
          focusTargetId: id,
        }),
      addTargetAndFocus: (target) =>
        set((state) => ({
          targets: [...state.targets, target],
          focusTargetId: target.name, // 假设'name'唯一标识目标
        })),
      saveAllTargets: () => {
        // 实现保存目标列表的逻辑，例如保存到本地存储或发送到服务器
        const targets = get().targets;
        localStorage.setItem("targets", JSON.stringify(targets));
      },
      changeFocusTarget: (target) =>
        set({
          focusTargetId: target.name, // 假设'name'唯一标识目标
        }),
      loading: false,
      error: null,

      removeTarget: (name) =>
        set((state) => ({
          targets: state.targets.filter((t) => t.name !== name),
        })),

      updateTarget: (target) =>
        set((state) => ({
          targets: state.targets.map((t) =>
            t.name === target.name ? target : t
          ),
        })),

      clearTargets: () => set({ targets: [], focusTargetId: null }),

      setLoading: (status) => set({ loading: status }),

      setError: (error) => set({ error }),

      all_tags: [],
      all_flags: [],
      setTargetFlag: ({ index, update_string }) =>
        set((state) => {
          const targets = [...state.targets];
          targets[index].flag = update_string;
          return { targets };
        }),
      setTargetTag: ({ index, update_string }) =>
        set((state) => {
          const targets = [...state.targets];
          targets[index].tag = update_string;
          return { targets };
        }),
      renameTarget: ({ index, update_string }) =>
        set((state) => {
          const targets = [...state.targets];
          targets[index].name = update_string;
          return { targets };
        }),
      checkOneTarget: (index) =>
        set((state) => {
          const targets = state.targets.map((target, i) => ({
            ...target,
            checked: i === index,
          }));
          return { targets };
        }),
      clearAllChecked: () =>
        set((state) => {
          const targets = state.targets.map((target) => ({
            ...target,
            checked: false,
          }));
          return { targets };
        }),
    }),
    {
      name: "target-storage",
      partialize: (state) => ({ targets: state.targets }),
    }
  )
);
