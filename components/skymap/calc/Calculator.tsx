"use client";

import { useState, useEffect } from "react";
import { useAstronomyStore } from "@/lib/store/skymap/calc";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { motion, AnimatePresence } from "framer-motion";
import { Moon, Sun, Eye, History, Calculator as CalcIcon } from "lucide-react";

export function Calculator() {
  const { isMetric } = useAstronomyStore();
  const [activeTab, setActiveTab] = useState("focal");
  const [aperture, setAperture] = useState("");
  const [focalRatio, setFocalRatio] = useState("");
  const [focalLength, setFocalLength] = useState("");
  const [eyepiece, setEyepiece] = useState("");
  const [magnification, setMagnification] = useState("");
  const [history, setHistory] = useState<
    Array<{ type: string; result: string }>
  >([]);

  // 现有的计算函数保持不变
  // ...

  const calculateMagnification = () => {
    const f = parseFloat(focalLength);
    const e = parseFloat(eyepiece);
    if (!isNaN(f) && !isNaN(e) && e !== 0) {
      const mag = (f / e).toFixed(1);
      setMagnification(mag);
      addToHistory("magnification", `${mag}x`);
    }
  };

  const addToHistory = (type: string, result: string) => {
    setHistory((prev) => [{ type, result }, ...prev].slice(0, 10));
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  function convertToImperial(eyepiece: string): string {
    const mm = parseFloat(eyepiece);
    if (isNaN(mm)) return eyepiece;
    const inches = (mm / 25.4).toFixed(2);
    return inches;
  }

  function calculateFocalLength() {
    const a = parseFloat(aperture);
    const fr = parseFloat(focalRatio);
    if (!isNaN(a) && !isNaN(fr)) {
      const fl = (a * fr).toFixed(0);
      setFocalLength(fl);
      addToHistory("focal length", `${fl}mm`);
    }
  }  

  // 新增实时计算功能
  useEffect(() => {
    if (activeTab === "focal") {
      calculateFocalLength();
    } else if (activeTab === "magnification") {
      calculateMagnification();
    }
  }, [aperture, focalRatio, focalLength, eyepiece]);

  // 新增动画配置
  const springConfig = {
    type: "spring",
    stiffness: 300,
    damping: 30
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-gray-100 p-4 md:p-8">
      <motion.div
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="max-w-6xl mx-auto space-y-8"
      >
        <Tabs
          defaultValue="focal"
          className="w-full"
          onValueChange={(value) => {
            setActiveTab(value);
            // 切换时重置表单
            if (value === "focal") {
              setAperture("");
              setFocalRatio("");
              setFocalLength("");
            }
          }}
        >
          <TabsList className="grid w-full grid-cols-3 bg-gray-800">
            <TabsTrigger
              value="focal"
              className="data-[state=active]:bg-gray-700"
            >
              <CalcIcon className="mr-2 h-4 w-4" />
              Focal Calculator
            </TabsTrigger>
            <TabsTrigger
              value="magnification"
              className="data-[state=active]:bg-gray-700"
            >
              <Eye className="mr-2 h-4 w-4" />
              Magnification
            </TabsTrigger>
            <TabsTrigger
              value="history"
              className="data-[state=active]:bg-gray-700"
            >
              <History className="mr-2 h-4 w-4" />
              History
            </TabsTrigger>
          </TabsList>

          <AnimatePresence mode="wait">
            <TabsContent value="focal" className="mt-6">
              <motion.div
                initial="hidden"
                animate="visible"
                exit="hidden"
                variants={containerVariants}
                className="grid gap-6 md:grid-cols-2"
              >
                {/* 现有的 Focal Length Calculator 卡片 */}
                <motion.div variants={itemVariants} className="md:col-span-2">
                  <Card className="bg-gray-800 border-gray-700">
                    <CardHeader>
                      <CardTitle className="text-gray-100">
                        Focal Length Calculator
                      </CardTitle>
                    </CardHeader>
                    <CardContent>{/* 现有的计算器内容 */}</CardContent>
                  </Card>
                </motion.div>

                {/* 新增放大倍率计算卡片 */}
                <motion.div variants={itemVariants}>
                  <Card className="bg-gray-800 border-gray-700">
                    <CardHeader>
                      <CardTitle className="text-gray-100">
                        Magnification Calculator
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label>Eyepiece Focal Length:</Label>
                            <div className="flex items-center space-x-2">
                              <Input
                                value={
                                  isMetric
                                    ? eyepiece
                                    : convertToImperial(eyepiece)
                                }
                                onChange={(e) => setEyepiece(e.target.value)}
                                className="bg-gray-700"
                              />
                              <span>{isMetric ? "mm" : "in"}</span>
                            </div>
                          </div>
                          <div className="space-y-2">
                            <Label>Magnification:</Label>
                            <div className="flex items-center space-x-2">
                              <Input
                                value={magnification}
                                readOnly
                                className="bg-gray-700"
                              />
                              <span>×</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              </motion.div>
            </TabsContent>

            <TabsContent value="history">
              <motion.div
                initial="hidden"
                animate="visible"
                exit="hidden"
                variants={containerVariants}
                className="space-y-4"
              >
                <Card className="bg-gray-800 border-gray-700">
                  <CardHeader>
                    <CardTitle className="text-gray-100">
                      Calculation History
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {history.map((item, index) => (
                        <motion.div
                          key={index}
                          variants={itemVariants}
                          initial="hidden"
                          animate="visible"
                          transition={{ delay: index * 0.1 }}
                          className="flex justify-between p-2 bg-gray-700 rounded"
                        >
                          <span>{item.type}</span>
                          <span>{item.result}</span>
                        </motion.div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </TabsContent>
          </AnimatePresence>
        </Tabs>
      </motion.div>
    </div>
  );
}

