import { motion } from "framer-motion";

export function ChartLegend() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="flex flex-wrap gap-4 items-center mb-2 p-2"
    >
      <motion.div
        whileHover={{ scale: 1.05 }}
        className="flex items-center gap-2"
      >
        <div className="w-6 h-1 bg-green-500 rounded-full" />
        <span className="text-sm text-zinc-400 dark:text-zinc-300">HFD</span>
      </motion.div>
      <motion.div
        whileHover={{ scale: 1.05 }}
        className="flex items-center gap-2"
      >
        <div className="w-6 h-1 bg-blue-500 rounded-full" />
        <span className="text-sm text-zinc-400 dark:text-zinc-300">
          StarIndex
        </span>
      </motion.div>
    </motion.div>
  );
}
