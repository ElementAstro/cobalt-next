import React from "react";
import { X } from "lucide-react";
import { motion } from "framer-motion";
import {
  Dialog,
  DialogOverlay,
  DialogContent,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Switch } from "@/components/ui/switch";
import { CustomizationOptions } from "@/types/filesystem";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Slider } from "@/components/ui/slider";
import { toast } from "@/hooks/use-toast";

// 添加重置设置函数
const resetSettings = async () => {
  // 实际项目中需要实现具体的重置逻辑
  await new Promise((resolve) => setTimeout(resolve, 1000));
};

export const SettingsPanel: React.FC<CustomizationOptions> = ({
  isOpen,
  onClose,
  options,
  setOptions,
}) => {
  const [isResetting, setIsResetting] = React.useState(false);
  const [backupLocation, setBackupLocation] = React.useState<string>("");
  const [shortcutKeys, setShortcutKeys] = React.useState<
    Record<string, string>
  >({
    copy: "ctrl+c",
    paste: "ctrl+v",
    cut: "ctrl+x",
    // ...更多快捷键
  });

  const handleReset = async () => {
    try {
      setIsResetting(true);
      await resetSettings();
      toast({
        title: "成功",
        description: "设置已重置",
        variant: "default",
      });
    } catch (error) {
      toast({
        title: "错误",
        description: "重置失败",
        variant: "destructive",
      });
    } finally {
      setIsResetting(false);
    }
  };

  const handleBackupLocationChange = (location: string) => {
    setBackupLocation(location);
  };

  const handleShortcutChange = (action: string, shortcut: string) => {
    setShortcutKeys((prev) => ({
      ...prev,
      [action]: shortcut,
    }));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogOverlay className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          transition={{ duration: 0.3 }}
          className="bg-gray-900 text-white p-4 rounded-lg w-full max-w-md mx-4 md:mx-0"
        >
          <DialogContent className="max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-2">
              <DialogTitle className="text-lg font-bold">设置</DialogTitle>
              <DialogClose />
            </div>
            <DialogDescription className="space-y-2">
              <Accordion type="single" collapsible className="w-full">
                {/* 显示设置 */}
                <AccordionItem value="display">
                  <AccordionTrigger>显示设置</AccordionTrigger>
                  <AccordionContent>
                    <div>
                      <Label className="block mb-1">网格大小</Label>
                      <Select
                        value={options.gridSize}
                        onValueChange={(value) =>
                          setOptions({
                            ...options,
                            gridSize: value as "small" | "medium" | "large",
                          })
                        }
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="选择网格大小" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="small">小</SelectItem>
                          <SelectItem value="medium">中</SelectItem>
                          <SelectItem value="large">大</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="showHiddenFiles"
                        checked={options.showHiddenFiles}
                        onCheckedChange={(checked) =>
                          setOptions({
                            ...options,
                            showHiddenFiles: checked as boolean,
                          })
                        }
                      />
                      <Label htmlFor="showHiddenFiles">显示隐藏文件</Label>
                    </div>
                    <div className="space-y-2">
                      <h3 className="text-md font-medium">排序与显示</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        <div>
                          <Label>排序方式</Label>
                          <Select
                            value={options.sortBy}
                            onValueChange={(value) =>
                              setOptions({
                                ...options,
                                sortBy: value as typeof options.sortBy,
                              })
                            }
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="name">名称</SelectItem>
                              <SelectItem value="date">日期</SelectItem>
                              <SelectItem value="size">大小</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label>默认视图</Label>
                          <Select
                            value={options.defaultView}
                            onValueChange={(value) =>
                              setOptions({
                                ...options,
                                defaultView: value as "list" | "grid",
                              })
                            }
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="list">列表</SelectItem>
                              <SelectItem value="grid">网格</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>
                {/* 性能设置 */}
                <AccordionItem value="performance">
                  <AccordionTrigger>性能设置</AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-2">
                      <h3 className="text-md font-medium">性能与存储</h3>
                      <div>
                        <Label>缩略图质量</Label>
                        <Select
                          value={options.thumbnailQuality}
                          onValueChange={(value) =>
                            setOptions({
                              ...options,
                              thumbnailQuality:
                                value as typeof options.thumbnailQuality,
                            })
                          }
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="low">低（节省带宽）</SelectItem>
                            <SelectItem value="medium">中等</SelectItem>
                            <SelectItem value="high">高（最佳质量）</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="flex items-center justify-between">
                        <Label>自动备份</Label>
                        <Switch
                          checked={options.autoBackup}
                          onCheckedChange={(checked) =>
                            setOptions({
                              ...options,
                              autoBackup: checked,
                            })
                          }
                        />
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>
                {/* 快捷键设置 */}
                <AccordionItem value="shortcuts">
                  <AccordionTrigger>快捷键设置</AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-2">
                      <h3 className="text-md font-medium">快捷键</h3>
                      {Object.keys(shortcutKeys).map((action) => (
                        <div
                          key={action}
                          className="flex items-center space-x-2"
                        >
                          <Label>{action}</Label>
                          <Input
                            value={shortcutKeys[action]}
                            onChange={(e) =>
                              handleShortcutChange(action, e.target.value)
                            }
                          />
                        </div>
                      ))}
                    </div>
                  </AccordionContent>
                </AccordionItem>
                {/* 备份设置 */}
                <AccordionItem value="backup">
                  <AccordionTrigger>备份设置</AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-2">
                      <h3 className="text-md font-medium">备份</h3>
                      <div>
                        <Label>备份位置</Label>
                        <Input
                          value={backupLocation}
                          onChange={(e) =>
                            handleBackupLocationChange(e.target.value)
                          }
                        />
                      </div>
                      <Button
                        onClick={handleReset}
                        disabled={isResetting}
                        className="mt-2"
                      >
                        {isResetting ? "重置中..." : "重置设置"}
                      </Button>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </DialogDescription>
          </DialogContent>
        </motion.div>
      </DialogOverlay>
    </Dialog>
  );
};
