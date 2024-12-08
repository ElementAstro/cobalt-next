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
      className="mt-4 dark:bg-gray-800 p-4 rounded-lg"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Pagination className="flex justify-center items-center gap-2">
        <PaginationContent className="flex items-center gap-2">
          {currentPage > 1 && (
            <>
              <PaginationItem>
                <PaginationPrevious onClick={() => onPageChange(1)}>
                  <ChevronsLeft className="h-4 w-4 dark:text-white" />
                  <span className="sr-only">First page</span>
                </PaginationPrevious>
              </PaginationItem>
              <PaginationItem>
                <PaginationPrevious
                  onClick={() => onPageChange(currentPage - 1)}
                >
                  <ChevronLeft className="h-4 w-4 dark:text-white" />
                  <span className="sr-only">Previous page</span>
                </PaginationPrevious>
              </PaginationItem>
            </>
          )}
          <PaginationItem>
            <span className="text-sm dark:text-white">
              Page {currentPage} of {totalPages}
            </span>
          </PaginationItem>
          {currentPage < totalPages && (
            <>
              <PaginationItem>
                <PaginationNext onClick={() => onPageChange(currentPage + 1)}>
                  <span className="sr-only">Next page</span>
                  <ChevronRight className="h-4 w-4 dark:text-white" />
                </PaginationNext>
              </PaginationItem>
              <PaginationItem>
                <PaginationNext onClick={() => onPageChange(totalPages)}>
                  <span className="sr-only">Last page</span>
                  <ChevronsRight className="h-4 w-4 dark:text-white" />
                </PaginationNext>
              </PaginationItem>
            </>
          )}
        </PaginationContent>
      </Pagination>
    </motion.div>
  );
}
