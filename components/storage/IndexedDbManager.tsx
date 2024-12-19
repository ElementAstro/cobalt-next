// IndexedDBManager.tsx
"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { motion } from "framer-motion";
import { useIndexedDBStore } from "@/lib/store/storage/indexdb";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";

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

  const [selectedStore, setSelectedStore] = useState<string>("images");
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const handleFileUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadstart = () => setUploadProgress(0);
    reader.onprogress = (e) => {
      if (e.lengthComputable) {
        setUploadProgress((e.loaded / e.total) * 100);
      }
    };
    reader.onload = async (e) => {
      const imageUrl = e.target?.result as string;
      setPreviewUrl(imageUrl);
      await addImage({ url: imageUrl }, selectedStore);
      setUploadProgress(100);
    };
    reader.readAsDataURL(file);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className={`dark bg-gray-900 min-h-screen ${isLandscape ? "p-2" : "p-4"}`}
    >
      <Card className={`${isLandscape ? "p-3" : "p-6"}`}>
        <motion.div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-4">
            <motion.h1
              initial={{ y: -20 }}
              animate={{ y: 0 }}
              className={`${
                isLandscape ? "text-xl" : "text-2xl"
              } text-white font-bold`}
            >
              IndexedDB Manager
            </motion.h1>

            <Select value={selectedStore} onValueChange={setSelectedStore}>
              <SelectTrigger>
                <SelectValue placeholder="选择存储类型" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="images">图片存储</SelectItem>
                <SelectItem value="documents">文档存储</SelectItem>
              </SelectContent>
            </Select>

            <Input
              type="file"
              onChange={handleFileUpload}
              accept="image/*"
              className="w-full"
            />

            {uploadProgress > 0 && (
              <Progress value={uploadProgress} className="w-full" />
            )}
          </div>

          <div className="space-y-4">
            {previewUrl && (
              <img
                src={previewUrl}
                alt="Preview"
                className="max-w-full h-auto rounded-lg"
              />
            )}
          </div>
        </motion.div>

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
