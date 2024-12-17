"use client";

import * as React from "react";
import {
  Card,
  CardHeader,
  CardContent,
  CardFooter,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import * as AXIOSOF from "@/services/skymap/find-object";
import { motion, AnimatePresence } from "framer-motion";
import { Star, Info } from "lucide-react";

interface TargetSuperSimpleCardProps {
  target_name: string;
  ra: number;
  dec: number;
  target_type: string;
  on_target_selected: (index: number) => void;
  index: number;
  onDelete?: (index: number) => void;
  onFavorite?: (index: number) => void;
  isFavorite?: boolean;
  availabilityScore?: number;
}

export const TranslateTargetType = (target_type: string): string => {
  const typeMap: { [key: string]: string } = {
    Asterism: "星群",
    "Dark Neb": "暗星云",
    "Em Neb": "发射星云",
    "Gal Chain": "星系链",
    "Gal Clus": "星系团",
    "Gal Group": "星系群",
    "Gal-BCD": "致密蓝矮星系",
    "Gal-Dwarf": "矮星系",
    "Gal-Ell": "椭圆星系",
    "Gal-Lent": "透镜状星系",
    "Gal-Mag": "麦哲伦星系",
    Galaxy: "星系",
    "Glob Cl": "球状星团",
    HH: "赫比格-哈罗天体",
    "HII Neb": "电离氢发射星云",
    "Mol Cld": "分子云",
    Nova: "新星",
    "Open Cl": "疏散星团",
    PN: "行星状星云",
    PPN: "原行星云",
    Quasar: "类星体",
    "Ref Neb": "反射星云",
    SNR: "超新星遗迹",
    Star: "恒星",
    "Star Cld": "恒星云",
    "WR Neb": "沃尔夫-拉叶星云",
    YSO: "初期恒星体",
  };
  return typeMap[target_type] || "未知";
};

const TargetSuperSimpleCard: React.FC<TargetSuperSimpleCardProps> = (props) => {
  const [targetIconLink, setTargetIconLink] = React.useState<string>("");
  const [displayType, setDisplayType] = React.useState<string>("未知");
  const [updated, setUpdated] = React.useState<boolean>(false);
  const [currentAlt, setCurrentAlt] = React.useState<number>(0);
  const [highestAlt, setHighestAlt] = React.useState<number>(0);
  const [availableTime, setAvailableTime] = React.useState<number>(0);
  const [isEditing, setIsEditing] = React.useState<boolean>(false);
  const [editedName, setEditedName] = React.useState<string>(props.target_name);
  const [showDetails, setShowDetails] = React.useState(false);
  const [isHovered, setIsHovered] = React.useState(false);

  const updateSimpleData = async () => {
    try {
      const result = await AXIOSOF.getSimpleCardInfo(props.ra, props.dec);
      if (result.success) {
        setCurrentAlt(result.data.current);
        setHighestAlt(result.data.highest);
        setAvailableTime(result.data.available_shoot_time);
      }
      setUpdated(true);
    } catch (err) {
      console.error("Error updating simple data:", err);
      setUpdated(true);
    }
  };

  React.useEffect(() => {
    updateSimpleData();
    const basePath =
      process.env.NODE_ENV === "development"
        ? "/api/file/DSO/DSOObjects/Small/"
        : "/file/DSO/DSOObjects/Small/";
    setTargetIconLink(`${basePath}${props.target_name}.jpg`);
    setDisplayType(TranslateTargetType(props.target_type));
  }, [props.target_name, props.ra, props.dec, props.target_type]);

  const handleImgError = () => {
    setTargetIconLink("/file/DSO/DSOObjects/Small/default.jpg");
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = () => {
    // 这里可以添加调用API保存编辑后的名称
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditedName(props.target_name);
    setIsEditing(false);
  };

  // 添加新的动画变体
  const cardVariants = {
    hover: { scale: 1.02, boxShadow: "0px 5px 15px rgba(0,0,0,0.2)" },
    tap: { scale: 0.98 },
  };

  return (
    <motion.div
      variants={cardVariants}
      whileHover="hover"
      whileTap="tap"
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className="relative"
    >
      <Card className="flex flex-col h-full border-none bg-transparent landscape:flex-row landscape:h-24">
        <CardHeader className="flex flex-row items-center space-y-0 gap-4 p-4 landscape:w-1/3">
          <motion.div
            className="relative overflow-hidden rounded-md"
            whileHover={{ scale: 1.1 }}
          >
            <img
              src={targetIconLink}
              onError={handleImgError}
              alt={props.target_name}
              className="w-16 h-16 object-cover rounded"
            />
            {updated && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="absolute top-0 right-0 bg-green-500/80 backdrop-blur-sm text-white px-2 py-0.5 text-xs rounded"
              >
                已更新
              </motion.div>
            )}
          </motion.div>
          <div className="flex-1">
            <CardDescription className="text-muted-foreground dark:text-gray-400">
              {displayType}
            </CardDescription>
            {isEditing ? (
              <input
                type="text"
                value={editedName}
                onChange={(e) => setEditedName(e.target.value)}
                className="mt-1 p-1 bg-gray-700 text-white rounded"
              />
            ) : (
              <CardTitle className="dark:text-white">
                {props.target_name}
              </CardTitle>
            )}
          </div>
          {props.availabilityScore && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="absolute top-2 right-2 p-2 bg-green-500/20 backdrop-blur-sm rounded-full"
            >
              <span className="text-xs font-medium">
                {props.availabilityScore}分
              </span>
            </motion.div>
          )}
        </CardHeader>
        <CardContent className="flex-1 p-4 landscape:w-1/3 landscape:py-2">
          <motion.div className="flex space-x-2 sm:space-x-4" layout>
            {isEditing ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex gap-2 w-full"
              >
                <Button
                  variant="default"
                  size="sm"
                  onClick={handleSave}
                  className="flex-1"
                >
                  保存
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleCancel}
                  className="flex-1"
                >
                  取消
                </Button>
              </motion.div>
            ) : (
              <motion.div className="flex gap-2 w-full" layout>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => props.on_target_selected(props.index)}
                  className="flex-1"
                >
                  选择目标
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => {
                    // 添加删除目标的逻辑
                  }}
                  className="flex-1"
                >
                  删除目标
                </Button>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={handleEdit}
                  className="flex-1"
                >
                  编辑
                </Button>
              </motion.div>
            )}
          </motion.div>
        </CardContent>
        <CardFooter className="bg-muted/50 backdrop-blur-sm p-4 rounded-b-lg landscape:w-1/3 landscape:rounded-r-lg landscape:rounded-bl-none">
          {updated ? (
            <div className="flex flex-col sm:flex-row justify-between text-sm text-muted-foreground dark:text-gray-300">
              <span>当前: {currentAlt.toFixed(0)}°</span>
              <span className="sm:border-x sm:px-2">
                最高: {highestAlt.toFixed(0)}°
              </span>
              <span>可拍: {availableTime.toFixed(1)}h</span>
            </div>
          ) : (
            <Skeleton className="h-4 w-full" />
          )}
          <motion.div
            initial={false}
            animate={{
              backgroundColor: updated ? "rgb(34 197 94 / 0.2)" : "transparent",
            }}
            className="p-2 rounded-full"
          >
            {updated ? "✓ 已更新" : "更新中..."}
          </motion.div>
        </CardFooter>
        <AnimatePresence>
          {isHovered && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="absolute -right-2 top-1/2 transform -translate-y-1/2 flex flex-col gap-2"
            >
              <Button
                variant="ghost"
                size="icon"
                onClick={() => props.onFavorite?.(props.index)}
                className="rounded-full bg-white/10 backdrop-blur-sm"
              >
                <Star className={props.isFavorite ? "fill-yellow-400" : ""} />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setShowDetails(!showDetails)}
                className="rounded-full bg-white/10 backdrop-blur-sm"
              >
                <Info />
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
        <AnimatePresence>
          {showDetails && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden"
            >
              <div className="p-4 space-y-2 bg-gray-100 dark:bg-gray-800/50">
                <p>
                  位置：RA {props.ra.toFixed(2)}° / DEC {props.dec.toFixed(2)}°
                </p>
                <p>类型：{displayType}</p>
                <div className="flex justify-between text-sm">
                  <span>当前高度：{currentAlt.toFixed(1)}°</span>
                  <span>最佳观测时间：{availableTime.toFixed(1)}h</span>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </Card>
    </motion.div>
  );
};

// 添加新的性能优化
export default React.memo(TargetSuperSimpleCard, (prevProps, nextProps) => {
  return (
    prevProps.target_name === nextProps.target_name &&
    prevProps.ra === nextProps.ra &&
    prevProps.dec === nextProps.dec
  );
});
