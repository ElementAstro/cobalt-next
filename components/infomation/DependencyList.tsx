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
import { useDependencyStore, Dependency } from "@/lib/store/dependency";
import { Switch } from "@/components/ui/switch";

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
  const itemsPerPage = 5;

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
            />
          </PaginationItem>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <PaginationItem key={page}>
              <PaginationLink
                isActive={page === currentPage}
                onClick={() => onPageChange(page)}
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
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-4 p-4 rounded-lg dark:bg-gray-800/50 backdrop-blur-sm"
    >
      <div className="flex justify-between mb-4">
        <Button
          variant="outline"
          onClick={exportDependencies}
          disabled={selectedDeps.length === 0}
        >
          导出选中 ({selectedDeps.length})
        </Button>
        <Button
          variant="destructive"
          onClick={() => setSelectedDeps([])}
          disabled={selectedDeps.length === 0}
        >
          清除选择
        </Button>
      </div>
      <CustomPagination
        currentPage={currentPage}
        totalPages={Math.ceil(sortedDependencies.length / itemsPerPage)}
        onPageChange={setCurrentPage}
      />
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead onClick={() => handleSort("name")}>
              名称
              <ArrowUpDown className="ml-2 h-4 w-4 inline" />
            </TableHead>
            <TableHead onClick={() => handleSort("version")}>
              版本
              <ArrowUpDown className="ml-2 h-4 w-4 inline" />
            </TableHead>
            <TableHead onClick={() => handleSort("description")}>
              描述
              <ArrowUpDown className="ml-2 h-4 w-4 inline" />
            </TableHead>
            <TableHead onClick={() => handleSort("license")}>
              许可证
              <ArrowUpDown className="ml-2 h-4 w-4 inline" />
            </TableHead>
            <TableHead>操作</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {paginatedDependencies.map((dep) => (
            <TableRow key={dep.name}>
              <TableCell>{dep.name}</TableCell>
              <TableCell>{dep.version}</TableCell>
              <TableCell>{dep.description}</TableCell>
              <TableCell>
                <Badge>{dep.license}</Badge>
              </TableCell>
              <TableCell>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => handleDelete(dep.name)}
                >
                  <Trash className="h-4 w-4" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </motion.div>
  );
}
