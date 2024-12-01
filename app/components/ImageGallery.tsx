import { useState, useEffect, useCallback, memo } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Image from "next/image";
import { X, Download, Trash, Check } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface ImageGalleryProps {
  images: string[];
  onClose: () => void;
}

export const ImageGallery: React.FC<ImageGalleryProps> = memo(
  ({ images, onClose }) => {
    const [selectedImage, setSelectedImage] = useState<string | null>(null);
    const [filter, setFilter] = useState("");
    const [selectedImages, setSelectedImages] = useState<Set<string>>(
      new Set()
    );
    const [open, setOpen] = useState(true);
    const [isSimulationMode, setIsSimulationMode] = useState(true);

    const filteredImages = images.filter((img) =>
      img.toLowerCase().includes(filter.toLowerCase())
    );

    const handleDownload = (src: string) => {
      // 实现下载逻辑
      const link = document.createElement("a");
      link.href = src;
      link.download = src.split("/").pop() || "image";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    };

    const handleDelete = (src: string) => {
      // 实现删除逻辑
      console.log(`Deleting image: ${src}`);
    };

    const toggleSelectImage = (src: string) => {
      setSelectedImages((prev) => {
        const newSet = new Set(prev);
        if (newSet.has(src)) {
          newSet.delete(src);
        } else {
          newSet.add(src);
        }
        return newSet;
      });
    };

    const handleBulkDownload = () => {
      selectedImages.forEach((src) => handleDownload(src));
    };

    const handleBulkDelete = () => {
      selectedImages.forEach((src) => handleDelete(src));
      setSelectedImages(new Set());
    };

    return (
      <Dialog
        open={open}
        onOpenChange={(isOpen) => {
          setOpen(isOpen);
          if (!isOpen) {
            onClose();
          }
        }}
      >
        <AnimatePresence>
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            className="max-w-6xl max-h-[80vh] flex flex-col"
          >
            <DialogContent>
              <DialogHeader>
                <DialogTitle className="text-white">图像画廊</DialogTitle>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={onClose}
                  aria-label="关闭画廊"
                >
                  <X className="h-5 w-5 text-white" />
                </Button>
              </DialogHeader>
              <div className="mb-4 flex items-center space-x-4">
                <Label htmlFor="filter" className="text-white">
                  过滤图像
                </Label>
                <Input
                  id="filter"
                  value={filter}
                  onChange={(e) => setFilter(e.target.value)}
                  placeholder="输入图像名称..."
                  className="flex-1 text-white placeholder-white"
                />
                {selectedImages.size > 0 && (
                  <>
                    <Button onClick={handleBulkDownload} className="text-white">
                      <Download className="mr-2 h-4 w-4" /> 下载选中
                    </Button>
                    <Button
                      variant="destructive"
                      onClick={handleBulkDelete}
                      className="text-white"
                    >
                      <Trash className="mr-2 h-4 w-4" /> 删除选中
                    </Button>
                  </>
                )}
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 overflow-y-auto flex-grow">
                {filteredImages.map((src, index) => (
                  <motion.div
                    key={index}
                    className="relative aspect-square rounded-lg overflow-hidden cursor-pointer"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Image
                      src={src}
                      alt={`Captured image ${index + 1}`}
                      layout="fill"
                      objectFit="cover"
                      className="rounded-lg"
                      onClick={() => setSelectedImage(src)}
                    />
                    <div className="absolute top-2 left-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleSelectImage(src);
                        }}
                        aria-label={
                          selectedImages.has(src) ? "取消选择" : "选择图像"
                        }
                      >
                        {selectedImages.has(src) ? (
                          <Check className="h-4 w-4 text-green-500" />
                        ) : (
                          <div className="w-4 h-4 border border-white rounded-full bg-transparent" />
                        )}
                      </Button>
                    </div>
                  </motion.div>
                ))}
              </div>
              {selectedImage && (
                <AnimatePresence>
                  <motion.div
                    className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    <motion.div
                      className="bg-gray-800 p-6 rounded-lg max-w-3xl max-h-[90vh] overflow-auto relative"
                      initial={{ scale: 0.8 }}
                      animate={{ scale: 1 }}
                      exit={{ scale: 0.8 }}
                    >
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setSelectedImage(null)}
                        className="absolute top-2 right-2 text-white"
                        aria-label="关闭预览"
                      >
                        <X className="h-5 w-5 text-white" />
                      </Button>
                      <Image
                        src={selectedImage}
                        alt="Selected image"
                        width={1200}
                        height={800}
                        objectFit="contain"
                        className="rounded-lg"
                      />
                      <div className="flex justify-center mt-4 space-x-4">
                        <Button
                          onClick={() => handleDownload(selectedImage)}
                          className="text-white"
                        >
                          <Download className="mr-2 h-4 w-4" /> 下载
                        </Button>
                        <Button
                          variant="destructive"
                          onClick={() => handleDelete(selectedImage)}
                          className="text-white"
                        >
                          <Trash className="mr-2 h-4 w-4" /> 删除
                        </Button>
                      </div>
                    </motion.div>
                  </motion.div>
                </AnimatePresence>
              )}
            </DialogContent>
          </motion.div>
        </AnimatePresence>
      </Dialog>
    );
  }
);
