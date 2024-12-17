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

export function CoordinateConverter() {
  const [locations, setLocations] = useState("");
  const [coordsys, setCoordsys] = useState("gps");
  const [result, setResult] = useState("");
  const [error, setError] = useState("");

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

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="flex items-center justify-center min-h-screen bg-gray-900 text-white p-4"
    >
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
    </motion.div>
  );
}
