"use client";

import { useState, useMemo, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Filter } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogFooter,
  DialogClose,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { motion, AnimatePresence } from "framer-motion";

import { RealTimeData } from "@/components/search/realtime-data";
import { PaginationComponent as Pagination } from "@/components/search/pagination";
import { CelestialObjectCard } from "@/components/search/celestial-object-card";
import { SearchBar } from "@/components/search/search-bar";
import { FilterPanel } from "@/components/search/filter-panel";
import useSearchStore from "@/store/useSearchStore";

// 假设我们有一个更大的模拟数据集
const mockObjects = Array.from({ length: 1000 }, (_, i) => ({
  id: (i + 1).toString(),
  name: `Celestial Object ${i + 1}`,
  type: ["OPNCL", "DRKNB", "BRTNB", "GALXY", "PLNTN", "STAR"][
    Math.floor(Math.random() * 6)
  ],
  constellation: ["UMA", "CYG", "PYX", "ORI", "CAS", "LEO"][
    Math.floor(Math.random() * 6)
  ],
  rightAscension: `${Math.floor(Math.random() * 24)}:${Math.floor(
    Math.random() * 60
  )}:${Math.floor(Math.random() * 60)}`,
  declination: `${Math.floor(Math.random() * 90)}° ${Math.floor(
    Math.random() * 60
  )}' ${Math.floor(Math.random() * 60)}"`,
  magnitude: Math.random() * 100,
  size: Math.floor(Math.random() * 1000),
  distance: Math.floor(Math.random() * 10000),
  riseTime: `${Math.floor(Math.random() * 24)}:${Math.floor(
    Math.random() * 60
  )}`,
  setTime: `${Math.floor(Math.random() * 24)}:${Math.floor(
    Math.random() * 60
  )}`,
  transitTime: `${Math.floor(Math.random() * 24)}:${Math.floor(
    Math.random() * 60
  )}`,
  transitAltitude: Math.floor(Math.random() * 90),
}));

const ITEMS_PER_PAGE = 10;

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

export default function StarSearch() {
  const {
    searchTerm,
    filters,
    sortBy,
    sortOrder,
    currentPage,
    itemsPerPage,
    objects,
    setSearchTerm,
    setFilters,
    setSortBy,
    setSortOrder,
    setCurrentPage,
    fetchObjects,
  } = useSearchStore();

  useEffect(() => {
    fetchObjects();
  }, [fetchObjects]);

  const filteredObjects = useMemo(() => {
    return objects.filter((obj) => {
      const matchesTerm =
        obj.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        obj.constellation.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesConstellation =
        filters.constellations.length === 0 ||
        filters.constellations.includes(obj.constellation);
      const matchesType =
        filters.types.length === 0 || filters.types.includes(obj.type);
      const matchesMagnitude =
        (!filters.minMagnitude || obj.magnitude >= filters.minMagnitude) &&
        (!filters.maxMagnitude || obj.magnitude <= filters.maxMagnitude);
      const matchesDistance =
        (!filters.minDistance || obj.distance >= filters.minDistance) &&
        (!filters.maxDistance || obj.distance <= filters.maxDistance);
      return (
        matchesTerm &&
        matchesConstellation &&
        matchesType &&
        matchesMagnitude &&
        matchesDistance
      );
    });
  }, [objects, searchTerm, filters]);

  const sortedObjects = useMemo(() => {
    return [...filteredObjects].sort((a, b) => {
      const valueA = a[sortBy as keyof typeof a];
      const valueB = b[sortBy as keyof typeof b];
      if (typeof valueA === "string" && typeof valueB === "string") {
        return sortOrder === "asc"
          ? valueA.localeCompare(valueB)
          : valueB.localeCompare(valueA);
      } else if (typeof valueA === "number" && typeof valueB === "number") {
        return sortOrder === "asc" ? valueA - valueB : valueB - valueA;
      } else {
        return 0;
      }
    });
  }, [filteredObjects, sortBy, sortOrder]);

  const paginatedObjects = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return sortedObjects.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [sortedObjects, currentPage]);

  const totalPages = Math.ceil(sortedObjects.length / ITEMS_PER_PAGE);

  const handleSearch = (term: string) => {
    setSearchTerm(term);
    setCurrentPage(1);
  };

  const handleFilterChange = (newFilters: typeof filters) => {
    setFilters(newFilters);
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="flex flex-col max-h-screen bg-background overflow-hidden"
      exit={{ opacity: 0 }}
    >
      <motion.div variants={itemVariants} className="flex-none p-4 border-b">
        <div className="flex flex-col md:flex-row items-center justify-between mx-auto gap-4">
          <SearchBar onSearch={handleSearch} items={mockObjects} />
          <div className="flex gap-2 items-center">
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="name">Name</SelectItem>
                <SelectItem value="magnitude">Magnitude</SelectItem>
                <SelectItem value="distance">Distance</SelectItem>
              </SelectContent>
            </Select>
            <Button
              variant="outline"
              onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
            >
              {sortOrder === "asc" ? "↑" : "↓"}
            </Button>
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline">
                  <Filter className="mr-2 h-4 w-4" />
                  Filters
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Filters</DialogTitle>
                </DialogHeader>
                <FilterPanel />
                <DialogFooter>
                  <DialogClose asChild>
                    <Button variant="outline">Close</Button>
                  </DialogClose>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </motion.div>

      <motion.div
        variants={itemVariants}
        className="flex-grow p-4 overflow-hidden"
        exit={{ opacity: 0 }}
      >
        <div className="mx-auto">
          <AnimatePresence>
            <ScrollArea
              className="space-y-4 overflow-y-auto"
              style={{ maxHeight: "calc(100vh - 5rem)" }}
            >
              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                exit="hidden"
              >
                {paginatedObjects.map((item) => (
                  <motion.div key={item.id} variants={itemVariants}>
                    <CelestialObjectCard
                      {...item}
                      isLoggedIn={false}
                      thumbnail=""
                    />
                  </motion.div>
                ))}
              </motion.div>
            </ScrollArea>
          </AnimatePresence>
          <motion.div variants={itemVariants}>
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          </motion.div>
        </div>
      </motion.div>
    </motion.div>
  );
}
