"use client";

import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface SettingsDialogProps {
  apiKey: string;
  setApiKey: (key: string) => void;
}

const SettingsDialog: React.FC<SettingsDialogProps> = ({
  apiKey,
  setApiKey,
}) => {
  return (
    <Card className="mt-4 p-4 bg-gray-700">
      <CardHeader>
        <CardTitle className="text-white">设置</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <Label htmlFor="apiKey" className="text-white">
              API 密钥:
            </Label>
            <Input
              id="apiKey"
              type="text"
              className="flex-1 px-2 py-1 bg-gray-600 text-white rounded"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default SettingsDialog;
