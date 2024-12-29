"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Alert } from "@/components/ui/alert";
import {
  Search,
  Settings as Gear,
  RotateCcw,
  ZoomIn,
  ZoomOut,
  Compass,
  Grid,
  Sun,
  Moon,
  ChevronLeft,
  ChevronRight,
  MoreHorizontal,
} from "lucide-react";
import AladinLiteView from "@/components/skymap/aladin";
import * as AXIOSOF from "@/services/find-object";
import FOVSettingDialog from "@/components/skymap/fov-dialog";
import ObjectManagementDialog from "@/components/skymap/object-manager-dialog";
import ObjectSearchDialog from "@/components/skymap/object-search-dialog";
import { useGlobalStore } from "@/store/useSkymapStore";
import { IDSOFramingObjectInfo, IOFRequestFOVpoints } from "@/types/skymap";
import { motion } from "framer-motion";
import { useToast } from "@/hooks/use-toast";
import { Slider } from "@/components/ui/slider";
import { ScrollArea } from "@/components/ui/scroll-area";
import Image from "next/image";

const ImageFraming: React.FC = () => {
  // 状态定义
  const [target_ra, set_target_ra] = useState(0);
  const [target_dec, set_target_dec] = useState(0);
  const [screen_ra, set_screen_ra] = useState(0);
  const [screen_dec, set_screen_dec] = useState(0);
  const [camera_rotation, set_camera_rotation] = useState(0);
  const [fov_data, set_fov_data] = useState({
    x_pixels: 0,
    x_pixel_size: 0,
    y_pixels: 0,
    y_pixel_size: 0,
    focal_length: 0,
  });
  const [show_span, set_show_span] = useState(false);
  const [open_fov_dialog, set_open_fov_dialog] = useState(0);
  const [open_search_dialog, set_open_search_dialog] = useState(0);
  const [open_manage_dialog, set_open_manage_dialog] = useState(0);

  // 其他数据
  const [fov_points, set_fov_points] = useState<
    Array<
      [[number, number], [number, number], [number, number], [number, number]]
    >
  >([]);
  const [fov_x, set_fov_x] = useState(0.25);
  const [fov_y, set_fov_y] = useState(0.25);
  const [aladin_show_fov, set_aladin_show_fov] = useState<number>(0.5);

  // 全局状态
  const target_store = useGlobalStore((state) => state.targets);
  const set_focus_target_to_store = useGlobalStore(
    (state) => state.changeFocusTarget
  );
  const update_twilight_data = useGlobalStore((state) => state.saveAllTargets);

  const on_new_ra_dec_input = (new_ra: number, new_dec: number) => {
    set_screen_ra(new_ra);
    set_screen_dec(new_dec);
  };

  const refresh_camera_telescope_data = () => {
    const camera_info = useGlobalStore.getState().twilight_data;
    set_fov_data((prevState) => ({
      ...prevState,
      x_pixels: camera_info.evening.sun_set_time.getTime(), // 示例
      y_pixels: camera_info.morning.sun_rise_time.getTime(), // 示例
      x_pixel_size: 0, // 根据实际情况填充
      y_pixel_size: 0, // 根据实际情况填充
      focal_length: 0, // 根据实际情况填充
    }));
  };

  const on_click_reset_with_current_center = () => {
    set_target_ra(screen_ra);
    set_target_dec(screen_dec);
    calculate_fov_points();
  };

  const post_for_one_single_fov_rect = async (ra: number, dec: number) => {
    const fov_request: IOFRequestFOVpoints = {
      x_pixels: fov_data.x_pixels,
      x_pixel_size: fov_data.x_pixel_size,
      y_pixels: fov_data.y_pixels,
      y_pixel_size: fov_data.y_pixel_size,
      focal_length: fov_data.focal_length,
      camera_rotation: camera_rotation,
      target_ra: ra,
      target_dec: dec,
    };
    try {
      const fov_response = await AXIOSOF.getFovPointsOfRect(fov_request);
      if (fov_response.success) {
        set_fov_points([fov_response.data]);
      } else {
        console.log(fov_response.message);
        return null;
      }
    } catch (err) {
      return null;
    }
  };

  const calculate_fov_points = () => {
    set_fov_points([]);
    if (fov_data.focal_length === 0) return;
    if (show_span) {
      // 瓦片叠加的绘图在这里
    } else {
      post_for_one_single_fov_rect(target_ra, target_dec);
    }
  };

  const update_target_center_points = () => {
    // 更新目标坐标逻辑
  };

  const add_current_as_new_target = () => {
    const to_add_object: IDSOFramingObjectInfo = {
      name: "-",
      ra: target_ra,
      dec: target_dec,
      rotation: camera_rotation,
      flag: "",
      tag: "",
      target_type: "",
      size: 0,
      checked: false,
    };
    set_focus_target_to_store(to_add_object);
  };

  const start_goto_and_focus_target = () => {
    // 实现移动赤道仪并居中逻辑
  };

  // 生命周期钩子
  useEffect(() => {
    update_twilight_data();
    refresh_camera_telescope_data();
  }, []);

  useEffect(() => {
    const fov_x_calc =
      ((57.3 / fov_data.focal_length) *
        fov_data.x_pixels *
        fov_data.x_pixel_size) /
      1000;
    const fov_y_calc =
      ((57.3 / fov_data.focal_length) *
        fov_data.y_pixels *
        fov_data.y_pixel_size) /
      1000;
    set_fov_x(fov_x_calc);
    set_fov_y(fov_y_calc);
    set_aladin_show_fov(Math.max(2 * fov_x_calc, 4));
    calculate_fov_points();
  }, [fov_data]);

  useEffect(() => {
    calculate_fov_points();
  }, [target_ra, target_dec, camera_rotation]);

  useEffect(() => {
    // 处理需要聚焦的目标
  }, [target_store]);

  const [showGrid, setShowGrid] = useState(false);
  const [showConstellations, setShowConstellations] = useState(false);
  const [nightMode, setNightMode] = useState(true);
  const [zoomLevel, setZoomLevel] = useState(1);
  const { toast } = useToast();

  const [leftPanelCollapsed, setLeftPanelCollapsed] = useState(false);
  const [rightPanelCollapsed, setRightPanelCollapsed] = useState(false);
  const [showTopTools, setShowTopTools] = useState(true);

  const toggleNightMode = () => {
    setNightMode(!nightMode);
    document.documentElement.classList.toggle("night-mode");
  };

  const handleZoom = (direction: "in" | "out") => {
    const newZoom =
      direction === "in"
        ? Math.min(zoomLevel * 1.2, 5)
        : Math.max(zoomLevel / 1.2, 0.2);
    setZoomLevel(newZoom);
    set_aladin_show_fov(aladin_show_fov / newZoom);
  };

  const panelVariants = {
    expanded: { opacity: 1, x: 0 },
    collapsed: (isLeft: boolean) => ({
      opacity: 0,
      x: isLeft ? -100 : 100,
    }),
  };

  return (
    <div className="relative h-screen max-h-screen max-w-screen overflow-hidden">
      <div className="absolute inset-0">
        <AladinLiteView
          ra={target_ra}
          dec={target_dec}
          fov={aladin_show_fov}
          onCenterChange={on_new_ra_dec_input}
          fov_points={fov_points}
          fov_size={aladin_show_fov}
        />
      </div>

      {/* 右侧工具栏 - 使用固定宽度 */}
      <motion.div
        initial="expanded"
        animate={rightPanelCollapsed ? "collapsed" : "expanded"}
        variants={panelVariants}
        custom={false}
        className="fixed right-0 top-0 bottom-0 z-40 flex h-full"
      >
        <Card className="w-48 bg-black/50 backdrop-blur-md border-l border-white/10">
          <CardContent className="p-4 h-full">
            <ScrollArea className="h-full">
              <div className="space-y-4">
                {/* 目标信息区域 */}
                <div className="space-y-2 text-sm">
                  <div className="text-white/90 flex justify-between">
                    <span>当前目标:</span>
                    <span>
                      {target_store.find((t) => t.checked)?.name || "无"}
                    </span>
                  </div>
                  <div className="text-white/90 flex justify-between">
                    <span>Ra:</span>
                    <span>{target_ra.toFixed(5)}</span>
                  </div>
                  <div className="text-white/90 flex justify-between">
                    <span>Dec:</span>
                    <span>{target_dec.toFixed(5)}</span>
                  </div>
                </div>

                {/* 控制按钮组 */}
                <div className="space-y-4">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => set_open_fov_dialog(open_fov_dialog + 1)}
                    className="w-full"
                  >
                    视场参数
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      set_open_search_dialog(open_search_dialog + 1)
                    }
                    className="w-full"
                  >
                    搜索目标
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      set_open_manage_dialog(open_manage_dialog + 1)
                    }
                    className="w-full"
                  >
                    目标管理
                  </Button>
                </div>
                {/* 工具按钮组 */}
                <div className="grid grid-cols-2 gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full"
                    onClick={on_click_reset_with_current_center}
                  >
                    更新中心
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full"
                    onClick={update_target_center_points}
                    disabled={target_store.find((t) => t.checked) == null}
                  >
                    更新坐标
                  </Button>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full"
                    onClick={add_current_as_new_target}
                  >
                    新建目标
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    className="w-full"
                    onClick={start_goto_and_focus_target}
                  >
                    移动居中
                  </Button>
                </div>
              </div>
            </ScrollArea>
          </CardContent>
          <CardFooter className="flex justify-end p-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setRightPanelCollapsed(!rightPanelCollapsed)}
              className="text-white/80 hover:text-white"
            >
              {rightPanelCollapsed ? <ChevronLeft /> : <ChevronRight />}
            </Button>
          </CardFooter>
        </Card>
      </motion.div>

      <div className="fixed bottom-2 left-1/2 transform -translate-x-1/2 w-[80%] max-w-3xl z-40 flex flex-col-2 items-center gap-2">
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="flex-1"
        >
          <Alert
            variant="default"
            className="bg-black/50 backdrop-blur-md border border-white/10 text-white p-2"
          >
            <div className="flex justify-between items-center text-xs lg:text-sm">
              <span>中心坐标:</span>
              <span>
                Ra: {screen_ra.toFixed(5)}; Dec: {screen_dec.toFixed(5)}
              </span>
            </div>
          </Alert>
        </motion.div>

        <motion.div
          initial={{ y: -100 }}
          animate={{ y: 0, opacity: 1 }}
          className="flex-1"
        >
          <div className="flex items-center justify-center gap-2 bg-black/50 backdrop-blur-md rounded-lg p-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleZoom("in")}
              className="text-white/80 hover:text-white"
            >
              <ZoomIn className="w-4 h-4" />
            </Button>
            <Slider
              value={[zoomLevel]}
              min={0.2}
              max={5}
              step={0.1}
              className="w-24"
              onValueChange={([value]) => setZoomLevel(value)}
            />
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleZoom("out")}
              className="text-white/80 hover:text-white"
            >
              <ZoomOut className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowGrid(!showGrid)}
              className={`text-white/80 hover:text-white ${
                showGrid ? "bg-white/20" : ""
              }`}
            >
              <Grid className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowConstellations(!showConstellations)}
              className={`text-white/80 hover:text-white ${
                showConstellations ? "bg-white/20" : ""
              }`}
            >
              <Compass className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleNightMode}
              className="text-white/80 hover:text-white"
            >
              {nightMode ? (
                <Sun className="w-4 h-4" />
              ) : (
                <Moon className="w-4 h-4" />
              )}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowTopTools(false)}
              className="bg-black/30 backdrop-blur-sm text-white/80 hover:text-white"
            >
              <MoreHorizontal className="w-4 h-4" />
            </Button>
          </div>
        </motion.div>
      </div>

      <motion.div
        className="fixed left-1 top-1 w-6 h-6 bg-black/50 backdrop-blur-md rounded-full z-40"
        animate={{ rotate: 360 }}
        transition={{
          duration: 10,
          ease: "linear",
          repeat: Infinity,
        }}
      >
        <Image
          src="/atom.png"
          width={24}
          height={24}
          alt="logo"
          className="w-full h-full"
        />
      </motion.div>

      <FOVSettingDialog
        fov_data={fov_data}
        rotation={camera_rotation}
        open_dialog={open_fov_dialog % 2 === 1}
        on_fov_change={(new_fov_data) => {
          set_fov_data((prevState) => ({
            ...prevState,
            focal_length: new_fov_data.focal_length,
            x_pixels: new_fov_data.x_pixels,
            x_pixel_size: new_fov_data.x_pixel_size,
            y_pixels: new_fov_data.y_pixels,
            y_pixel_size: new_fov_data.y_pixel_size,
          }));
        }}
        on_rotation_change={(new_rotation) => {
          set_camera_rotation(new_rotation);
        }}
      />
      <ObjectSearchDialog open_dialog={open_search_dialog} />
      <ObjectManagementDialog open_dialog={open_manage_dialog} />
    </div>
  );
};

export default ImageFraming;
