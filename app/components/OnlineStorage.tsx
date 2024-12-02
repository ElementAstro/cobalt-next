"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { CookieManager } from "@/components/storage/CookieManager";
import { IndexedDBManager } from "@/components/storage/IndexedDbManager";
import { LocalStorageManager } from "@/components/storage/LocalStorageManager";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

export default function OnlineStorage() {
  const [cookieCount, setCookieCount] = useState(0);
  const [localStorageCount, setLocalStorageCount] = useState(0);
  const [indexedDBCount, setIndexedDBCount] = useState(0);
  const [isLandscape, setIsLandscape] = useState(
    typeof window !== "undefined"
      ? window.innerWidth > window.innerHeight
      : true
  );

  useEffect(() => {
    // 统计 Cookies 数量
    setCookieCount(
      document.cookie.split(";").filter((c) => c.trim() !== "").length
    );

    // 统计 LocalStorage 项数
    setLocalStorageCount(localStorage.length);

    // 统计 IndexedDB 项数
    const request = indexedDB.open("MyDatabase", 1);
    request.onsuccess = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      if (db.objectStoreNames.contains("items")) {
        const transaction = db.transaction(["items"], "readonly");
        const objectStore = transaction.objectStore("items");
        const countRequest = objectStore.count();
        countRequest.onsuccess = () => {
          setIndexedDBCount(countRequest.result);
        };
      } else {
        setIndexedDBCount(0);
      }
    };

    // 监听窗口大小变化
    const handleResize = () => {
      setIsLandscape(window.innerWidth > window.innerHeight);
    };

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <motion.div
      className="dark bg-gray-900 min-h-screen "
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.div
        className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6"
        variants={containerVariants}
      >
        <motion.div variants={itemVariants}>
          <Card className="bg-gray-800 text-white">
            <CardHeader>
              <CardTitle>Cookies</CardTitle>
            </CardHeader>
            <CardContent>
              <p>{cookieCount} 项</p>
            </CardContent>
          </Card>
        </motion.div>
        <motion.div variants={itemVariants}>
          <Card className="bg-gray-800 text-white">
            <CardHeader>
              <CardTitle>LocalStorage</CardTitle>
            </CardHeader>
            <CardContent>
              <p>{localStorageCount} 项</p>
            </CardContent>
          </Card>
        </motion.div>
        <motion.div variants={itemVariants}>
          <Card className="bg-gray-800 text-white">
            <CardHeader>
              <CardTitle>IndexedDB</CardTitle>
            </CardHeader>
            <CardContent>
              <p>{indexedDBCount} 项</p>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>
      <motion.div variants={itemVariants}>
        <Tabs
          defaultValue="cookies"
          className="bg-gray-800 text-white rounded-lg"
        >
          <TabsList className="flex space-x-1 bg-gray-700 p-1 rounded-lg">
            <TabsTrigger value="cookies" className="flex-1">
              Cookies
            </TabsTrigger>
            <TabsTrigger value="localstorage" className="flex-1">
              LocalStorage
            </TabsTrigger>
            <TabsTrigger value="indexeddb" className="flex-1">
              IndexedDB
            </TabsTrigger>
          </TabsList>
          <TabsContent value="cookies" className="mt-4">
            <CookieManager isLandscape={isLandscape} />
          </TabsContent>
          <TabsContent value="localstorage" className="mt-4">
            <LocalStorageManager isLandscape={isLandscape} />
          </TabsContent>
          <TabsContent value="indexeddb" className="mt-4">
            <IndexedDBManager isLandscape={isLandscape} />
          </TabsContent>
        </Tabs>
      </motion.div>
    </motion.div>
  );
}
