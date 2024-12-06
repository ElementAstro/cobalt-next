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
} from "lucide-react";
import { Pagination } from "@/components/ui/pagination";
import { motion, AnimatePresence } from "framer-motion";
import { useDependencyStore, Dependency } from "@/lib/store/dependency";
import { Switch } from "@/components/ui/switch";

async function fetchDependencies(): Promise<Dependency[]> {
  const response = await fetch("/api/dependencies");
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
  const itemsPerPage = 5;

  useEffect(() => {
    if (dependencies.length === 0) {
      fetchDependencies().then((deps) => {
        setDependencies(deps);
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
  };

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    if (!darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  };

  if (isLoading) {
    return <div className="text-center mt-10">加载依赖中...</div>;
  }

  return (
    <div className={`space-y-4 ${darkMode ? "dark" : ""}`}>
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
        <div className="flex items-center">
          <Sun className="h-5 w-5 mr-2" />
          <Switch checked={darkMode} onCheckedChange={toggleDarkMode} />
          <Moon className="h-5 w-5 ml-2" />
        </div>
        <Input
          placeholder="搜索依赖..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full sm:max-w-sm"
        />
        <div className="flex space-x-2">
          <Button
            onClick={handleCheckUpdates}
            disabled={isChecking}
            className="w-full sm:w-auto"
          >
            {isChecking ? (
              <>
                <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                检查中...
              </>
            ) : (
              <>
                <RefreshCw className="mr-2 h-4 w-4" />
                检查更新
              </>
            )}
          </Button>
          <Button variant="secondary" className="w-full sm:w-auto">
            <Plus className="mr-2 h-4 w-4" />
            添加依赖
          </Button>
        </div>
      </div>
      <div className="overflow-x-auto">
        <Table className={`${darkMode ? "bg-gray-800" : "bg-white"}`}>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[200px]">
                <Button
                  variant="ghost"
                  onClick={() => handleSort("name")}
                  className="flex items-center"
                >
                  名称
                  <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
              </TableHead>
              <TableHead className="w-[150px]">
                <Button
                  variant="ghost"
                  onClick={() => handleSort("version")}
                  className="flex items-center"
                >
                  版本
                  <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
              </TableHead>
              <TableHead className="w-[100px] hidden sm:table-cell">
                <Button
                  variant="ghost"
                  onClick={() => handleSort("license")}
                  className="flex items-center"
                >
                  许可
                  <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
              </TableHead>
              <TableHead className="hidden md:table-cell">描述</TableHead>
              <TableHead className="w-[150px]">操作</TableHead>
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
                  transition={{ duration: 0.3 }}
                  className={`${
                    darkMode ? "bg-gray-700" : "bg-gray-100"
                  } hover:bg-gray-200 dark:hover:bg-gray-600`}
                >
                  <TableCell className="font-medium">
                    <a
                      href={`https://www.npmjs.com/package/${dep.name}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center hover:underline"
                    >
                      {dep.name}
                      <ExternalLink className="ml-2 h-4 w-4" />
                    </a>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        dep.latestVersion && dep.version !== dep.latestVersion
                          ? "destructive"
                          : "secondary"
                      }
                    >
                      {dep.version}
                    </Badge>
                    {dep.latestVersion && dep.version !== dep.latestVersion && (
                      <Badge variant="outline" className="ml-2">
                        最新: {dep.latestVersion}
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell className="hidden sm:table-cell">
                    {dep.license}
                  </TableCell>
                  <TableCell
                    className="hidden md:table-cell max-w-md truncate"
                    title={dep.description}
                  >
                    {dep.description}
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <Info className="h-4 w-4" />
                            <span className="sr-only">更多信息</span>
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[425px]">
                          <DialogHeader>
                            <DialogTitle>{dep.name}</DialogTitle>
                          </DialogHeader>
                          <div className="grid gap-4 py-4">
                            <div className="grid grid-cols-4 items-center gap-4">
                              <span className="font-bold">版本:</span>
                              <span className="col-span-3">{dep.version}</span>
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                              <span className="font-bold">许可:</span>
                              <span className="col-span-3">{dep.license}</span>
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                              <span className="font-bold">描述:</span>
                              <span className="col-span-3">
                                {dep.description}
                              </span>
                            </div>
                            {dep.latestVersion && (
                              <div className="grid grid-cols-4 items-center gap-4">
                                <span className="font-bold">最新版本:</span>
                                <span className="col-span-3">
                                  {dep.latestVersion}
                                </span>
                              </div>
                            )}
                          </div>
                        </DialogContent>
                      </Dialog>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(dep.name)}
                      >
                        <Trash className="h-4 w-4" />
                        <span className="sr-only">删除依赖</span>
                      </Button>
                    </div>
                  </TableCell>
                </motion.tr>
              ))}
            </AnimatePresence>
          </TableBody>
        </Table>
      </div>
      <Pagination
        currentPage={currentPage}
        totalItems={sortedDependencies.length}
        itemsPerPage={itemsPerPage}
        onPageChange={setCurrentPage}
      />
    </div>
  );
}
