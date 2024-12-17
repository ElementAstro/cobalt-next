import { create } from "zustand";

interface StorageItem {
  key: string;
  value: string;
  selected?: boolean;
}

interface LocalStorageState {
  items: StorageItem[];
  loadItems: () => void;
  addItem: (item: StorageItem) => void;
  updateItem: (item: StorageItem) => void;
  deleteItem: (key: string) => void;
  selectAll: (checked: boolean) => void;
  toggleSelect: (key: string, checked: boolean) => void;
  deleteSelected: () => void;
  exportItems: () => void;
  importItems: (items: StorageItem[]) => void;
  searchTerm: string;
  setSearchTerm: (term: string) => void;
}

export const useLocalStorageStore = create<LocalStorageState>((set, get) => ({
  items: [],
  searchTerm: "",
  loadItems: () => {
    const allItems: StorageItem[] = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key) {
        allItems.push({
          key,
          value: localStorage.getItem(key) || "",
          selected: false,
        });
      }
    }
    set({ items: allItems });
  },
  addItem: (item) => {
    localStorage.setItem(item.key, item.value);
    get().loadItems();
  },
  updateItem: (item) => {
    localStorage.setItem(item.key, item.value);
    get().loadItems();
  },
  deleteItem: (key) => {
    localStorage.removeItem(key);
    get().loadItems();
  },
  selectAll: (checked) => {
    set({
      items: get().items.map((item) => ({ ...item, selected: checked })),
    });
  },
  toggleSelect: (key, checked) => {
    set({
      items: get().items.map((item) =>
        item.key === key ? { ...item, selected: checked } : item
      ),
    });
  },
  deleteSelected: () => {
    get()
      .items.filter((item) => item.selected)
      .forEach((item) => {
        localStorage.removeItem(item.key);
      });
    set({ items: [] });
  },
  exportItems: () => {
    const selectedItems = get().items.filter((item) => item.selected);
    if (selectedItems.length === 0) return;
    const itemsData = JSON.stringify(selectedItems, null, 2);
    const blob = new Blob([itemsData], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "localstorage_items.json";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  },
  importItems: (items) => {
    items.forEach((item) => {
      localStorage.setItem(item.key, item.value);
    });
    get().loadItems();
  },
  setSearchTerm: (term) => set({ searchTerm: term }),
}));
