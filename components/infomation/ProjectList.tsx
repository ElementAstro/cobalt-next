import { useState } from "react";
import { motion } from "framer-motion";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ExternalLink, Filter, Search } from "lucide-react";
import { Input } from "@/components/ui/input";

interface Project {
  name: string;
  description: string;
  link: string;
  category: string;
}

interface ProjectListProps {
  projects: Project[];
}

export function ProjectList({ projects }: ProjectListProps) {
  const [filter, setFilter] = useState<string>("all");
  const [search, setSearch] = useState<string>("");

  const filteredProjects = projects.filter(
    (project) =>
      (filter === "all" || project.category === filter) &&
      (project.name.toLowerCase().includes(search.toLowerCase()) ||
        project.description.toLowerCase().includes(search.toLowerCase()))
  );

  const categories = Array.from(new Set(projects.map((p) => p.category)));

  return (
    <div className="p-4">
      <div className="flex flex-col md:flex-row justify-between items-center mb-6">
        <div className="flex items-center mb-4 md:mb-0">
          <Filter className="h-5 w-5 text-gray-500 dark:text-gray-300 mr-2" />
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="border border-gray-300 dark:border-gray-600 rounded px-2 py-1 dark:bg-gray-700 dark:text-white"
          >
            <option value="all">所有类别</option>
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>
        <div className="flex items-center">
          <Search className="h-5 w-5 text-gray-500 dark:text-gray-300 mr-2" />
          <Input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="搜索项目..."
            className="dark:bg-gray-700 dark:text-white"
          />
        </div>
      </div>
      {filteredProjects.length === 0 ? (
        <p className="text-center text-gray-500 dark:text-gray-300">
          未找到匹配的项目。
        </p>
      ) : (
        <div className="grid grid-cols-1">
          {filteredProjects.map((project, index) => (
            <motion.div
              key={project.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{
                scale: 1.05,
                boxShadow: "0px 4px 15px rgba(0, 0, 0, 0.2)",
              }}
              className="flex flex-col"
            >
              <Card className="w-full dark:bg-gray-800">
                <CardHeader>
                  <CardTitle className="text-lg flex justify-between items-center">
                    {project.name}
                    <span className="text-sm text-blue-500">
                      {project.category}
                    </span>
                  </CardTitle>
                  <CardDescription className="mt-2">
                    {project.description}
                  </CardDescription>
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
        </div>
      )}
    </div>
  );
}
