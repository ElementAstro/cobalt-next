import React, { useState } from "react";
import { X, Search } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardContent } from "@/components/ui/card";

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  theme: "light" | "dark";
}

export const SearchModal: React.FC<SearchModalProps> = ({
  isOpen,
  onClose,
  theme,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState<string[]>([]);

  if (!isOpen) return null;

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Implement actual search logic here
    const mockResults = ["Result 1", "Result 2", "Result 3"];
    setSearchResults(mockResults);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
        >
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 20, opacity: 0 }}
            className={`${
              theme === "dark"
                ? "bg-gray-800 text-white"
                : "bg-white text-black"
            } p-6 rounded-lg max-w-md w-full`}
          >
            <Card className="w-full">
              <CardHeader className="flex justify-between items-center">
                <h2 className="text-2xl font-bold">Search Files</h2>
                <Button variant="ghost" onClick={onClose}>
                  <X className="w-6 h-6" />
                </Button>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSearch} className="mb-4">
                  <div className="relative">
                    <Input
                      type="text"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      placeholder="Search files..."
                      className={`w-full py-2 px-4 pr-10 rounded-lg ${
                        theme === "dark"
                          ? "bg-gray-700 text-white"
                          : "bg-gray-200 text-black"
                      }`}
                    />
                    <Button
                      type="submit"
                      variant="ghost"
                      className="absolute right-2 top-2 p-1"
                    >
                      <Search className="w-5 h-5" />
                    </Button>
                  </div>
                </form>
                {searchResults.length > 0 && (
                  <div>
                    <h3 className="font-semibold mb-2">Search Results:</h3>
                    <ul className="space-y-2">
                      {searchResults.map((result, index) => (
                        <li
                          key={index}
                          className={`p-2 rounded-lg ${
                            theme === "dark"
                              ? "hover:bg-gray-700"
                              : "hover:bg-gray-200"
                          } cursor-pointer transition duration-200`}
                        >
                          {result}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
