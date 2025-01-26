"use client";

import { FC, useEffect, useState, useMemo, memo } from "react";
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
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { DateTime } from "luxon";
import { motion, AnimatePresence } from "framer-motion";
import { Spinner } from "@/components/custom/spinner";
import {
  Star,
  Info,
  BookOpen,
  Plus,
  Target,
  X,
  BarChart2,
  PieChart as PieChartIcon,
  LineChart as LineChartIcon,
  Radar as RadarIcon,
} from "lucide-react";
import { IDSOObjectDetailedInfo } from "@/types/skymap";
import { useGlobalStore } from "@/store/useSkymapStore";

interface TargetSmallCardProps {
  open_dialog: number;
  target_info: IDSOObjectDetailedInfo;
  in_updating: boolean;
  on_choice_maken: (() => void) | null;
  in_manage?: boolean;
}

const TargetDetailCard: FC<TargetSmallCardProps> = (props) => {
  const [add_btn_color, set_add_btn_color] = useState<
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
  const [alt_data, set_alt_data] = useState<any[]>([]);
  const [polar_data, set_polar_data] = useState<any[]>([]);
  const [bar_data, set_bar_data] = useState<any[]>([]);
  const [pie_data, set_pie_data] = useState<any[]>([]);

  // store data
  const targets = useGlobalStore((state) => state.targets);
  const add_target_to_store = useGlobalStore((state) => state.addTarget);
  const set_focus_target_to_store = useGlobalStore(
    (state) => state.setFocusTarget
  );

  const handleClose = () => {
    // 实现关闭逻辑，例如调用父组件的回调
  };

  // on mount
  useEffect(() => {
    if (props.open_dialog > 0) {
      // 打开逻辑
    }
  }, [props.open_dialog]);

  useEffect(() => {
    if (!props.in_updating) {
      init_fig_data();
    }
  }, [props.in_updating]);

  // functions
  const init_fig_data = () => {
    // 处理目标信息以显示数据
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

    // 示例条形图数据
    const barData = [
      { name: "观测1", uv: 4000, pv: 2400, amt: 2400 },
      { name: "观测2", uv: 3000, pv: 1398, amt: 2210 },
      { name: "观测3", uv: 2000, pv: 9800, amt: 2290 },
      { name: "观测4", uv: 2780, pv: 3908, amt: 2000 },
    ];
    set_bar_data(barData);

    // 示例饼图数据
    const pieData = [
      { name: "类别A", value: 400 },
      { name: "类别B", value: 300 },
      { name: "类别C", value: 300 },
      { name: "类别D", value: 200 },
    ];
    set_pie_data(pieData);
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
    const translations: { [key: string]: string } = {
      star: "恒星",
      planet: "行星",
      galaxy: "星系",
      // 更多类型...
    };
    return translations[type] || type;
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

  // 添加新的状态和动画变量
  const [selectedTab, setSelectedTab] = useState("observationData");
  const [chartHovered, setChartHovered] = useState(false);

  const tabVariants = {
    initial: { opacity: 0, y: 10 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -10 },
    hover: { scale: 1.05, transition: { duration: 0.2 } },
  };

  const chartVariants = {
    initial: { scale: 0.95, opacity: 0 },
    animate: { scale: 1, opacity: 1 },
    hover: { scale: 1.02, transition: { duration: 0.2 } },
  };

  // 获取实时数据更新的定时器
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (props.open_dialog > 0) {
      interval = setInterval(() => {
        if (!props.in_updating) {
          init_fig_data();
        }
      }, 30000); // 每30秒更新一次
    }
    return () => clearInterval(interval);
  }, [props.open_dialog]);

  // 添加图表交互动画
  const handleChartHover = (isHovered: boolean) => {
    setChartHovered(isHovered);
  };

  // 优化图表渲染性能
  const memoizedCharts = useMemo(() => {
    return (
      <motion.div
        variants={chartVariants}
        initial="initial"
        animate="animate"
        whileHover="hover"
        onHoverStart={() => handleChartHover(true)}
        onHoverEnd={() => handleChartHover(false)}
        className="relative"
      >
        {/* ...existing chart code... */}
      </motion.div>
    );
  }, [alt_data, polar_data, bar_data, pie_data]);

  return (
    <motion.div
      className="h-full w-full p-6 bg-gray-800/95 backdrop-blur-sm dark:bg-gray-900/95 rounded-xl shadow-2xl landscape:flex landscape:gap-6 border border-gray-700/50"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      whileHover={{ scale: 1.02 }}
      transition={{ type: "spring", stiffness: 300 }}
    >
      <AnimatePresence>
        <Tabs
          defaultValue="observationData"
          className="w-full landscape:flex landscape:gap-4"
        >
          <motion.div variants={itemVariants} className="landscape:w-48">
            <TabsList className="flex landscape:flex-col space-x-1 landscape:space-x-0 landscape:space-y-1 bg-gray-700 dark:bg-gray-800 p-1 rounded">
              <TabsTrigger
                value="observationData"
                className="px-4 py-2 text-white flex items-center gap-2"
              >
                <LineChartIcon className="w-4 h-4" />
                观测数据
              </TabsTrigger>
              <TabsTrigger
                value="basicInfo"
                className="px-4 py-2 text-white flex items-center gap-2"
              >
                <Info className="w-4 h-4" />
                基础信息
              </TabsTrigger>
              <TabsTrigger
                value="wiki"
                className="px-4 py-2 text-white flex items-center gap-2"
              >
                <BookOpen className="w-4 h-4" />
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
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                      >
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
                      </motion.div>
                    )}
                  </motion.div>
                </motion.div>
                <motion.div className="h-1/2" variants={itemVariants}>
                  {props.in_updating ? (
                    <Spinner />
                  ) : (
                    <>
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                      >
                        <LineChart width={600} height={300} data={alt_data}>
                          <CartesianGrid
                            strokeDasharray="3 3"
                            stroke="#ffffff"
                          />
                          <XAxis dataKey="date" stroke="#ffffff" />
                          <YAxis stroke="#ffffff" />
                          <Tooltip
                            contentStyle={{
                              backgroundColor: "#333",
                              color: "#fff",
                            }}
                          />
                          <Line
                            type="monotone"
                            dataKey="value"
                            stroke="#8884d8"
                            activeDot={{ r: 8 }}
                          />
                        </LineChart>
                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.4 }}
                        >
                          <BarChart width={600} height={300} data={bar_data}>
                            <CartesianGrid
                              strokeDasharray="3 3"
                              stroke="#ffffff"
                            />
                            <XAxis dataKey="name" stroke="#ffffff" />
                            <YAxis stroke="#ffffff" />
                            <Tooltip
                              contentStyle={{
                                backgroundColor: "#333",
                                color: "#fff",
                              }}
                            />
                            <Bar dataKey="uv" fill="#8884d8" />
                            <Bar dataKey="pv" fill="#82ca9d" />
                          </BarChart>
                        </motion.div>
                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.5 }}
                        >
                          <PieChart width={400} height={400}>
                            <Pie
                              data={pie_data}
                              cx="50%"
                              cy="50%"
                              labelLine={false}
                              label={({ name, percent }) =>
                                `${name} ${(percent * 100).toFixed(0)}%`
                              }
                              outerRadius={100}
                              fill="#8884d8"
                              dataKey="value"
                            >
                              {pie_data.map((entry, index) => (
                                <Cell
                                  key={`cell-${index}`}
                                  fill={
                                    [
                                      "#0088FE",
                                      "#00C49F",
                                      "#FFBB28",
                                      "#FF8042",
                                    ][index % 4]
                                  }
                                />
                              ))}
                            </Pie>
                            <Tooltip />
                          </PieChart>
                        </motion.div>
                      </motion.div>
                    </>
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
                className="gap-2"
              >
                <Plus className="w-4 h-4" />
                加入目标列表
              </Button>
            </motion.div>
          )}
          <motion.div variants={itemVariants}>
            <Button
              variant="default"
              size="sm"
              onClick={on_add_focused_target_clicked}
              className="gap-2"
            >
              <Target className="w-4 h-4" />
              以该目标构图
            </Button>
          </motion.div>
          <motion.div variants={itemVariants}>
            <Button
              variant="secondary"
              size="sm"
              onClick={handleClose}
              className="gap-2"
            >
              <X className="w-4 h-4" />
              退出
            </Button>
          </motion.div>
        </motion.div>

        {/* 添加新的交互动画 */}
        <AnimatePresence mode="wait">
          {chartHovered && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="absolute bottom-4 right-4 bg-black/80 text-white p-2 rounded"
            >
              <p className="text-sm">点击可查看详细数据</p>
            </motion.div>
          )}
        </AnimatePresence>
      </AnimatePresence>
    </motion.div>
  );
};

export default memo(TargetDetailCard);
