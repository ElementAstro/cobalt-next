import { motion, AnimatePresence } from "framer-motion";

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
      y: ["0%", "-50%", "100%"],
      opacity: [0.5, 1, 0.5],
      scale: [0.8, 1.2, 1],
      transition: {
        duration: 1.2,
        ease: "easeInOut",
        times: [0, 0.5, 1],
      },
    },
  };

  const progressRingVariants = {
    hidden: { pathLength: 0, opacity: 0 },
    visible: {
      pathLength: progress / 100,
      opacity: 1,
      transition: {
        duration: 0.8,
        ease: [0.4, 0, 0.2, 1],
      },
    },
  };

  const pulseVariants = {
    initial: { scale: 1, opacity: 0.3 },
    animate: {
      scale: 1.2,
      opacity: 0,
      transition: {
        repeat: Infinity,
        duration: 2,
        ease: "easeOut",
      },
    },
  };

  const numberVariants = {
    initial: { opacity: 0, y: 10 },
    animate: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.4,
        ease: "easeOut",
      },
    },
    exit: {
      opacity: 0,
      y: -10,
      transition: {
        duration: 0.4,
        ease: "easeIn",
      },
    },
  };

  return (
    <div className="relative w-64 h-64 transform-gpu">
      {/* 脉冲动画背景 */}
      <motion.div
        className="absolute inset-0 rounded-full bg-blue-500/20"
        variants={pulseVariants}
        initial="initial"
        animate="animate"
      />

      <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
        {/* 背景圆环 */}
        <motion.circle
          cx="50"
          cy="50"
          r="45"
          fill="none"
          className="stroke-gray-700/50"
          strokeWidth="2"
          initial={{ opacity: 0.3 }}
          animate={{
            opacity: [0.3, 0.5, 0.3],
            transition: { duration: 2, repeat: Infinity },
          }}
        />

        {/* 渐变定义 */}
        <defs>
          <linearGradient
            id="progressGradient"
            x1="0%"
            y1="0%"
            x2="100%"
            y2="0%"
          >
            <stop offset="0%" stopColor="#60A5FA" />
            <stop offset="100%" stopColor="#3B82F6" />
          </linearGradient>
        </defs>

        {/* 进度圆环 */}
        <motion.circle
          cx="50"
          cy="50"
          r="45"
          fill="none"
          stroke="url(#progressGradient)"
          strokeWidth="3"
          strokeLinecap="round"
          variants={progressRingVariants}
          initial="hidden"
          animate="visible"
          style={{
            filter: "drop-shadow(0 0 6px rgba(59, 130, 246, 0.5))",
          }}
        />
      </svg>

      {/* 弹跳小球容器 */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="relative w-20 h-8">
          {[0, 1, 2].map((index) => (
            <motion.div
              key={index}
              className="absolute w-4 h-4 bg-gradient-to-br from-blue-400 to-blue-600
                rounded-full shadow-lg shadow-blue-500/50"
              variants={circleVariants}
              transition={{
                duration: 1.2,
                repeat: Infinity,
                ease: "easeInOut",
                delay: index * 0.2,
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

      {/* 进度百分比 */}
      <div className="absolute inset-0 flex items-center justify-center">
        <AnimatePresence mode="wait">
          <motion.span
            key={Math.round(progress)}
            variants={numberVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            className="text-2xl font-medium text-gray-200"
          >
            {Math.round(progress)}%
          </motion.span>
        </AnimatePresence>
      </div>
    </div>
  );
}
