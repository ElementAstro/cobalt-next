"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { motion } from "framer-motion";
import { Toggle } from "@/components/ui/toggle";

export function CoordinateConverter() {
  const [locations, setLocations] = useState("");
  const [coordsys, setCoordsys] = useState("gps");
  const [result, setResult] = useState("");
  const [error, setError] = useState("");
  const [batchMode, setBatchMode] = useState(false);
  const [format, setFormat] = useState<"json" | "csv">("json");

  const coordinateSystems = {
    gps: "GPS坐标",
    mapbar: "图吧坐标",
    baidu: "百度坐标",
    wgs84: "WGS84",
    gcj02: "国测局坐标",
  };

  const handleConvert = async () => {
    setError("");
    setResult("");

    if (!locations) {
      setError("请输入坐标");
      return;
    }

    try {
      const response = await fetch(
        `/api/convert?locations=${encodeURIComponent(
          locations
        )}&coordsys=${coordsys}`
      );
      const data = await response.json();

      if (data.status === "1") {
        setResult(data.locations);
      } else {
        setError(data.info || "转换失败");
      }
    } catch (err) {
      setError("请求失败，请稍后重试");
    }
  };

  const handleBatchConvert = async () => {
    // 实现批量转换逻辑
  };

  const exportResult = () => {
    if (!result) return;

    const blob =
      format === "json"
        ? new Blob([JSON.stringify(result, null, 2)], {
            type: "application/json",
          })
        : new Blob([result], { type: "text/csv" });

    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `coordinates.${format}`;
    a.click();
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="flex items-center justify-center min-h-screen bg-gray-900 text-white p-4"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4">
        <Card className="w-full max-w-md mx-auto bg-gray-800 text-white shadow-lg rounded-lg">
          <CardHeader>
            <CardTitle className="text-xl font-bold">坐标转换</CardTitle>
            <CardDescription className="text-sm">
              将非高德坐标转换为高德坐标
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="space-y-2"
              >
                <label htmlFor="locations" className="text-sm font-medium">
                  坐标点
                </label>
                <Input
                  id="locations"
                  placeholder="经度,纬度|经度,纬度..."
                  value={locations}
                  onChange={(e) => setLocations(e.target.value)}
                  className="bg-gray-700 text-white"
                />
              </motion.div>
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
                className="space-y-2"
              >
                <label htmlFor="coordsys" className="text-sm font-medium">
                  原坐标系
                </label>
                <Select value={coordsys} onValueChange={setCoordsys}>
                  <SelectTrigger className="bg-gray-700 text-white">
                    <SelectValue placeholder="选择坐标系" />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-700 text-white">
                    <SelectItem value="gps">GPS</SelectItem>
                    <SelectItem value="mapbar">Mapbar</SelectItem>
                    <SelectItem value="baidu">Baidu</SelectItem>
                    <SelectItem value="wgs84">WGS84</SelectItem>
                    <SelectItem value="gcj02">国测局坐标</SelectItem>
                  </SelectContent>
                </Select>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6 }}
              >
                <Button
                  onClick={handleConvert}
                  className="w-full bg-blue-600 hover:bg-blue-700"
                >
                  转换
                </Button>
              </motion.div>
              <div className="flex gap-2 mt-4">
                <Toggle pressed={batchMode} onPressedChange={setBatchMode}>
                  批量模式
                </Toggle>
                <Select
                  value={format}
                  onValueChange={(value) => setFormat(value as "json" | "csv")}
                >
                  <SelectTrigger className="w-24">
                    <SelectValue placeholder="格式" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="json">JSON</SelectItem>
                    <SelectItem value="csv">CSV</SelectItem>
                  </SelectContent>
                </Select>
                <Button onClick={exportResult} disabled={!result}>
                  导出
                </Button>
              </div>
              {error && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.8 }}
                  className="text-red-500 text-sm"
                >
                  {error}
                </motion.p>
              )}
              {result && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1 }}
                  className="space-y-2"
                >
                  <h3 className="text-sm font-medium">转换结果：</h3>
                  <p className="text-sm">{result}</p>
                </motion.div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </motion.div>
  );
}
