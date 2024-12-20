import React from "react";
import { X, Star, StarOff } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { format } from "date-fns";
import {
  Card,
  CardHeader,
  CardFooter,
  CardContent,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useThemeStore } from "@/lib/store/theme";
import { Switch } from "@/components/ui/switch";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { File } from "@/types/filesystem";

interface FilePropertiesProps {
  file: File;
  isOpen: boolean;
  onClose: () => void;
}

export function FileProperties({
  file,
  isOpen,
  onClose,
}: FilePropertiesProps) {
  const { theme, toggleTheme } = useThemeStore();
  const [favorite, setFavorite] = React.useState(false);
  const [readOnly, setReadOnly] = React.useState<boolean>(
    file.permissions.includes("read") && !file.permissions.includes("write")
  );
  const [detailLevel, setDetailLevel] = React.useState<"basic" | "advanced">(
    "basic"
  );

  const variants = {
    backdrop: {
      hidden: { opacity: 0 },
      visible: { opacity: 1 },
      exit: { opacity: 0 },
    },
    modal: {
      hidden: { y: 50, opacity: 0 },
      visible: {
        y: 0,
        opacity: 1,
        transition: { type: "spring", stiffness: 300, damping: 24 },
      },
      exit: { y: 50, opacity: 0 },
    },
    item: { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } },
  };

  if (!isOpen) return null;

  const handleFavorite = () => setFavorite((prev) => !prev);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          variants={variants.backdrop}
          initial="hidden"
          animate="visible"
          exit="exit"
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
        >
          <motion.div
            variants={variants.modal}
            initial="hidden"
            animate="visible"
            exit="exit"
            className={`${
              theme === "dark"
                ? "bg-gray-800 text-white"
                : "bg-white text-black"
            } w-full max-w-lg mx-4 sm:mx-0 p-4 rounded-lg shadow-lg`}
          >
            <Card className="w-full">
              <CardHeader className="flex flex-col space-y-2 sm:space-y-0 sm:flex-row sm:items-center sm:justify-between gap-2">
                <div className="flex items-center space-x-3">
                  <CardTitle className="text-lg font-bold">文件属性</CardTitle>
                  <Button
                    variant="secondary"
                    onClick={handleFavorite}
                    size="sm"
                  >
                    {favorite ? (
                      <Star className="mr-1 w-4 h-4" />
                    ) : (
                      <StarOff className="mr-1 w-4 h-4" />
                    )}
                    {favorite ? "已收藏" : "收藏"}
                  </Button>
                </div>
                <div className="flex items-center space-x-2">
                  <Button variant="outline" onClick={toggleTheme} size="sm">
                    {theme === "dark" ? "亮色" : "暗色"}
                  </Button>
                  <Button variant="ghost" onClick={onClose} size="sm">
                    <X className="w-5 h-5" />
                  </Button>
                </div>
              </CardHeader>

              <Separator />

              <CardContent className="pb-0">
                <ScrollArea className="max-h-[60vh] w-full pr-2">
                  <motion.div
                    variants={variants.item}
                    className="mb-4 space-y-2"
                  >
                    <Label>
                      <strong>名称:</strong> {file.name}
                    </Label>
                    <Label>
                      <strong>类型:</strong> {file.type}
                    </Label>
                    <Label>
                      <strong>大小:</strong>{" "}
                      {((file.size || 0) / 1024).toFixed(2)} KB
                    </Label>
                  </motion.div>

                  <ToggleGroup
                    type="single"
                    value={detailLevel}
                    onValueChange={(v) => setDetailLevel((v || "basic") as any)}
                    className="mb-4 flex"
                  >
                    <ToggleGroupItem value="basic" className="flex-1">
                      基本信息
                    </ToggleGroupItem>
                    <ToggleGroupItem value="advanced" className="flex-1">
                      高级信息
                    </ToggleGroupItem>
                  </ToggleGroup>

                  {detailLevel === "basic" ? (
                    <motion.div variants={variants.item} className="space-y-2">
                      <Label>
                        <strong>创建时间:</strong>{" "}
                        {format(file.createdAt, "yyyy-MM-dd HH:mm:ss")}
                      </Label>
                      <Label>
                        <strong>修改时间:</strong>{" "}
                        {format(file.lastModified, "yyyy-MM-dd HH:mm:ss")}
                      </Label>
                    </motion.div>
                  ) : (
                    <motion.div variants={variants.item} className="space-y-2">
                      <Label>
                        <strong>所有者:</strong> {file.owner}
                      </Label>
                      <div className="flex items-center space-x-2">
                        <Label className="cursor-pointer">
                          <strong>只读模式:</strong>
                        </Label>
                        <Switch
                          checked={readOnly}
                          onCheckedChange={(checked) => setReadOnly(checked)}
                        />
                      </div>
                      <Label>
                        <strong>权限:</strong> {readOnly ? "读" : "读/写"}
                      </Label>
                      <Label>
                        <strong>路径:</strong> {file.path}
                      </Label>
                    </motion.div>
                  )}
                </ScrollArea>
              </CardContent>

              <CardFooter className="flex flex-col sm:flex-row items-center sm:justify-end space-y-2 sm:space-y-0 sm:space-x-2 mt-4">
                <Button
                  variant="outline"
                  onClick={onClose}
                  className="w-full sm:w-auto"
                >
                  关闭
                </Button>
              </CardFooter>
            </Card>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
