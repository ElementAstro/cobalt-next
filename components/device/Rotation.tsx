"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { StopCircle } from "lucide-react";
import { useRotatorStore } from "@/lib/store/device/rotation";
import { DeviceSelector } from "./DeviceSelector";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

export default function RotatorInterface() {
  const {
    isMoving,
    reverse,
    mechanicalPosition,
    targetPosition,
    speed,
    setReverse,
    setTargetPosition,
    setSpeed,
    move,
    stop,
  } = useRotatorStore();

  return (
    <motion.div
      className="min-h-screen bg-gray-900 text-white p-4"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <div className="max-w-7xl mx-auto space-y-6">
        <DeviceSelector
          deviceType="Rotator"
          onDeviceChange={(device) =>
            console.log(`Selected rotator: ${device}`)
          }
        />

        <div className="grid gap-6 md:grid-cols-2">
          <Card className="bg-gray-800 border-gray-700 shadow-xl rounded-2xl">
            <CardHeader>
              <CardTitle>旋转器状态</CardTitle>
            </CardHeader>
            <CardContent>
              <motion.div
                variants={containerVariants}
                className="grid grid-cols-2 gap-4"
              >
                <motion.div variants={itemVariants} className="space-y-2">
                  <Label>机械位置</Label>
                  <div className="text-sm">
                    {mechanicalPosition.toFixed(1)}°
                  </div>
                </motion.div>
                <motion.div variants={itemVariants} className="space-y-2">
                  <Label>目标位置</Label>
                  <div className="text-sm">{targetPosition.toFixed(1)}°</div>
                </motion.div>
                <motion.div variants={itemVariants} className="space-y-2">
                  <Label>速度</Label>
                  <div className="text-sm">{speed}%</div>
                </motion.div>
                <motion.div variants={itemVariants} className="space-y-2">
                  <Label>反转状态</Label>
                  <div className="text-sm">{reverse ? "开启" : "关闭"}</div>
                </motion.div>
              </motion.div>
            </CardContent>
          </Card>

          <Card className="bg-gray-800 border-gray-700 shadow-xl rounded-2xl">
            <CardHeader>
              <CardTitle>旋转器控制</CardTitle>
            </CardHeader>
            <CardContent>
              <motion.div variants={containerVariants} className="space-y-8">
                <motion.div variants={itemVariants} className="space-y-4">
                  <Label>目标位置</Label>
                  <div className="flex space-x-4">
                    <Input
                      type="number"
                      value={targetPosition}
                      onChange={(e) =>
                        setTargetPosition(Number(e.target.value))
                      }
                      className="flex-1 bg-gray-700"
                    />
                    <Button onClick={move} disabled={isMoving}>
                      移动
                    </Button>
                  </div>
                </motion.div>

                <motion.div variants={itemVariants} className="space-y-4">
                  <Label>速度控制</Label>
                  <Slider
                    value={[speed]}
                    onValueChange={(value) => setSpeed(value[0])}
                    max={100}
                    step={1}
                  />
                </motion.div>
              </motion.div>
            </CardContent>
          </Card>
        </div>

        <Card className="bg-gray-800 border-gray-700 shadow-xl rounded-2xl">
          <CardHeader>
            <CardTitle>高级设置</CardTitle>
          </CardHeader>
          <CardContent>
            <motion.div variants={containerVariants} className="space-y-4">
              <motion.div
                variants={itemVariants}
                className="flex items-center space-x-2"
              >
                <Label>反转</Label>
                <Switch checked={reverse} onCheckedChange={setReverse} />
              </motion.div>

              <motion.div variants={itemVariants}>
                <Button
                  variant="destructive"
                  onClick={stop}
                  disabled={!isMoving}
                >
                  <StopCircle className="h-4 w-4 mr-2" />
                  停止
                </Button>
              </motion.div>
            </motion.div>
          </CardContent>
        </Card>
      </div>
    </motion.div>
  );
}
