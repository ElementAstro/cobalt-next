import React from "react";
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationPrevious,
  PaginationNext,
} from "@/components/ui/pagination";
import { motion } from "framer-motion";
import { Span } from "@/components/custom/Span";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export function PaginationComponent({
  currentPage,
  totalPages,
  onPageChange,
}: PaginationProps) {
  return (
    <motion.div
      className="mt-4 bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      layout
    >
      <Pagination className="flex justify-center items-center gap-2">
        <PaginationContent className="flex items-center gap-2 flex-wrap justify-center">
          {currentPage > 1 && (
            <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
              <PaginationItem>
                <PaginationPrevious
                  onClick={() => onPageChange(1)}
                  className="hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
                >
                  <ChevronsLeft className="h-4 w-4 dark:text-white" />
                  <span className="sr-only">First page</span>
                </PaginationPrevious>
              </PaginationItem>
            </motion.div>
          )}
          {currentPage > 1 && (
            <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
              <PaginationItem>
                <PaginationPrevious
                  onClick={() => onPageChange(currentPage - 1)}
                  className="hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
                >
                  <ChevronLeft className="h-4 w-4 dark:text-white" />
                  <span className="sr-only">Previous page</span>
                </PaginationPrevious>
              </PaginationItem>
            </motion.div>
          )}
          <PaginationItem>
            <Span
              variant="info"
              size="md"
              tooltip={`当前页: ${currentPage}, 总页数: ${totalPages}`}
            >
              Page {currentPage} of {totalPages}
            </Span>
          </PaginationItem>
          {currentPage < totalPages && (
            <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
              <PaginationItem>
                <PaginationNext
                  onClick={() => onPageChange(currentPage + 1)}
                  className="hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
                >
                  <span className="sr-only">Next page</span>
                  <ChevronRight className="h-4 w-4 dark:text-white" />
                </PaginationNext>
              </PaginationItem>
            </motion.div>
          )}
          {currentPage < totalPages && (
            <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
              <PaginationItem>
                <PaginationNext
                  onClick={() => onPageChange(totalPages)}
                  className="hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
                >
                  <span className="sr-only">Last page</span>
                  <ChevronsRight className="h-4 w-4 dark:text-white" />
                </PaginationNext>
              </PaginationItem>
            </motion.div>
          )}
        </PaginationContent>
      </Pagination>
    </motion.div>
  );
}
