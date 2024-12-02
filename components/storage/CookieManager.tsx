"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "@/hooks/use-toast";
import { motion } from "framer-motion";

interface Cookie {
  name: string;
  value: string;
  selected?: boolean;
}

interface CookieManagerProps {
  isLandscape: boolean;
}

export function CookieManager({ isLandscape }: CookieManagerProps) {
  const [cookies, setCookies] = useState<Cookie[]>([]);
  const [newCookie, setNewCookie] = useState<Cookie>({ name: "", value: "" });
  const [editCookie, setEditCookie] = useState<Cookie | null>(null);
  const [selectAll, setSelectAll] = useState(false);

  useEffect(() => {
    loadCookies();
  }, []);

  const loadCookies = () => {
    const allCookies = document.cookie.split(";").map((cookie) => {
      const [name, value] = cookie.split("=").map((c) => c.trim());
      return { name, value, selected: false };
    });
    setCookies(allCookies);
  };

  const addCookie = () => {
    if (!newCookie.name || !newCookie.value) {
      toast({
        title: "添加失败",
        description: `请填写Cookie名称和值。`,
      });
      return;
    }
    document.cookie = `${newCookie.name}=${newCookie.value}`;
    setNewCookie({ name: "", value: "" });
    loadCookies();
    toast({
      title: "Cookie 已添加",
      description: `Cookie "${newCookie.name}" 已成功添加。`,
    });
  };

  const updateCookie = () => {
    if (editCookie) {
      document.cookie = `${editCookie.name}=${editCookie.value}`;
      setEditCookie(null);
      loadCookies();
      toast({
        title: "Cookie 已更新",
        description: `Cookie "${editCookie.name}" 已成功更新。`,
      });
    }
  };

  const deleteCookie = (name: string) => {
    document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
    loadCookies();
    toast({
      title: "Cookie 已删除",
      description: `Cookie "${name}" 已成功删除。`,
    });
  };

  const handleSelectAll = (checked: boolean) => {
    setSelectAll(checked);
    setCookies(cookies.map((cookie) => ({ ...cookie, selected: checked })));
  };

  const handleSelect = (name: string, checked: boolean) => {
    setCookies(
      cookies.map((cookie) =>
        cookie.name === name ? { ...cookie, selected: checked } : cookie
      )
    );
  };

  const deleteSelected = () => {
    cookies.forEach((cookie) => {
      if (cookie.selected) {
        deleteCookie(cookie.name);
      }
    });
    setSelectAll(false);
  };

  const exportCookies = () => {
    const selectedCookies = cookies.filter((cookie) => cookie.selected);
    if (selectedCookies.length === 0) {
      toast({
        title: "导出失败",
        description: `请先选择要导出的Cookie。`,
      });
      return;
    }
    const cookieData = JSON.stringify(selectedCookies, null, 2);
    const blob = new Blob([cookieData], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "cookies.json";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast({
      title: "Cookies 已导出",
      description: `${selectedCookies.length} 个Cookie已成功导出。`,
    });
  };

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

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className={`space-y-4 ${isLandscape ? "landscape-layout" : ""}`}
    >
      <motion.h2
        variants={itemVariants}
        className="text-2xl font-bold dark:text-white"
      >
        Cookie 管理器
      </motion.h2>
      <motion.div
        variants={itemVariants}
        className={`flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-2`}
      >
        <Input
          placeholder="Cookie 名称"
          value={newCookie.name}
          onChange={(e) => setNewCookie({ ...newCookie, name: e.target.value })}
          aria-label="Cookie 名称"
          className="w-full md:w-1/3"
        />
        <Input
          placeholder="Cookie 值"
          value={newCookie.value}
          onChange={(e) =>
            setNewCookie({ ...newCookie, value: e.target.value })
          }
          aria-label="Cookie 值"
          className="w-full md:w-1/3"
        />
        <Button onClick={addCookie} className="w-full md:w-1/3">
          添加 Cookie
        </Button>
      </motion.div>
      <motion.div
        variants={itemVariants}
        className={`flex ${
          isLandscape ? "flex-col" : "justify-between"
        } items-center space-y-2 md:space-y-0`}
      >
        <div className="flex items-center space-x-2">
          <Checkbox
            id="select-all"
            checked={selectAll}
            onCheckedChange={(checked) => handleSelectAll(checked as boolean)}
          />
          <label htmlFor="select-all" className="dark:text-gray-300">
            全选
          </label>
        </div>
        <div
          className={`flex ${
            isLandscape ? "flex-col w-full" : "flex-row"
          } space-y-2 md:space-y-0 md:space-x-2`}
        >
          <Button
            onClick={deleteSelected}
            variant="destructive"
            disabled={!cookies.some((c) => c.selected)}
            className={isLandscape ? "w-full" : ""}
          >
            删除选中
          </Button>
          <Button
            onClick={exportCookies}
            disabled={!cookies.some((c) => c.selected)}
            className={isLandscape ? "w-full" : ""}
          >
            导出选中
          </Button>
        </div>
      </motion.div>
      <motion.div
        variants={itemVariants}
        className={`overflow-x-auto ${isLandscape ? "landscape-table" : ""}`}
      >
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[50px]">选择</TableHead>
              <TableHead>名称</TableHead>
              <TableHead>值</TableHead>
              <TableHead>操作</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {cookies.map((cookie) => (
              <TableRow key={cookie.name}>
                <TableCell>
                  <Checkbox
                    checked={cookie.selected}
                    onCheckedChange={(checked) =>
                      handleSelect(cookie.name, checked as boolean)
                    }
                  />
                </TableCell>
                <TableCell className="dark:text-gray-200">
                  {cookie.name}
                </TableCell>
                <TableCell className="dark:text-gray-200">
                  {cookie.value}
                </TableCell>
                <TableCell>
                  <div
                    className={`flex ${
                      isLandscape ? "flex-col" : "flex-row"
                    } space-y-2 md:space-y-0 md:space-x-2`}
                  >
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button
                          variant="outline"
                          onClick={() => setEditCookie(cookie)}
                          className={isLandscape ? "w-full" : ""}
                        >
                          编辑
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>编辑 Cookie</DialogTitle>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                          <div className="grid grid-cols-4 items-center gap-4">
                            <Label
                              htmlFor="name"
                              className="text-right dark:text-gray-300"
                            >
                              名称
                            </Label>
                            <Input
                              id="name"
                              value={editCookie?.name}
                              className="col-span-3 bg-gray-700 text-white"
                              onChange={(e) =>
                                setEditCookie({
                                  ...editCookie!,
                                  name: e.target.value,
                                })
                              }
                            />
                          </div>
                          <div className="grid grid-cols-4 items-center gap-4">
                            <Label
                              htmlFor="value"
                              className="text-right dark:text-gray-300"
                            >
                              值
                            </Label>
                            <Input
                              id="value"
                              value={editCookie?.value}
                              className="col-span-3 bg-gray-700 text-white"
                              onChange={(e) =>
                                setEditCookie({
                                  ...editCookie!,
                                  value: e.target.value,
                                })
                              }
                            />
                          </div>
                        </div>
                        <Button onClick={updateCookie} className="w-full">
                          更新 Cookie
                        </Button>
                      </DialogContent>
                    </Dialog>
                    <Button
                      variant="destructive"
                      onClick={() => deleteCookie(cookie.name)}
                      className={isLandscape ? "w-full" : ""}
                    >
                      删除
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </motion.div>
    </motion.div>
  );
}
