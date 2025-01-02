"use client";

import React from "react";
import { X, Search } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Dialog,
  DialogOverlay,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { useFilesystemStore } from "@/store/useFilesystemStore";

interface AdvancedSearchProps {
  isOpen: boolean;
  onClose: () => void;
  customFilters?: {
    sizeRange?: boolean;
    ownerFilter?: boolean;
    tagFilter?: boolean;
  };
}

export const AdvancedSearch: React.FC<AdvancedSearchProps> = ({
  isOpen,
  onClose,
}) => {
  const {
    searchTerm,
    setSearchTerm,
    fileType,
    setFileType,
    dateRange,
    setDateRange,
    includeArchived,
    setIncludeArchived,
    searchResults,
    setSearchResults,
    isLoading,
    setIsLoading,
    minSize,
    setMinSize,
    maxSize,
    setMaxSize,
    owner,
    setOwner,
    searchTags,
    setSearchTags,
  } = useFilesystemStore();

  const handleSearch = async () => {
    setIsLoading(true);
    console.log(
      `Searching for "${searchTerm}" with file type "${fileType}", date range "${dateRange}", include archived: ${includeArchived}`
    );
    setTimeout(() => {
      setSearchResults(["Result 1", "Result 2", "Result 3"]);
      setIsLoading(false);
    }, 1500);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <Dialog open={isOpen} onOpenChange={onClose}>
          <DialogOverlay asChild>
            <motion.div
              className="fixed inset-0 bg-black bg-opacity-50 z-50"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            />
          </DialogOverlay>
          <DialogContent asChild>
            <motion.div
              className="bg-gray-800 text-white p-6 rounded-lg max-w-lg w-full mx-4 relative"
              initial={{ scale: 0.9, opacity: 0, y: -50 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 50 }}
              transition={{ duration: 0.3 }}
            >
              <DialogHeader>
                <DialogTitle className="flex justify-between items-center mb-4">
                  <span className="text-2xl font-bold">Advanced Search</span>
                  <DialogClose asChild>
                    <button className="p-2 rounded-full hover:bg-gray-700 transition duration-200 text-white">
                      <X className="w-6 h-6" />
                    </button>
                  </DialogClose>
                </DialogTitle>
              </DialogHeader>

              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSearch();
                }}
                className="space-y-4"
              >
                {/* Search Term */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="space-y-2"
                >
                  <Label
                    htmlFor="searchTerm"
                    className="block mb-2 font-medium"
                  >
                    Search Term
                  </Label>
                  <Input
                    id="searchTerm"
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full p-2 rounded bg-gray-700 text-white"
                    placeholder="Enter search term..."
                    required
                  />
                </motion.div>

                {/* File Type */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <Label className="block mb-2 font-medium">File Type</Label>
                  <Select
                    value={fileType}
                    onValueChange={(value) => setFileType(value as any)}
                  >
                    <SelectTrigger className="w-full p-2 rounded bg-gray-700">
                      <SelectValue placeholder="Select file type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All</SelectItem>
                      <SelectItem value="document">Document</SelectItem>
                      <SelectItem value="image">Image</SelectItem>
                      <SelectItem value="video">Video</SelectItem>
                    </SelectContent>
                  </Select>
                </motion.div>

                {/* Date Range */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  <Label className="block mb-2 font-medium">Date Range</Label>
                  <Select
                    value={dateRange}
                    onValueChange={(value) => setDateRange(value as any)}
                  >
                    <SelectTrigger className="w-full p-2 rounded bg-gray-700">
                      <SelectValue placeholder="Select date range" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="any">Any Time</SelectItem>
                      <SelectItem value="past-week">Past Week</SelectItem>
                      <SelectItem value="past-month">Past Month</SelectItem>
                      <SelectItem value="past-year">Past Year</SelectItem>
                    </SelectContent>
                  </Select>
                </motion.div>

                {/* Include Archived */}
                <motion.div
                  className="flex items-center"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  <Checkbox
                    id="includeArchived"
                    checked={includeArchived}
                    onCheckedChange={(checked) =>
                      setIncludeArchived(checked === true)
                    }
                    className="mr-2"
                  />
                  <Label htmlFor="includeArchived" className="font-medium">
                    Include Archived
                  </Label>
                </motion.div>

                {/* Search Button */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.55 }}
                >
                  <Button
                    type="submit"
                    className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition duration-200 flex items-center justify-center"
                    disabled={isLoading}
                  >
                    <Search className="w-5 h-5 mr-2" />
                    {isLoading ? "Searching..." : "Search"}
                  </Button>
                </motion.div>
              </form>

              {/* Search Results */}
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{
                  opacity: searchResults.length > 0 ? 1 : 0,
                  scale: searchResults.length > 0 ? 1 : 0.95,
                }}
                transition={{
                  duration: 0.3,
                  delay: 0.6,
                  type: "spring",
                  stiffness: 100,
                }}
                className="mt-6 bg-gray-700/50 p-4 rounded-lg"
              >
                {searchResults.length > 0 && (
                  <div>
                    <h3 className="text-xl font-semibold mb-2">
                      Search Results:
                    </h3>
                    <ul className="grid grid-cols-1 gap-2">
                      {searchResults.map((result, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{
                            delay: 0.1 * index,
                            type: "spring",
                            stiffness: 100,
                          }}
                          className="p-3 bg-gray-600/50 rounded-lg hover:bg-gray-600/70 transition-colors duration-200"
                        >
                          <div className="flex items-center justify-between">
                            <span className="text-gray-100">{result}</span>
                            <button className="p-1 rounded-full hover:bg-gray-500/50 transition-colors duration-200">
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                          <div className="text-sm text-gray-400 mt-1">
                            File details...
                          </div>
                        </motion.div>
                      ))}
                    </ul>
                  </div>
                )}
              </motion.div>
            </motion.div>
          </DialogContent>
        </Dialog>
      )}
    </AnimatePresence>
  );
};
