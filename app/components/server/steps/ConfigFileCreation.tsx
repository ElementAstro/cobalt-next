import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createConfigFile } from "@/app/actions/serverActions";
import { Button } from "@/components/ui/button";

interface ConfigFileCreationProps {
  setConfig: (config: any) => void;
  isMockMode: boolean;
  onComplete: () => void;
}

export function ConfigFileCreation({
  setConfig,
  isMockMode,
  onComplete,
}: ConfigFileCreationProps) {
  const [name, setName] = useState("");
  const [port, setPort] = useState("");
  const [isCreating, setIsCreating] = useState(false);

  const handleCreate = async () => {
    if (name && port) {
      setIsCreating(true);
      try {
        const newConfig = await createConfigFile({ name, port }, isMockMode);
        setConfig(newConfig);
        onComplete();
      } catch (error) {
        console.error("Error creating config file:", error);
      } finally {
        setIsCreating(false);
      }
    }
  };

  return (
    <div className="space-y-4 w-full max-w-xs sm:max-w-sm md:max-w-md mx-auto p-4 sm:p-6 md:p-8">
      <div>
        <Label htmlFor="config-name" className="text-sm sm:text-base">
          Configuration Name
        </Label>
        <Input
          id="config-name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Enter configuration name"
          className="mt-1 text-sm sm:text-base"
        />
      </div>
      <div>
        <Label htmlFor="server-port" className="text-sm sm:text-base">
          Server Port
        </Label>
        <Input
          id="server-port"
          type="number"
          value={port}
          onChange={(e) => setPort(e.target.value)}
          placeholder="Enter server port"
          className="mt-1 text-sm sm:text-base"
        />
      </div>
      <Button
        onClick={handleCreate}
        className="w-full text-sm sm:text-base"
        disabled={isCreating}
      >
        {isCreating ? "Creating..." : "Create Configuration"}
      </Button>
    </div>
  );
}
