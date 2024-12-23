import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Download, Upload, Plus, Search, Sun, Moon } from "lucide-react";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

interface HeaderProps {
  exportData: () => void;
  importData: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onAddNewSite: () => void;
  onSearch: (query: string) => void;
  toggleTheme: () => void;
  isDark: boolean;
}

const Header: React.FC<HeaderProps> = ({
  exportData,
  importData,
  onAddNewSite,
  onSearch,
  toggleTheme,
  isDark,
}) => {
  return (
    <motion.div
      className="flex flex-col sm:flex-row justify-between items-center gap-2 p-2"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex items-center gap-2">
        <h1 className="text-3xl sm:text-4xl font-bold text-indigo-300 dark:text-indigo-400">
          Cobalt Hub
        </h1>
      </div>
      <div className="flex items-center gap-2 w-full sm:w-auto">
        <div className="relative flex-1 sm:flex-initial sm:w-64">
          <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-indigo-400" />
          <Input
            type="search"
            placeholder="搜索站点..."
            className="pl-8 bg-indigo-800/50 border-indigo-600"
            onChange={(e) => onSearch(e.target.value)}
          />
        </div>
        <Button
          variant="outline"
          size="icon"
          onClick={exportData}
          className="bg-indigo-700 hover:bg-indigo-600 text-white"
        >
          <Download className="h-4 w-4" />
          <span className="sr-only">Export data</span>
        </Button>
        <Label htmlFor="import-data">
          <Button
            variant="outline"
            size="icon"
            className="bg-indigo-700 hover:bg-indigo-600 text-white"
          >
            <Upload className="h-4 w-4" />
            <span className="sr-only">Import data</span>
          </Button>
        </Label>
        <Input
          id="import-data"
          type="file"
          accept=".json"
          onChange={importData}
          className="hidden"
        />
        <Dialog>
          <DialogTrigger asChild>
            <Button
              variant="default"
              className="bg-indigo-600 hover:bg-indigo-500 text-white"
              onClick={onAddNewSite}
            >
              <Plus className="mr-2 h-4 w-4" /> 添加新站点
            </Button>
          </DialogTrigger>
        </Dialog>
      </div>
    </motion.div>
  );
};

export default Header;
