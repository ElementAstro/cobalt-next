import React, { useState, useEffect, useRef, useCallback } from "react";
import { motion } from "framer-motion";

interface NumberAnimationProps {
  active?: boolean;
  duration?: number;
  from?: number;
  locale?: string;
  precision?: number;
  showSeparator?: boolean;
  to?: number;
  onFinish?: () => void;
  easing?: (t: number) => number;
  format?: (value: number) => string;
  direction?: "forward" | "reverse";
  steps?: number;
  fromColor?: string;
  toColor?: string;
  bounce?: boolean;
  loop?: boolean | number;
  delay?: number;
  unit?: string;
}

const NumberAnimation: React.FC<NumberAnimationProps> & {
  play: () => void;
  pause: () => void;
  resume: () => void;
} = ({
  active = true,
  duration = 3000,
  from = 0,
  locale,
  precision = 0,
  showSeparator = false,
  to,
  onFinish,
  easing = (t) => t, // Linear easing by default
  format,
  direction = "forward",
  steps,
  fromColor,
  toColor,
  bounce = false,
  loop = false,
  delay = 0,
  unit = "",
}) => {
  const [currentValue, setCurrentValue] = useState(from);
  const [currentColor, setCurrentColor] = useState(fromColor);
  const animationRef = useRef<number | null>(null);
  const startTimeRef = useRef<number | null>(null);
  const pausedTimeRef = useRef<number | null>(null);
  const loopCountRef = useRef(0);

  const interpolateColor = (color1: string, color2: string, factor: number) => {
    if (!color1 || !color2) return "";
    const parse = (str: string) => str.match(/\d+/g)!.map(Number);
    const [r1, g1, b1] = parse(color1);
    const [r2, g2, b2] = parse(color2);
    const r = Math.round(r1 + factor * (r2 - r1));
    const g = Math.round(g1 + factor * (g2 - g1));
    const b = Math.round(b1 + factor * (b2 - b1));
    return `rgb(${r}, ${g}, ${b})`;
  };

  const animate = useCallback(
    (timestamp: number) => {
      if (!startTimeRef.current) {
        startTimeRef.current = timestamp;
      }

      const elapsedTime = pausedTimeRef.current
        ? timestamp -
          pausedTimeRef.current +
          (pausedTimeRef.current - startTimeRef.current)
        : timestamp - startTimeRef.current - delay;

      if (elapsedTime < 0) {
        animationRef.current = requestAnimationFrame(animate);
        return;
      }

      let progress = Math.min(elapsedTime / duration, 1);
      let easedProgress = easing(progress);

      if (bounce && progress >= 1) {
        easedProgress = 1 - easing(progress % 1);
      }

      let value: number;
      if (steps) {
        const stepSize = (to! - from) / steps;
        value = from + Math.round(easedProgress * steps) * stepSize;
      } else {
        value = from + (to! - from) * easedProgress;
      }

      if (direction === "reverse") {
        value = to! - (value - from);
      }

      setCurrentValue(value);

      if (fromColor && toColor) {
        setCurrentColor(interpolateColor(fromColor, toColor, easedProgress));
      }

      if (progress < 1 || (bounce && progress < 2)) {
        animationRef.current = requestAnimationFrame(animate);
      } else {
        if (typeof loop === "number" && loopCountRef.current < loop - 1) {
          loopCountRef.current++;
          startTimeRef.current = null;
          animationRef.current = requestAnimationFrame(animate);
        } else if (loop === true) {
          startTimeRef.current = null;
          animationRef.current = requestAnimationFrame(animate);
        } else if (onFinish) {
          onFinish();
        }
      }
    },
    [
      from,
      to,
      duration,
      onFinish,
      easing,
      direction,
      steps,
      fromColor,
      toColor,
      bounce,
      loop,
      delay,
    ]
  );

  const play = useCallback(() => {
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }
    startTimeRef.current = null;
    pausedTimeRef.current = null;
    loopCountRef.current = 0;
    animationRef.current = requestAnimationFrame(animate);
  }, [animate]);

  const pause = useCallback(() => {
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
      pausedTimeRef.current = performance.now();
    }
  }, []);

  const resume = useCallback(() => {
    if (pausedTimeRef.current) {
      animationRef.current = requestAnimationFrame(animate);
    }
  }, [animate]);

  useEffect(() => {
    if (active && to !== undefined) {
      play();
    }
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [active, to, play]);

  const formatNumber = (num: number) => {
    if (format) {
      return format(num);
    }

    const formatted = num.toFixed(precision);
    if (showSeparator) {
      const parts = formatted.split(".");
      parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
      return parts.join(".");
    }
    return formatted;
  };

  const formattedValue = React.useMemo(() => {
    let formatted: string;
    if (locale) {
      formatted = new Intl.NumberFormat(locale, {
        minimumFractionDigits: precision,
        maximumFractionDigits: precision,
      }).format(currentValue);
    } else {
      formatted = formatNumber(currentValue);
    }
    return `${formatted}${unit}`;
  }, [currentValue, locale, precision, showSeparator, format, unit]);

  return (
    <motion.span
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      style={{ color: currentColor }}
      className="number-animation"
    >
      {formattedValue}
    </motion.span>
  );
};

NumberAnimation.play = function () {
  console.warn(
    "This method should be called on the component instance, not the component itself."
  );
};

NumberAnimation.pause = function () {
  console.warn(
    "This method should be called on the component instance, not the component itself."
  );
};

NumberAnimation.resume = function () {
  console.warn(
    "This method should be called on the component instance, not the component itself."
  );
};

export default NumberAnimation;
