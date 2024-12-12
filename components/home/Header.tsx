import { Button } from "@/components/ui/button";
import { Download, Upload, Plus } from "lucide-react";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

interface HeaderProps {
  exportData: () => void;
  importData: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onAddNewSite: () => void;
}

const Header: React.FC<HeaderProps> = ({
  exportData,
  importData,
  onAddNewSite,
}) => {
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
    </div>
  );
};

export default Header;
