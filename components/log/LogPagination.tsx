// LogPagination.tsx
import React from "react";
import { Button } from "@/components/ui/button";
import { useLogStore } from "@/lib/store/log";

const LogPagination: React.FC = () => {
  const { currentPage, setCurrentPage, filteredLogs } = useLogStore();

  const totalPages = Math.ceil(filteredLogs.length / 100);

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

  return (
    <div className="p-2 flex justify-center items-center space-x-2 dark:text-gray-200">
      <Button
        onClick={() => handlePageChange(currentPage - 1)}
        disabled={currentPage === 1}
        variant="outline"
        size="sm"
      >
        上一页
      </Button>
      <span className="text-sm">
        第 {currentPage} 页，共 {totalPages} 页
      </span>
      <Button
        onClick={() => handlePageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        variant="outline"
        size="sm"
      >
        下一页
      </Button>
    </div>
  );
};

export default LogPagination;