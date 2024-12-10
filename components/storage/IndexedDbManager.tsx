// IndexedDBManager.tsx
"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { motion } from "framer-motion";
import { useIndexedDBStore } from "@/lib/store/storage";

export function IndexedDBManager({ isLandscape }: { isLandscape: boolean }) {
  const { isDBOpen, openDB, addImage, deleteImage, clearDB, getAllImages } =
    useIndexedDBStore();

  useEffect(() => {
    openDB();
  }, [openDB]);

  const handleAddImage = () => {
    const image = { url: "test" };
    addImage(image, isLandscape ? "landscape" : "portrait");
  };

  const handleDeleteImage = () => {
    deleteImage(1, isLandscape ? "landscape" : "portrait");
  };

  const handleClearDB = () => {
    clearDB();
  };

  const handleFetchImages = async () => {
    try {
      const images = await getAllImages(isLandscape ? "landscape" : "portrait");
      console.log("Fetched Images:", images);
    } catch (error) {
      console.error("Error fetching images:", error);
    }
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
            打开数据库
          </Button>
          <Button onClick={handleClearDB} variant="secondary">
            清空数据库
          </Button>
          <Button onClick={handleAddImage} variant="default">
            添加图片
          </Button>
          <Button onClick={handleDeleteImage} variant="destructive">
            删除图片
          </Button>
          <Button onClick={handleFetchImages} variant="ghost">
            获取所有图片
          </Button>
        </div>
        <p className="text-gray-300 mt-2">
          数据库打开: {isDBOpen ? "是" : "否"}
        </p>
      </Card>
    </motion.div>
  );
}
