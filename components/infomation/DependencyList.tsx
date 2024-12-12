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
      <CustomPagination
        currentPage={currentPage}
        totalPages={Math.ceil(sortedDependencies.length / itemsPerPage)}
        onPageChange={setCurrentPage}
      />
    </motion.div>
  );
}
