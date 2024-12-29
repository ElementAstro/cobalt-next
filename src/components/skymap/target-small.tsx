"use client";

import * as React from "react";
import TargetDetailCard from "./target-detail";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  LineChart,
  Line,
  ReferenceLine,
  XAxis,
  YAxis,
  Tooltip as RechartsTooltip,
} from "recharts";
import { DateTime } from "luxon";
import { XCircle, CheckCircle, FilePlus } from "lucide-react";
import { useGlobalStore } from "@/store/useSkymapStore";
import * as AXIOSOF from "@/services/find-object";
import Image from "next/image";
import { Spinner } from "@/components/custom/spinner";
import { IDSOFramingObjectInfo, IDSOObjectDetailedInfo } from "@/types/skymap";
import { motion } from "framer-motion";

interface TargetSmallCardProps {
  target_info: IDSOObjectDetailedInfo | IDSOFramingObjectInfo;
  card_index: number;
  on_card_clicked: ((card_index: number, checked: boolean) => void) | null;
  on_choice_maken: (() => void) | null;
  in_manage?: boolean;
}

const fig_options_template: any = {
  grid: {
    top: 10,
    bottom: 20,
    right: "1%",
    left: "10%",
  },
  tooltip: {
    trigger: "axis",
  },
  xAxis: {
    type: "time",
    axisLabel: {
      formatter: "{HH}",
    },
  },
  yAxis: {
    type: "value",
    min: 0,
    max: 90,
  },
  series: [
    {
      data: [],
      type: "line",
      smooth: 0.6,
      markLine: {
        silent: true,
        data: [],
      },
      tooltip: {
        trigger: "none",
      },
    },
  ],
};

const fig_line_data_template: any[] = [
  {
    name: "日落",
    xAxis: new Date(),
    label: {
      formatter: "{b}",
      position: "insideEnd",
    },
    lineStyle: { color: "grey" },
  },
  {
    name: "天文昏影",
    xAxis: new Date(),
    label: {
      formatter: "{b}",
      position: "insideEnd",
    },
    lineStyle: { color: "black" },
  },
  {
    name: "日出",
    xAxis: new Date(),
    label: {
      formatter: "{b}",
      position: "insideEnd",
    },
    lineStyle: { color: "grey" },
  },
  {
    name: "天文晨光",
    xAxis: new Date(),
    label: {
      formatter: "{b}",
      position: "insideEnd",
    },
    lineStyle: { color: "black" },
  },
];

function isDetailed(object: any): object is IDSOObjectDetailedInfo {
  return "altitude" in object;
}

const TargetSmallCard: React.FC<TargetSmallCardProps> = (props) => {
  // UI 控制
  const [show_detail, set_show_detail] = React.useState(false);
  const [this_checked, set_this_checked] = React.useState(false);
  const [added_flag, set_added_flag] = React.useState(false);
  const [target_icon_link, set_target_icon_link] = React.useState("");
  const [add_tooltip_open, set_add_tooltip_open] = React.useState(false);

  // 显示数据
  const [echarts_options, set_echarts_options] =
    React.useState<any>(fig_options_template);
  const [real_target_info, set_real_target_info] =
    React.useState<IDSOObjectDetailedInfo>({
      id: "",
      name: "",
      ra: 0,
      dec: 0,
      target_type: "",
      size: 0,
      altitude: [],
      alias: "",
      const: "",
      transit_month: 0,
      transit_date: "",
      filter: "",
      focal_length: 0,
      Top200: null,
      rotation: 0,
      flag: "",
      tag: "",
      checked: false,
      angular_size: 0,
      magnitude: 0,
      type: "",
    });
  const [in_updating, set_in_updating] = React.useState(true);

  // 全局状态
  const targets = useGlobalStore((state) => state.targets);
  const add_target_to_store = useGlobalStore((state) => state.addTarget);
  const save_all_targets = useGlobalStore((state) => state.saveAllTargets);
  const set_focus_target_to_store = useGlobalStore(
    (state) => state.setFocusTarget
  );
  const twilight_data = useGlobalStore((state) => state.twilight_data);

  // 生命周期函数
  React.useEffect(() => {
    if (isDetailed(props.target_info)) {
      set_real_target_info(props.target_info);
    } else {
      construct_framing_info2card_info();
    }

    const iconPath =
      process.env.NODE_ENV === "development"
        ? `/api/file/DSO/${props.target_info.name}.jpg`
        : `/file/DSO/${props.target_info.name}.jpg`;
    set_target_icon_link(iconPath);
  }, [props.target_info]);

  React.useEffect(() => {
    initial_fig_data();
  }, [real_target_info]);

  React.useEffect(() => {
    if ("checked" in props.target_info) {
      set_this_checked(props.target_info.checked);
    }
  }, [props.target_info]);

  // 初始化图表数据
  const initial_fig_data = () => {
    const new_data = real_target_info.altitude.map((item) => ({
      date: DateTime.fromFormat(item[0], "yyyy-MM-dd HH:mm:ss").toJSDate(),
      value: Number(item[2].toFixed(2)),
    }));
    const new_options = { ...fig_options_template };
    new_options.series[0].data = new_data;

    const new_mark_line = fig_line_data_template.map((line, index) => {
      let time;
      switch (index) {
        case 0:
          time = twilight_data.evening.sun_set_time;
          break;
        case 1:
          time = twilight_data.evening.evening_astro_time;
          break;
        case 2:
          time = twilight_data.morning.sun_rise_time;
          break;
        case 3:
          time = twilight_data.morning.morning_astro_time;
          break;
        default:
          time = new Date();
      }
      return { ...line, xAxis: time };
    });
    new_options.series[0].markLine.data = new_mark_line;

    set_echarts_options(new_options);
    set_in_updating(false);
  };

  // 新增响应式图表配置
  const [chartDimensions, setChartDimensions] = React.useState({
    width: 500,
    height: 300,
  });

  // 监听容器尺寸变化
  React.useEffect(() => {
    const resizeObserver = new ResizeObserver((entries) => {
      const { width, height } = entries[0].contentRect;
      setChartDimensions({
        width: Math.max(300, width - 40),
        height: Math.min(300, height * 0.6),
      });
    });

    const container = document.getElementById("chart-container");
    if (container) {
      resizeObserver.observe(container);
    }

    return () => resizeObserver.disconnect();
  }, []);

  // 构建框架信息到卡片信息
  const construct_framing_info2card_info = async () => {
    try {
      const new_curve_data = await AXIOSOF.getTargetALtCurveOnly(
        props.target_info.ra,
        props.target_info.dec
      );
      if (new_curve_data.success) {
        set_real_target_info({
          ...new_curve_data.data,
          alias: "",
          const: "",
          transit_month: 0,
          transit_date: "",
          filter: "",
          focal_length: 0,
          Top200: null,
          rotation: 0,
          flag: "",
          tag: "",
          checked: false,
          angular_size: 0,
          magnitude: 0,
          type: "",
        });
        initial_fig_data();
      }
    } catch (err) {
      console.error("Error fetching target altitude curve:", err);
    }
  };

  // 添加目标到框架
  const on_add_target_to_framing_clicked = () => {
    const to_add_object: IDSOFramingObjectInfo = {
      name: props.target_info.name,
      ra: props.target_info.ra,
      dec: props.target_info.dec,
      rotation: 0,
      flag: "",
      tag: "",
      target_type: props.target_info.target_type,
      size: props.target_info.size,
      checked: false,
    };
    set_focus_target_to_store(to_add_object.name);
    props.on_choice_maken?.();
  };

  // 添加目标到列表
  const on_add_target_to_list_clicked = () => {
    if (added_flag) {
      set_add_tooltip_open(true);
      setTimeout(() => set_add_tooltip_open(false), 3000);
    } else {
      const to_add_object: IDSOFramingObjectInfo = {
        name: props.target_info.name,
        ra: props.target_info.ra,
        dec: props.target_info.dec,
        rotation: 0,
        flag: "",
        tag: "",
        target_type: props.target_info.target_type,
        size: props.target_info.size,
        checked: false,
      };
      add_target_to_store(to_add_object);
      save_all_targets();
      set_focus_target_to_store(to_add_object.name);
      set_added_flag(true);
    }
  };

  // 翻译目标类型
  const TranslateTargetType = (type: string) => {
    // 实现实际的翻译逻辑
    return type;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="mb-3 hover:shadow-lg transition-all duration-300 dark:bg-gray-800 rounded-lg"
    >
      <Card className="p-4 landscape:flex landscape:gap-4">
        <div className="landscape:w-1/3">
          <CardContent className="flex flex-col md:flex-row">
            <div className="relative w-full md:w-32 group">
              <Image
                src={target_icon_link}
                alt={props.target_info.name}
                width={130}
                height={130}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105 rounded"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded">
                <div className="absolute bottom-2 left-2 text-white text-sm">
                  <p>视角: {real_target_info.size.toFixed(1)}′</p>
                  <p>
                    类型: {TranslateTargetType(real_target_info.target_type)}
                  </p>
                </div>
              </div>
              <Button
                variant="default"
                size="sm"
                className="absolute right-0 bottom-1/2 transform translate-y-1/2 rounded-full z-10"
                onClick={() => set_show_detail(!show_detail)}
              >
                {/* 添加图标，例如 <MoreHoriz /> */}
              </Button>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="default"
                      size="sm"
                      className="absolute left-0 bottom-1/2 transform translate-y-1/2 rounded-full z-10"
                      onClick={on_add_target_to_list_clicked}
                    >
                      {added_flag ? <CheckCircle /> : <FilePlus />}
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    {add_tooltip_open && (
                      <span>
                        已添加到待拍摄列表，如需要删除目标，请到目标管理界面删除
                      </span>
                    )}
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              {props.on_card_clicked && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="absolute left-0 top-0 bg-transparent z-10"
                  onClick={() => {
                    set_this_checked(!this_checked);
                    props.on_card_clicked?.(props.card_index, !this_checked);
                  }}
                >
                  {this_checked ? <CheckCircle /> : <XCircle />}
                </Button>
              )}
            </div>
            <div
              className="flex-grow pl-0 md:pl-3 cursor-pointer mt-4 md:mt-0"
              onClick={on_add_target_to_framing_clicked}
            >
              <CardTitle className="text-lg font-semibold text-green-600 dark:text-green-400">
                {real_target_info.name}
              </CardTitle>
              <div className="text-sm dark:text-gray-300">
                Ra: {real_target_info.ra.toFixed(5)} °
              </div>
              <div className="text-sm dark:text-gray-300">
                Dec: {real_target_info.dec.toFixed(5)} °
              </div>
            </div>
          </CardContent>
        </div>
        <div id="chart-container" className="landscape:w-2/3">
          <div className="relative h-32 mt-4">
            {in_updating ? (
              <div className="absolute inset-0 flex items-center justify-center bg-gray-700 bg-opacity-50 backdrop-blur-sm rounded">
                <Spinner className="w-8 h-8" />
              </div>
            ) : (
              <LineChart
                width={chartDimensions.width}
                height={chartDimensions.height}
                data={real_target_info.altitude.map(([time, _, alt]) => ({
                  time: DateTime.fromFormat(
                    time,
                    "yyyy-MM-dd HH:mm:ss"
                  ).toJSDate(),
                  altitude: Number(alt.toFixed(2)),
                }))}
                margin={{ top: 10, right: 5, left: 10, bottom: 20 }}
                className="transition-all duration-300 hover:opacity-90"
              >
                <XAxis
                  dataKey="time"
                  tickFormatter={(time) =>
                    DateTime.fromJSDate(time).toFormat("HH")
                  }
                  stroke="#fff"
                />
                <YAxis domain={[0, 90]} stroke="#fff" />
                <RechartsTooltip />
                <Line
                  type="monotone"
                  dataKey="altitude"
                  stroke="#8884d8"
                  dot={false}
                  strokeWidth={2}
                />
                {fig_line_data_template.map((line, index) => (
                  <ReferenceLine
                    key={index}
                    x={line.xAxis.getTime()}
                    stroke={line.lineStyle.color}
                    label={line.name}
                  />
                ))}
              </LineChart>
            )}
          </div>
        </div>
        <TargetDetailCard
          open_dialog={show_detail ? 1 : 0}
          target_info={real_target_info}
          in_updating={in_updating}
          on_choice_maken={props.on_choice_maken}
          in_manage={props.in_manage}
        />
      </Card>
    </motion.div>
  );
};

export default TargetSmallCard;
