"use client";

import { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  ArrowUpDown,
  ExternalLink,
  Info,
  RefreshCw,
  Sun,
  Moon,
  Trash,
  Plus,
  Loader2,
  Check,
} from "lucide-react";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { motion, AnimatePresence } from "framer-motion";
import { useDependencyStore, Dependency } from "@/store/useOtherStore";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

const defaultDependencies: Dependency[] = [
  {
    name: "react",
    version: "17.0.2",
    description: "A JavaScript library for building user interfaces",
    license: "MIT",
  },
  {
    name: "next",
    version: "10.2.3",
    description: "The React Framework",
    license: "MIT",
  },
  {
    name: "typescript",
    version: "4.3.2",
    description: "TypeScript is a language for application-scale JavaScript",
    license: "Apache-2.0",
  },
];

async function fetchDependencies(): Promise<Dependency[]> {
  const response = await fetch("/api/dependencies");
  if (!response.ok) {
    throw new Error("Failed to fetch dependencies");
  }
  const data = await response.json();
  return data;
}

async function checkForUpdates(
  dependencies: Dependency[]
): Promise<Dependency[]> {
  const response = await fetch("/api/check-updates", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(dependencies),
  });
  const data = await response.json();
  return data;
}

async function deleteDependency(name: string): Promise<void> {
  await fetch(`/api/dependencies/${name}`, {
    method: "DELETE",
  });
}

async function addDependency(dep: Dependency): Promise<void> {
  const response = await fetch("/api/dependencies", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(dep),
  });
  if (!response.ok) {
    throw new Error("Failed to add dependency");
  }
}

export function DependencyList() {
  const {
    dependencies,
    isLoading,
    isChecking,
    search,
    currentPage,
    sortColumn,
    sortDirection,
    setDependencies,
    setIsLoading,
    setIsChecking,
    setSearch,
    setCurrentPage,
    setSortColumn,
    setSortDirection,
  } = useDependencyStore();

  const [darkMode, setDarkMode] = useState(false);
  const [selectedDeps, setSelectedDeps] = useState<string[]>([]);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [newDep, setNewDep] = useState<Dependency>({
    name: "",
    version: "",
    description: "",
    license: "",
  });
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const itemsPerPageOptions = [5, 10, 20];

  useEffect(() => {
    if (dependencies.length === 0) {
      fetchDependencies()
        .then((deps) => {
          setDependencies(deps);
          setIsLoading(false);
        })
        .catch(() => {
          setDependencies(defaultDependencies);
          setIsLoading(false);
        });
    } else {
      setIsLoading(false);
    }
  }, [dependencies.length, setDependencies, setIsLoading]);

  const sortedDependencies = [...dependencies]
    .sort((a, b) => {
      if (a[sortColumn] !== undefined && b[sortColumn] !== undefined) {
        if (a[sortColumn] < b[sortColumn])
          return sortDirection === "asc" ? -1 : 1;
        if (a[sortColumn] > b[sortColumn])
          return sortDirection === "asc" ? 1 : -1;
      }
      return 0;
    })
    .filter(
      (dep) =>
        dep.name.toLowerCase().includes(search.toLowerCase()) ||
        dep.description.toLowerCase().includes(search.toLowerCase())
    );

  const paginatedDependencies = sortedDependencies.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleSort = (column: keyof Dependency) => {
    if (column === sortColumn) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortColumn(column);
      setSortDirection("asc");
    }
  };

  const handleCheckUpdates = async () => {
    setIsChecking(true);
    const updatedDeps = await checkForUpdates(dependencies);
    setDependencies(updatedDeps);
    setIsChecking(false);
  };

  const handleDelete = async (name: string) => {
    await deleteDependency(name);
    setDependencies(dependencies.filter((dep) => dep.name !== name));
    setSelectedDeps(selectedDeps.filter((depName) => depName !== name));
  };

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    if (!darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  };

  const exportDependencies = () => {
    const data = dependencies.filter((d) => selectedDeps.includes(d.name));
    const json = JSON.stringify(data, null, 2);
    const blob = new Blob([json], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "dependencies.json";
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleAddDependency = async () => {
    await addDependency(newDep);
    setDependencies([...dependencies, newDep]);
    setNewDep({ name: "", version: "", description: "", license: "" });
    setIsAddDialogOpen(false);
  };

  const toggleSelectAll = () => {
    if (selectedDeps.length === paginatedDependencies.length) {
      setSelectedDeps([]);
    } else {
      setSelectedDeps(paginatedDependencies.map((dep) => dep.name));
    }
  };

  const handleSelect = (name: string) => {
    if (selectedDeps.includes(name)) {
      setSelectedDeps(selectedDeps.filter((depName) => depName !== name));
    } else {
      setSelectedDeps([...selectedDeps, name]);
    }
  };

  if (isLoading) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex flex-col items-center justify-center min-h-[400px]"
      >
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="mt-4 text-muted-foreground">加载依赖中...</p>
      </motion.div>
    );
  }

  const CustomPagination = ({
    currentPage,
    totalPages,
    onPageChange,
  }: {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
  }) => {
    return (
      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              onClick={() => onPageChange(currentPage - 1)}
              className={
                currentPage <= 1 ? "pointer-events-none opacity-50" : ""
              }
              aria-label="上一页"
            >
              <ArrowUpDown />
            </PaginationPrevious>
          </PaginationItem>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <PaginationItem key={page}>
              <PaginationLink
                isActive={page === currentPage}
                onClick={() => onPageChange(page)}
                aria-label={`第${page}页`}
              >
                {page}
              </PaginationLink>
            </PaginationItem>
          ))}
          <PaginationItem>
            <PaginationNext
              onClick={() => onPageChange(currentPage + 1)}
              className={
                currentPage >= totalPages
                  ? "pointer-events-none opacity-50"
                  : ""
              }
              aria-label="下一页"
            >
              <ArrowUpDown />
            </PaginationNext>
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-4 p-4 rounded-lg dark:bg-gray-800/50 backdrop-blur-sm"
    >
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-4">
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            onClick={exportDependencies}
            disabled={selectedDeps.length === 0}
            aria-label="导出选中依赖"
          >
            <ExternalLink className="mr-2 h-4 w-4" />
            导出选中 ({selectedDeps.length})
          </Button>
          <Button
            variant="destructive"
            onClick={() => {
              selectedDeps.forEach((depName) => handleDelete(depName));
            }}
            disabled={selectedDeps.length === 0}
            aria-label="删除选中依赖"
          >
            <Trash className="mr-2 h-4 w-4" />
            删除选中
          </Button>
        </div>
        <div className="flex items-center space-x-2">
          <Switch
            checked={darkMode}
            onCheckedChange={toggleDarkMode}
            aria-label="切换暗黑模式"
          />
          <Label htmlFor="dark-mode-toggle">暗黑模式</Label>
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="default" className="flex items-center">
                <Plus className="mr-2 h-4 w-4" />
                新增依赖
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>新增依赖</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="dep-name">名称</Label>
                  <Input
                    id="dep-name"
                    value={newDep.name}
                    onChange={(e) =>
                      setNewDep({ ...newDep, name: e.target.value })
                    }
                    placeholder="如 react"
                  />
                </div>
                <div>
                  <Label htmlFor="dep-version">版本</Label>
                  <Input
                    id="dep-version"
                    value={newDep.version}
                    onChange={(e) =>
                      setNewDep({ ...newDep, version: e.target.value })
                    }
                    placeholder="如 17.0.2"
                  />
                </div>
                <div>
                  <Label htmlFor="dep-description">描述</Label>
                  <Textarea
                    id="dep-description"
                    value={newDep.description}
                    onChange={(e) =>
                      setNewDep({ ...newDep, description: e.target.value })
                    }
                    placeholder="依赖项描述"
                  />
                </div>
                <div>
                  <Label htmlFor="dep-license">许可证</Label>
                  <Input
                    id="dep-license"
                    value={newDep.license}
                    onChange={(e) =>
                      setNewDep({ ...newDep, license: e.target.value })
                    }
                    placeholder="如 MIT"
                  />
                </div>
              </div>
              <div className="flex justify-end space-x-2 mt-4">
                <Button
                  onClick={() => setIsAddDialogOpen(false)}
                  variant="outline"
                >
                  取消
                </Button>
                <Button
                  onClick={handleAddDependency}
                  disabled={!newDep.name || !newDep.version || !newDep.license}
                >
                  添加
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>
      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        <Input
          placeholder="搜索依赖..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full md:w-1/3"
          aria-label="搜索依赖"
        />
        <div className="flex items-center space-x-2">
          <Label htmlFor="items-per-page">每页显示:</Label>
          <Select
            value={itemsPerPage.toString()}
            onValueChange={(value) => setItemsPerPage(Number(value))}
            aria-label="选择每页显示数量"
          >
            <SelectTrigger>
              <SelectValue placeholder="选择数量" />
            </SelectTrigger>
            <SelectContent>
              {itemsPerPageOptions.map((option) => (
                <SelectItem key={option} value={option.toString()}>
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <Button
          variant="secondary"
          onClick={handleCheckUpdates}
          disabled={isChecking}
          aria-label="检查更新"
        >
          {isChecking ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <RefreshCw className="mr-2 h-4 w-4" />
          )}
          检查更新
        </Button>
      </div>
      <CustomPagination
        currentPage={currentPage}
        totalPages={Math.ceil(sortedDependencies.length / itemsPerPage)}
        onPageChange={setCurrentPage}
      />
      <div className="overflow-x-auto">
        <Table className="min-w-[600px] dark:bg-gray-700">
          <TableHeader>
            <TableRow>
              <TableHead className="px-4">
                <input
                  type="checkbox"
                  checked={
                    selectedDeps.length === paginatedDependencies.length &&
                    paginatedDependencies.length > 0
                  }
                  onChange={toggleSelectAll}
                  aria-label="选择所有依赖"
                />
              </TableHead>
              <TableHead
                onClick={() => handleSort("name")}
                className="hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors cursor-pointer"
              >
                <div className="flex items-center">
                  名称
                  <ArrowUpDown className="ml-2 h-4 w-4" />
                </div>
              </TableHead>
              <TableHead
                onClick={() => handleSort("version")}
                className="hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors cursor-pointer"
              >
                <div className="flex items-center">
                  版本
                  <ArrowUpDown className="ml-2 h-4 w-4" />
                </div>
              </TableHead>
              <TableHead
                onClick={() => handleSort("description")}
                className="hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors cursor-pointer"
              >
                <div className="flex items-center">
                  描述
                  <ArrowUpDown className="ml-2 h-4 w-4" />
                </div>
              </TableHead>
              <TableHead
                onClick={() => handleSort("license")}
                className="hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors cursor-pointer"
              >
                <div className="flex items-center">
                  许可证
                  <ArrowUpDown className="ml-2 h-4 w-4" />
                </div>
              </TableHead>
              <TableHead>操作</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <AnimatePresence>
              {paginatedDependencies.map((dep) => (
                <motion.tr
                  key={dep.name}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  transition={{ duration: 0.2 }}
                  className="hover:bg-gray-50 dark:hover:bg-gray-600/50 transition-colors"
                >
                  <TableCell className="px-4">
                    <input
                      type="checkbox"
                      checked={selectedDeps.includes(dep.name)}
                      onChange={() => handleSelect(dep.name)}
                      aria-label={`选择 ${dep.name}`}
                    />
                  </TableCell>
                  <TableCell className="font-medium">{dep.name}</TableCell>
                  <TableCell>{dep.version}</TableCell>
                  <TableCell
                    className="max-w-[200px] truncate"
                    title={dep.description}
                  >
                    {dep.description}
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{dep.license}</Badge>
                  </TableCell>
                  <TableCell>
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="flex items-center space-x-2"
                    >
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDelete(dep.name)}
                        aria-label={`删除 ${dep.name}`}
                      >
                        <Trash className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="secondary"
                        size="sm"
                        aria-label={`查看 ${dep.name} 信息`}
                      >
                        <Info className="h-4 w-4" />
                      </Button>
                    </motion.div>
                  </TableCell>
                </motion.tr>
              ))}
            </AnimatePresence>
          </TableBody>
        </Table>
      </div>
      <CustomPagination
        currentPage={currentPage}
        totalPages={Math.ceil(sortedDependencies.length / itemsPerPage)}
        onPageChange={setCurrentPage}
      />
    </motion.div>
  );
}
