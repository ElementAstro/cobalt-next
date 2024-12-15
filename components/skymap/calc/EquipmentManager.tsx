"use client";

import { useState, useEffect } from "react";
import { useAstronomyStore } from "@/lib/store/skymap/calc";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Filter, Download, Edit, Trash2, Plus } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Equipment {
  id: string;
  name: string;
  type: string;
  focalLength: number;
  aperture: number;
}

export function EquipmentManager() {
  const { equipment, removeEquipment } = useAstronomyStore();
  const [importText, setImportText] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Equipment | null>(null);

  const filteredEquipment = equipment.filter((eq) => {
    const matchesSearch = eq.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesType = filterType === "all" || eq.type === filterType;
    return matchesSearch && matchesType;
  });

  const handleExport = () => {
    const dataStr = JSON.stringify(equipment, null, 2);
    const blob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.download = "equipment.json";
    link.href = url;
    link.click();
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 p-4 md:p-8">
      <motion.div
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="max-w-6xl mx-auto space-y-6"
      >
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle className="text-gray-100">设备管理</CardTitle>
              <div className="flex space-x-2">
                <Button onClick={handleExport} variant="outline">
                  <Download className="w-4 h-4 mr-2" />
                  导出
                </Button>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button>
                      <Plus className="w-4 h-4 mr-2" />
                      添加设备
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="bg-gray-800 text-gray-100">
                    <DialogHeader>
                      <DialogTitle>添加新设备</DialogTitle>
                    </DialogHeader>
                    {/* 添加设备表单 */}
                  </DialogContent>
                </Dialog>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <Label>搜索设备</Label>
                  <div className="relative">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      className="pl-10 bg-gray-700"
                      placeholder="输入设备名称..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                </div>
                <div className="w-full md:w-48">
                  <Label>类型过滤</Label>
                  <Select value={filterType} onValueChange={setFilterType}>
                    <SelectTrigger className="bg-gray-700">
                      <SelectValue placeholder="选择类型" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">全部</SelectItem>
                      <SelectItem value="telescope">望远镜</SelectItem>
                      <SelectItem value="eyepiece">目镜</SelectItem>
                      <SelectItem value="camera">相机</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="border-gray-700">
                      <TableHead className="text-gray-300">名称</TableHead>
                      <TableHead className="text-gray-300">类型</TableHead>
                      <TableHead className="text-gray-300">焦距</TableHead>
                      <TableHead className="text-gray-300">口径</TableHead>
                      <TableHead className="text-gray-300">操作</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <AnimatePresence>
                      {filteredEquipment.map((eq, index) => (
                        <motion.tr
                          key={eq.id}
                          variants={itemVariants}
                          initial="hidden"
                          animate="visible"
                          exit="hidden"
                          transition={{ delay: index * 0.05 }}
                          className="border-gray-700 hover:bg-gray-700/50"
                        >
                          <TableCell className="font-medium text-gray-200">
                            {eq.name}
                          </TableCell>
                          <TableCell>{eq.type}</TableCell>
                          <TableCell>{eq.focalLength} mm</TableCell>
                          <TableCell>{eq.aperture} mm</TableCell>
                          <TableCell>
                            <div className="flex space-x-2">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setEditingId(eq.id)}
                              >
                                <Edit className="w-4 h-4" />
                              </Button>
                              <Button
                                variant="destructive"
                                size="sm"
                                onClick={() => removeEquipment(eq.id)}
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </motion.tr>
                      ))}
                    </AnimatePresence>
                  </TableBody>
                </Table>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
