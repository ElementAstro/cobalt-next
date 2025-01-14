import { useState, useEffect } from "react";
import { motion, AnimatePresence, useAnimationControls } from "framer-motion";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  ExternalLink,
  Filter,
  Search,
  Star,
  LayoutGrid,
  List,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

interface Project {
  name: string;
  description: string;
  link: string;
  category: string;
  tags?: string[];
  rating?: number;
  isFavorite?: boolean;
}

interface ProjectListProps {
  projects: Project[];
}

const categoryColors = {
  Web: "bg-blue-500/10 text-blue-500",
  Mobile: "bg-green-500/10 text-green-500",
  AI: "bg-purple-500/10 text-purple-500",
  Data: "bg-orange-500/10 text-orange-500",
  Design: "bg-pink-500/10 text-pink-500",
};

export function ProjectList({ projects }: ProjectListProps) {
  const [filter, setFilter] = useState<string>("all");
  const [search, setSearch] = useState<string>("");
  const [sortField, setSortField] = useState<keyof Project>("name");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [view, setView] = useState<"grid" | "list">("grid");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(9);
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [tagFilter, setTagFilter] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const controls = useAnimationControls();

  // Simulate loading
  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1500);
    return () => clearTimeout(timer);
  }, []);

  const filteredProjects = projects.filter((project) => {
    const matchesCategory = filter === "all" || project.category === filter;
    const matchesSearch =
      project.name.toLowerCase().includes(search.toLowerCase()) ||
      project.description.toLowerCase().includes(search.toLowerCase());
    const matchesTags =
      tagFilter.length === 0 ||
      (project.tags && tagFilter.some((tag) => project.tags?.includes(tag)));

    return matchesCategory && matchesSearch && matchesTags;
  });

  const sortedProjects = [...filteredProjects].sort((a, b) => {
    if (sortField === "rating") {
      const aRating = a.rating || 0;
      const bRating = b.rating || 0;
      return sortOrder === "asc" ? aRating - bRating : bRating - aRating;
    }
    const aValue = a[sortField] ?? "";
    const bValue = b[sortField] ?? "";
    const compareResult = aValue > bValue ? 1 : -1;
    return sortOrder === "asc" ? compareResult : -compareResult;
  });

  // Pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentProjects = sortedProjects.slice(
    indexOfFirstItem,
    indexOfLastItem
  );
  const totalPages = Math.ceil(sortedProjects.length / itemsPerPage);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    controls
      .start({
        opacity: 0,
        y: 20,
        transition: { duration: 0.2 },
      })
      .then(() => {
        controls.start({
          opacity: 1,
          y: 0,
          transition: { duration: 0.3 },
        });
      });
  };

  const categories = Array.from(new Set(projects.map((p) => p.category)));
  const allTags = Array.from(new Set(projects.flatMap((p) => p.tags || [])));

  const toggleFavorite = (projectName: string) => {
    const updatedProjects = projects.map((p) =>
      p.name === projectName ? { ...p, isFavorite: !p.isFavorite } : p
    );
    // Here you would typically update the state or make an API call
    console.log("Updated favorites:", updatedProjects);
  };

  const renderRatingStars = (rating?: number) => {
    if (!rating) return null;
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    
    return (
      <div className="flex items-center gap-1 mt-2">
        {Array.from({ length: fullStars }).map((_, i) => (
          <Star key={i} className="h-4 w-4 text-yellow-400 fill-yellow-400" />
        ))}
        {hasHalfStar && (
          <div className="relative h-4 w-4">
            <Star className="absolute h-4 w-4 text-yellow-400" />
            <Star className="absolute h-4 w-4 text-yellow-400 fill-yellow-400" 
              style={{ clipPath: 'inset(0 50% 0 0)' }} />
          </div>
        )}
        {Array.from({ length: 5 - Math.ceil(rating) }).map((_, i) => (
          <Star key={i} className="h-4 w-4 text-muted-foreground" />
        ))}
      </div>
    );
  };

  return (
    <div className="p-4 min-h-screen bg-gradient-to-b from-background to-muted/20">
      {/* Controls and filters */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4"
      >
        {/* Filter controls */}
        <div className="flex flex-col md:flex-row gap-4 w-full">
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
            >
              <Filter className="h-4 w-4 mr-2" />
              {showAdvancedFilters ? "隐藏高级筛选" : "显示高级筛选"}
            </Button>
            <Select value={filter} onValueChange={(value) => setFilter(value)}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="选择类别" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">所有类别</SelectItem>
                {categories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center gap-2 flex-1">
            <Search className="h-5 w-5 text-muted-foreground" />
            <Input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="搜索项目..."
              className="flex-1"
            />
          </div>
        </div>

        {/* Advanced filters */}
        {showAdvancedFilters && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            transition={{ duration: 0.3 }}
            className="w-full mt-4 space-y-4"
          >
            <div className="flex flex-wrap gap-2">
              {allTags.map((tag) => (
                <motion.div
                  key={tag}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button
                    variant={tagFilter.includes(tag) ? "default" : "outline"}
                    size="sm"
                    onClick={() => {
                      setTagFilter((prev) =>
                        prev.includes(tag)
                          ? prev.filter((t) => t !== tag)
                          : [...prev, tag]
                      );
                    }}
                  >
                    {tag}
                  </Button>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </motion.div>

      {/* View controls */}
      <motion.div className="flex flex-col md:flex-row justify-between items-center mb-4 gap-4">
        <div className="flex items-center space-x-4">
          <Button
            variant={view === "grid" ? "default" : "outline"}
            size="sm"
            onClick={() => setView("grid")}
          >
            <LayoutGrid className="h-4 w-4 mr-2" />
            网格视图
          </Button>
          <Button
            variant={view === "list" ? "default" : "outline"}
            size="sm"
            onClick={() => setView("list")}
          >
            <List className="h-4 w-4 mr-2" />
            列表视图
          </Button>
        </div>

        <div className="flex items-center space-x-4">
          <Select
            value={sortField}
            onValueChange={(value) => setSortField(value as keyof Project)}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="排序方式" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="name">名称</SelectItem>
              <SelectItem value="category">类别</SelectItem>
              <SelectItem value="rating">评分</SelectItem>
            </SelectContent>
          </Select>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
          >
            {sortOrder === "asc" ? "升序" : "降序"}
          </Button>
        </div>
      </motion.div>

      {/* Loading state */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: itemsPerPage }).map((_, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="w-full h-full relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-muted/50 to-transparent animate-shimmer" />
                <CardHeader>
                  <Skeleton className="h-6 w-3/4" />
                  <Skeleton className="h-4 w-1/2 mt-2" />
                </CardHeader>
                <div className="p-4 space-y-2">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-2/3" />
                  <Skeleton className="h-10 w-24 mt-4" />
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      ) : (
        <>
          {/* Empty state */}
          {currentProjects.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center text-muted-foreground py-8"
            >
              未找到匹配的项目。
            </motion.div>
          ) : (
            <>
              {/* Projects grid */}
              <motion.div
                animate={controls}
                className={`grid ${
                  view === "grid"
                    ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                    : "grid-cols-1 gap-4"
                }`}
              >
                <AnimatePresence mode="wait">
                  {currentProjects.map((project, index) => (
                    <motion.div
                      key={project.name}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{
                        delay: index * 0.1,
                        type: "spring",
                        stiffness: 200,
                        damping: 20,
                      }}
                      whileHover={{
                        scale: 1.02,
                        y: -5,
                        transition: { duration: 0.2 },
                      }}
                      className="flex flex-col h-full"
                    >
                      <Card className="w-full h-full bg-background/50 backdrop-blur-sm border border-border/50 shadow-sm hover:shadow-md transition-shadow">
                        <CardHeader>
                          <div className="flex justify-between items-start">
                            <div>
                              <CardTitle className="text-lg">
                                {project.name}
                              </CardTitle>
                              <div className={`text-xs px-2 py-1 mt-2 rounded-full w-fit ${
                                categoryColors[project.category as keyof typeof categoryColors] || 
                                "bg-gray-500/10 text-gray-500"
                              }`}>
                                {project.category}
                              </div>
                            </div>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <button
                                  onClick={() => toggleFavorite(project.name)}
                                  className="p-1 hover:bg-muted rounded-full"
                                >
                                  <Star
                                    className={`h-5 w-5 ${
                                      project.isFavorite
                                        ? "text-yellow-400 fill-yellow-400"
                                        : "text-muted-foreground"
                                    }`}
                                  />
                                </button>
                              </TooltipTrigger>
                              <TooltipContent>
                                {project.isFavorite ? "取消收藏" : "添加到收藏"}
                              </TooltipContent>
                            </Tooltip>
                          </div>
                          <CardDescription className="mt-2">
                            {project.description}
                          </CardDescription>
                          {renderRatingStars(project.rating)}
                          <div className="flex flex-wrap gap-2 mt-2">
                            {project.tags?.map((tag) => (
                              <motion.span
                                key={tag}
                                whileHover={{ scale: 1.1 }}
                                className="text-xs px-2 py-1 bg-muted rounded-full"
                              >
                                {tag}
                              </motion.span>
                            ))}
                          </div>
                        </CardHeader>
                        <div className="p-4">
                          <Button variant="outline" size="sm" asChild>
                            <a
                              href={project.link}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center"
                            >
                              查看项目 <ExternalLink className="ml-2 h-4 w-4" />
                            </a>
                          </Button>
                        </div>
                      </Card>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </motion.div>

              {/* Pagination */}
              {totalPages > 1 && (
                <motion.div 
                  className="mt-8"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <Pagination>
                    <PaginationContent>
                      <PaginationItem>
                        <PaginationPrevious
                          href="#"
                          onClick={() => handlePageChange(currentPage - 1)}
                          className={
                            currentPage === 1
                              ? "pointer-events-none opacity-50"
                              : ""
                          }
                        />
                      </PaginationItem>

                      {Array.from({ length: totalPages }).map((_, i) => (
                        <PaginationItem key={i}>
                          <PaginationLink
                            href="#"
                            onClick={() => handlePageChange(i + 1)}
                            isActive={currentPage === i + 1}
                          >
                            {i + 1}
                          </PaginationLink>
                        </PaginationItem>
                      ))}

                      <PaginationItem>
                        <PaginationNext
                          href="#"
                          onClick={() => handlePageChange(currentPage + 1)}
                          className={
                            currentPage === totalPages
                              ? "pointer-events-none opacity-50"
                              : ""
                          }
                        />
                      </PaginationItem>
                    </PaginationContent>
                  </Pagination>
                </motion.div>
              )}
            </>
          )}
        </>
      )}
    </div>
  );
}
