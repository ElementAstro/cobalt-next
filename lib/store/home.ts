import { create } from "zustand";

export interface Site {
  id: string;
  name: string;
  url: string;
  icon: string;
  category: string;
}

interface SiteState {
  sites: Site[];
  quickAccessSites: Site[];
  searchTerm: string;
  activeCategory: string;
  addSite: (site: Site) => void;
  updateSite: (updatedSite: Site) => void;
  removeSite: (site: Site) => void;
  toggleQuickAccess: (site: Site) => void;
  setSearchTerm: (term: string) => void;
  setActiveCategory: (category: string) => void;
  setSites: (sites: Site[]) => void;
  setQuickAccessSites: (sites: Site[]) => void;
  reorderSites: (startIndex: number, endIndex: number) => void;
}

export const useSiteStore = create<SiteState>((set) => ({
  sites: [],
  quickAccessSites: [],
  searchTerm: "",
  activeCategory: "All",
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
}));
