import { Button } from "@/components/ui/button";
import { Download, Upload, Moon, Sun, Plus } from "lucide-react";
import { useTheme } from "next-themes";
import { Dialog, DialogTrigger, DialogContent } from "@/components/ui/dialog";
import AddEditSiteDialog from "./AddEditSiteDialog";

interface HeaderProps {
  exportData: () => void;
  importData: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const Header: React.FC<HeaderProps> = ({ exportData, importData }) => {
  const { theme, setTheme } = useTheme();

  return (
    <div className="flex justify-between items-center">
      <h1 className="text-4xl sm:text-5xl font-bold text-indigo-300 dark:text-indigo-400">
        Cobalt Hub
      </h1>
      <div className="flex space-x-2">
        <Button
          variant="outline"
          size="icon"
          onClick={exportData}
          className="bg-indigo-700 hover:bg-indigo-600 text-white"
        >
          <Download className="h-4 w-4" />
          <span className="sr-only">Export data</span>
        </Button>
        <label htmlFor="import-data">
          <Button
            variant="outline"
            size="icon"
            className="bg-indigo-700 hover:bg-indigo-600 text-white"
          >
            <Upload className="h-4 w-4" />
            <span className="sr-only">Import data</span>
          </Button>
        </label>
        <input
          id="import-data"
          type="file"
          accept=".json"
          onChange={importData}
          className="hidden"
        />
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          className="bg-indigo-700 hover:bg-indigo-600 text-white"
        >
          {theme === "dark" ? (
            <Sun className="h-6 w-6" />
          ) : (
            <Moon className="h-6 w-6" />
          )}
          <span className="sr-only">Toggle theme</span>
        </Button>
        <Dialog>
          <DialogTrigger asChild>
            <Button
              variant="default"
              className="bg-indigo-600 hover:bg-indigo-500 text-white"
            >
              <Plus className="mr-2 h-4 w-4" /> Add New Site
            </Button>
          </DialogTrigger>
          <DialogContent>
            <AddEditSiteDialog
              addSite={() => {}}
              editingSite={null}
              updateSite={() => {}}
              setEditingSite={() => {}}
            />
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default Header;
