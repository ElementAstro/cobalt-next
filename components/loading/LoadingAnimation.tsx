import { motion } from "framer-motion";

interface LoadingAnimationProps {
  progress: number;
}

export function LoadingAnimation({ progress }: LoadingAnimationProps) {
  const circleVariants = {
    start: {
      y: "0%",
      opacity: 0.5,
      scale: 0.8,
    },
    end: {
      y: "100%",
      opacity: 1,
      scale: 1,
    },
  };

  const progressRingVariants = {
    hidden: { pathLength: 0, opacity: 0 },
    visible: {
      pathLength: progress / 100,
      opacity: 1,
      transition: { duration: 0.5, ease: "easeInOut" },
    },
  };

  return (
    <div className="relative w-64 h-64 transform-gpu">
      <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
        {/* 背景圆环 */}
        <circle
          cx="50"
          cy="50"
          r="45"
          fill="none"
          className="stroke-gray-700"
          strokeWidth="2"
        />
        {/* 进度圆环 */}
        <motion.circle
          cx="50"
          cy="50"
          r="45"
          fill="none"
          className="stroke-blue-500"
          strokeWidth="2"
          strokeLinecap="round"
          variants={progressRingVariants}
          initial="hidden"
          animate="visible"
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="relative w-20 h-8">
          {[0, 1, 2].map((index) => (
            <motion.div
              key={index}
              className="absolute w-4 h-4 bg-blue-500 rounded-full
                shadow-lg shadow-blue-500/50"
              variants={circleVariants}
              transition={{
                duration: 0.6,
                yoyo: Infinity,
                ease: "easeInOut",
                delay: index * 0.15,
              }}
              animate="end"
              initial="start"
              style={{
                left: `${index * 32}px`,
              }}
            />
          ))}
        </div>
      </div>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-2xl font-medium text-gray-200">
          {Math.round(progress)}%
        </span>
      </div>
    </div>
  );
}
