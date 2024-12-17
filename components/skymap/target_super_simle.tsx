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
import { motion } from "framer-motion";

interface TargetSuperSimpleCardProps {
  target_name: string;
  ra: number;
  dec: number;
  target_type: string;
  on_target_selected: (index: number) => void;
  index: number;
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

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ scale: 1.02 }}
      transition={{ 
        duration: 0.3,
        type: "spring",
        stiffness: 300,
        damping: 20
      }}
      className="w-full sm:w-72 hover:shadow-xl transition-all duration-300 dark:bg-gray-800/90 backdrop-blur-sm rounded-lg"
    >
      <Card className="flex flex-col h-full border-none bg-transparent">
        <CardHeader className="flex flex-row items-center space-y-0 gap-4 p-4">
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
        </CardHeader>
        <CardContent className="flex-1 p-4">
          <motion.div 
            className="flex space-x-2 sm:space-x-4"
            layout
          >
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
              <motion.div 
                className="flex gap-2 w-full"
                layout
              >
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
        <CardFooter className="bg-muted/50 backdrop-blur-sm p-4 rounded-b-lg">
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
        </CardFooter>
      </Card>
    </motion.div>
  );
};

export default TargetSuperSimpleCard;
