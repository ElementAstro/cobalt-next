import { useState, useEffect } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { fetchConfigFiles } from "@/app/actions/serverActions";

interface ConfigFile {
  id: string;
  name: string;
}

interface ConfigFileSelectionProps {
  setConfig: (config: ConfigFile) => void;
  isMockMode: boolean;
  onCreateNew: () => void;
}

export function ConfigFileSelection({
  setConfig,
  isMockMode,
  onCreateNew,
}: ConfigFileSelectionProps) {
  const [configFiles, setConfigFiles] = useState<ConfigFile[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    fetchConfigFiles(isMockMode)
      .then((files: ConfigFile[] | null) => {
        setConfigFiles(files || []);
        setIsLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching config files:", error);
        setConfigFiles([]);
        setIsLoading(false);
      });
  }, [isMockMode]);

  if (isLoading) {
    return <div>Loading configuration files...</div>;
  }

  return (
    <div className="w-full max-w-xs sm:max-w-sm md:max-w-md mx-auto space-y-4 p-4 sm:p-6 md:p-8">
      {configFiles.length > 0 ? (
        <Select onValueChange={(value) => setConfig(JSON.parse(value))}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select a configuration file" />
          </SelectTrigger>
          <SelectContent>
            {configFiles.map((file) => (
              <SelectItem key={file.id} value={JSON.stringify(file)}>
                {file.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      ) : (
        <div>No configuration files found. Please create a new one.</div>
      )}
      <Button onClick={onCreateNew} className="w-full">
        Create New Configuration
      </Button>
    </div>
  );
}
