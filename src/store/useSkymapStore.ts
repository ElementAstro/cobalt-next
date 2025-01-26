import {
  IAdvancedFilter,
  IDSOFramingObjectInfo,
  IFavoriteTarget,
  IObservationPlan,
  ISearchHistory,
} from "@/types/skymap";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import log from "@/utils/logger"; // Import the logger
import { ITargetGroup, ITargetNote, ITargetStatistics } from "@/types/skymap";

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
  setTwilightData: (data: TwilightData) => void;
}

interface ExtendedTargetListState extends TargetListState {
  searchHistory: ISearchHistory[];
  favorites: IFavoriteTarget[];
  advancedFilter: IAdvancedFilter;

  addToHistory: (history: ISearchHistory) => void;
  clearHistory: () => void;
  addToFavorites: (target: IFavoriteTarget) => void;
  removeFromFavorites: (id: string) => void;
  updateFavoriteNotes: (id: string, notes: string) => void;
  setAdvancedFilter: (filter: Partial<IAdvancedFilter>) => void;

  groups: ITargetGroup[];
  notes: ITargetNote[];
  statistics: ITargetStatistics;

  // Group management
  addGroup: (
    group: Omit<ITargetGroup, "id" | "createdAt" | "updatedAt">
  ) => void;
  updateGroup: (groupId: string, updates: Partial<ITargetGroup>) => void;
  deleteGroup: (groupId: string) => void;
  addTargetToGroup: (groupId: string, targetName: string) => void;
  removeTargetFromGroup: (groupId: string, targetName: string) => void;

  // Notes management
  addNote: (note: Omit<ITargetNote, "createdAt" | "updatedAt">) => void;
  updateNote: (targetName: string, content: string) => void;
  deleteNote: (targetName: string) => void;

  // Statistics
  updateStatistics: () => void;

  // Batch operations
  importTargets: (targets: IDSOFramingObjectInfo[]) => void;
  batchUpdateTags: (targetNames: string[], tag: string) => void;
  batchUpdateFlags: (targetNames: string[], flag: string) => void;

  // Sorting and filtering
  sortTargets: (
    by: "name" | "ra" | "dec" | "size" | "altitude" | "type" | "date",
    order: "asc" | "desc"
  ) => void;
  filterTargets: (filters: {
    type?: string[];
    minSize?: number;
    maxSize?: number;
    minAltitude?: number;
    maxAltitude?: number;
    constellation?: string[];
  }) => void;

  // Batch operations
  batchDelete: (targetIds: string[]) => void;
  batchExport: (targetIds: string[], format: "csv" | "json") => void;
  batchImportFromFile: (file: File) => Promise<void>;

  // Observation plan
  generateObservationPlan: (params: {
    date: Date;
    duration: number;
    minAltitude: number;
    weatherConditions: string[];
  }) => Promise<IObservationPlan>;

  // Extended statistics
  targetStatistics: {
    totalObservationTime: number;
    bestObservingMonths: { [key: string]: number };
    successRate: number;
    averageAltitude: number;
    popularTypes: { [key: string]: number };
  };
}

export const useGlobalStore = create<ExtendedTargetListState>()(
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
      setTwilightData: (data) =>
        set(() => {
          log.info("Setting twilight data");
          return {
            twilight_data: data,
          };
        }),

      searchHistory: [],
      favorites: [],
      advancedFilter: {
        angular_size_min: 0,
        angular_size_max: 100,
        magnitude_min: -30,
        magnitude_max: 30,
        type: [],
        constellation: [],
        transit_month: [],
        sort: {
          field: "name",
          order: "asc",
        },
      },

      addToHistory: (history) =>
        set((state) => ({
          searchHistory: [history, ...state.searchHistory].slice(0, 50),
        })),

      clearHistory: () => set(() => ({ searchHistory: [] })),

      addToFavorites: (target) =>
        set((state) => ({
          favorites: [...state.favorites, target],
        })),

      removeFromFavorites: (id) =>
        set((state) => ({
          favorites: state.favorites.filter((f) => f.id !== id),
        })),

      updateFavoriteNotes: (id, notes) =>
        set((state) => ({
          favorites: state.favorites.map((f) =>
            f.id === id ? { ...f, notes } : f
          ),
        })),

      setAdvancedFilter: (filter) =>
        set((state) => ({
          advancedFilter: { ...state.advancedFilter, ...filter },
        })),

      groups: [],
      notes: [],
      statistics: {
        totalCount: 0,
        typeDistribution: {},
        tagDistribution: {},
        flagDistribution: {},
        averageSize: 0,
        monthlyDistribution: {},
      },

      addGroup: (group) =>
        set((state) => ({
          groups: [
            ...state.groups,
            {
              ...group,
              id: crypto.randomUUID(),
              createdAt: new Date(),
              updatedAt: new Date(),
            },
          ],
        })),

      addTargetToGroup: (groupId, targetName) =>
        set((state) => ({
          groups: state.groups.map((g) =>
            g.id === groupId
              ? {
                  ...g,
                  targets: [...g.targets, targetName],
                  updatedAt: new Date(),
                }
              : g
          ),
        })),

      removeTargetFromGroup: (groupId, targetName) =>
        set((state) => ({
          groups: state.groups.map((g) =>
            g.id === groupId
              ? {
                  ...g,
                  targets: g.targets.filter((t) => t !== targetName),
                  updatedAt: new Date(),
                }
              : g
          ),
        })),

      updateGroup: (groupId, updates) =>
        set((state) => ({
          groups: state.groups.map((g) =>
            g.id === groupId ? { ...g, ...updates, updatedAt: new Date() } : g
          ),
        })),

      deleteGroup: (groupId) =>
        set((state) => ({
          groups: state.groups.filter((g) => g.id !== groupId),
        })),

      addNote: (note) =>
        set((state) => ({
          notes: [
            ...state.notes,
            { ...note, createdAt: new Date(), updatedAt: new Date() },
          ],
        })),

      deleteNote: (targetName) =>
        set((state) => ({
          notes: state.notes.filter((n) => n.targetName !== targetName),
        })),

      updateNote: (targetName, content) =>
        set((state) => ({
          notes: state.notes.map((n) =>
            n.targetName === targetName
              ? { ...n, content, updatedAt: new Date() }
              : n
          ),
        })),

      updateStatistics: () =>
        set((state) => {
          const stats = calculateStatistics(state.targets);
          return { statistics: stats };
        }),

      importTargets: (targets) =>
        set((state) => {
          const existingNames = new Set(state.targets.map((t) => t.name));
          const newTargets = targets.filter((t) => !existingNames.has(t.name));
          return {
            targets: [...state.targets, ...newTargets],
          };
        }),

      batchUpdateTags: (targetNames, tag) =>
        set((state) => ({
          targets: state.targets.map((t) =>
            targetNames.includes(t.name) ? { ...t, tag } : t
          ),
        })),

      batchUpdateFlags: (targetNames, flag) =>
        set((state) => ({
          targets: state.targets.map((t) =>
            targetNames.includes(t.name) ? { ...t, flag } : t
          ),
        })),

      sortTargets: (by, order) =>
        set((state) => {
          const sorted = [...state.targets].sort((a, b) => {
            const aValue = (a as Record<string, any>)[by];
            const bValue = (b as Record<string, any>)[by];
            if (order === "asc") {
              return aValue > bValue ? 1 : -1;
            }
            return aValue < bValue ? 1 : -1;
          });
          return { targets: sorted };
        }),

      filterTargets: (filters) =>
        set((state) => {
          const filtered = state.targets.filter((target) => {
            let match = true;
            if (filters.type) {
              match = match && filters.type.includes(target.target_type);
            }
            if (filters.minSize !== undefined) {
              match = match && target.size >= filters.minSize;
            }
            // ... 更多过滤条件
            return match;
          });
          return { targets: filtered };
        }),

      batchDelete: (targetIds) =>
        set((state) => ({
          targets: state.targets.filter((t) => !targetIds.includes(t.name)),
        })),

      batchExport: (targetIds, format) => {
        const state = get();
        const targets = state.targets.filter((t) => targetIds.includes(t.name));
        if (format === "csv") {
          // 导出CSV逻辑
        } else {
          // 导出JSON逻辑
        }
      },

      batchImportFromFile: async (file) => {
        const text = await file.text();
        // 实现文件导入逻辑
      },

      generateObservationPlan: async (params) => {
        // 实现观测计划生成逻辑
        return {
          startTime: params.date,
          endTime: new Date(
            params.date.getTime() + params.duration * 60 * 60 * 1000
          ),
          targets: [],
          priority: 1,
          weather: params.weatherConditions.join(","),
        };
      },

      targetStatistics: {
        totalObservationTime: 0,
        bestObservingMonths: {},
        successRate: 0,
        averageAltitude: 0,
        popularTypes: {},
      },
    }),
    {
      name: "target-storage",
      partialize: (state) => ({
        targets: state.targets,
        searchHistory: state.searchHistory,
        favorites: state.favorites,
        advancedFilter: state.advancedFilter,
        groups: state.groups,
        notes: state.notes,
        targetStatistics: state.targetStatistics,
      }),
    }
  )
);

function calculateStatistics(
  targets: IDSOFramingObjectInfo[]
): ITargetStatistics {
  const stats: ITargetStatistics = {
    totalCount: targets.length,
    typeDistribution: {},
    tagDistribution: {},
    flagDistribution: {},
    averageSize: 0,
    monthlyDistribution: {},
  };

  let totalSize = 0;

  targets.forEach((target) => {
    // Update type distribution
    stats.typeDistribution[target.target_type] =
      (stats.typeDistribution[target.target_type] || 0) + 1;

    // Update tag distribution
    stats.tagDistribution[target.tag] =
      (stats.tagDistribution[target.tag] || 0) + 1;

    // Update flag distribution
    stats.flagDistribution[target.flag] =
      (stats.flagDistribution[target.flag] || 0) + 1;

    // Update size statistics
    totalSize += target.size;

    // Update monthly distribution
    //const month = target.transit_month.toString();
    //stats.monthlyDistribution[month] =
    //  (stats.monthlyDistribution[month] || 0) + 1;
  });

  stats.averageSize = targets.length > 0 ? totalSize / targets.length : 0;

  return stats;
}

function calculateExtendedStatistics(targets: IDSOFramingObjectInfo[]): any {
  // 实现扩展的统计计算逻辑
  return {
    totalObservationTime: 0,
    bestObservingMonths: {},
    successRate: 0,
    averageAltitude: 0,
    popularTypes: {},
  };
}
