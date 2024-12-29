import { useState, useCallback, useEffect } from "react";

const MIN_EXPOSURE = -6; // 1/64 second
const MAX_EXPOSURE = 6; // 64 seconds
const PRESET_VALUES = [-4, -2, 0, 2, 4]; // 1/16s, 1/4s, 1s, 4s, 16s

export function useExposureTime(initialValue: number = 0) {
  const [exposureValue, setExposureValue] = useState(initialValue);
  const [isAnimating, setIsAnimating] = useState(false);

  const handleExposureChange = useCallback((newValue: number) => {
    setExposureValue(Math.min(Math.max(newValue, MIN_EXPOSURE), MAX_EXPOSURE));
  }, []);

  const animateToValue = useCallback(
    (targetValue: number) => {
      setIsAnimating(true);
      const startValue = exposureValue;
      const startTime = performance.now();
      const duration = 500; // Animation duration in milliseconds

      const animate = (currentTime: number) => {
        const elapsedTime = currentTime - startTime;
        if (elapsedTime < duration) {
          const progress = elapsedTime / duration;
          const easedProgress = 0.5 - Math.cos(progress * Math.PI) / 2; // Easing function
          const newValue =
            startValue + (targetValue - startValue) * easedProgress;
          setExposureValue(newValue);
          requestAnimationFrame(animate);
        } else {
          setExposureValue(targetValue);
          setIsAnimating(false);
        }
      };

      requestAnimationFrame(animate);
    },
    [exposureValue]
  );

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "ArrowLeft") {
        animateToValue(Math.max(exposureValue - 0.3, MIN_EXPOSURE));
      } else if (event.key === "ArrowRight") {
        animateToValue(Math.min(exposureValue + 0.3, MAX_EXPOSURE));
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [exposureValue, animateToValue]);

  return {
    exposureValue,
    handleExposureChange,
    animateToValue,
    isAnimating,
    MIN_EXPOSURE,
    MAX_EXPOSURE,
    PRESET_VALUES,
  };
}
