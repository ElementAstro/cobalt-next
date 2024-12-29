import React from "react";
import { Star, StarOff, X } from "lucide-react";
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
import { Switch } from "@/components/ui/switch";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { File, Folder } from "@/types/filesystem";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface FilePropertiesProps {
  item: File | Folder;
  isOpen: boolean;
  onClose: () => void;
}

export function FileProperties({ item, isOpen, onClose }: FilePropertiesProps) {
  const [favorite, setFavorite] = React.useState(false);
  const [readOnly, setReadOnly] = React.useState<boolean>(
    "permissions" in item
      ? item.permissions.includes("read") && !item.permissions.includes("write")
      : false
  );
  const [detailLevel, setDetailLevel] = React.useState<"basic" | "advanced">(
    "basic"
  );

  const handleFavorite = () => setFavorite((prev) => !prev);

  const isFolder = (obj: File | Folder): obj is Folder => {
    return (obj as Folder).files !== undefined;
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-gray-800 text-white w-full max-w-lg p-4 rounded-lg shadow-lg">
        <Card className="w-full">
          <CardHeader className="flex flex-col space-y-2 sm:space-y-0 sm:flex-row sm:items-center sm:justify-between gap-2">
            <div className="flex items-center space-x-3">
              <CardTitle className="text-lg font-bold">
                {isFolder(item) ? "文件夹属性" : "文件属性"}
              </CardTitle>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
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
                  </TooltipTrigger>
                  <TooltipContent>
                    {favorite ? "取消收藏" : "添加到收藏"}
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            <div className="flex items-center space-x-2">
              <DialogClose asChild>
                <Button variant="ghost" size="sm">
                  <X className="w-5 h-5" />
                </Button>
              </DialogClose>
            </div>
          </CardHeader>

          <Separator />

          <CardContent className="pb-0">
            <ScrollArea className="max-h-[60vh] w-full pr-2">
              <div className="mb-4 space-y-2">
                <Label>
                  <strong>名称:</strong> {item.name}
                </Label>
                <Label>
                  <strong>类型:</strong> {isFolder(item) ? "文件夹" : item.type}
                </Label>
                {!isFolder(item) && (
                  <Label>
                    <strong>大小:</strong>{" "}
                    {((item.size || 0) / 1024).toFixed(2)} KB
                  </Label>
                )}
                {isFolder(item) && (
                  <Label>
                    <strong>包含项数:</strong> {item.files.length} 项
                  </Label>
                )}
              </div>

              <ToggleGroup
                type="single"
                value={detailLevel}
                onValueChange={(v) => setDetailLevel(v as "basic" | "advanced")}
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
                <div className="space-y-2">
                  <Label>
                    <strong>创建时间:</strong>{" "}
                    {format(item.createdAt, "yyyy-MM-dd HH:mm:ss")}
                  </Label>
                  <Label>
                    <strong>修改时间:</strong>{" "}
                    {format(item.lastModified, "yyyy-MM-dd HH:mm:ss")}
                  </Label>
                  {isFolder(item) && (
                    <Label>
                      <strong>路径:</strong> {item.path}
                    </Label>
                  )}
                </div>
              ) : (
                <div className="space-y-2">
                  <Label>
                    <strong>所有者:</strong> {item.owner}
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
                  {!isFolder(item) && (
                    <>
                      <Label>
                        <strong>路径:</strong> {item.path}
                      </Label>
                      {item.language && (
                        <Label>
                          <strong>编程语言:</strong> {item.language}
                        </Label>
                      )}
                    </>
                  )}
                </div>
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
      </DialogContent>
    </Dialog>
  );
}
