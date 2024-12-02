import { useState } from "react";
import { Button } from "@/components/ui/button";
import { startServer } from "@/app/actions/serverActions";

interface Config {
  name: string;
  port: string;
  [key: string]:
    | {
        driverName?: string;
        deviceName?: string;
      }
    | string;
}

interface StartupConfirmationProps {
  config: Config;
  isMockMode: boolean;
}

export function StartupConfirmation({
  config,
  isMockMode,
}: StartupConfirmationProps) {
  const [status, setStatus] = useState("");
  const [isStarting, setIsStarting] = useState(false);

  const handleStartServer = async () => {
    setIsStarting(true);
    setStatus("Starting server...");
    try {
      const result = await startServer(config, isMockMode);
      setStatus(
        result.success
          ? "Server started successfully!"
          : "Failed to start server."
      );
    } catch (error) {
      setStatus("An error occurred while starting the server.");
    } finally {
      setIsStarting(false);
    }
  };

  const categories = [
    "camera",
    "mount",
    "focuser",
    "filterWheel",
    "powerManagement",
    "guider",
    "solver",
  ];

  return (
    <div className="space-y-4 w-full max-w-2xl mx-auto p-4 sm:p-6 md:p-8">
      <h3 className="text-lg font-semibold text-center">
        Configuration Summary
      </h3>
      <ul className="list-disc list-inside text-sm sm:text-base space-y-2">
        <li>Configuration Name: {config.name}</li>
        <li>Server Port: {config.port}</li>
        {categories.map(
          (category) =>
            config[category] &&
            typeof config[category] === "object" && (
              <li key={category}>
                {category.charAt(0).toUpperCase() + category.slice(1)}:
                <ul className="list-disc list-inside ml-4">
                  <li>Driver: {config[category].driverName}</li>
                  <li>Device: {config[category].deviceName}</li>
                </ul>
              </li>
            )
        )}
      </ul>
      <Button
        onClick={handleStartServer}
        className="w-full text-sm sm:text-base"
        disabled={isStarting}
      >
        {isStarting ? "Starting..." : "Start Server"}
      </Button>
      {status && (
        <p className="mt-2 text-xs sm:text-sm text-gray-600 text-center">
          {status}
        </p>
      )}
    </div>
  );
}
