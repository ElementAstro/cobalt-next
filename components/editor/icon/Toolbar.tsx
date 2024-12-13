import { Button } from "@/components/ui/button";
import {
  RotateCw,
  ZoomIn,
  ZoomOut,
  Trash2,
  Undo,
  Redo,
  Crop as CropIcon,
  Scissors,
  Download,
  Upload,
} from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { motion } from "framer-motion";

type ToolbarProps = {
  onUpload: () => void;
  onDelete: () => void;
  onUndo: () => void;
  onRedo: () => void;
  onCrop: () => void;
  isCropping: boolean;
  onCropApply: () => void;
  onCropCancel: () => void;
};

export default function Toolbar({
  onUpload,
  onDelete,
  onUndo,
  onRedo,
  onCrop,
  isCropping,
  onCropApply,
  onCropCancel,
}: ToolbarProps) {
  return (
    <motion.div
      className="flex flex-wrap justify-center gap-2 mb-4 lg:justify-start"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.3, duration: 0.5 }}
    >
      <Button onClick={onUpload}>
        <Upload className="w-4 h-4 mr-2" />
        上传图标
      </Button>
      <Button onClick={() => {}} variant="outline" disabled>
        <RotateCw className="w-4 h-4 mr-2" />
        旋转
      </Button>
      <Button onClick={() => {}} variant="outline" disabled>
        <ZoomIn className="w-4 h-4 mr-2" />
        放大
      </Button>
      <Button onClick={() => {}} variant="outline" disabled>
        <ZoomOut className="w-4 h-4 mr-2" />
        缩小
      </Button>
      <Button onClick={onDelete} variant="destructive">
        <Trash2 className="w-4 h-4 mr-2" />
        删除
      </Button>
      <Button onClick={onUndo} variant="outline">
        <Undo className="w-4 h-4 mr-2" />
        撤销
      </Button>
      <Button onClick={onRedo} variant="outline">
        <Redo className="w-4 h-4 mr-2" />
        重做
      </Button>
      {isCropping ? (
        <>
          <Button onClick={onCropApply} variant="outline">
            <Scissors className="w-4 h-4 mr-2" />
            应用裁剪
          </Button>
          <Button onClick={onCropCancel} variant="outline">
            取消裁剪
          </Button>
        </>
      ) : (
        <Button onClick={onCrop} variant="outline">
          <CropIcon className="w-4 h-4 mr-2" />
          裁剪
        </Button>
      )}
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            导出
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-48">
          <div className="grid gap-2">
            <Button onClick={() => {}} size="sm">
              16x16
            </Button>
            <Button onClick={() => {}} size="sm">
              32x32
            </Button>
            <Button onClick={() => {}} size="sm">
              64x64
            </Button>
            <Button onClick={() => {}} size="sm">
              128x128
            </Button>
          </div>
        </PopoverContent>
      </Popover>
    </motion.div>
  );
}
