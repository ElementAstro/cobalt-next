import { useState } from "react";
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
import { X, Download, Trash } from "lucide-react";

interface ImageGalleryProps {
  images: string[];
  onClose: () => void;
}

export function ImageGallery({ images, onClose }: ImageGalleryProps) {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [filter, setFilter] = useState("");

  const filteredImages = images.filter((img) =>
    img.toLowerCase().includes(filter.toLowerCase())
  );

  const handleDownload = (src: string) => {
    // In a real application, you would implement the download logic here
    console.log(`Downloading image: ${src}`);
  };

  const handleDelete = (src: string) => {
    // In a real application, you would implement the delete logic here
    console.log(`Deleting image: ${src}`);
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>Image Gallery</DialogTitle>
        </DialogHeader>
        <div className="mb-4">
          <Label htmlFor="filter">Filter Images</Label>
          <Input
            id="filter"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            placeholder="Enter image name..."
          />
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 p-4 overflow-y-auto flex-grow">
          {filteredImages.map((src, index) => (
            <div key={index} className="relative aspect-square">
              <Image
                src={src}
                alt={`Captured image ${index + 1}`}
                layout="fill"
                objectFit="cover"
                className="rounded-lg cursor-pointer"
                onClick={() => setSelectedImage(src)}
              />
            </div>
          ))}
        </div>
        {selectedImage && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-gray-800 p-4 rounded-lg max-w-2xl max-h-[80vh] overflow-auto">
              <div className="flex justify-end mb-2">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setSelectedImage(null)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
              <Image
                src={selectedImage}
                alt="Selected image"
                width={800}
                height={600}
                objectFit="contain"
              />
              <div className="flex justify-center mt-4 space-x-4">
                <Button onClick={() => handleDownload(selectedImage)}>
                  <Download className="mr-2 h-4 w-4" /> Download
                </Button>
                <Button
                  variant="destructive"
                  onClick={() => handleDelete(selectedImage)}
                >
                  <Trash className="mr-2 h-4 w-4" /> Delete
                </Button>
              </div>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
