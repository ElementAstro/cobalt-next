"use client"

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Alert } from "@/components/ui/alert";
import { Search, Settings as Gear } from "lucide-react";
import AladinLiteView from "@/components/skymap/aladin";
import * as AXIOSOF from "@/services/skymap/find-object";
import FOVSettingDialog from "@/components/skymap/fov_dialog";
import ObjectManagementDialog from "./components/object_manager_dialog";
import ObjectSearchDialog from "./components/object_search_dialog";
import { useGlobalStore } from "@/lib/store/skymap/target";
import {
  IDSOFramingObjectInfo,
  IOFRequestFOVpoints,
} from "@/types/skymap/find-object";
import { motion } from "framer-motion";

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

  return (
    <div className="framing-root relative h-screen w-screen overflow-hidden">
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
      
      {/* 左侧控制面板 - 横屏优化 */}
      <motion.div 
        initial={{ x: -100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="fixed left-2 top-2 lg:top-1/2 lg:transform lg:-translate-y-1/2 w-48 lg:w-72 z-40"
      >
        <Card className="bg-black/50 backdrop-blur-md border border-white/10">
          <CardContent className="p-3 lg:p-6">
            <CardTitle className="text-sm lg:text-base text-white text-shadow-lg">
              当前目标: {target_store.find((t) => t.checked)?.name || "无"}
            </CardTitle>
            <div className="space-y-1 mt-2 text-xs lg:text-sm">
              <div className="text-white/90 text-shadow flex justify-between">
                <span>Ra:</span>
                <span>{target_ra.toFixed(5)}</span>
              </div>
              <div className="text-white/90 text-shadow flex justify-between">
                <span>Dec:</span>
                <span>{target_dec.toFixed(5)}</span>
              </div>
            </div>
          </CardContent>
          <CardFooter className="p-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => set_open_fov_dialog(open_fov_dialog + 1)}
              className="w-full text-xs lg:text-sm backdrop-blur-sm hover:bg-white/20"
            >
              修改视场参数
            </Button>
          </CardFooter>
        </Card>
      </motion.div>

      {/* 右侧工具栏 - 横屏优化 */}
      <motion.div 
        initial={{ x: 100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="fixed right-2 top-2 lg:top-1/2 lg:transform lg:-translate-y-1/2 z-40"
      >
        <div className="flex flex-col gap-1 lg:gap-2">
          <div className="grid grid-cols-2 gap-1 lg:gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => set_open_search_dialog(open_search_dialog + 1)}
              className="text-xs lg:text-sm bg-black/50 backdrop-blur-md"
            >
              <Search className="w-3 h-3 lg:w-4 lg:h-4 mr-1" /> 搜索
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => set_open_manage_dialog(open_manage_dialog + 1)}
              className="text-xs lg:text-sm"
            >
              <Gear className="w-3 h-3 lg:w-4 lg:h-4 mr-1" /> 目标
            </Button>
          </div>
          <div className="grid grid-cols-2 gap-1 lg:gap-2">
            <Button
              variant="secondary"
              size="sm"
              className="text-xs lg:text-sm"
              onClick={on_click_reset_with_current_center}
            >
              更新中心
            </Button>
            <Button
              variant="secondary"
              size="sm"
              className="text-xs lg:text-sm"
              onClick={update_target_center_points}
              disabled={target_store.find((t) => t.checked) == null}
            >
              更新坐标
            </Button>
          </div>
          <div className="grid grid-cols-2 gap-1 lg:gap-2">
            <Button
              variant="secondary"
              size="sm"
              className="text-xs lg:text-sm"
              onClick={add_current_as_new_target}
            >
              新建目标
            </Button>
            <Button
              variant="destructive"
              size="sm"
              className="text-xs lg:text-sm"
              onClick={start_goto_and_focus_target}
            >
              移动居中
            </Button>
          </div>
        </div>
      </motion.div>

      {/* 底部状态栏 - 横屏优化 */}
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="fixed bottom-2 left-1/2 transform -translate-x-1/2 w-[80%] max-w-2xl z-40"
      >
        <Alert
          variant="default"
          className="bg-black/50 backdrop-blur-md border border-white/10 text-white p-2"
        >
          <div className="flex justify-between items-center text-xs lg:text-sm">
            <span>中心坐标:</span>
            <span>Ra: {screen_ra.toFixed(5)}; Dec: {screen_dec.toFixed(5)}</span>
          </div>
        </Alert>
      </motion.div>

      <div className="fixed left-1 top-1 w-56 h-6 bg-black z-40"></div>

      <FOVSettingDialog
        fov_data={fov_data}
        rotation={camera_rotation}
        open_dialog={open_fov_dialog}
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
