"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { TargetSetHeader } from "@/components/sequencer/target-set-header";
import { TimelineGraph } from "@/components/sequencer/timeline-graph";
import { TargetControls } from "@/components/sequencer/target-controls";
import { AutofocusSettings } from "@/components/sequencer/autofocus-settings";
import { CoordinateData } from "@/types/sequencer";
import { useMediaQuery } from "react-responsive";
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

const containerVariants = {
  hidden: { opacity: 0, y: -50 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      staggerChildren: 0.2,
      duration: 0.5,
      ease: [0.16, 1, 0.3, 1],
    },
  },
  exit: {
    opacity: 0,
    y: 50,
    transition: {
      duration: 0.5,
      ease: [0.7, 0, 0.84, 0],
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 15,
    },
  },
};

const mobileContainerVariants = {
  hidden: { opacity: 0, x: -50 },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      staggerChildren: 0.1,
      duration: 0.3,
      ease: [0.16, 1, 0.3, 1],
    },
  },
  exit: {
    opacity: 0,
    x: 50,
    transition: {
      duration: 0.3,
      ease: [0.7, 0, 0.84, 0],
    },
  },
};

const SequencerEditor: React.FC<SequenceEditorProps> = ({ onClose }) => {
  const [coordinates, setCoordinates] =
    useState<CoordinateData>(initialCoordinates);
  const isMobile = useMediaQuery({ query: "(max-width: 768px)" });
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
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
        >
          <ScrollArea style={{ height: "100vh" }}>
            <div className="min-h-screen bg-gray-950 text-white">
              <div className="mx-auto">
                <div className="space-y-1">
                  <motion.div
                    variants={itemVariants}
                    className="flex justify-between items-center p-4"
                  >
                    <h1 className="text-xl font-semibold">Target Set</h1>
                    <div className="flex items-center gap-2">
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
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
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
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
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
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
                      </motion.button>
                    </div>
                  </motion.div>

                  <motion.div variants={itemVariants}>
                    <TargetSetHeader />
                  </motion.div>

                  {isMobile ? (
                    <motion.div variants={mobileContainerVariants}>
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button
                            variant="outline"
                            className="w-full my-2 bg-teal-500/10 border-teal-500/20 text-teal-400 hover:bg-teal-500/20 hover:text-teal-300 transition-colors"
                          >
                            View Timeline
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="w-screen h-screen max-w-none m-0 bg-gray-900 text-white">
                          <DialogHeader>
                            <DialogTitle className="text-teal-500 text-xl font-bold">
                              Timeline
                            </DialogTitle>
                          </DialogHeader>
                          <div className="h-[calc(100vh-120px)] p-4">
                            <div className="rounded-lg bg-gray-800/50 p-4">
                              <motion.div
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{
                                  duration: 0.3,
                                  ease: [0.16, 1, 0.3, 1],
                                }}
                              >
                                <TimelineGraph
                                  data={timelineData}
                                  height={400}
                                />
                              </motion.div>
                            </div>
                          </div>
                        </DialogContent>
                      </Dialog>
                    </motion.div>
                  ) : (
                    <motion.div
                      variants={itemVariants}
                      className="bg-gray-900/50 p-6 rounded-lg"
                    >
                      <div className="h-64">
                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{
                            duration: 0.5,
                            ease: [0.16, 1, 0.3, 1],
                          }}
                        >
                          <div className="rounded-lg bg-gray-800/50 p-4">
                            <TimelineGraph data={timelineData} height={200} />
                          </div>
                        </motion.div>
                      </div>
                    </motion.div>
                  )}

                  <motion.div
                    variants={itemVariants}
                    className="bg-gray-900/50 p-6 rounded-lg"
                  >
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 text-sm text-gray-400">
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
                  </motion.div>

                  <motion.div variants={itemVariants}>
                    <TargetControls />
                  </motion.div>
                  <motion.div variants={itemVariants}>
                    <AutofocusSettings />
                  </motion.div>
                </div>
              </div>
            </div>
          </ScrollArea>
        </motion.div>
      </AnimatePresence>
    </Dialog>
  );
};

export default SequencerEditor;
