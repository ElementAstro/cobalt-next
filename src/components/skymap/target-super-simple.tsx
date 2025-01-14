"use client";

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
import * as AXIOSOF from "@/services/find-object";
import { motion, AnimatePresence } from "framer-motion";
import {
  Star, Info, Check, Edit3, Eye, Settings, Download, ChevronRight, ChevronDown, ChevronUp, ChevronLeft, X,
  Share2, Copy, Heart, MapPin, Clock, Calendar, Compass, Layers, Target, Globe, Maximize, Minimize, RotateCw
} from "lucide-react";
import { FC, memo, useEffect, useState } from "react";

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
  enableDrag?: boolean;
  enableBatchOperation?: boolean;
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

const TargetSuperSimpleCard: FC<TargetSuperSimpleCardProps> = (props) => {
  const [targetIconLink, setTargetIconLink] = useState<string>("");
  const [displayType, setDisplayType] = useState<string>("未知");
  const [updated, setUpdated] = useState<boolean>(false);
  const [currentAlt, setCurrentAlt] = useState<number>(0);
  const [highestAlt, setHighestAlt] = useState<number>(0);
  const [availableTime, setAvailableTime] = useState<number>(0);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [editedName, setEditedName] = useState<string>(props.target_name);
  const [showDetails, setShowDetails] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isSelected, setIsSelected] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [showQuickMenu, setShowQuickMenu] = useState(false);

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

  useEffect(() => {
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

  const handleDragStart = () => setIsDragging(true);
  const handleDragEnd = () => setIsDragging(false);

  // 添加新的动画变体
  const cardVariants = {
    initial: { opacity: 0, y: 20, scale: 0.95, rotate: -1 },
    animate: {
      opacity: 1,
      y: 0,
      scale: 1,
      rotate: 0,
      transition: {
        type: "spring",
        stiffness: 120,
        damping: 12,
        delay: props.index * 0.05,
        mass: 0.5
      }
    },
    hover: {
      scale: 1.03,
      rotate: 0.5,
      boxShadow: "0px 8px 20px rgba(0,0,0,0.25)",
      transition: {
        type: "spring",
        stiffness: 250,
        damping: 12,
        mass: 0.8
      }
    },
    tap: {
      scale: 0.96,
      rotate: -0.5,
      transition: {
        type: "spring",
        stiffness: 350,
        damping: 12,
        mass: 0.5
      }
    }
  };

  // 优化快速操作菜单动画
  const quickMenuVariants = {
    hidden: { opacity: 0, x: 20, scale: 0.9 },
    visible: {
      opacity: 1,
      x: 0,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 150,
        damping: 10,
        delay: 0.1
      }
    },
    exit: {
      opacity: 0,
      x: 20,
      scale: 0.9,
      transition: {
        duration: 0.15
      }
    }
  };

  const getBestSeason = (dec: number): string => {
    if (dec >= 0) {
      if (dec > 60) return '夏季';
      if (dec > 30) return '春末/夏初';
      return '春季';
    } else {
      if (dec < -60) return '冬季';
      if (dec < -30) return '秋末/冬初';
      return '秋季';
    }
  };

  const getVisibilityScore = (alt: number): string => {
    if (alt > 60) return '极佳';
    if (alt > 30) return '良好';
    if (alt > 15) return '一般';
    return '较差';
  };

  const detailsVariants = {
    hidden: {
      height: 0,
      opacity: 0,
      y: 10,
      scale: 0.98
    },
    visible: {
      height: "auto",
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 120,
        damping: 12,
        mass: 0.5
      }
    },
    exit: {
      height: 0,
      opacity: 0,
      y: 10,
      scale: 0.98,
      transition: {
        duration: 0.18,
        ease: "easeInOut"
      }
    }
  };

  return (
    <motion.div
      drag={props.enableDrag}
      dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      variants={cardVariants}
      initial="initial"
      animate="animate"
      whileHover="hover"
      whileTap="tap"
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className={`relative ${isDragging ? "z-50" : "z-0"} ${
        isSelected ? "ring-2 ring-primary" : ""
      }`}
    >
      <Card className="relative overflow-hidden bg-gradient-to-br from-gray-900/90 to-gray-800/90 backdrop-blur-sm border-none landscape:flex landscape:h-24">
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
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-muted-foreground" />
              <CardDescription className="text-muted-foreground dark:text-gray-400">
                {displayType}
              </CardDescription>
            </div>
            {isEditing ? (
              <div className="mt-1 flex items-center gap-2">
                <input
                  type="text"
                  value={editedName}
                  onChange={(e) => setEditedName(e.target.value)}
                  className="flex-1 p-1 bg-gray-700 text-white rounded"
                />
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleSave}
                  className="h-8 w-8"
                >
                  <Check className="w-4 h-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleCancel}
                  className="h-8 w-8"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            ) : (
              <CardTitle className="dark:text-white flex items-center gap-2">
                <Target className="w-5 h-5 text-primary" />
                <span>{props.target_name}</span>
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
            <div className="flex flex-col gap-2">
              <div className="flex justify-between text-sm text-muted-foreground dark:text-gray-300">
                <div className="flex items-center gap-1">
                  <Compass className="w-4 h-4" />
                  <span>当前: {currentAlt.toFixed(0)}°</span>
                </div>
                <div className="flex items-center gap-1">
                  <Globe className="w-4 h-4" />
                  <span>最高: {highestAlt.toFixed(0)}°</span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  <span>可拍: {availableTime.toFixed(1)}h</span>
                </div>
              </div>
              <div className="flex justify-between text-xs text-muted-foreground/80 dark:text-gray-400">
                <div className="flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  <span>最佳季节: {getBestSeason(props.dec)}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Layers className="w-3 h-3" />
                  <span>可见性: {getVisibilityScore(currentAlt)}</span>
                </div>
              </div>
            </div>
          ) : (
            <Skeleton className="h-4 w-full" />
          )}
          <motion.div
            initial={false}
            animate={{
              backgroundColor: updated ? "rgb(34 197 94 / 0.2)" : "transparent",
            }}
            className="p-2 rounded-full flex items-center gap-1"
          >
            <RotateCw className="w-4 h-4" />
            <span>{updated ? "✓ 已更新" : "更新中..."}</span>
          </motion.div>
        </CardFooter>
        <AnimatePresence>
          {props.enableBatchOperation && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="absolute -right-2 top-1/2 transform -translate-y-1/2"
            >
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsSelected(!isSelected)}
                className="rounded-full bg-white/10 backdrop-blur-sm"
              >
                <Check className={isSelected ? "text-primary" : ""} />
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
        <AnimatePresence>
          {isHovered && (
            <motion.div
              variants={quickMenuVariants}
              initial="hidden"
              animate="visible"
              exit="hidden"
              className="absolute right-2 top-1/2 -translate-y-1/2 flex flex-col gap-2"
            >
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowDetails(!showDetails)}
                className="rounded-full bg-black/20 backdrop-blur-sm hover:bg-black/40"
              >
                <Info className="w-4 h-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => props.onFavorite?.(props.index)}
                className="rounded-full bg-black/20 backdrop-blur-sm hover:bg-black/40"
              >
                <Star className={props.isFavorite ? "fill-yellow-400" : ""} />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleEdit}
                className="rounded-full bg-black/20 backdrop-blur-sm hover:bg-black/40"
              >
                <Edit3 className="w-4 h-4" />
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
              className="absolute left-0 right-0 bottom-0 bg-black/60 backdrop-blur-sm"
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

export default memo(TargetSuperSimpleCard, (prevProps, nextProps) => {
  return (
    prevProps.target_name === nextProps.target_name &&
    prevProps.ra === nextProps.ra &&
    prevProps.dec === nextProps.dec
  );
});
