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
      y: ["0%", "-80%", "100%"],
      opacity: [0.5, 1, 0.5],
      scale: [0.8, 1.4, 1],
      transition: {
        duration: 1.5,
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
        duration: 1,
        ease: [0.34, 1.56, 0.64, 1], // Custom spring curve
      },
    },
  };

  const pulseVariants = {
    initial: { scale: 1, opacity: 0.3 },
    animate: {
      scale: [1, 1.2, 1],
      opacity: [0.3, 0.1, 0.3],
      transition: {
        repeat: Infinity,
        duration: 3,
        ease: "easeInOut",
      },
    },
  };

  const numberVariants = {
    initial: { opacity: 0, y: 20, scale: 0.8 },
    animate: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.5,
        ease: [0.34, 1.56, 0.64, 1],
      },
    },
    exit: {
      opacity: 0,
      y: -20,
      scale: 0.8,
      transition: {
        duration: 0.4,
        ease: "easeIn",
      },
    },
  };

  return (
    <div className="relative w-64 h-64 transform-gpu">
      {/* 星空背景 */}
      <div className="absolute inset-0 overflow-hidden rounded-full">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-0.5 h-0.5 bg-blue-400 rounded-full"
            initial={{
              opacity: Math.random() * 0.5 + 0.25,
              scale: Math.random() * 0.5 + 0.5,
              x: Math.random() * 256,
              y: Math.random() * 256,
            }}
            animate={{
              opacity: [null, 0.8, 0.2],
              scale: [null, 1.2, 0.8],
            }}
            transition={{
              duration: 2 + Math.random() * 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>

      {/* 脉冲动画背景 */}
      {[0, 1, 2].map((i) => (
        <motion.div
          key={i}
          className="absolute inset-0 rounded-full bg-blue-500/10"
          variants={pulseVariants}
          initial="initial"
          animate="animate"
          style={{
            animationDelay: `${i * 0.5}s`,
          }}
        />
      ))}

      <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
        {/* 背景圆环 */}
        <circle
          cx="50"
          cy="50"
          r="45"
          fill="none"
          className="stroke-gray-700/30"
          strokeWidth="4"
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
            <stop offset="50%" stopColor="#3B82F6" />
            <stop offset="100%" stopColor="#2563EB" />
          </linearGradient>
          <filter id="glow">
            <feGaussianBlur stdDeviation="2" result="blur" />
            <feFlood floodColor="#3B82F6" floodOpacity="0.5" />
            <feComposite in2="blur" operator="in" />
            <feMerge>
              <feMergeNode />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* 进度圆环 */}
        <motion.circle
          cx="50"
          cy="50"
          r="45"
          fill="none"
          stroke="url(#progressGradient)"
          strokeWidth="4"
          strokeLinecap="round"
          variants={progressRingVariants}
          initial="hidden"
          animate="visible"
          style={{
            filter: "url(#glow)",
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
                duration: 1.5,
                repeat: Infinity,
                ease: "easeInOut",
                delay: index * 0.25,
              }}
              animate="end"
              initial="start"
              style={{
                left: `${index * 32}px`,
                filter: "drop-shadow(0 0 8px rgba(59, 130, 246, 0.5))",
              }}
            />
          ))}
        </div>
      </div>

      {/* 进度百分比 */}
      <div className="absolute inset-0 flex items-center justify-center">
        <AnimatePresence mode="wait">
          <motion.div
            key={Math.round(progress)}
            variants={numberVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            className="flex flex-col items-center"
          >
            <motion.span
              className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-blue-600"
              style={{
                textShadow: "0 0 20px rgba(59, 130, 246, 0.5)",
              }}
            >
              {Math.round(progress)}%
            </motion.span>
            <motion.span className="text-xs text-blue-300 mt-1 opacity-80">
              正在加载...
            </motion.span>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
