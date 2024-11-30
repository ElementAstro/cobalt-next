"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function TargetControls() {
  const [delayStart, setDelayStart] = useState("0");
  const [sequenceMode, setSequenceMode] = useState("one-after-another");
  const [estimatedDownload, setEstimatedDownload] = useState("00:00:00");
  const [startTime, setStartTime] = useState("15:39:51");
  const [endTime, setEndTime] = useState("15:39:52");
  const [duration, setDuration] = useState("01s");

  return (
    <div className="space-y-6 bg-gray-900/50 p-4 rounded-lg border border-gray-800">
      <div className="grid gap-6 md:grid-cols-3">
        <div>
          <Label htmlFor="delay-start" className="text-sm text-gray-400">
            Delay start
          </Label>
          <div className="flex items-center gap-2">
            <Input
              id="delay-start"
              type="number"
              value={delayStart}
              onChange={(e) => setDelayStart(e.target.value)}
              className="w-20 bg-gray-800 border-gray-700 text-white"
            />
            <span className="text-gray-400">s</span>
          </div>
        </div>
        <div>
          <Label htmlFor="sequence-mode" className="text-sm text-gray-400">
            Sequence mode
          </Label>
          <Select value={sequenceMode} onValueChange={setSequenceMode}>
            <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-gray-800 border-gray-700 text-white">
              <SelectItem value="one-after-another">
                One after another
              </SelectItem>
              <SelectItem value="simultaneous">Simultaneous</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label className="text-sm text-gray-400">
            Estimated download time
          </Label>
          <div className="text-white">{estimatedDownload}</div>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <Label className="text-sm text-gray-400">Estimated finish time</Label>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="text-xs text-gray-500">From</div>
              <Input
                type="time"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                className="bg-gray-800 border-gray-700 text-white"
              />
            </div>
            <div>
              <div className="text-xs text-gray-500">To</div>
              <Input
                type="time"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                className="bg-gray-800 border-gray-700 text-white"
              />
            </div>
          </div>
          <div className="mt-2 text-sm text-gray-400">Duration: {duration}</div>
        </div>
      </div>
    </div>
  );
}
