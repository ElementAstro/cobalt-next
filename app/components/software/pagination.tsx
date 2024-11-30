import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationPrevious,
  PaginationNext,
} from "@/components/ui/pagination";

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
    <Pagination className="mt-4">
      <PaginationContent>
        <PaginationItem>
          {currentPage > 1 && (
            <PaginationPrevious onClick={() => onPageChange(currentPage - 1)}>
              <ChevronLeft className="h-4 w-4" />
              <span className="sr-only">Previous page</span>
            </PaginationPrevious>
          )}
        </PaginationItem>
        <PaginationItem>
          <span className="text-sm">
            Page {currentPage} of {totalPages}
          </span>
        </PaginationItem>
        <PaginationItem>
          {currentPage < totalPages && (
            <PaginationNext onClick={() => onPageChange(currentPage + 1)}>
              <span className="sr-only">Next page</span>
              <ChevronRight className="h-4 w-4" />
            </PaginationNext>
          )}
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}
