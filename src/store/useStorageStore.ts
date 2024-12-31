import { create } from "zustand";
import { persist } from "zustand/middleware";
import CryptoJS from "crypto-js";
import Cookies from "js-cookie";
import log from "@/utils/logger"; // Import the logger

export interface CookieData {
  name: string;
  value: string;
  selected?: boolean;
  expires?: Date | number;
  domain?: string;
  secure?: boolean;
  httpOnly?: boolean;
  sameSite?: "strict" | "lax" | "none";
  path?: string;
  maxAge?: number;
}

interface CookieState {
  cookies: CookieData[];
  loadCookies: () => void;
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

  loadCookies: () => {
    log.info("Loading cookies from browser");
    const cookieList = Object.entries(Cookies.get()).map(([name, value]) => ({
      name,
      value: String(value),
      selected: false,
    }));
    set({ cookies: cookieList });
    log.info("Cookies loaded successfully");
  },

  addCookie: (cookie) => {
    try {
      log.info(`Adding cookie: ${cookie.name}`);
      Cookies.set(cookie.name, cookie.value, {
        path: cookie.path || "/",
        sameSite: cookie.sameSite || "strict",
        expires: cookie.expires,
        domain: cookie.domain,
        secure: cookie.secure,
        httpOnly: cookie.httpOnly,
        maxAge: cookie.maxAge,
      });
      get().loadCookies();
      log.info(`Cookie added successfully: ${cookie.name}`);
    } catch (error) {
      log.error(`Error adding cookie: ${cookie.name}`, error);
      throw new Error("Failed to add cookie");
    }
  },

  updateCookie: (cookie) => {
    log.info(`Updating cookie: ${cookie.name}`);
    Cookies.set(cookie.name, cookie.value, {
      path: "/",
      sameSite: "strict",
    });
    get().loadCookies();
    log.info(`Cookie updated successfully: ${cookie.name}`);
  },

  deleteCookie: (name) => {
    log.info(`Deleting cookie: ${name}`);
    Cookies.remove(name, { path: "/" });
    get().loadCookies();
    log.info(`Cookie deleted successfully: ${name}`);
  },

  selectAll: (selected) => {
    log.info(`Selecting all cookies: ${selected}`);
    set({
      cookies: get().cookies.map((cookie) => ({ ...cookie, selected })),
    });
    log.info("All cookies selected successfully");
  },

  toggleSelect: (name, selected) => {
    log.info(`Toggling selection for cookie: ${name}`);
    set({
      cookies: get().cookies.map((cookie) =>
        cookie.name === name ? { ...cookie, selected } : cookie
      ),
    });
    log.info(`Cookie selection toggled successfully: ${name}`);
  },

  deleteSelected: () => {
    log.info("Deleting selected cookies");
    get()
      .cookies.filter((cookie) => cookie.selected)
      .forEach((cookie) => {
        Cookies.remove(cookie.name, { path: "/" });
      });
    get().loadCookies();
    log.info("Selected cookies deleted successfully");
  },

  encryptCookie: (data, key) => {
    log.info("Encrypting cookie data");
    if (!key || key.length < 8) {
      log.error("Encryption key must be at least 8 characters");
      throw new Error("Encryption key must be at least 8 characters");
    }
    try {
      const encryptedData = CryptoJS.AES.encrypt(data, key).toString();
      log.info("Cookie data encrypted successfully");
      return encryptedData;
    } catch (error) {
      log.error("Encryption failed:", error);
      throw new Error("Failed to encrypt data");
    }
  },

  decryptCookie: (data, key) => {
    log.info("Decrypting cookie data");
    if (!key || key.length < 8) {
      log.error("Decryption key must be at least 8 characters");
      throw new Error("Decryption key must be at least 8 characters");
    }
    try {
      const bytes = CryptoJS.AES.decrypt(data, key);
      const result = bytes.toString(CryptoJS.enc.Utf8);
      if (!result) {
        log.error("Decryption failed - invalid key or data");
        throw new Error("Decryption failed - invalid key or data");
      }
      log.info("Cookie data decrypted successfully");
      return result;
    } catch (error) {
      log.error("Decryption failed:", error);
      throw new Error("Failed to decrypt data");
    }
  },
}));

export interface CookieOption {
  id: string;
  name: string;
  description: string;
  isRequired: boolean;
}

export interface CookieConsentProps {
  privacyPolicyUrl?: string;
  cookieOptions?: CookieOption[];
  onAccept?: (acceptedOptions: string[]) => void;
  onDecline?: () => void;
  position?: "bottom" | "top";
}

export const defaultCookieOptions: CookieOption[] = [
  {
    id: "necessary",
    name: "必要",
    description: "网站功能所必需的Cookie",
    isRequired: true,
  },
  {
    id: "analytics",
    name: "分析",
    description: "帮助我们理解如何改善网站",
    isRequired: false,
  },
  {
    id: "marketing",
    name: "营销",
    description: "用于向您展示相关广告",
    isRequired: false,
  },
];

// Zustand store
export const useCookieConsentStore = create<{
  isVisible: boolean;
  acceptedOptions: string[];
  showDetails: boolean;
  setIsVisible: (visible: boolean) => void;
  setAcceptedOptions: (
    options: string[] | ((prev: string[]) => string[])
  ) => void;
  toggleOption: (optionId: string) => void;
  setShowDetails: (show: boolean) => void;
}>((set) => ({
  isVisible: false,
  acceptedOptions: [],
  showDetails: false,
  setIsVisible: (visible) => set({ isVisible: visible }),
  setAcceptedOptions: (options) =>
    set((state) => ({
      acceptedOptions:
        typeof options === "function"
          ? options(state.acceptedOptions)
          : options,
    })),
  toggleOption: (optionId) =>
    set((state) => ({
      acceptedOptions: state.acceptedOptions.includes(optionId)
        ? state.acceptedOptions.filter((id) => id !== optionId)
        : [...state.acceptedOptions, optionId],
    })),
  setShowDetails: (show) => set({ showDetails: show }),
}));

interface ImageData {
  id?: number;
  url: string;
  name?: string;
  timestamp?: number;
  size?: number;
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
  searchImages: (query: string, orientation: string) => Promise<ImageData[]>;
  bulkAddImages: (images: ImageData[], orientation: string) => void;
  bulkDeleteImages: (ids: number[], orientation: string) => void;
  getImageCount: (orientation: string) => Promise<number>;
  updateImage: (id: number, image: ImageData, orientation: string) => void;
}

export const useIndexedDBStore = create<IndexedDBState>((set, get) => ({
  db: null,
  isDBOpen: false,
  dbVersion: 1,

  openDB: () => {
    try {
      log.info("Attempting to open IndexedDB...");
      const request = indexedDB.open("myDB", get().dbVersion);

      request.onerror = (event) => {
        log.error("Error opening database:", event);
        set({ isDBOpen: false });
      };

      request.onsuccess = (event) => {
        log.info("Database opened successfully:", request.result);
        set({ db: request.result, isDBOpen: true });
      };

      request.onupgradeneeded = (event) => {
        log.info("Database upgrade needed...");
        const target = event.target as IDBOpenDBRequest;
        if (!target) {
          log.error("Error: event.target is null");
          return;
        }
        const db = target.result;
        if (!db.objectStoreNames.contains("landscape")) {
          db.createObjectStore("landscape", {
            keyPath: "id",
            autoIncrement: true,
          });
          log.info("Created object store: landscape");
        }
        if (!db.objectStoreNames.contains("portrait")) {
          db.createObjectStore("portrait", {
            keyPath: "id",
            autoIncrement: true,
          });
          log.info("Created object store: portrait");
        }
      };
    } catch (error) {
      log.error("Error opening database:", error);
      set({ isDBOpen: false });
    }
  },

  addImage: async (image, orientation) => {
    const { db, openDB } = get();
    if (!db) {
      log.warn("Database not open, attempting to open...");
      openDB();
      return;
    }
    log.info(`Adding image to ${orientation} store...`);
    const transaction = db.transaction([orientation], "readwrite");
    const objectStore = transaction.objectStore(orientation);
    const request = objectStore.add(image);

    request.onsuccess = () => {
      log.info("Image added successfully:", image);
    };

    request.onerror = (event) => {
      log.error("Error adding image:", event);
    };
  },

  getAllImages: (orientation) => {
    const { db } = get();
    return new Promise<ImageData[]>((resolve, reject) => {
      if (!db) {
        log.error("Database is not open");
        reject("Database is not open");
        return;
      }
      log.info(`Fetching all images from ${orientation} store...`);
      const transaction = db.transaction([orientation], "readonly");
      const objectStore = transaction.objectStore(orientation);
      const request = objectStore.getAll();

      request.onsuccess = () => {
        log.info(`Successfully fetched images from ${orientation} store`);
        resolve(request.result as ImageData[]);
      };

      request.onerror = (event) => {
        log.error("Error fetching images:", event);
        reject(event);
      };
    });
  },

  deleteImage: (id, orientation) => {
    const { db, openDB } = get();
    if (!db) {
      log.warn("Database not open, attempting to open...");
      openDB();
      return;
    }
    log.info(`Deleting image with ID ${id} from ${orientation} store...`);
    const transaction = db.transaction([orientation], "readwrite");
    const objectStore = transaction.objectStore(orientation);
    const request = objectStore.delete(id);

    request.onsuccess = () => {
      log.info("Image deleted successfully:", id);
    };

    request.onerror = (event) => {
      log.error("Error deleting image:", event);
    };
  },

  clearDB: () => {
    const { db, openDB } = get();
    if (!db) {
      log.warn("Database not open, attempting to open...");
      openDB();
      return;
    }
    log.info("Clearing all images from the database...");
    const transaction = db.transaction(["landscape", "portrait"], "readwrite");
    const landscapeStore = transaction.objectStore("landscape");
    const portraitStore = transaction.objectStore("portrait");
    landscapeStore.clear();
    portraitStore.clear();
    log.info("Database cleared successfully.");
  },

  searchImages: (query, orientation) => {
    const { db } = get();
    return new Promise<ImageData[]>((resolve, reject) => {
      if (!db) {
        log.error("Database is not open");
        reject("Database is not open");
        return;
      }
      log.info(`Searching images in ${orientation} store with query: ${query}`);
      const transaction = db.transaction([orientation], "readonly");
      const objectStore = transaction.objectStore(orientation);
      const request = objectStore.getAll();

      request.onsuccess = () => {
        const results = (request.result as ImageData[]).filter((img) =>
          img.name?.toLowerCase().includes(query.toLowerCase())
        );
        log.info(`Found ${results.length} images matching the query`);
        resolve(results);
      };
      request.onerror = (event) => {
        log.error("Error searching images:", event);
        reject(event);
      };
    });
  },

  bulkAddImages: (images, orientation) => {
    const { db, openDB } = get();
    if (!db) {
      log.warn("Database not open, attempting to open...");
      openDB();
      return;
    }
    log.info(`Bulk adding ${images.length} images to ${orientation} store...`);
    const transaction = db.transaction([orientation], "readwrite");
    const objectStore = transaction.objectStore(orientation);

    images.forEach((image) => {
      const request = objectStore.add({
        ...image,
        timestamp: Date.now(),
      });
      request.onerror = (event) => log.error("Error bulk adding image:", event);
    });
    log.info("Bulk add operation completed.");
  },

  bulkDeleteImages: (ids, orientation) => {
    const { db, openDB } = get();
    if (!db) {
      log.warn("Database not open, attempting to open...");
      openDB();
      return;
    }
    log.info(`Bulk deleting ${ids.length} images from ${orientation} store...`);
    const transaction = db.transaction([orientation], "readwrite");
    const objectStore = transaction.objectStore(orientation);

    ids.forEach((id) => {
      const request = objectStore.delete(id);
      request.onerror = (event) =>
        log.error("Error bulk deleting image:", event);
    });
    log.info("Bulk delete operation completed.");
  },

  getImageCount: (orientation) => {
    const { db } = get();
    return new Promise<number>((resolve, reject) => {
      if (!db) {
        log.error("Database is not open");
        reject("Database is not open");
        return;
      }
      log.info(`Getting image count from ${orientation} store...`);
      const transaction = db.transaction([orientation], "readonly");
      const objectStore = transaction.objectStore(orientation);
      const request = objectStore.count();

      request.onsuccess = () => {
        log.info(`Image count in ${orientation} store: ${request.result}`);
        resolve(request.result);
      };
      request.onerror = (event) => {
        log.error("Error getting image count:", event);
        reject(event);
      };
    });
  },

  updateImage: (id, image, orientation) => {
    const { db, openDB } = get();
    if (!db) {
      log.warn("Database not open, attempting to open...");
      openDB();
      return;
    }
    log.info(`Updating image with ID ${id} in ${orientation} store...`);
    const transaction = db.transaction([orientation], "readwrite");
    const objectStore = transaction.objectStore(orientation);
    const request = objectStore.put({ ...image, id });

    request.onsuccess = () => {
      log.info("Image updated successfully:", id);
    };

    request.onerror = (event) => {
      log.error("Error updating image:", event);
    };
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
    log.info("Loading items from localStorage");
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
    log.info(`Loaded ${allItems.length} items from localStorage`);
  },
  addItem: (item) => {
    log.info(`Adding item to localStorage: ${item.key}`);
    localStorage.setItem(item.key, item.value);
    get().loadItems();
    log.info(`Item added to localStorage: ${item.key}`);
  },
  updateItem: (item) => {
    log.info(`Updating item in localStorage: ${item.key}`);
    localStorage.setItem(item.key, item.value);
    get().loadItems();
    log.info(`Item updated in localStorage: ${item.key}`);
  },
  deleteItem: (key) => {
    log.info(`Deleting item from localStorage: ${key}`);
    localStorage.removeItem(key);
    get().loadItems();
    log.info(`Item deleted from localStorage: ${key}`);
  },
  selectAll: (checked) => {
    log.info(`Selecting all items: ${checked}`);
    set({
      items: get().items.map((item) => ({ ...item, selected: checked })),
    });
    log.info(`All items selected: ${checked}`);
  },
  toggleSelect: (key, checked) => {
    log.info(`Toggling selection for item: ${key}, checked: ${checked}`);
    set({
      items: get().items.map((item) =>
        item.key === key ? { ...item, selected: checked } : item
      ),
    });
    log.info(`Selection toggled for item: ${key}, checked: ${checked}`);
  },
  deleteSelected: () => {
    log.info("Deleting selected items from localStorage");
    get()
      .items.filter((item) => item.selected)
      .forEach((item) => {
        localStorage.removeItem(item.key);
      });
    set({ items: [] });
    log.info("Selected items deleted from localStorage");
  },
  exportItems: () => {
    log.info("Exporting selected items from localStorage");
    const selectedItems = get().items.filter((item) => item.selected);
    if (selectedItems.length === 0) {
      log.warn("No items selected for export");
      return;
    }
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
    log.info(
      `Exported ${selectedItems.length} items to localstorage_items.json`
    );
  },
  importItems: (items) => {
    log.info(`Importing ${items.length} items to localStorage`);
    items.forEach((item) => {
      localStorage.setItem(item.key, item.value);
    });
    get().loadItems();
    log.info(`Imported ${items.length} items to localStorage`);
  },
  setSearchTerm: (term) => {
    log.info(`Setting search term: ${term}`);
    set({ searchTerm: term });
    log.info(`Search term set to: ${term}`);
  },
}));

interface StorageItem {
  key: string;
  value: string;
}

interface SessionStorageState {
  items: StorageItem[];
  settings: {
    theme: "light" | "dark";
    itemsPerPage: number;
    showValuePreview: boolean;
  };
  currentPage: number;
  setItems: (items: StorageItem[]) => void;
  addItem: (key: string, value: string) => void;
  editItem: (oldKey: string, newKey: string, value: string) => void;
  deleteItem: (key: string) => void;
  updateSettings: (settings: Partial<SessionStorageState["settings"]>) => void;
  setCurrentPage: (page: number) => void;
}

export const useSessionStorageStore = create<SessionStorageState>()(
  persist<SessionStorageState>(
    (set, get) => ({
      items: [],
      settings: {
        theme: "dark",
        itemsPerPage: 5,
        showValuePreview: true,
      },
      currentPage: 1,
      setItems: (items: StorageItem[]) => {
        log.info(`Setting items: ${JSON.stringify(items)}`);
        set({ items });
      },
      addItem: (key: string, value: string) => {
        const { items } = get();
        const newItems = [...items, { key, value }];
        log.info(`Adding item - Key: ${key}, Value: ${value}`);
        set({ items: newItems });
        sessionStorage.setItem(key, value);
      },
      editItem: (oldKey: string, newKey: string, value: string) => {
        const { items } = get();
        const newItems = items.map((item: StorageItem) =>
          item.key === oldKey ? { key: newKey, value } : item
        );
        log.info(
          `Editing item - Old Key: ${oldKey}, New Key: ${newKey}, Value: ${value}`
        );
        set({ items: newItems });
        if (oldKey !== newKey) {
          sessionStorage.removeItem(oldKey);
        }
        sessionStorage.setItem(newKey, value);
      },
      deleteItem: (key: string) => {
        const { items } = get();
        const newItems = items.filter((item: StorageItem) => item.key !== key);
        log.info(`Deleting item - Key: ${key}`);
        set({ items: newItems });
        sessionStorage.removeItem(key);
      },
      updateSettings: (
        newSettings: Partial<SessionStorageState["settings"]>
      ) => {
        log.info(`Updating settings: ${JSON.stringify(newSettings)}`);
        set((state) => ({
          settings: { ...state.settings, ...newSettings },
        }));
      },
      setCurrentPage: (page: number) => {
        log.info(`Setting current page to: ${page}`);
        set({ currentPage: page });
      },
    }),
    {
      name: "session-storage-store",
    }
  )
);
