"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { CookieManager } from "@/components/storage/CookieManager";
import { IndexedDBManager } from "@/components/storage/IndexedDbManager";
import { LocalStorageManager } from "@/components/storage/LocalStorageManager";
import { SessionStorageEditor } from "@/components/storage/SessionManager";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      duration: 0.3,
    },
  },
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
      className="dark bg-gray-900 min-h-screen p-2"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <div className="grid grid-cols-3 gap-2 mb-2">
        <Card className="bg-gray-800 text-white">
          <CardHeader className="p-2">
            <CardTitle className="text-sm">Cookies</CardTitle>
          </CardHeader>
          <CardContent className="p-2 pt-0">
            <p className="text-sm">{cookieCount} 项</p>
          </CardContent>
        </Card>
        <Card className="bg-gray-800 text-white">
          <CardHeader className="p-2">
            <CardTitle className="text-sm">LocalStorage</CardTitle>
          </CardHeader>
          <CardContent className="p-2 pt-0">
            <p className="text-sm">{localStorageCount} 项</p>
          </CardContent>
        </Card>
        <Card className="bg-gray-800 text-white">
          <CardHeader className="p-2">
            <CardTitle className="text-sm">IndexedDB</CardTitle>
          </CardHeader>
          <CardContent className="p-2 pt-0">
            <p className="text-sm">{indexedDBCount} 项</p>
          </CardContent>
        </Card>
      </div>

      <Tabs
        defaultValue="cookies"
        className="bg-gray-800 text-white rounded-lg"
      >
        <TabsList className="flex bg-gray-700 p-0.5 rounded-t-lg">
          <TabsTrigger value="cookies" className="flex-1 text-sm py-1">
            Cookies
          </TabsTrigger>
          <TabsTrigger value="localstorage" className="flex-1 text-sm py-1">
            LocalStorage
          </TabsTrigger>
          <TabsTrigger value="indexeddb" className="flex-1 text-sm py-1">
            IndexedDB
          </TabsTrigger>
        </TabsList>
        <div className="p-2">
          <TabsContent value="cookies" className="mt-0">
            <CookieManager isLandscape={isLandscape} />
          </TabsContent>
          <TabsContent value="localstorage" className="mt-0">
            <LocalStorageManager isLandscape={isLandscape} />
          </TabsContent>
          <TabsContent value="indexeddb" className="mt-0">
            <IndexedDBManager isLandscape={isLandscape} />
          </TabsContent>
          <TabsContent value="sessionstorage" className="mt-0">
            <SessionStorageEditor />
          </TabsContent>
        </div>
      </Tabs>
    </motion.div>
  );
}
