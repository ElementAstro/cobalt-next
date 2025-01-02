"use client";

import React, { useEffect, useMemo } from "react";
import { SearchBar } from "@/components/custom/search-bar";
import { ViewToggle } from "@/components/software/view-toggle";
import { SoftwareFilters } from "@/components/software/software-filters";
import { SoftwareList } from "@/components/software/software-list";
import { SoftwareDetail } from "@/components/software/software-detail";
import { motion, AnimatePresence } from "framer-motion";
import { FilterBy, SortBy, useSoftwareStore } from "@/store/useSoftwareStore";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationPrevious,
  PaginationNext,
  PaginationEllipsis,
} from "@/components/ui/pagination";

const ITEMS_PER_PAGE = 10;

export default function SoftwareManagement() {
  const {
    searchQuery,
    setSearchQuery,
    view,
    setView,
    sortBy,
    setSortBy,
    orderBy,
    setOrderBy,
    filterBy,
    setFilterBy,
    software,
    setSoftware,
    currentPage,
    setCurrentPage,
    selectedSoftware,
    setSelectedSoftware,
  } = useSoftwareStore((state) => state);

  useEffect(() => {
    const mockSoftware = [
      {
        id: "1",
        name: "2fast - two factor authenticator",
        version: "1.0.0",
        author: "Jan Philipp Weber",
        date: "2024/8/5",
        size: "89.9 MB",
        icon: "/placeholder.svg?height=48&width=48",
        isInstalled: true,
        hasUpdate: false,
        isFavorite: false,
        isUpdating: false,
        autoUpdate: false,
      },
      {
        id: "2",
        name: "7-Zip",
        version: "24.08",
        author: "Igor Pavlov",
        date: "2024/9/18",
        size: "5.56 MB",
        icon: "/placeholder.svg?height=48&width=48",
        isInstalled: true,
        hasUpdate: true,
        isFavorite: true,
        isUpdating: false,
        autoUpdate: true,
      },
      {
        id: "3",
        name: "Adobe Photoshop 2024",
        version: "25.6.0.433",
        author: "Adobe Inc.",
        date: "2024/9/16",
        size: "4.51 GB",
        icon: "/placeholder.svg?height=48&width=48",
        isInstalled: false,
        hasUpdate: false,
        isFavorite: false,
        isUpdating: false,
        autoUpdate: false,
      },
      {
        id: "4",
        name: "Apifox",
        version: "2.6.10",
        author: "Apifox Team",
        date: "2024/8/23",
        size: "647 MB",
        icon: "/placeholder.svg?height=48&width=48",
        isInstalled: true,
        hasUpdate: true,
        isFavorite: false,
        isUpdating: false,
        autoUpdate: false,
      },
      {
        id: "5",
        name: "Arch WSL",
        version: "1.0.0",
        author: "Vineel Sai",
        date: "2024/9/20",
        size: "2.13 GB",
        icon: "/placeholder.svg?height=48&width=48",
        isInstalled: true,
        hasUpdate: false,
        isFavorite: true,
        isUpdating: false,
        autoUpdate: true,
      },
    ];
    setSoftware(mockSoftware);
  }, [setSoftware]);

  const filteredSoftware = useMemo(() => {
    return software.filter((s) =>
      s.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [software, searchQuery]);

  const sortedSoftware = useMemo(() => {
    const sorted = [...filteredSoftware];
    switch (sortBy) {
      case "name-asc":
        sorted.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case "name-desc":
        sorted.sort((a, b) => b.name.localeCompare(a.name));
        break;
      case "size-asc":
        sorted.sort((a, b) => parseFloat(a.size) - parseFloat(b.size));
        break;
      case "size-desc":
        sorted.sort((a, b) => parseFloat(b.size) - parseFloat(a.size));
        break;
      case "date-asc":
        sorted.sort(
          (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
        );
        break;
      case "date-desc":
        sorted.sort(
          (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
        );
        break;
      default:
        break;
    }
    switch (filterBy) {
      case "system":
        return sorted.filter((s) => s.author === "System");
      case "local":
        return sorted.filter((s) => s.author !== "System");
      case "all":
      default:
        return sorted;
    }
  }, [filteredSoftware, sortBy, filterBy]);

  const totalPages = Math.ceil(sortedSoftware.length / ITEMS_PER_PAGE);
  const paginatedSoftware = useMemo(() => {
    return sortedSoftware.slice(
      (currentPage - 1) * ITEMS_PER_PAGE,
      currentPage * ITEMS_PER_PAGE
    );
  }, [sortedSoftware, currentPage]);

  const handlePageChange = (page: number) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  };

  const handleReset = () => {
    setSearchQuery("");
    setSortBy("name-asc");
    setFilterBy("all");
  };

  return (
    <div className="container mx-auto p-4 space-y-6 dark:bg-gray-900 dark:text-white">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex-1 max-w-md">
          <SearchBar
            initialSuggestions={[]}
            placeholder="搜索软件..."
            onSearch={setSearchQuery}
            variant="minimal"
          />
        </div>
        <ViewToggle />
      </div>

      <SoftwareFilters
        sortOptions={[
          { label: "名称(A到Z)", value: "name-asc" },
          { label: "名称(Z到A)", value: "name-desc" },
          { label: "大小(升序)", value: "size-asc" },
          { label: "大小(降序)", value: "size-desc" },
          { label: "日期(最新)", value: "date-desc" },
          { label: "日期(最早)", value: "date-asc" },
        ]}
        filterOptions={[
          { label: "所有驱动器", value: "all" },
          { label: "系统驱动器", value: "system" },
          { label: "本地驱动器", value: "local" },
        ]}
        selectedSort={sortBy}
        selectedFilter={filterBy}
        onSortChange={(value) => setSortBy(value as SortBy)}
        onFilterChange={(value: string) => setFilterBy(value as FilterBy)}
        totalCount={filteredSoftware.length}
        onSearchChange={setSearchQuery}
        onReset={handleReset}
      />

      <AnimatePresence>
        <motion.div
          key={view}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.3 }}
        >
          <SoftwareList />
        </motion.div>
      </AnimatePresence>

      <nav aria-label="分页导航" className="flex justify-center mt-4">
        <Pagination>
          <PaginationContent>
            {currentPage > 1 && (
              <PaginationItem>
                <PaginationPrevious
                  onClick={(e) => {
                    e.preventDefault();
                    handlePageChange(currentPage - 1);
                  }}
                />
              </PaginationItem>
            )}
            {Array.from({ length: totalPages }, (_, i) => (
              <PaginationItem key={i + 1}>
                <PaginationLink
                  isActive={currentPage === i + 1}
                  onClick={(e) => {
                    e.preventDefault();
                    handlePageChange(i + 1);
                  }}
                >
                  {i + 1}
                </PaginationLink>
              </PaginationItem>
            ))}
            {totalPages > 5 && <PaginationEllipsis />}
            {currentPage < totalPages && (
              <PaginationItem>
                <PaginationNext
                  onClick={(e) => {
                    e.preventDefault();
                    handlePageChange(currentPage + 1);
                  }}
                />
              </PaginationItem>
            )}
          </PaginationContent>
        </Pagination>
      </nav>

      <AnimatePresence>
        {selectedSoftware && (
          <motion.div
            key={selectedSoftware.id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.3 }}
          >
            <SoftwareDetail
              software={selectedSoftware}
              onClose={() => setSelectedSoftware(null)}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
