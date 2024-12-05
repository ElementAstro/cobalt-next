import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

interface EnvironmentManagerProps {
  environment: { [key: string]: string };
  onChange: (newEnvironment: { [key: string]: string }) => void;
}

export default function EnvironmentManager({
  environment,
  onChange,
}: EnvironmentManagerProps) {
  const [key, setKey] = useState<string>("");
  const [value, setValue] = useState<string>("");

  const handleAdd = () => {
    if (key && value) {
      onChange({ ...environment, [key]: value });
      setKey("");
      setValue("");
    }
  };

  const handleRemove = (keyToRemove: string) => {
    const newEnvironment = { ...environment };
    delete newEnvironment[keyToRemove];
    onChange(newEnvironment);
  };

  return (
    <Card className="bg-gray-800 text-white">
      <CardHeader>
        <CardTitle>Environment Variables</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-2 mb-4">
          <Input
            placeholder="Key"
            value={key}
            onChange={(e) => setKey(e.target.value)}
            className="bg-gray-700 text-white"
          />
          <Input
            placeholder="Value"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            className="bg-gray-700 text-white"
          />
          <Button onClick={handleAdd} className="bg-blue-600 hover:bg-blue-700">
            Add
          </Button>
        </div>
        <ul className="space-y-2">
          {Object.entries(environment).map(([k, v]) => (
            <motion.li
              key={k}
              className="flex justify-between items-center bg-gray-700 p-2 rounded"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              <span>
                {k}: {v as string}
              </span>
              <Button
                variant="destructive"
                size="sm"
                onClick={() => handleRemove(k)}
                className="bg-red-600 hover:bg-red-700"
              >
                Remove
              </Button>
            </motion.li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}
