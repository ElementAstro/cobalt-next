import React, { useState, useEffect, ChangeEvent } from "react";
import {
  Dialog,
  DialogHeader,
  DialogTitle,
  DialogContent,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { Settings } from "lucide-react";
import { motion } from "framer-motion";

interface FovDataType {
  x_pixels: number;
  x_pixel_size: number;
  y_pixels: number;
  y_pixel_size: number;
  focal_length: number;
}

interface FOVDialogProps {
  fov_data: FovDataType;
  rotation: number;
  open_dialog: number;
  on_fov_change: (fov_data: FovDataType) => void;
  on_rotation_change: (rotation: number) => void;
}

const FOVSettingDialog: React.FC<FOVDialogProps> = (props) => {
  const [open, setOpen] = useState(false);
  const [x_pixels, setXPixels] = useState(0);
  const [x_pixels_size, setXPixelsSize] = useState(0);
  const [y_pixels, setYPixels] = useState(0);
  const [y_pixel_size, setYPixelsSize] = useState(0);
  const [focal_length, setFocalLength] = useState(0);
  const [rotation, setRotation] = useState(0);
  const [previewFOV, setPreviewFOV] = useState({ width: 0, height: 0 });

  const [modified, setModified] = useState(false);

  useEffect(() => {
    setXPixels(props.fov_data.x_pixels);
    setYPixels(props.fov_data.y_pixels);
    setXPixelsSize(props.fov_data.x_pixel_size);
    setYPixelsSize(props.fov_data.y_pixel_size);
    setFocalLength(props.fov_data.focal_length);
    setRotation(props.rotation);
  }, []);

  useEffect(() => {
    setXPixels(props.fov_data.x_pixels);
    setYPixels(props.fov_data.y_pixels);
    setXPixelsSize(props.fov_data.x_pixel_size);
    setYPixelsSize(props.fov_data.y_pixel_size);
    setFocalLength(props.fov_data.focal_length);
  }, [props.fov_data]);

  useEffect(() => {
    setRotation(props.rotation);
  }, [props.rotation]);

  useEffect(() => {
    if (props.open_dialog > 0) {
      setOpen(true);
    }
  }, [props.open_dialog]);

  useEffect(() => {
    // 计算预览FOV
    const widthArcMin = (x_pixels * x_pixels_size * 206.265) / focal_length;
    const heightArcMin = (y_pixels * y_pixel_size * 206.265) / focal_length;
    setPreviewFOV({ width: widthArcMin, height: heightArcMin });
  }, [x_pixels, x_pixels_size, y_pixels, y_pixel_size, focal_length]);

  const handleClose = (update_flag: boolean = false) => {
    if (update_flag) {
      let new_fov_data: FovDataType = {
        x_pixels: x_pixels,
        x_pixel_size: x_pixels_size,
        y_pixels: y_pixels,
        y_pixel_size: y_pixel_size,
        focal_length: focal_length,
      };
      props.on_fov_change(new_fov_data);
      console.log("in dialog, changing fov", new_fov_data);
      props.on_rotation_change(rotation);
    } else {
      if (modified) {
        // 显示提示
      }
    }
    setOpen(false);
  };

  const updateFovModified = () => {
    setModified(true);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-w-3xl w-[90vw] max-h-[90vh] overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="space-y-6"
        >
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <motion.div
                whileHover={{ rotate: 180 }}
                transition={{ duration: 0.3 }}
              >
                <Settings className="w-5 h-5" />
              </motion.div>
              视角设置
            </DialogTitle>
          </DialogHeader>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              {/* Input fields */}
              <motion.div 
                className="space-y-4"
                variants={{
                  hidden: { opacity: 0 },
                  show: { 
                    opacity: 1,
                    transition: { staggerChildren: 0.1 }
                  }
                }}
                initial="hidden"
                animate="show"
              >
                <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4">
                  <Label className="block text-sm sm:w-1/3">
                    相机x方向的像素数量
                  </Label>
                  <Input
                    type="number"
                    value={x_pixels}
                    onChange={(e: ChangeEvent<HTMLInputElement>) =>
                      setXPixels(parseInt(e.target.value))
                    }
                    onBlur={updateFovModified}
                    className="flex-1"
                  />
                  <span>个</span>
                </div>
                <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4">
                  <Label className="block text-sm sm:w-1/3">
                    相机x方向的像素大小
                  </Label>
                  <Input
                    type="number"
                    value={x_pixels_size}
                    onChange={(e: ChangeEvent<HTMLInputElement>) =>
                      setXPixelsSize(parseFloat(e.target.value))
                    }
                    onBlur={updateFovModified}
                    className="flex-1"
                  />
                  <span>µm</span>
                </div>
                <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4">
                  <Label className="block text-sm sm:w-1/3">
                    相机y方向的像素数量
                  </Label>
                  <Input
                    type="number"
                    value={y_pixels}
                    onChange={(e: ChangeEvent<HTMLInputElement>) =>
                      setYPixels(parseInt(e.target.value))
                    }
                    onBlur={updateFovModified}
                    className="flex-1"
                  />
                  <span>个</span>
                </div>
                <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4">
                  <Label className="block text-sm sm:w-1/3">
                    相机y方向的像素大小
                  </Label>
                  <Input
                    type="number"
                    value={y_pixel_size}
                    onChange={(e: ChangeEvent<HTMLInputElement>) =>
                      setYPixelsSize(parseFloat(e.target.value))
                    }
                    onBlur={updateFovModified}
                    className="flex-1"
                  />
                  <span>µm</span>
                </div>
                <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4">
                  <Label className="block text-sm sm:w-1/3">望远镜焦距</Label>
                  <Input
                    type="number"
                    value={focal_length}
                    onChange={(e: ChangeEvent<HTMLInputElement>) =>
                      setFocalLength(parseFloat(e.target.value))
                    }
                    onBlur={updateFovModified}
                    className="flex-1"
                  />
                  <span>mm</span>
                </div>
                <div>
                  <Button variant="default">解析获取视场角度</Button>
                </div>
                <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4">
                  <Label className="block text-sm sm:w-1/3">相机旋转角度</Label>
                  <Slider
                    min={0}
                    max={360}
                    step={1}
                    value={[rotation]}
                    onValueChange={(value: number[]) => setRotation(value[0])}
                    onValueCommit={updateFovModified}
                    className="flex-1"
                  />
                  <span>{rotation}°</span>
                </div>
              </motion.div>
            </div>
            
            <div className="space-y-4">
              {/* Preview section */}
              <motion.div
                className="bg-muted/50 backdrop-blur-sm p-6 rounded-lg"
                whileHover={{ scale: 1.02 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <div className="bg-muted p-4 rounded-lg">
                  <h4 className="font-medium mb-2">预览计算结果</h4>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p>视场宽度: {previewFOV.width.toFixed(2)}′</p>
                      <p>视场高度: {previewFOV.height.toFixed(2)}′</p>
                    </div>
                    <div className="relative aspect-video border rounded">
                      <div
                        className="absolute inset-2 border-2 border-primary rounded"
                        style={{
                          transform: `rotate(${rotation}deg)`,
                          transformOrigin: "center",
                        }}
                      />
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </motion.div>
        
        <DialogFooter className="mt-6">
          <Button variant="outline" onClick={() => handleClose(false)}>
            取消
          </Button>
          <Button
            variant={modified ? "default" : "secondary"}
            onClick={() => handleClose(true)}
            disabled={!modified}
          >
            {modified ? "保存修改" : "无改动"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default FOVSettingDialog;
