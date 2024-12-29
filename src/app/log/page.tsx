"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import LogFilters from "@/components/log/log-filters";
import LogActions from "@/components/log/log-actions";
import LogTabs from "@/components/log/log-tabs";

const LogPanel: React.FC = () => {
  return (
    <Card className="h-full flex flex-col overflow-hidden">
      <CardHeader className="px-4 py-2 border-b">
        <CardTitle className="text-lg font-semibold">日志面板</CardTitle>
      </CardHeader>
      <CardContent className="flex-1 p-0 overflow-hidden flex flex-col">
        <div className="p-2 space-y-2 border-b">
          <LogFilters />
          <LogActions />
        </div>
        <div className="flex-1 overflow-hidden">
          <LogTabs />
        </div>
      </CardContent>
    </Card>
  );
};

export default LogPanel;
