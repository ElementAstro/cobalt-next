import { motion, AnimatePresence } from "framer-motion";

interface LoadingAnimationProps {
  progress: number;
}

export function LoadingAnimation({ progress }: LoadingAnimationProps) {
  // 3D Cube Animation
  const cubeVariants = {
    hidden: { rotateX: 0, rotateY: 0, opacity: 0 },
    visible: {
      rotateX: [0, 180, 360],
      rotateY: [0, 180, 360],
      opacity: 1,
      transition: {
        duration: 6,
        repeat: Infinity,
        ease: "linear",
      },
    },
  };

  // Particle Wave Animation
  const particleVariants = {
    hidden: { y: 0, opacity: 0 },
    visible: (i: number) => ({
      y: [0, -50, 0],
      opacity: [0, 1, 0],
      transition: {
        delay: i * 0.1,
        duration: 2,
        repeat: Infinity,
        ease: "easeInOut",
      },
    }),
  };

  // Enhanced Progress Ring
  const progressRingVariants = {
    hidden: { pathLength: 0, opacity: 0 },
    visible: {
      pathLength: progress / 100,
      opacity: 1,
      transition: {
        duration: 1,
        ease: [0.34, 1.56, 0.64, 1],
      },
    },
  };

  // Glowing Trail Effect
  const trailVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: [0, 0.8, 0],
      transition: {
        duration: 1.5,
        repeat: Infinity,
        ease: "easeInOut",
      },
    },
  };

  // Number Animation
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
      {/* 3D Cube Animation */}
      <motion.div
        className="absolute inset-0 flex items-center justify-center"
        variants={cubeVariants}
        initial="hidden"
        animate="visible"
      >
        <div className="w-20 h-20 perspective-1000">
          <motion.div
            className="w-full h-full bg-gradient-to-br from-blue-400 to-purple-600 rounded-lg shadow-2xl shadow-blue-500/50"
            style={{
              transformStyle: "preserve-3d",
            }}
          />
        </div>
      </motion.div>

      {/* Particle Wave Animation */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(30)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-blue-400 rounded-full"
            custom={i}
            variants={particleVariants}
            initial="hidden"
            animate="visible"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
          />
        ))}
      </div>

      {/* Progress Ring */}
      <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
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

        {/* Glowing Trail */}
        <motion.circle
          cx="50"
          cy="50"
          r="45"
          fill="none"
          stroke="url(#progressGradient)"
          strokeWidth="8"
          strokeLinecap="round"
          variants={trailVariants}
          initial="hidden"
          animate="visible"
          style={{
            filter: "url(#glow)",
            strokeDasharray: "10 100",
          }}
        />
      </svg>

      {/* Progress Percentage */}
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
