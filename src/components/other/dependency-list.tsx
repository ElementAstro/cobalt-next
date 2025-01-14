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
  AlertCircle,
  TrendingUp,
  TrendingDown,
  Circle,
  GitCompare,
  Network,
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
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Skeleton } from "@/components/ui/skeleton";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { DependencyGraph } from "./dependency-graph";

const defaultDependencies: Dependency[] = [
  {
    name: "react",
    version: "17.0.2",
    description: "A JavaScript library for building user interfaces",
    license: "MIT",
    status: "up-to-date",
    latestVersion: "17.0.2",
  },
  {
    name: "next",
    version: "10.2.3",
    description: "The React Framework",
    license: "MIT",
    status: "update-available",
    latestVersion: "14.1.0",
  },
  {
    name: "typescript",
    version: "4.3.2",
    description: "TypeScript is a language for application-scale JavaScript",
    license: "Apache-2.0",
    status: "outdated",
    latestVersion: "5.3.3",
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
  const [showGraph, setShowGraph] = useState(false);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const itemsPerPageOptions = [5, 10, 20];

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

  const handleDelete = async (name: string) => {
    await deleteDependency(name);
    setDependencies(dependencies.filter((dep) => dep.name !== name));
    setSelectedDeps(selectedDeps.filter((depName) => depName !== name));
  };

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

  // Loading skeleton for table rows
  const TableRowSkeleton = () => (
    <TableRow>
      <TableCell>
        <Skeleton className="h-4 w-4" />
      </TableCell>
      <TableCell>
        <Skeleton className="h-4 w-[100px]" />
      </TableCell>
      <TableCell>
        <Skeleton className="h-4 w-[80px]" />
      </TableCell>
      <TableCell>
        <Skeleton className="h-4 w-[200px]" />
      </TableCell>
      <TableCell>
        <Skeleton className="h-4 w-[80px]" />
      </TableCell>
      <TableCell>
        <Skeleton className="h-4 w-[100px]" />
      </TableCell>
    </TableRow>
  );

  // Enhanced status indicator
  const StatusIndicator = ({ status }: { status?: string }) => {
    switch (status) {
      case "up-to-date":
        return <Circle className="h-3 w-3 text-green-500" />;
      case "update-available":
        return <TrendingUp className="h-3 w-3 text-yellow-500" />;
      case "outdated":
        return <AlertCircle className="h-3 w-3 text-red-500" />;
      default:
        return <Circle className="h-3 w-3 text-gray-500" />;
    }
  };

  // Enhanced version comparison
  const VersionComparison = ({
    version,
    latestVersion,
  }: {
    version: string;
    latestVersion: string;
  }) => {
    if (version === latestVersion) {
      return (
        <Tooltip>
          <TooltipTrigger>
            <Badge variant="outline" className="flex items-center gap-1">
              <Check className="h-3 w-3" />
              {version}
            </Badge>
          </TooltipTrigger>
          <TooltipContent>
            <p>You're using the latest version</p>
          </TooltipContent>
        </Tooltip>
      );
    }

    return (
      <Tooltip>
        <TooltipTrigger>
          <Badge variant="destructive" className="flex items-center gap-1">
            <GitCompare className="h-3 w-3" />
            {version} → {latestVersion}
          </Badge>
        </TooltipTrigger>
        <TooltipContent>
          <p>Update available: {latestVersion}</p>
        </TooltipContent>
      </Tooltip>
    );
  };

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
            />
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
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    );
  };

  // Type-safe access to sort column
  const getSortValue = (dep: Dependency, column: keyof Dependency) => {
    const value = dep[column];
    return typeof value === "string" ? value.toLowerCase() : "";
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-4 p-4 rounded-lg dark:bg-gray-800/50 backdrop-blur-sm"
    >
      {/* Enhanced controls section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-4">
          <div className="flex flex-col md:flex-row gap-2">
            <Button
              variant="outline"
              onClick={exportDependencies}
              disabled={selectedDeps.length === 0}
              className="flex-1"
            >
              <ExternalLink className="mr-2 h-4 w-4" />
              导出选中 ({selectedDeps.length})
            </Button>
            <Button
              variant="destructive"
              onClick={() => selectedDeps.forEach(handleDelete)}
              disabled={selectedDeps.length === 0}
              className="flex-1"
            >
              <Trash className="mr-2 h-4 w-4" />
              删除选中
            </Button>
          </div>

          <Button
            variant="ghost"
            onClick={() => setShowGraph(!showGraph)}
            className="w-full"
          >
            <Network className="mr-2 h-4 w-4" />
            {showGraph ? "隐藏依赖图" : "显示依赖图"}
          </Button>
        </div>

        {/* Right side controls */}
        <div className="space-y-4">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center space-x-2">
              <Switch
                checked={darkMode}
                onCheckedChange={toggleDarkMode}
                id="dark-mode-toggle"
              />
              <Label htmlFor="dark-mode-toggle">暗黑模式</Label>
            </div>

            <Dialog>
              <DialogTrigger asChild>
                <Button variant="default" className="flex-1">
                  <Plus className="mr-2 h-4 w-4" />
                  新增依赖
                </Button>
              </DialogTrigger>
              {/* Dialog content remains the same */}
            </Dialog>
          </div>

          <div className="flex items-center gap-2">
            <Input
              placeholder="搜索依赖..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="flex-1"
            />
            <Button
              variant="secondary"
              onClick={handleCheckUpdates}
              disabled={isChecking}
              className="flex-1"
            >
              {isChecking ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <RefreshCw className="mr-2 h-4 w-4" />
              )}
              检查更新
            </Button>
          </div>
        </div>
      </div>

      {/* Dependency Graph */}
      {showGraph && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.3 }}
          className="rounded-lg border p-4"
        >
          <DependencyGraph dependencies={dependencies} />
        </motion.div>
      )}

      {/* Loading state */}
      {isLoading ? (
        <div className="space-y-2">
          {Array.from({ length: itemsPerPage }).map((_, i) => (
            <TableRowSkeleton key={i} />
          ))}
        </div>
      ) : (
        <>
          {/* Enhanced table */}
          <div className="overflow-x-auto rounded-lg border">
            <Table className="min-w-[800px]">
              <TableHeader className="bg-gray-100 dark:bg-gray-700">
                <TableRow>
                  <TableHead className="w-[40px]">
                    <input
                      type="checkbox"
                      checked={
                        selectedDeps.length === paginatedDependencies.length &&
                        paginatedDependencies.length > 0
                      }
                      onChange={toggleSelectAll}
                      className="rounded border-gray-300 text-primary focus:ring-primary"
                    />
                  </TableHead>
                  <TableHead
                    onClick={() => handleSort("name")}
                    className="cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-600"
                  >
                    <div className="flex items-center">
                      名称
                      <ArrowUpDown className="ml-2 h-4 w-4" />
                    </div>
                  </TableHead>
                  <TableHead
                    onClick={() => handleSort("version")}
                    className="cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-600"
                  >
                    <div className="flex items-center">
                      版本
                      <ArrowUpDown className="ml-2 h-4 w-4" />
                    </div>
                  </TableHead>
                  <TableHead>状态</TableHead>
                  <TableHead
                    onClick={() => handleSort("description")}
                    className="cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-600"
                  >
                    描述
                  </TableHead>
                  <TableHead
                    onClick={() => handleSort("license")}
                    className="cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-600"
                  >
                    许可证
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
                      className="hover:bg-gray-50 dark:hover:bg-gray-600/50"
                    >
                      <TableCell>
                        <input
                          type="checkbox"
                          checked={selectedDeps.includes(dep.name)}
                          onChange={() => handleSelect(dep.name)}
                          className="rounded border-gray-300 text-primary focus:ring-primary"
                        />
                      </TableCell>
                      <TableCell className="font-medium">
                        <div className="flex items-center gap-2">
                          {dep.name}
                        </div>
                      </TableCell>
                      <TableCell>
                        <VersionComparison
                          version={dep.version}
                          latestVersion={dep.latestVersion ?? dep.version}
                        />
                      </TableCell>
                      <TableCell>
                        <Tooltip>
                          <TooltipTrigger>
                            <div className="flex items-center gap-1">
                              <StatusIndicator status={dep.status} />
                              <span className="capitalize">
                                {dep.status?.replace("-", " ") || "unknown"}
                              </span>
                            </div>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Dependency status: {dep.status}</p>
                          </TooltipContent>
                        </Tooltip>
                      </TableCell>
                      <TableCell className="max-w-[200px]">
                        <Tooltip>
                          <TooltipTrigger>
                            <span className="truncate">{dep.description}</span>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>{dep.description}</p>
                          </TooltipContent>
                        </Tooltip>
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
                          >
                            <Trash className="h-4 w-4" />
                          </Button>
                          <Button variant="secondary" size="sm">
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

          {/* Pagination */}
          <CustomPagination
            currentPage={currentPage}
            totalPages={Math.ceil(sortedDependencies.length / itemsPerPage)}
            onPageChange={setCurrentPage}
          />
        </>
      )}
    </motion.div>
  );
}
