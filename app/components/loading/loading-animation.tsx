import { motion } from "framer-motion";

interface LoadingAnimationProps {
  progress: number;
}

export function LoadingAnimation({ progress }: LoadingAnimationProps) {
  const circleVariants = {
    start: {
      y: "0%",
    },
    end: {
      y: "100%",
    },
  };

  const circleTransition = {
    duration: 0.5,
    yoyo: Infinity,
    ease: "easeInOut",
  };

  return (
    <div className="relative w-64 h-64">
      <svg className="w-full h-full" viewBox="0 0 100 100">
        <motion.circle
          cx="50"
          cy="50"
          r="45"
          fill="none"
          stroke="#ffffff"
          strokeWidth="2"
          strokeDasharray="283"
          strokeDashoffset="283"
          animate={{ strokeDashoffset: 283 - (progress / 100) * 283 }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="relative w-16 h-16">
          {[0, 1, 2].map((index) => (
            <motion.div
              key={index}
              className="absolute w-4 h-4 bg-white rounded-full"
              variants={circleVariants}
              transition={{
                ...circleTransition,
                delay: index * 0.15,
              }}
              animate="end"
              initial="start"
              style={{
                left: `${index * 24}px`,
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
