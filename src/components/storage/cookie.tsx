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
import { motion, AnimatePresence } from "framer-motion";
import { CookieData, useCookieStore } from "@/store/useStorageStore";
import {
  Clipboard,
  ClipboardCheck,
  Trash2,
  Edit,
  Download,
  Plus,
  Check,
  X,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function CookieManager({ isLandscape }: { isLandscape: boolean }) {
  const {
    cookies,
    loadCookies,
    addCookie,
    updateCookie,
    deleteCookie,
    selectAll,
    toggleSelect,
    deleteSelected,
  } = useCookieStore();

  useEffect(() => {
    loadCookies();
  }, [loadCookies]);

  const [newCookie, setNewCookie] = useState<CookieData>({
    name: "",
    value: "",
    path: "/",
    sameSite: "strict",
    secure: false,
    httpOnly: false,
  });
  const [editCookie, setEditCookie] = useState<{
    name: string;
    value: string;
  } | null>(null);
  const [selectAllChecked, setSelectAllChecked] = useState(false);
  const [copiedCookie, setCopiedCookie] = useState<string | null>(null);

  const handleAddCookie = () => {
    if (!newCookie.name || !newCookie.value) {
      toast({
        title: "添加失败",
        description: "请填写Cookie名称和值。",
        variant: "destructive",
      });
      return;
    }

    if (cookies.some((c: { name: string }) => c.name === newCookie.name)) {
      toast({
        title: "添加失败",
        description: "已存在相同名称的Cookie。",
        variant: "destructive",
      });
      return;
    }

    addCookie(newCookie);
    setNewCookie({ name: "", value: "" });
    toast({
      title: "Cookie 已添加",
      description: `Cookie "${newCookie.name}" 已成功添加。`,
    });
  };

  const handleUpdateCookie = () => {
    if (editCookie) {
      updateCookie(editCookie);
      setEditCookie(null);
      toast({
        title: "Cookie 已更新",
        description: `Cookie "${editCookie.name}" 已成功更新。`,
      });
    }
  };

  const handleDeleteSelected = () => {
    deleteSelected();
    toast({
      title: "选中 Cookie 已删除",
    });
  };

  const handleExport = () => {
    const selectedCookies = cookies.filter(
      (cookie: { selected?: boolean }) => cookie.selected === true
    );
    if (selectedCookies.length === 0) {
      toast({
        title: "导出失败",
        description: "请先选择要导出的Cookie。",
        variant: "destructive",
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

  const handleCopyValue = (value: string) => {
    navigator.clipboard.writeText(value);
    setCopiedCookie(value);
    setTimeout(() => setCopiedCookie(null), 2000);
    toast({
      title: "已复制",
      description: "Cookie值已复制到剪贴板。",
    });
  };

  const handleSelectAll = (checked: boolean) => {
    setSelectAllChecked(checked);
    selectAll(checked);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className={`space-y-4 ${isLandscape ? "landscape-layout" : ""}`}
    >
      <motion.h2 className="text-2xl font-bold dark:text-white flex items-center gap-2">
        <Clipboard className="w-6 h-6" />
        Cookie 管理器
      </motion.h2>

      {/* Add Cookie Form */}
      <motion.div
        className={`flex flex-col md:flex-row gap-2`}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1 }}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 w-full">
          <Input
            placeholder="Cookie 名称"
            value={newCookie.name}
            onChange={(e) =>
              setNewCookie({ ...newCookie, name: e.target.value })
            }
            aria-label="Cookie 名称"
          />
          <Input
            placeholder="Cookie 值"
            value={newCookie.value}
            onChange={(e) =>
              setNewCookie({ ...newCookie, value: e.target.value })
            }
            aria-label="Cookie 值"
          />
          <Input
            placeholder="路径"
            value={newCookie.path || ""}
            onChange={(e) =>
              setNewCookie({ ...newCookie, path: e.target.value })
            }
            aria-label="路径"
          />
          <Select
            value={newCookie.sameSite || "strict"}
            onValueChange={(value) =>
              setNewCookie({
                ...newCookie,
                sameSite: value as "strict" | "lax" | "none",
              })
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="SameSite" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="strict">Strict</SelectItem>
              <SelectItem value="lax">Lax</SelectItem>
              <SelectItem value="none">None</SelectItem>
            </SelectContent>
          </Select>
          <div className="flex items-center gap-2">
            <Checkbox
              id="secure"
              checked={newCookie.secure || false}
              onCheckedChange={(checked) =>
                setNewCookie({ ...newCookie, secure: !!checked })
              }
            />
            <Label htmlFor="secure">Secure</Label>
          </div>
          <div className="flex items-center gap-2">
            <Checkbox
              id="httpOnly"
              checked={newCookie.httpOnly || false}
              onCheckedChange={(checked) =>
                setNewCookie({ ...newCookie, httpOnly: !!checked })
              }
            />
            <Label htmlFor="httpOnly">HttpOnly</Label>
          </div>
        </div>
        <Button onClick={handleAddCookie} className="gap-2">
          <Plus className="w-4 h-4" />
          添加 Cookie
        </Button>
      </motion.div>

      {/* Bulk Actions */}
      <motion.div
        className={`flex flex-col md:flex-row justify-between items-center gap-4`}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        <div className="flex items-center gap-2">
          <Checkbox
            id="select-all"
            checked={selectAllChecked}
            onCheckedChange={(checked) => handleSelectAll(checked as boolean)}
          />
          <label htmlFor="select-all" className="dark:text-gray-300">
            全选
          </label>
        </div>

        <div className="flex flex-col md:flex-row gap-2 w-full md:w-auto">
          <Button
            onClick={handleDeleteSelected}
            variant="destructive"
            disabled={!cookies.some((c) => c.selected === true)}
            className="gap-2 flex-1"
          >
            <Trash2 className="w-4 h-4" />
            删除选中
          </Button>
          <Button
            onClick={handleExport}
            disabled={!cookies.some((c) => c.selected === true)}
            className="gap-2 flex-1"
          >
            <Download className="w-4 h-4" />
            导出选中
          </Button>
        </div>
      </motion.div>

      {/* Cookie Table */}
      <motion.div
        className="overflow-x-auto"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[50px]">选择</TableHead>
              <TableHead>名称</TableHead>
              <TableHead>值</TableHead>
              <TableHead>路径</TableHead>
              <TableHead>SameSite</TableHead>
              <TableHead>Secure</TableHead>
              <TableHead>HttpOnly</TableHead>
              <TableHead className="w-[200px]">操作</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <AnimatePresence>
              {cookies.map((cookie: CookieData) => (
                <motion.tr
                  key={cookie.name}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                >
                  <TableCell>
                    <Checkbox
                      checked={cookie.selected ?? false} // Provide a default value if `selected` is undefined
                      onCheckedChange={(checked) =>
                        toggleSelect(cookie.name, checked as boolean)
                      }
                    />
                  </TableCell>
                  <TableCell className="dark:text-gray-200">
                    {cookie.name}
                  </TableCell>
                  <TableCell className="dark:text-gray-200">
                    <div className="flex items-center gap-2">
                      <span className="truncate max-w-[200px]">
                        {cookie.value}
                      </span>
                      <button
                        onClick={() => handleCopyValue(cookie.value)}
                        className="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700"
                        aria-label="复制Cookie值"
                      >
                        {copiedCookie === cookie.value ? (
                          <ClipboardCheck className="w-4 h-4 text-green-500" />
                        ) : (
                          <Clipboard className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                  </TableCell>
                  <TableCell className="dark:text-gray-200">
                    {cookie.path || "/"}
                  </TableCell>
                  <TableCell className="dark:text-gray-200 capitalize">
                    {cookie.sameSite || "strict"}
                  </TableCell>
                  <TableCell className="dark:text-gray-200">
                    {cookie.secure ? (
                      <Check className="w-4 h-4 text-green-500" />
                    ) : (
                      <X className="w-4 h-4 text-red-500" />
                    )}
                  </TableCell>
                  <TableCell className="dark:text-gray-200">
                    {cookie.httpOnly ? (
                      <Check className="w-4 h-4 text-green-500" />
                    ) : (
                      <X className="w-4 h-4 text-red-500" />
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() =>
                              setEditCookie({
                                name: cookie.name,
                                value: cookie.value,
                              })
                            }
                            className="gap-2"
                          >
                            <Edit className="w-4 h-4" />
                            编辑
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>编辑 Cookie</DialogTitle>
                          </DialogHeader>
                          <div className="grid gap-4 py-4">
                            <div className="grid grid-cols-4 items-center gap-4">
                              <Label htmlFor="name" className="text-right">
                                名称
                              </Label>
                              <Input
                                id="name"
                                value={editCookie?.name || ""}
                                className="col-span-3"
                                onChange={(e) =>
                                  setEditCookie({
                                    ...editCookie!,
                                    name: e.target.value,
                                  })
                                }
                              />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                              <Label htmlFor="value" className="text-right">
                                值
                              </Label>
                              <Input
                                id="value"
                                value={editCookie?.value || ""}
                                className="col-span-3"
                                onChange={(e) =>
                                  setEditCookie({
                                    ...editCookie!,
                                    value: e.target.value,
                                  })
                                }
                              />
                            </div>
                          </div>
                          <Button
                            onClick={handleUpdateCookie}
                            className="w-full"
                          >
                            更新 Cookie
                          </Button>
                        </DialogContent>
                      </Dialog>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => deleteCookie(cookie.name)}
                        className="gap-2"
                      >
                        <Trash2 className="w-4 h-4" />
                        删除
                      </Button>
                    </div>
                  </TableCell>
                </motion.tr>
              ))}
            </AnimatePresence>
          </TableBody>
        </Table>
      </motion.div>
    </motion.div>
  );
}
