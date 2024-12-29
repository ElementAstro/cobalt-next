import { IDSOFramingObjectInfo } from "@/types/skymap";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import log from "@/utils/logger"; // Import the logger

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
  selectAll: () => void;

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
      selectAll: () =>
        set((state) => {
          const targets = state.targets.map((target) => ({
            ...target,
            checked: true,
          }));
          log.info("All targets selected");
          return { targets };
        }),
      addTarget: (target) =>
        set((state) => {
          log.info(`Adding target: ${target.name}`);
          return {
            targets: [...state.targets, target],
          };
        }),
      setFocusTarget: (id) =>
        set(() => {
          log.info(`Setting focus target to: ${id}`);
          return {
            focusTargetId: id,
          };
        }),
      addTargetAndFocus: (target) =>
        set((state) => {
          log.info(`Adding and focusing on target: ${target.name}`);
          return {
            targets: [...state.targets, target],
            focusTargetId: target.name,
          };
        }),
      saveAllTargets: () => {
        const targets = get().targets;
        localStorage.setItem("targets", JSON.stringify(targets));
        log.info("All targets saved to local storage");
      },
      changeFocusTarget: (target) =>
        set(() => {
          log.info(`Changing focus target to: ${target.name}`);
          return {
            focusTargetId: target.name,
          };
        }),
      loading: false,
      error: null,

      removeTarget: (name) =>
        set((state) => {
          log.info(`Removing target: ${name}`);
          return {
            targets: state.targets.filter((t) => t.name !== name),
          };
        }),

      updateTarget: (target) =>
        set((state) => {
          log.info(`Updating target: ${target.name}`);
          return {
            targets: state.targets.map((t) =>
              t.name === target.name ? target : t
            ),
          };
        }),

      clearTargets: () =>
        set(() => {
          log.info("Clearing all targets");
          return { targets: [], focusTargetId: null };
        }),

      setLoading: (status) =>
        set(() => {
          log.info(`Setting loading status to: ${status}`);
          return { loading: status };
        }),

      setError: (error) =>
        set(() => {
          log.error(`Setting error: ${error}`);
          return { error };
        }),

      all_tags: [],
      all_flags: [],
      setTargetFlag: ({ index, update_string }) =>
        set((state) => {
          const targets = [...state.targets];
          targets[index].flag = update_string;
          log.info(
            `Setting flag for target at index ${index} to: ${update_string}`
          );
          return { targets };
        }),
      setTargetTag: ({ index, update_string }) =>
        set((state) => {
          const targets = [...state.targets];
          targets[index].tag = update_string;
          log.info(
            `Setting tag for target at index ${index} to: ${update_string}`
          );
          return { targets };
        }),
      renameTarget: ({ index, update_string }) =>
        set((state) => {
          const targets = [...state.targets];
          targets[index].name = update_string;
          log.info(`Renaming target at index ${index} to: ${update_string}`);
          return { targets };
        }),
      checkOneTarget: (index) =>
        set((state) => {
          const targets = state.targets.map((target, i) => ({
            ...target,
            checked: i === index,
          }));
          log.info(`Checking target at index ${index}`);
          return { targets };
        }),
      clearAllChecked: () =>
        set((state) => {
          const targets = state.targets.map((target) => ({
            ...target,
            checked: false,
          }));
          log.info("Clearing all checked targets");
          return { targets };
        }),
    }),
    {
      name: "target-storage",
      partialize: (state) => ({ targets: state.targets }),
    }
  )
);
