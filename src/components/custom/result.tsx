import React, { useState } from "react";
import { motion, AnimatePresence, Variants } from "framer-motion";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

interface ResultProps {
  status:
    | "info"
    | "success"
    | "warning"
    | "error"
    | "404"
    | "403"
    | "500"
    | "418"
    | "loading"
    | "disabled"
    | "neutral"
    | "custom";
  title: string;
  description: string;
  size?: "small" | "medium" | "large" | "huge";
  footer?: React.ReactNode;
  icon?: React.ReactNode;
  color?: string;
  onAction?: () => void;
  animationPreset?: "fade" | "slide" | "bounce" | "custom";
  customAnimation?: Variants;
  interactive?: boolean;
  details?: string;
  className?: string;
  style?: React.CSSProperties;
  header?: React.ReactNode;
  footerPosition?: "top" | "bottom";
  mobileView?: "compact" | "full";
  alignment?: "left" | "center" | "right";
  mobileLayout?: "card" | "list";
}

const defaultIcons: Record<ResultProps["status"], string> = {
  info: "ℹ️",
  success: "✅",
  warning: "⚠️",
  error: "❌",
  "404": "🔍",
  "403": "🚫",
  "500": "💥",
  "418": "🫖",
  loading: "⏳",
  disabled: "🚧",
  neutral: "⚪",
  custom: "✨",
};

const defaultColors: Record<ResultProps["status"], string> = {
  info: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100",
  success: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100",
  warning:
    "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100",
  error: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100",
  "404":
    "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-100",
  "403":
    "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-100",
  "500": "bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-100",
  "418":
    "bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-100",
  loading: "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-100",
  disabled: "bg-gray-200 text-gray-800 dark:bg-gray-800 dark:text-gray-200",
  neutral: "bg-white text-gray-800 dark:bg-gray-950 dark:text-gray-100",
  custom: "bg-gradient-to-r from-pink-500 to-purple-500 text-white",
};

const animationPresets: Record<string, Variants> = {
  fade: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
  },
  slide: {
    initial: { x: -100, opacity: 0 },
    animate: { x: 0, opacity: 1 },
    exit: { x: 100, opacity: 0 },
  },
  bounce: {
    initial: { scale: 0 },
    animate: { scale: 1 },
    exit: { scale: 0 },
    transition: {
      type: "spring",
    },
  },
  zoom: {
    initial: { scale: 0.5, opacity: 0 },
    animate: {
      scale: 1,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 20,
      },
    },
    exit: {
      scale: 0.5,
      opacity: 0,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 20,
      },
    },
  },
  flip: {
    initial: { rotateY: 90, opacity: 0 },
    animate: {
      rotateY: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 260,
        damping: 20,
      },
    },
    exit: {
      rotateY: -90,
      opacity: 0,
      transition: {
        type: "spring",
        stiffness: 260,
        damping: 20,
      },
    },
  },
  float: {
    initial: { y: 20, opacity: 0 },
    animate: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 200,
        damping: 15,
      },
    },
    exit: {
      y: -20,
      opacity: 0,
      transition: {
        type: "spring",
        stiffness: 200,
        damping: 15,
      },
    },
  },
};

export function Result({
  status,
  title,
  description,
  size = "medium",
  footer,
  icon,
  color,
  onAction,
  animationPreset = "fade",
  customAnimation,
  interactive = false,
  details,
  className = "",
  style = {},
  header,
  footerPosition = "bottom",
  mobileView = "full",
  alignment = "center",
  mobileLayout = "card",
}: ResultProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isVisible, setIsVisible] = useState(true);

  const sizeClasses = {
    small: "text-lg",
    medium: "text-xl",
    large: "text-2xl",
    huge: "text-4xl",
  };

  const colorClass = color || defaultColors[status];
  const animation = customAnimation || animationPresets[animationPreset];

  const containerClasses = cn(
    "relative flex flex-col p-6 rounded-lg shadow-lg",
    "transition-all duration-300",
    {
      "items-start text-left": alignment === "left",
      "items-center text-center": alignment === "center",
      "items-end text-right": alignment === "right",
      "p-4": mobileView === "compact",
      [colorClass]: true,
      "cursor-pointer": interactive,
      "dark:shadow-gray-800": true,
      [className]: true,
      "md:p-6": true,
      "flex-row items-center gap-4":
        mobileLayout === "list" && window.innerWidth < 768,
    }
  );

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          {...animation}
          className={containerClasses}
          style={style}
          onClick={() => interactive && setIsExpanded(!isExpanded)}
          onMouseEnter={() => interactive && setIsHovered(true)}
          onMouseLeave={() => interactive && setIsHovered(false)}
        >
          <button
            className="absolute top-2 right-2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
            onClick={() => setIsVisible(false)}
          >
            <X className="w-4 h-4" />
          </button>
          {header && <div className="mb-4">{header}</div>}
          <motion.div
            className={`mb-4 ${sizeClasses[size]} flex items-center justify-center`}
            animate={isHovered ? { scale: 1.1 } : { scale: 1 }}
          >
            {icon || defaultIcons[status]}
          </motion.div>
          <motion.h2
            className={`font-bold mb-2 ${sizeClasses[size]}`}
            animate={isHovered ? { y: -5 } : { y: 0 }}
          >
            {title}
          </motion.h2>
          <motion.p
            className="text-gray-600 dark:text-gray-300 mb-4"
            animate={isHovered ? { y: -3 } : { y: 0 }}
          >
            {description}
          </motion.p>
          <AnimatePresence>
            {isExpanded && details && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="text-sm text-gray-500 dark:text-gray-400 mt-2 overflow-hidden"
              >
                {details}
              </motion.div>
            )}
          </AnimatePresence>
          {footer && footerPosition === "bottom" && (
            <motion.div
              className="mt-4"
              animate={isHovered ? { y: -2 } : { y: 0 }}
            >
              {footer}
            </motion.div>
          )}
          {onAction && (
            <motion.div
              className="mt-4"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button
                onClick={(e) => {
                  e.stopPropagation();
                  onAction();
                }}
              >
                执行操作
              </Button>
            </motion.div>
          )}
          {interactive && details && (
            <motion.div
              className="mt-4"
              animate={isHovered ? { y: -2 } : { y: 0 }}
            >
              <Button
                onClick={(e) => {
                  e.stopPropagation();
                  setIsExpanded(!isExpanded);
                }}
              >
                {isExpanded ? "收起详情" : "查看详情"}
              </Button>
            </motion.div>
          )}
          {footer && footerPosition === "top" && (
            <motion.div
              className="mt-4"
              animate={isHovered ? { y: -2 } : { y: 0 }}
            >
              {footer}
            </motion.div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export function InfoContent() {
  const [count, setCount] = useState(0);
  return (
    <Result
      status="info"
      title="信息"
      description="在这个年代，信息就是金钱，金钱就是信息。"
      footer={
        <Button onClick={() => setCount(count + 1)}>
          我需要信息 ({count})
        </Button>
      }
      onAction={() => alert("执行信息操作！")}
      animationPreset="slide"
      interactive
      details="这是一些额外的信息，可以通过点击卡片或'查看详情'按钮来查看。"
      header={<div className="text-lg">自定义头部内容</div>}
      footerPosition="bottom"
      className="max-w-md mx-auto"
    />
  );
}

export function SizeContent() {
  const [size, setSize] = useState<"small" | "medium" | "large" | "huge">(
    "huge"
  );
  return (
    <Result
      status="404"
      title="大！大！啊"
      description="这么大"
      size={size}
      footer={
        <div className="space-x-2">
          <Button onClick={() => setSize("small")}>小</Button>
          <Button onClick={() => setSize("medium")}>中</Button>
          <Button onClick={() => setSize("large")}>大</Button>
          <Button onClick={() => setSize("huge")}>特大</Button>
        </div>
      }
      animationPreset="bounce"
      footerPosition="top"
      className="max-w-lg mx-auto"
    />
  );
}

export function SuccessContent() {
  const [showConfetti, setShowConfetti] = useState(false);
  return (
    <div className="relative">
      <Result
        status="success"
        title="成功"
        description="操作已成功完成！"
        footer={<Button onClick={() => setShowConfetti(true)}>显示庆祝</Button>}
        interactive
        details="成功并不意味着结束，失败也不意味着终止。重要的是继续前进的勇气。"
        animationPreset="fade"
      />
      {showConfetti && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 pointer-events-none"
        >
          {[...Array(100)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 bg-yellow-500 dark:bg-yellow-300 rounded-full"
              initial={{
                top: "50%",
                left: "50%",
              }}
              animate={{
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                opacity: 0,
              }}
              transition={{ duration: 2, delay: i * 0.05 }}
            />
          ))}
        </motion.div>
      )}
    </div>
  );
}

export function TeapotContent() {
  const [isPouring, setIsPouring] = useState(false);
  return (
    <Result
      status="418"
      title="418 我是个杯具"
      description="一切尽在不言中"
      icon={
        <motion.div
          animate={{ rotate: isPouring ? 45 : 0 }}
          transition={{ type: "spring", stiffness: 260, damping: 20 }}
        >
          🫖
        </motion.div>
      }
      footer={<Button onClick={() => setIsPouring(!isPouring)}>倒茶</Button>}
      animationPreset="bounce"
      className="max-w-sm mx-auto"
    />
  );
}

export function ErrorContent() {
  const [shake, setShake] = useState(false);
  return (
    <motion.div
      animate={shake ? { x: [-10, 10, -10, 10, 0] } : {}}
      transition={{ duration: 0.4 }}
    >
      <Result
        status="error"
        title="错误"
        description="发生了一个错误"
        footer={<Button onClick={() => setShake(true)}>摇一摇</Button>}
        interactive
        details="错误是常态，完美是稀有的。不要因为犯错而气馁，而要从错误中学习。"
        animationPreset="slide"
      />
    </motion.div>
  );
}

export function ForbiddenContent() {
  return (
    <Result
      status="403"
      title="403 禁止访问"
      description="总有些门是对你关闭的"
      footer={<Button>放轻松</Button>}
      color="bg-red-200 text-red-800 dark:bg-red-900 dark:text-red-100"
      animationPreset="slide"
      footerPosition="top"
      className="max-w-md mx-auto"
    />
  );
}

export function CustomIconContent() {
  const [isExpanded, setIsExpanded] = useState(false);
  return (
    <Result
      status="info"
      title="如何成功"
      description="写好报告，搞乱项目，增本降效，做大蛋糕"
      icon={
        <motion.div
          className="w-12 h-12 text-sm overflow-hidden"
          animate={{ height: isExpanded ? "auto" : "48px" }}
        >
          底层逻辑是打通信息屏障，创建行业新生态。顶层设计时聚焦用户感知赛道，通过差异化和颗粒度达到引爆点。交付价值是在垂直领域采取复用大发达成持久收益。抽离透传归因分析作为抓手为产品赋能，体验度量作为闭环的评判标准。亮点是载体，优势是链路。思考整个生命周期，完善逻辑考虑资源倾斜。方法论是组合拳达到平台化标准。
        </motion.div>
      }
      footer={
        <Button onClick={() => setIsExpanded(!isExpanded)}>
          {isExpanded ? "收起" : "展开"}
        </Button>
      }
      animationPreset="fade"
      className="max-w-xl mx-auto"
    />
  );
}

export function ServerErrorContent() {
  const [isRaining, setIsRaining] = useState(false);
  return (
    <div className="relative">
      <Result
        status="500"
        title="500 服务器错误"
        description="服务器出错可能需要更多程序员"
        footer={
          <Button onClick={() => setIsRaining(!isRaining)}>散财消灾</Button>
        }
        interactive
        details="服务器错误可能由多种原因引起，包括但不限于：代码错误、服务器过载、数据库问题等。请联系技术支持以获取更多信息。"
        animationPreset="bounce"
      />
      {isRaining && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 pointer-events-none"
        >
          {[...Array(100)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-4 bg-blue-500 dark:bg-blue-300 rounded-full"
              initial={{
                top: "-10%",
                left: `${Math.random() * 100}%`,
              }}
              animate={{
                top: "110%",
              }}
              transition={{ duration: 1, delay: i * 0.02, repeat: Infinity }}
            />
          ))}
        </motion.div>
      )}
    </div>
  );
}

export function NotFoundContent() {
  const [isSearching, setIsSearching] = useState(false);
  return (
    <Result
      status="404"
      title="404 资源不存在"
      description="生活总归带点荒谬"
      icon={
        <motion.div
          animate={{ rotate: isSearching ? 360 : 0 }}
          transition={{
            duration: 2,
            repeat: isSearching ? Infinity : 0,
            ease: "linear",
          }}
        >
          🔍
        </motion.div>
      }
      footer={
        <Button onClick={() => setIsSearching(!isSearching)}>
          {isSearching ? "停止搜索" : "开始搜索"}
        </Button>
      }
      animationPreset="slide"
      className="max-w-md mx-auto"
    />
  );
}

export function ResponsiveContent() {
  return (
    <div className="space-y-4">
      <Result
        status="info"
        title="响应式布局"
        description="自动适应不同屏幕尺寸"
        mobileLayout="list"
        alignment="left"
        footer={
          <div className="flex gap-2">
            <Button size="sm">确认</Button>
            <Button size="sm" variant="outline">
              取消
            </Button>
          </div>
        }
      />

      <Result
        status="success"
        title="紧凑视图"
        description="适合移动端显示"
        mobileView="compact"
        footer={<Button size="sm">了解更多</Button>}
      />
    </div>
  );
}

export function AnimatedContent() {
  return (
    <Result
      status="info"
      title="动画效果"
      description="丰富的动画交互"
      animationPreset="custom"
      customAnimation={{
        initial: { scale: 0, rotate: -180 },
        animate: {
          scale: 1,
          rotate: 0,
          transition: {
            type: "spring",
            stiffness: 260,
            damping: 20,
          },
        },
        exit: {
          scale: 0,
          rotate: 180,
        },
      }}
      footer={
        <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
          <Button>点击交互</Button>
        </motion.div>
      }
    />
  );
}

export function GroupContent() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      <Result
        status="success"
        title="成功"
        description="操作成功完成"
        mobileLayout="list"
      />
      <Result
        status="warning"
        title="警告"
        description="请注意潜在问题"
        mobileLayout="list"
      />
      <Result
        status="error"
        title="错误"
        description="操作失败"
        mobileLayout="list"
      />
    </div>
  );
}
