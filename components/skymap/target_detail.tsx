"use client";

import { create } from "zustand";
import * as React from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  RadarChart,
} from "recharts";
import { DateTime } from "luxon";
import { motion, AnimatePresence } from "framer-motion";
import { Spinner } from "@/components/custom/Spinner";
import { IDSOObjectDetailedInfo } from "@/types/skymap/find-object";
import { useGlobalStore } from "@/lib/store/skymap/target";

interface TargetSmallCardProps {
  open_dialog: number;
  target_info: IDSOObjectDetailedInfo;
  in_updating: boolean;
  on_choice_maken: (() => void) | null;
  in_manage?: boolean;
}

const TargetDetailCard: React.FC<TargetSmallCardProps> = (props) => {
  const [add_btn_color, set_add_btn_color] = React.useState<
    | "link"
    | "secondary"
    | "default"
    | "destructive"
    | "outline"
    | "ghost"
    | null
    | undefined
  >("default");

  // chart data
  const [alt_data, set_alt_data] = React.useState<any[]>([]);
  const [polar_data, set_polar_data] = React.useState<any[]>([]);

  // store data
  const targets = useGlobalStore((state) => state.targets);
  const add_target_to_store = useGlobalStore((state) => state.addTarget);
  const set_focus_target_to_store = useGlobalStore(
    (state) => state.setFocusTarget
  );

  const handleClose = () => {
    // 根据需求实现关闭逻辑
  };

  // on mount
  React.useEffect(() => {}, []);

  React.useEffect(() => {
    if (props.open_dialog > 0) {
      // 根据需求实现打开逻辑
    }
  }, [props.open_dialog]);

  React.useEffect(() => {
    if (!props.in_updating) {
      init_fig_data();
    }
  }, [props.in_updating]);

  // functions
  const init_fig_data = () => {
    // process target info to display data
    const new_data = props.target_info.altitude.map((item) => ({
      date: DateTime.fromFormat(item[0], "yyyy-MM-dd HH:mm:ss").toJSDate(),
      value: Number(item[2].toFixed(2)),
    }));
    set_alt_data(new_data);

    const polarData = props.target_info.altitude.map((item) => ({
      angle: Number(item[1].toFixed(2)),
      radius: Number(item[2].toFixed(2)),
    }));
    set_polar_data(polarData);
  };

  const handleAddTarget = () => {
    if (add_target_to_store) {
      const targetInfo = {
        ...props.target_info,
        bmag: props.target_info.bmag ?? undefined,
        vmag: props.target_info.vmag ?? undefined,
      };
      add_target_to_store(targetInfo);
      set_add_btn_color("destructive");
      setTimeout(() => {
        set_add_btn_color("default");
      }, 500);
    }
  };

  const handleFocusTarget = () => {
    if (set_focus_target_to_store) {
      set_focus_target_to_store(props.target_info.id);
      if (props.on_choice_maken) {
        props.on_choice_maken();
      }
    }
  };

  const TranslateTargetType = (type: string) => {
    // 假设有一个翻译函数
    return type;
  };

  const on_add_target_to_list_clicked = () => {
    handleAddTarget();
  };

  const on_add_focused_target_clicked = () => {
    handleFocusTarget();
  };

  const target_icon_link = "/path/to/target/icon.png"; // 替换为实际路径
  const current_alt = 45; // 替换为实际数据
  const highest_alt = 90; // 替换为实际数据
  const available_time = 5.5; // 替换为实际数据

  // 动画变体
  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <motion.div
      className="h-full w-full p-4 bg-gray-800 dark:bg-gray-900 rounded-lg shadow-lg landscape:flex landscape:gap-4"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <AnimatePresence>
        <Tabs defaultValue="observationData" className="w-full landscape:flex landscape:gap-4">
          <motion.div variants={itemVariants} className="landscape:w-48">
            <TabsList className="flex landscape:flex-col space-x-1 landscape:space-x-0 landscape:space-y-1 bg-gray-700 dark:bg-gray-800 p-1 rounded">
              <TabsTrigger
                value="observationData"
                className="px-4 py-2 text-white"
              >
                观测数据
              </TabsTrigger>
              <TabsTrigger value="basicInfo" className="px-4 py-2 text-white">
                基础信息
              </TabsTrigger>
              <TabsTrigger value="wiki" className="px-4 py-2 text-white">
                小百科
              </TabsTrigger>
            </TabsList>
          </motion.div>
          <div className="landscape:flex-1">
            <TabsContent value="observationData" className="mt-4">
              <motion.div
                className="flex flex-col h-full space-y-4 landscape:space-y-2"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
              >
                <motion.div
                  className="flex flex-col md:flex-row h-1/2 space-y-4 md:space-y-0 md:space-x-4 landscape:h-auto"
                  variants={containerVariants}
                >
                  <motion.div
                    className="w-full md:w-1/2 h-full"
                    variants={itemVariants}
                  >
                    <Card className="h-full bg-gray-700 dark:bg-gray-800">
                      <Image
                        src={target_icon_link}
                        alt="目标图片"
                        className="object-cover h-40 w-full rounded-t-lg"
                        width={400}
                        height={160}
                      />
                      <div className="p-4">
                        <h2 className="text-lg font-semibold text-white">
                          {props.target_info.name}
                        </h2>
                      </div>
                    </Card>
                  </motion.div>
                  <motion.div
                    className="w-full md:w-1/2 h-full"
                    variants={itemVariants}
                  >
                    {props.in_updating ? (
                      <Spinner />
                    ) : (
                      <RadarChart
                        cx="50%"
                        cy="50%"
                        outerRadius="80%"
                        width={300}
                        height={300}
                        data={polar_data}
                      >
                        <PolarGrid />
                        <PolarAngleAxis dataKey="angle" stroke="#ffffff" />
                        <PolarRadiusAxis stroke="#ffffff" />
                        <Radar
                          name={props.target_info.name}
                          dataKey="radius"
                          stroke="#8884d8"
                          fill="#8884d8"
                          fillOpacity={0.6}
                        />
                      </RadarChart>
                    )}
                  </motion.div>
                </motion.div>
                <motion.div className="h-1/2" variants={itemVariants}>
                  {props.in_updating ? (
                    <Spinner />
                  ) : (
                    <LineChart width={600} height={300} data={alt_data}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#ffffff" />
                      <XAxis dataKey="date" stroke="#ffffff" />
                      <YAxis stroke="#ffffff" />
                      <Tooltip
                        contentStyle={{ backgroundColor: "#333", color: "#fff" }}
                      />
                      <Line
                        type="monotone"
                        dataKey="value"
                        stroke="#8884d8"
                        activeDot={{ r: 8 }}
                      />
                    </LineChart>
                  )}
                </motion.div>
              </motion.div>
            </TabsContent>
            <TabsContent value="basicInfo" className="mt-4">
              <motion.div
                className="flex flex-col h-full space-y-4"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
              >
                <motion.div
                  className="flex flex-col md:flex-row h-2/5 space-y-4 md:space-y-0 md:space-x-4"
                  variants={containerVariants}
                >
                  <motion.div
                    className="w-full md:w-1/2 h-full"
                    variants={itemVariants}
                  >
                    <Card className="h-full flex bg-gray-700 dark:bg-gray-800">
                      <Image
                        src={target_icon_link}
                        alt="目标图片"
                        className="object-cover h-full w-40 rounded-l-lg"
                        width={160}
                        height={160}
                      />
                      <div className="p-4 flex flex-col justify-between">
                        <h2 className="text-lg font-semibold text-white">
                          {props.target_info.name}
                        </h2>
                        <div className="space-y-2">
                          <p className="text-white">
                            Ra: {props.target_info.ra.toFixed(7)} °
                          </p>
                          <p className="text-white">
                            Dec: {props.target_info.dec.toFixed(7)} °
                          </p>
                          <p className="text-secondary">
                            目标类型:{" "}
                            {TranslateTargetType(props.target_info.target_type)}
                          </p>
                          <p className="text-secondary">
                            目标视角大小: {props.target_info.size} ′
                          </p>
                        </div>
                      </div>
                    </Card>
                  </motion.div>
                  <motion.div
                    className="w-full md:w-1/2 h-full"
                    variants={itemVariants}
                  >
                    <Card className="h-full p-4 bg-gray-700 dark:bg-gray-800">
                      <div className="grid grid-cols-2 gap-4">
                        <p className="text-white">
                          当前高度: {current_alt.toFixed(0)}°
                        </p>
                        <p className="text-white">
                          最高高度: {highest_alt.toFixed(0)}°
                        </p>
                        <p className="text-white">
                          估计可拍摄时间: {available_time.toFixed(1)}h
                        </p>
                        <p className="text-white">状态: 活跃</p>
                      </div>
                    </Card>
                  </motion.div>
                </motion.div>
                <motion.div className="h-3/5" variants={itemVariants}>
                  <Card className="h-full p-4 overflow-auto bg-gray-700 dark:bg-gray-800">
                    {/* 目标维基小百科内容 */}
                    <h3 className="text-xl font-semibold text-white mb-2">
                      {props.target_info.name} 简介
                    </h3>
                    <p className="text-white">
                      这里是关于目标的详细信息和背景介绍。您可以在这里添加更多关于目标的描述、历史和相关数据。
                    </p>
                  </Card>
                </motion.div>
              </motion.div>
            </TabsContent>
            <TabsContent value="wiki" className="mt-4">
              <motion.div
                className="w-full h-full overflow-auto bg-gray-700 dark:bg-gray-800 p-4 rounded"
                variants={itemVariants}
              >
                {/* 目标维基小百科内容 */}
                <h3 className="text-xl font-semibold text-white mb-2">
                  {props.target_info.name} 维基百科
                </h3>
                <p className="text-white">
                  这里可以显示来自维基百科或其他资料来源的关于目标的详细信息。
                </p>
              </motion.div>
            </TabsContent>
          </div>
        </Tabs>

        <motion.div
          className="flex justify-end mt-6 space-x-2"
          variants={containerVariants}
        >
          {!props.in_manage && (
            <motion.div variants={itemVariants}>
              <Button
                variant={add_btn_color}
                size="sm"
                onClick={on_add_target_to_list_clicked}
              >
                加入目标列表
              </Button>
            </motion.div>
          )}
          <motion.div variants={itemVariants}>
            <Button
              variant="default"
              size="sm"
              onClick={on_add_focused_target_clicked}
            >
              以该目标构图
            </Button>
          </motion.div>
          <motion.div variants={itemVariants}>
            <Button variant="secondary" size="sm" onClick={handleClose}>
              退出
            </Button>
          </motion.div>
        </motion.div>
      </AnimatePresence>
    </motion.div>
  );
};

export default TargetDetailCard;
