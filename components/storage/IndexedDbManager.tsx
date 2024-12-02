import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { motion } from "framer-motion";

export function IndexedDBManager({ isLandscape }: { isLandscape: boolean }) {
  const [isDBOpen, setIsDBOpen] = useState(false);
  const [db, setDb] = useState<IDBDatabase | null>(null);
  const [dbVersion, setDbVersion] = useState<number>(1);

  const openDB = async () => {
    try {
      const request = indexedDB.open("myDB", dbVersion);

      request.onerror = (event) => {
        console.error("Error opening database:", event);
        setIsDBOpen(false);
      };

      request.onsuccess = (event) => {
        setDb(request.result);
        setIsDBOpen(true);
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
      setIsDBOpen(false);
    }
  };

  useEffect(() => {
    openDB();
  }, [dbVersion]);

  const addImage = async (image: any, orientation: string) => {
    if (!db) return;
    const transaction = db.transaction([orientation], "readwrite");
    const objectStore = transaction.objectStore(orientation);
    const request = objectStore.add(image);

    request.onsuccess = () => {
      console.log("Image added successfully:", image);
    };

    request.onerror = (event) => {
      console.error("Error adding image:", event);
    };
  };

  const getAllImages = async (orientation: string) => {
    if (!db) return [];
    return new Promise<any[]>((resolve, reject) => {
      const transaction = db.transaction([orientation], "readonly");
      const objectStore = transaction.objectStore(orientation);
      const request = objectStore.getAll();

      request.onsuccess = () => {
        resolve(request.result);
      };

      request.onerror = (event) => {
        reject(event);
      };
    });
  };

  const deleteImage = async (id: number, orientation: string) => {
    if (!db) return;
    const transaction = db.transaction([orientation], "readwrite");
    const objectStore = transaction.objectStore(orientation);
    const request = objectStore.delete(id);

    request.onsuccess = () => {
      console.log("Image deleted successfully:", id);
    };

    request.onerror = (event) => {
      console.error("Error deleting image:", event);
    };
  };

  const clearDB = async () => {
    if (!db) return;
    const transaction = db.transaction(["landscape", "portrait"], "readwrite");
    const landscapeStore = transaction.objectStore("landscape");
    const portraitStore = transaction.objectStore("portrait");
    landscapeStore.clear();
    portraitStore.clear();
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="dark bg-gray-900 min-h-screen p-4"
    >
      <Card className="p-6">
        <motion.h1
          initial={{ y: -20 }}
          animate={{ y: 0 }}
          className="text-2xl text-white"
        >
          IndexedDB Manager
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-gray-300"
        >
          isLandscape: {isLandscape ? "true" : "false"}
        </motion.p>
        <div className="mt-4 space-x-2">
          <Button onClick={openDB} variant="default">
            Open DB
          </Button>
          <Button onClick={clearDB} variant="secondary">
            Clear DB
          </Button>
          <Button
            onClick={() =>
              addImage(
                { id: 1, url: "test" },
                isLandscape ? "landscape" : "portrait"
              )
            }
            variant="default"
          >
            Add Image
          </Button>
          <Button
            onClick={() =>
              deleteImage(1, isLandscape ? "landscape" : "portrait")
            }
            variant="destructive"
          >
            Delete Image
          </Button>
        </div>
        <p className="text-gray-300 mt-2">
          DB Open: {isDBOpen ? "true" : "false"}
        </p>
      </Card>
    </motion.div>
  );
}
