"use client";

import React, { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area"
import { TargetSetHeader } from "./sequencer/target-set-header";
import { TimelineGraph } from "./sequencer/timeline-graph";
import { TargetControls } from "./sequencer/target-controls";
import { AutofocusSettings } from "./sequencer/autofocus-settings";
import { CoordinateData } from "@/types/sequencer";
import { useMediaQuery } from "@/hooks/use-media-query";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { motion, AnimatePresence } from "framer-motion";

const timelineData = Array.from({ length: 24 }, (_, i) => ({
  time: i.toString().padStart(2, "0"),
  value: i >= 3 && i <= 6 ? 90 : 30,
}));

const initialCoordinates: CoordinateData = {
  ra: { h: 0, m: 0, s: 0 },
  dec: { d: 0, m: 0, s: 0 },
  rotation: 0,
};

interface SequenceEditorProps {
  onClose: () => void;
}

const SequencerEditor: React.FC<SequenceEditorProps> = ({ onClose }) => {
  const [coordinates, setCoordinates] =
    useState<CoordinateData>(initialCoordinates);
  const isMobile = useMediaQuery("(max-width: 768px)");
  const [open, setOpen] = useState(true);

  return (
    <Dialog
      open={open}
      onOpenChange={(isOpen) => {
        setOpen(isOpen);
        if (!isOpen) {
          onClose();
        }
      }}
    >
      <AnimatePresence>
        <ScrollArea style={{ height: '100vh' }}>
          <div className="min-h-screen bg-gray-950 text-white">
            <div className="max-w-7xl mx-auto">
              <div className="space-y-1">
                <div className="flex justify-between items-center p-4">
                  <h1 className="text-xl font-semibold">Target Set</h1>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="icon"
                      className="bg-teal-500/10 border-teal-500/20"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="w-4 h-4"
                      >
                        <polyline points="15 18 9 12 15 6"></polyline>
                      </svg>
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      className="bg-teal-500/10 border-teal-500/20"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="w-4 h-4"
                      >
                        <polyline points="9 18 15 12 9 6"></polyline>
                      </svg>
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      className="bg-teal-500/10 border-teal-500/20"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="w-4 h-4"
                      >
                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                        <polyline points="17 8 12 3 7 8"></polyline>
                        <line x1="12" y1="3" x2="12" y2="15"></line>
                      </svg>
                    </Button>
                  </div>
                </div>

                <TargetSetHeader />

                {isMobile ? (
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button
                        variant="outline"
                        className="w-full my-2 bg-gray-800 text-white border-gray-700 hover:bg-gray-700"
                      >
                        View Timeline
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="w-screen h-screen max-w-none m-0 bg-gray-900 text-white">
                      <DialogHeader>
                        <DialogTitle className="text-teal-500">
                          Timeline
                        </DialogTitle>
                      </DialogHeader>
                      <div className="h-48 mb-4">
                        <TimelineGraph data={timelineData} height={200} />
                      </div>
                    </DialogContent>
                  </Dialog>
                ) : (
                  <div className="bg-gray-900/50 p-4">
                    <div className="h-48 mb-4">
                      <TimelineGraph data={timelineData} height={200} />
                    </div>
                  </div>
                )}

                <div className="bg-gray-900/50 p-4">
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm text-gray-400">
                    <div>
                      <div>RA</div>
                      <div className="text-white">{`${coordinates.ra.h}h ${
                        coordinates.ra.m
                      }m ${coordinates.ra.s.toFixed(1)}s`}</div>
                    </div>
                    <div>
                      <div>Dec</div>
                      <div className="text-white">{`${coordinates.dec.d}d ${
                        coordinates.dec.m
                      }m ${coordinates.dec.s.toFixed(1)}s`}</div>
                    </div>
                    <div>
                      <div>Rotation</div>
                      <div className="text-white">{`${coordinates.rotation}°`}</div>
                    </div>
                    <div className="text-right">
                      <div>Now</div>
                      <div className="text-white">15:39:51</div>
                    </div>
                  </div>
                </div>

                <TargetControls />
                <AutofocusSettings />
              </div>
            </div>
          </div>
        </ScrollArea>
      </AnimatePresence>
    </Dialog>
  );
};

export default SequencerEditor;