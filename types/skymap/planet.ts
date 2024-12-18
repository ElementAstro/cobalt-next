export interface Planet {
  id: string;
  name: string;
  riseTime: string;
  setTime: string;
  angle: number;
  diameter: number;
  brightness: number;
  status: "即将升起" | "正在下落" | "已经落下" | "自定义";
  description: string;
  favorite: boolean;
}
