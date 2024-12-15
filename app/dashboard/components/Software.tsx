"use client";

import React, { useState, useMemo } from "react";
import { SearchBar } from "@/components/custom/SearchBar";
import { ViewToggle } from "../../../components/software/view-toggle";
import { SoftwareFilters } from "../../../components/software/software-filters";
import { SoftwareList } from "../../../components/software/software-list";
import { PaginationComponent as Pagination } from "../../../components/software/pagination";
import { SoftwareDetail } from "../../../components/software/software-detail";
import { motion, AnimatePresence } from "framer-motion";
import type { Software, SortOption, FilterOption } from "@/types/software";

const sortOptions: SortOption[] = [
  { label: "名称(A到Z)", value: "name-asc" },
  { label: "名称(Z到A)", value: "name-desc" },
  { label: "大小(升序)", value: "size-asc" },
  { label: "大小(降序)", value: "size-desc" },
  { label: "日期(最新)", value: "date-desc" },
  { label: "日期(最早)", value: "date-asc" },
];

const filterOptions: FilterOption[] = [
  { label: "所有驱动器", value: "all" },
  { label: "系统驱动器", value: "system" },
  { label: "本地驱动器", value: "local" },
];

// Mock data (expanded)
const mockSoftware: Software[] = [
  {
    id: "1",
    name: "2fast - two factor authenticator",
    version: "1.0.0",
    author: "Jan Philipp Weber",
    date: "2024/8/5",
    size: "89.9 MB",
    icon: "/placeholder.svg?height=48&width=48",
  },
  {
    id: "2",
    name: "7-Zip",
    version: "24.08",
    author: "Igor Pavlov",
    date: "2024/9/18",
    size: "5.56 MB",
    icon: "/placeholder.svg?height=48&width=48",
  },
  {
    id: "3",
    name: "Adobe Photoshop 2024",
    version: "25.6.0.433",
    author: "Adobe Inc.",
    date: "2024/9/16",
    size: "4.51 GB",
    icon: "/placeholder.svg?height=48&width=48",
  },
  {
    id: "4",
    name: "Apifox",
    version: "2.6.10",
    author: "Apifox Team",
    date: "2024/8/23",
    size: "647 MB",
    icon: "/placeholder.svg?height=48&width=48",
  },
  {
    id: "5",
    name: "Arch WSL",
    version: "1.0.0",
    author: "Vineel Sai",
    date: "2024/9/20",
    size: "2.13 GB",
    icon: "/placeholder.svg?height=48&width=48",
  },
];

const ITEMS_PER_PAGE = 10;

const SoftwareListMemo = React.memo(SoftwareList);

export default function SoftwareManagement() {
  const [search, setSearch] = useState("");
  const [view, setView] = useState<"list" | "grid" | "detail">("list");
  const [selectedSort, setSelectedSort] = useState("name-asc");
  const [selectedFilter, setSelectedFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedSoftware, setSelectedSoftware] = useState<Software | null>(
    null
  );

  const filteredSoftware = mockSoftware.filter((software) =>
    software.name.toLowerCase().includes(search.toLowerCase())
  );

  const sortedSoftware = [...filteredSoftware].sort((a, b) => {
    switch (selectedSort) {
      case "name-asc":
        return a.name.localeCompare(b.name);
      case "name-desc":
        return b.name.localeCompare(a.name);
      case "size-asc":
        return parseFloat(a.size) - parseFloat(b.size);
      case "size-desc":
        return parseFloat(b.size) - parseFloat(a.size);
      case "date-asc":
        return new Date(a.date).getTime() - new Date(b.date).getTime();
      case "date-desc":
        return new Date(b.date).getTime() - new Date(a.date).getTime();
      default:
        return 0;
    }
  });

  const totalPages = Math.ceil(sortedSoftware.length / ITEMS_PER_PAGE);
  const paginatedSoftware = sortedSoftware.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleViewDetail = (software: Software) => {
    setSelectedSoftware(software);
  };

  return (
    <div className="container mx-auto p-4 space-y-6 dark:bg-gray-900 dark:text-white">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex-1 max-w-md">
          <SearchBar
            initialSuggestions={[]}
            placeholder="搜索软件..."
            onSearch={setSearch}
            variant="minimal"
          />
        </div>
        <ViewToggle />
      </div>

      <SoftwareFilters
        sortOptions={sortOptions}
        filterOptions={filterOptions}
        selectedSort={selectedSort}
        selectedFilter={selectedFilter}
        onSortChange={setSelectedSort}
        onFilterChange={setSelectedFilter}
        totalCount={filteredSoftware.length}
        onSearchChange={setSearch}
        onReset={() => {
          setSearch("");
          setSelectedSort("name-asc");
          setSelectedFilter("all");
        }}
      />

      <AnimatePresence>
        <motion.div
          key={view}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.3 }}
        >
          <SoftwareListMemo
            software={paginatedSoftware}
            view={view}
            onViewDetail={handleViewDetail}
          />
        </motion.div>
      </AnimatePresence>

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />

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
