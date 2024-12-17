import { create } from "zustand";

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

  searchImages: (query, orientation) => {
    const { db } = get();
    return new Promise<ImageData[]>((resolve, reject) => {
      if (!db) {
        reject("数据库未打开");
        return;
      }
      const transaction = db.transaction([orientation], "readonly");
      const objectStore = transaction.objectStore(orientation);
      const request = objectStore.getAll();

      request.onsuccess = () => {
        const results = (request.result as ImageData[]).filter(
          img => img.name?.toLowerCase().includes(query.toLowerCase())
        );
        resolve(results);
      };
      request.onerror = (event) => reject(event);
    });
  },

  bulkAddImages: (images, orientation) => {
    const { db, openDB } = get();
    if (!db) {
      openDB();
      return;
    }
    const transaction = db.transaction([orientation], "readwrite");
    const objectStore = transaction.objectStore(orientation);
    
    images.forEach(image => {
      const request = objectStore.add({
        ...image,
        timestamp: Date.now()
      });
      request.onerror = (event) => console.error("批量添加出错:", event);
    });
  },

  bulkDeleteImages: (ids, orientation) => {
    const { db, openDB } = get();
    if (!db) {
      openDB();
      return;
    }
    const transaction = db.transaction([orientation], "readwrite");
    const objectStore = transaction.objectStore(orientation);
    
    ids.forEach(id => {
      const request = objectStore.delete(id);
      request.onerror = (event) => console.error("批量删除出错:", event);
    });
  },

  getImageCount: (orientation) => {
    const { db } = get();
    return new Promise<number>((resolve, reject) => {
      if (!db) {
        reject("数据库未打开");
        return;
      }
      const transaction = db.transaction([orientation], "readonly");
      const objectStore = transaction.objectStore(orientation);
      const request = objectStore.count();
      
      request.onsuccess = () => resolve(request.result);
      request.onerror = (event) => reject(event);
    });
  },
}));
