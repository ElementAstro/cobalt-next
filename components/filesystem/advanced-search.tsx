import React, { useState } from "react";
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

interface AdvancedSearchProps {
  isOpen: boolean;
  onClose: () => void;
  theme: "light" | "dark";
}

export const AdvancedSearch: React.FC<AdvancedSearchProps> = ({
  isOpen,
  onClose,
  theme,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [fileType, setFileType] = useState<
    "all" | "document" | "image" | "video"
  >("all");
  const [dateRange, setDateRange] = useState<
    "any" | "past-week" | "past-month" | "past-year"
  >("any");
  const [searchResults, setSearchResults] = useState<string[]>([]);

  if (!isOpen) return null;

  const handleSearch = () => {
    // Implement actual search logic here
    console.log(
      `Searching for ${searchTerm} with file type ${fileType} and date range ${dateRange}`
    );
    // Simulating search results
    setSearchResults(["Result 1", "Result 2", "Result 3"]);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <Dialog open={isOpen} onOpenChange={onClose}>
          <DialogOverlay className="fixed inset-0 bg-black bg-opacity-50 z-50" />
          <DialogContent
            className={`${
              theme === "dark"
                ? "bg-gray-800 text-white"
                : "bg-white text-black"
            } p-6 rounded-lg max-w-md w-full mx-4`}
          >
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 20, opacity: 0 }}
            >
              <DialogHeader>
                <DialogTitle className="flex justify-between items-center mb-4">
                  <span className="text-2xl font-bold">Advanced Search</span>
                  <DialogClose asChild>
                    <button className="p-1 rounded-full hover:bg-gray-700 transition duration-200">
                      <X className="w-6 h-6" />
                    </button>
                  </DialogClose>
                </DialogTitle>
              </DialogHeader>
              <div className="mb-4">
                <Label className="block mb-2 font-medium">Search Term</Label>
                <Input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className={`w-full p-2 rounded ${
                    theme === "dark" ? "bg-gray-700" : "bg-gray-200"
                  }`}
                  placeholder="Enter search term..."
                />
              </div>
              <div className="mb-4">
                <Label className="block mb-2 font-medium">File Type</Label>
                <Select
                  value={fileType}
                  onValueChange={(value) =>
                    setFileType(value as "all" | "document" | "image" | "video")
                  }
                >
                  <SelectTrigger
                    className={`w-full p-2 rounded ${
                      theme === "dark" ? "bg-gray-700" : "bg-gray-200"
                    }`}
                  >
                    <SelectValue placeholder="Select file type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All</SelectItem>
                    <SelectItem value="document">Document</SelectItem>
                    <SelectItem value="image">Image</SelectItem>
                    <SelectItem value="video">Video</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="mb-4">
                <Label className="block mb-2 font-medium">Date Range</Label>
                <Select
                  value={dateRange}
                  onValueChange={(value) =>
                    setDateRange(
                      value as "any" | "past-week" | "past-month" | "past-year"
                    )
                  }
                >
                  <SelectTrigger
                    className={`w-full p-2 rounded ${
                      theme === "dark" ? "bg-gray-700" : "bg-gray-200"
                    }`}
                  >
                    <SelectValue placeholder="Select date range" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="any">Any Time</SelectItem>
                    <SelectItem value="past-week">Past Week</SelectItem>
                    <SelectItem value="past-month">Past Month</SelectItem>
                    <SelectItem value="past-year">Past Year</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button
                onClick={handleSearch}
                className={`w-full py-2 px-4 ${
                  theme === "dark"
                    ? "bg-blue-600 hover:bg-blue-700"
                    : "bg-blue-500 hover:bg-blue-600"
                } text-white rounded-lg transition duration-200`}
              >
                <Search className="w-5 h-5 inline-block mr-2" />
                Search
              </Button>
              {searchResults.length > 0 && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="mt-4"
                >
                  <h3 className="font-medium mb-2">Search Results:</h3>
                  <ul className="list-disc pl-5">
                    {searchResults.map((result, index) => (
                      <motion.li
                        key={index}
                        initial={{ x: -10, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        exit={{ x: -10, opacity: 0 }}
                        transition={{ delay: index * 0.1 }}
                      >
                        {result}
                      </motion.li>
                    ))}
                  </ul>
                </motion.div>
              )}
            </motion.div>
          </DialogContent>
        </Dialog>
      )}
    </AnimatePresence>
  );
};
