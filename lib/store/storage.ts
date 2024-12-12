import { create } from "zustand";
import CryptoJS from "crypto-js";

interface CookieData {
  name: string;
  value: string;
  selected?: boolean;
}

interface CookieState {
  cookies: CookieData[];
  loadCookies: (name?: string) => string | null;
  addCookie: (cookie: CookieData) => void;
  updateCookie: (cookie: CookieData) => void;
  deleteCookie: (name: string) => void;
  selectAll: (selected: boolean) => void;
  toggleSelect: (name: string, selected: boolean) => void;
  deleteSelected: () => void;
  encryptCookie: (data: string, key: string) => string;
  decryptCookie: (data: string, key: string) => string | null;
}

export const useCookieStore = create<CookieState>((set, get) => ({
  cookies: [],
  loadCookies: (name) => {
    if (name) {
      const value = document.cookie
        .split("; ")
        .find((row) => row.startsWith(`${name}=`))
        ?.split("=")[1];
      return value || null;
    } else {
      const allCookies: CookieData[] = [];
      for (let i = 0; i < document.cookie.split(";").length; i++) {
        const cookie = document.cookie.split(";")[i];
        if (cookie) {
          const [key, value] = cookie.split("=");
          allCookies.push({ name: key, value, selected: false });
        }
      }
      set({ cookies: allCookies });
      return null;
    }
  },
  addCookie: (cookie) => {
    document.cookie = `${cookie.name}=${cookie.value}; path=/;`;
    get().loadCookies();
  },
  updateCookie: (cookie) => {
    document.cookie = `${cookie.name}=${cookie.value}; path=/;`;
    get().loadCookies();
  },
  deleteCookie: (name) => {
    document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
    get().loadCookies();
  },
  selectAll: (selected) => {
    set({
      cookies: get().cookies.map((cookie) => ({ ...cookie, selected })),
    });
  },
  toggleSelect: (name, selected) => {
    set({
      cookies: get().cookies.map((cookie) =>
        cookie.name === name ? { ...cookie, selected } : cookie
      ),
    });
  },
  deleteSelected: () => {
    get()
      .cookies.filter((cookie) => cookie.selected)
      .forEach((cookie) => {
        get().deleteCookie(cookie.name);
      });
    set({ cookies: [] });
  },
  encryptCookie: (data, key) => {
    return CryptoJS.AES.encrypt(data, key).toString();
  },
  decryptCookie: (data, key) => {
    try {
      const bytes = CryptoJS.AES.decrypt(data, key);
      return bytes.toString(CryptoJS.enc.Utf8);
    } catch (error) {
      console.error("解密 Cookie 时出错:", error);
      return null;
    }
  },
}));

interface ImageData {
  id?: number;
  url: string;
}

interface IndexedDBState {
  db: IDBDatabase | null;
  isDBOpen: boolean;
  dbVersion: number;
  openDB: () => void;
  addImage: (image: ImageData, orientation: string) => void;
  getAllImages: (orientation: string) => Promise<ImageData[]>;
  deleteImage: (id: number, orientation: string) => void;
  clearDB: () => void;
}

export const useIndexedDBStore = create<IndexedDBState>((set, get) => ({
  db: null,
  isDBOpen: false,
  dbVersion: 1,

  openDB: () => {
    try {
      const request = indexedDB.open("myDB", get().dbVersion);

      request.onerror = (event) => {
        console.error("Error opening database:", event);
        set({ isDBOpen: false });
      };

      request.onsuccess = (event) => {
        set({ db: request.result, isDBOpen: true });
        console.log("Database opened successfully:", request.result);
      };

      request.onupgradeneeded = (event) => {
        const target = event.target as IDBOpenDBRequest;
        if (!target) {
          console.error("Error: event.target is null");
          return;
        }
        const db = target.result;
        if (!db.objectStoreNames.contains("landscape")) {
          db.createObjectStore("landscape", {
            keyPath: "id",
            autoIncrement: true,
          });
        }
        if (!db.objectStoreNames.contains("portrait")) {
          db.createObjectStore("portrait", {
            keyPath: "id",
            autoIncrement: true,
          });
        }
      };
    } catch (error) {
      console.error("Error opening database:", error);
      set({ isDBOpen: false });
    }
  },

  addImage: async (image, orientation) => {
    const { db, openDB } = get();
    if (!db) {
      openDB();
      return;
    }
    const transaction = db.transaction([orientation], "readwrite");
    const objectStore = transaction.objectStore(orientation);
    const request = objectStore.add(image);

    request.onsuccess = () => {
      console.log("Image added successfully:", image);
    };

    request.onerror = (event) => {
      console.error("Error adding image:", event);
    };
  },

  getAllImages: (orientation) => {
    const { db } = get();
    return new Promise<ImageData[]>((resolve, reject) => {
      if (!db) {
        reject("Database is not open");
        return;
      }
      const transaction = db.transaction([orientation], "readonly");
      const objectStore = transaction.objectStore(orientation);
      const request = objectStore.getAll();

      request.onsuccess = () => {
        resolve(request.result as ImageData[]);
      };

      request.onerror = (event) => {
        reject(event);
      };
    });
  },

  deleteImage: (id, orientation) => {
    const { db, openDB } = get();
    if (!db) {
      openDB();
      return;
    }
    const transaction = db.transaction([orientation], "readwrite");
    const objectStore = transaction.objectStore(orientation);
    const request = objectStore.delete(id);

    request.onsuccess = () => {
      console.log("Image deleted successfully:", id);
    };

    request.onerror = (event) => {
      console.error("Error deleting image:", event);
    };
  },

  clearDB: () => {
    const { db, openDB } = get();
    if (!db) {
      openDB();
      return;
    }
    const transaction = db.transaction(["landscape", "portrait"], "readwrite");
    const landscapeStore = transaction.objectStore("landscape");
    const portraitStore = transaction.objectStore("portrait");
    landscapeStore.clear();
    portraitStore.clear();
    console.log("Database cleared successfully.");
  },
}));

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
