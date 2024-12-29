import { create } from "zustand";
import Cookies from "js-cookie";
import { Site } from "@/types/home";

interface SiteState {
  sites: Site[];
  quickAccessSites: Site[];
  searchTerm: string;
  activeCategory: string;
  // 自定义设置
  backgroundColor: string;
  layoutMode: 'grid' | 'list';
  cardStyle: 'default' | 'minimal' | 'detailed';
  addSite: (site: Site) => void;
  updateSite: (updatedSite: Site) => void;
  removeSite: (site: Site) => void;
  toggleQuickAccess: (site: Site) => void;
  setSearchTerm: (term: string) => void;
  setActiveCategory: (category: string) => void;
  setSites: (sites: Site[]) => void;
  setQuickAccessSites: (sites: Site[]) => void;
  reorderSites: (startIndex: number, endIndex: number) => void;
  // 自定义设置方法
  setBackgroundColor: (color: string) => void;
  setLayoutMode: (mode: 'grid' | 'list') => void;
  setCardStyle: (style: 'default' | 'minimal' | 'detailed') => void;
}

const STORAGE_KEY = "homeStore";

// 从cookies中加载持久化的状态
const loadState = (): Partial<SiteState> | undefined => {
  const storedState = Cookies.get(STORAGE_KEY);
  if (storedState) {
    try {
      return JSON.parse(storedState);
    } catch (error) {
      console.error("解析存储的状态时出错:", error);
      return undefined;
    }
  }
  return undefined;
};

export const useSiteStore = create<SiteState>((set, get) => {
  const persistedState = loadState();

  return {
    sites: persistedState?.sites || [],
    quickAccessSites: persistedState?.quickAccessSites || [],
    searchTerm: persistedState?.searchTerm || "",
    activeCategory: persistedState?.activeCategory || "All",
    // 自定义设置默认值
    backgroundColor: persistedState?.backgroundColor || "from-indigo-900 to-purple-900",
    layoutMode: persistedState?.layoutMode || "grid",
    cardStyle: persistedState?.cardStyle || "default",
    addSite: (site) =>
      set((state) => ({
        sites: [...state.sites, site],
        quickAccessSites:
          state.quickAccessSites.length < 5
            ? [...state.quickAccessSites, site]
            : state.quickAccessSites,
      })),
    updateSite: (updatedSite) =>
      set((state) => ({
        sites: state.sites.map((site) =>
          site.id === updatedSite.id ? updatedSite : site
        ),
      })),
    removeSite: (siteToRemove) =>
      set((state) => ({
        sites: state.sites.filter((site) => site.id !== siteToRemove.id),
        quickAccessSites: state.quickAccessSites.filter(
          (site) => site.id !== siteToRemove.id
        ),
      })),
    toggleQuickAccess: (site) =>
      set((state) => {
        if (state.quickAccessSites.some((s) => s.id === site.id)) {
          return {
            quickAccessSites: state.quickAccessSites.filter(
              (s) => s.id !== site.id
            ),
          };
        } else if (state.quickAccessSites.length < 5) {
          return {
            quickAccessSites: [...state.quickAccessSites, site],
          };
        } else {
          return {};
        }
      }),
    setSearchTerm: (term: string) => set({ searchTerm: term }),
    setActiveCategory: (category: string) => set({ activeCategory: category }),
    setSites: (sites: Site[]) => set({ sites }),
    setQuickAccessSites: (sites: Site[]) => set({ quickAccessSites: sites }),
    reorderSites: (startIndex: number, endIndex: number) => {
      set((state) => {
        const sites = [...state.sites];
        const [removed] = sites.splice(startIndex, 1);
        sites.splice(endIndex, 0, removed);
        return { sites };
      });
    },
    // 自定义设置方法
    setBackgroundColor: (color: string) => set({ backgroundColor: color }),
    setLayoutMode: (mode: 'grid' | 'list') => set({ layoutMode: mode }),
    setCardStyle: (style: 'default' | 'minimal' | 'detailed') => set({ cardStyle: style }),
  };
});

// 订阅状态变化并持久化到cookies
useSiteStore.subscribe((state) => {
  Cookies.set(
    STORAGE_KEY,
    JSON.stringify({
      sites: state.sites,
      quickAccessSites: state.quickAccessSites,
      searchTerm: state.searchTerm,
      activeCategory: state.activeCategory,
      // 持久化自定义设置
      backgroundColor: state.backgroundColor,
      layoutMode: state.layoutMode,
      cardStyle: state.cardStyle,
    }),
    { expires: 365 }
  );
});
