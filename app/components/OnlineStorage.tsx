"use client";

import { useState, useEffect } from "react";

import { CookieManager } from "@/components/storage/cookie-manager";
import { IndexedDBManager } from "@/components/storage/indexed-db-manager";
import { LocalStorageManager } from "@/components/storage/local-storage-manager";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function StorageManager() {
  const [cookieCount, setCookieCount] = useState(0);
  const [localStorageCount, setLocalStorageCount] = useState(0);
  const [indexedDBCount, setIndexedDBCount] = useState(0);
  const [isLandscape, setIsLandscape] = useState(
    window.innerWidth > window.innerHeight
  );

  useEffect(() => {
    // Count cookies
    setCookieCount(
      document.cookie.split(";").filter((c) => c.trim() !== "").length
    );

    // Count localStorage items
    setLocalStorageCount(localStorage.length);

    // Count IndexedDB items
    const request = indexedDB.open("MyDatabase", 1);
    request.onsuccess = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      const transaction = db.transaction(["items"], "readonly");
      const objectStore = transaction.objectStore("items");
      const countRequest = objectStore.count();
      countRequest.onsuccess = () => {
        setIndexedDBCount(countRequest.result);
      };
    };

    // Update isLandscape on resize
    const handleResize = () => {
      setIsLandscape(window.innerWidth > window.innerHeight);
    };

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Storage Manager</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <Card>
          <CardHeader>
            <CardTitle>Cookies</CardTitle>
          </CardHeader>
          <CardContent>
            <p>{cookieCount} items</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>LocalStorage</CardTitle>
          </CardHeader>
          <CardContent>
            <p>{localStorageCount} items</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>IndexedDB</CardTitle>
          </CardHeader>
          <CardContent>
            <p>{indexedDBCount} items</p>
          </CardContent>
        </Card>
      </div>
      <Tabs defaultValue="cookies">
        <TabsList>
          <TabsTrigger value="cookies">Cookies</TabsTrigger>
          <TabsTrigger value="localstorage">LocalStorage</TabsTrigger>
          <TabsTrigger value="indexeddb">IndexedDB</TabsTrigger>
        </TabsList>
        <TabsContent value="cookies">
          <CookieManager isLandscape={isLandscape} />
        </TabsContent>
        <TabsContent value="localstorage">
          <LocalStorageManager isLandscape={isLandscape} />
        </TabsContent>
        <TabsContent value="indexeddb">
          <IndexedDBManager isLandscape={isLandscape} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
