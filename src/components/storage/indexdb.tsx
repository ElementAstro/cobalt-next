// IndexedDBManager.tsx
"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { motion } from "framer-motion";
import { useIndexedDBStore } from "@/store/useStorageStore";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Checkbox } from "@/components/ui/checkbox";

interface ImageMetadata {
  name: string;
  size: number;
  type: string;
  lastModified: number;
}

export function IndexedDBManager({ isLandscape }: { isLandscape: boolean }) {
  const {
    isDBOpen,
    openDB,
    addImage,
    deleteImage,
    clearDB,
    getAllImages,
    updateImage,
  } = useIndexedDBStore();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedImages, setSelectedImages] = useState<number[]>([]);
  const [metadata, setMetadata] = useState<ImageMetadata | null>(null);
  const [selectedStore, setSelectedStore] = useState<string>("images");
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [showMetadata, setShowMetadata] = useState(false);
  const [sortOrder, setSortOrder] = useState<string>("latest");
  const [filterType, setFilterType] = useState<string>("all");

  useEffect(() => {
    openDB();
  }, [openDB]);

  const handleAddImage = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const image = { url: "test" };
      await addImage(image, isLandscape ? "landscape" : "portrait");
    } catch (err) {
      setError("添加图片失败");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteImage = async (id?: number) => {
    setIsLoading(true);
    setError(null);
    try {
      const imageId = id || 1;
      await deleteImage(imageId, isLandscape ? "landscape" : "portrait");
      setSelectedImages((prev) => prev.filter((i) => i !== imageId));
    } catch (err) {
      setError("删除图片失败");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleBulkDelete = async () => {
    if (selectedImages.length === 0) return;
    setIsLoading(true);
    setError(null);
    try {
      await Promise.all(
        selectedImages.map((id) =>
          deleteImage(id, isLandscape ? "landscape" : "portrait")
        )
      );
      setSelectedImages([]);
    } catch (err) {
      setError("批量删除图片失败");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearDB = async () => {
    setIsLoading(true);
    setError(null);
    try {
      await clearDB();
      setSelectedImages([]);
      setPreviewUrl(null);
      setMetadata(null);
    } catch (err) {
      setError("清空数据库失败");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFetchImages = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const images = await getAllImages(isLandscape ? "landscape" : "portrait");
      console.log("获取的图片:", images);
    } catch (err) {
      setError("获取图片失败");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleImageSelect = (id: number) => {
    setSelectedImages((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const handleUpdateImage = async (id: number, newUrl: string) => {
    setIsLoading(true);
    setError(null);
    try {
      await updateImage(
        id,
        { url: newUrl },
        isLandscape ? "landscape" : "portrait"
      );
    } catch (err) {
      setError("更新图片失败");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsLoading(true);
    setError(null);

    const reader = new FileReader();
    reader.onloadstart = () => setUploadProgress(0);
    reader.onprogress = (e) => {
      if (e.lengthComputable) {
        setUploadProgress((e.loaded / e.total) * 100);
      }
    };
    reader.onload = async (e) => {
      try {
        const imageUrl = e.target?.result as string;
        setPreviewUrl(imageUrl);
        setMetadata({
          name: file.name,
          size: file.size,
          type: file.type,
          lastModified: file.lastModified,
        });
        await addImage({ url: imageUrl }, selectedStore);
        setUploadProgress(100);
      } catch (err) {
        setError("上传图片失败");
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    reader.readAsDataURL(file);
  };

  const sortedAndFilteredImages = () => {
    // 假设有 getAllImages 返回的 images 数组
    // 这里需要根据 sortOrder 和 filterType 进行排序和过滤
    // 由于无法修改 store，这里仅做示例
    return [];
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className={`dark:bg-gray-900 min-h-screen p-4 ${
        isLandscape ? "p-2" : "p-4"
      }`}
    >
      <Card className={`${isLandscape ? "p-3" : "p-6"}`}>
        {isLoading && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
          </div>
        )}

        {error && (
          <motion.div
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="bg-red-500/10 border border-red-500/30 text-red-500 p-3 rounded-md mb-4"
          >
            {error}
          </motion.div>
        )}

        <motion.div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-4">
            <motion.h1
              initial={{ y: -20 }}
              animate={{ y: 0 }}
              className={`${
                isLandscape ? "text-xl" : "text-2xl"
              } text-white font-bold`}
            >
              IndexedDB 管理器
            </motion.h1>

            <div className="flex flex-col md:flex-row gap-2">
              <Button
                onClick={handleBulkDelete}
                variant="destructive"
                disabled={selectedImages.length === 0}
                className="flex-1"
              >
                批量删除 ({selectedImages.length})
              </Button>
              <Button
                onClick={() => setShowMetadata(!showMetadata)}
                variant="outline"
                className="flex-1"
              >
                {showMetadata ? "隐藏元数据" : "显示元数据"}
              </Button>
            </div>

            <div className="flex flex-col md:flex-row gap-2">
              <Select value={selectedStore} onValueChange={setSelectedStore}>
                <SelectTrigger>
                  <SelectValue placeholder="选择存储类型" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="images">图片存储</SelectItem>
                  <SelectItem value="documents">文档存储</SelectItem>
                </SelectContent>
              </Select>

              <Select value={sortOrder} onValueChange={setSortOrder}>
                <SelectTrigger>
                  <SelectValue placeholder="排序方式" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="latest">最新</SelectItem>
                  <SelectItem value="oldest">最旧</SelectItem>
                  <SelectItem value="name">名称</SelectItem>
                </SelectContent>
              </Select>

              <Select value={filterType} onValueChange={setFilterType}>
                <SelectTrigger>
                  <SelectValue placeholder="过滤类型" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">全部</SelectItem>
                  <SelectItem value="image/png">PNG</SelectItem>
                  <SelectItem value="image/jpeg">JPEG</SelectItem>
                </SelectContent>
              </Select>
            </div>

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
              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.3 }}
                className="relative"
              >
                <img
                  src={previewUrl}
                  alt="预览"
                  className="max-w-full h-auto rounded-lg shadow-lg"
                />
                {showMetadata && metadata && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="absolute bottom-0 left-0 right-0 bg-black/75 p-2 text-white text-sm rounded-b-lg"
                  >
                    <div>文件名: {metadata.name}</div>
                    <div>大小: {(metadata.size / 1024).toFixed(2)} KB</div>
                    <div>类型: {metadata.type}</div>
                    <div>
                      修改时间:{" "}
                      {new Date(metadata.lastModified).toLocaleString()}
                    </div>
                  </motion.div>
                )}
              </motion.div>
            )}
          </div>
        </motion.div>

        <motion.div
          className="mt-6 flex flex-wrap gap-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <Button
            onClick={openDB}
            variant="default"
            className="flex items-center gap-2"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M21 12a9 9 0 0 1-9 9m9-9a9 9 0 0 0-9-9m9 9H3m9 9a9 9 0 0 1-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 0 1 9-9" />
            </svg>
            打开数据库
          </Button>
          <Button
            onClick={handleClearDB}
            variant="secondary"
            className="flex items-center gap-2"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M3 6h18" />
              <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
              <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
            </svg>
            清空数据库
          </Button>
          <Button
            onClick={handleAddImage}
            variant="default"
            className="flex items-center gap-2"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h7" />
              <line x1="16" y1="5" x2="22" y2="5" />
              <line x1="19" y1="2" x2="19" y2="8" />
              <circle cx="9" cy="9" r="2" />
              <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />
            </svg>
            添加图片
          </Button>
          <Button
            onClick={() => handleDeleteImage()}
            variant="destructive"
            className="flex items-center gap-2"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M3 6h18" />
              <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
              <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
              <line x1="10" y1="11" x2="10" y2="17" />
              <line x1="14" y1="11" x2="14" y2="17" />
            </svg>
            删除图片
          </Button>
          <Button
            onClick={handleFetchImages}
            variant="ghost"
            className="flex items-center gap-2"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M21 12a9 9 0 0 1-9 9m9-9a9 9 0 0 0-9-9m9 9H3m9 9a9 9 0 0 1-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 0 1 9-9" />
            </svg>
            获取所有图片
          </Button>
        </motion.div>
        <motion.div
          className="mt-4 flex items-center gap-2 text-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          <div
            className={`w-2 h-2 rounded-full ${
              isDBOpen ? "bg-green-500" : "bg-red-500"
            }`}
          />
          <span className="text-gray-300">
            数据库状态: {isDBOpen ? "已连接" : "未连接"}
          </span>
        </motion.div>
      </Card>
    </motion.div>
  );
}
