"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";

interface ClockProps {
  darkMode?: boolean;
}

export const Clock: React.FC<ClockProps> = ({ darkMode = false }) => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date());
    }, 1000);

    return () => {
      clearInterval(timer);
    };
  }, []);

  const seconds = time.getSeconds();
  const minutes = time.getMinutes();
  const hours = time.getHours() % 12;

  return (
    <div
      className={`relative w-64 h-64 md:w-80 md:h-80 rounded-full ${
        darkMode ? "bg-gray-800" : "bg-white"
      } shadow-lg mx-auto`}
    >
      {/* Clock face */}
      <div
        className={`absolute inset-0 ${
          darkMode ? "text-white" : "text-gray-800"
        }`}
      >
        {[...Array(12)].map((_, i) => (
          <div
            key={i}
            className="absolute w-full h-full text-center"
            style={{ transform: `rotate(${i * 30}deg)` }}
          >
            <span
              className="inline-block"
              style={{ transform: `rotate(-${i * 30}deg)` }}
            >
              {i === 0 ? "12" : i}
            </span>
          </div>
        ))}
      </div>

      {/* Hour hand */}
      <motion.div
        className={`absolute w-1 h-16 md:h-20 ${
          darkMode ? "bg-white" : "bg-gray-800"
        } rounded-full origin-bottom`}
        style={{
          top: "25%",
          left: "calc(50% - 0.5px)",
          transformOrigin: "50% 100%",
        }}
        animate={{ rotate: hours * 30 + minutes * 0.5 }}
        transition={{ type: "spring", stiffness: 50, damping: 15 }}
      />

      {/* Minute hand */}
      <motion.div
        className={`absolute w-1 h-24 md:h-28 ${
          darkMode ? "bg-white" : "bg-gray-800"
        } rounded-full origin-bottom`}
        style={{
          top: "10%",
          left: "calc(50% - 0.5px)",
          transformOrigin: "50% 100%",
        }}
        animate={{ rotate: minutes * 6 }}
        transition={{ type: "spring", stiffness: 50, damping: 15 }}
      />

      {/* Second hand */}
      <motion.div
        className="absolute w-0.5 h-28 md:h-32 bg-red-500 rounded-full origin-bottom"
        style={{
          top: "6%",
          left: "calc(50% - 0.25px)",
          transformOrigin: "50% 100%",
        }}
        animate={{ rotate: seconds * 6 }}
        transition={{ type: "spring", stiffness: 300, damping: 10 }}
      />

      {/* Center dot */}
      <div
        className={`absolute w-3 h-3 md:w-4 md:h-4 rounded-full ${
          darkMode ? "bg-white" : "bg-gray-800"
        } top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2`}
      />

      {/* Digital time and date display */}
      <div
        className={`absolute bottom-12 md:bottom-16 left-0 right-0 text-center ${
          darkMode ? "text-white" : "text-gray-800"
        }`}
      >
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="text-xl md:text-2xl font-bold"
        >
          {time.toLocaleTimeString()}
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="text-sm md:text-base"
        >
          {time.toLocaleDateString()}
        </motion.div>
      </div>
    </div>
  );
};
