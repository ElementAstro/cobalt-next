"use client";

import {
  useState,
  useEffect,
  useDeferredValue,
  startTransition,
  useMemo,
  useCallback,
} from "react";
import { motion, useAnimation, useMotionValue } from "framer-motion";
import { MouseFollowerProps } from "@/types/home";

export default function MouseFollower({
  color = "#3b82f6",
  size = 24,
  blur = 0,
  trail = 5,
  trailColor = "rgba(59, 130, 246, 0.5)",
  trailBlur = 5,
  animationDuration = 0.2,
  animationType = "spring",
  springStiffness = 500,
  springDamping = 28,
  scaleOnTouch = true,
  rotateOnMove = true,
}: MouseFollowerProps) {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const deferredMousePosition = useDeferredValue(mousePosition);
  const [trailPositions, setTrailPositions] = useState<
    { x: number; y: number }[]
  >([]);
  const [isTouching, setIsTouching] = useState(false);

  const cursorX = useMotionValue(0);
  const cursorY = useMotionValue(0);
  const cursorControls = useAnimation();

  useEffect(() => {
    const handleMouseMove = useCallback(
      (e: MouseEvent | TouchEvent) => {
        let clientX, clientY;
        if ("touches" in e) {
          clientX = e.touches[0].clientX;
          clientY = e.touches[0].clientY;
        } else {
          clientX = e.clientX;
          clientY = e.clientY;
        }
        startTransition(() => {
          setMousePosition({ x: clientX, y: clientY });
        });
        cursorX.set(clientX);
        cursorY.set(clientY);
      },
      [cursorX, cursorY]
    );

    const handleTouchStart = () => setIsTouching(true);
    const handleTouchEnd = () => setIsTouching(false);

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("touchmove", handleMouseMove);
    window.addEventListener("touchstart", handleTouchStart);
    window.addEventListener("touchend", handleTouchEnd);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("touchmove", handleMouseMove);
      window.removeEventListener("touchstart", handleTouchStart);
      window.removeEventListener("touchend", handleTouchEnd);
    };
  }, [cursorX, cursorY]);

  const trailPositionsMemo = useMemo(() => {
    const newPositions = [
      deferredMousePosition,
      ...trailPositions.slice(0, trail - 1),
    ];
    return newPositions;
  }, [deferredMousePosition, trail, trailPositions]);

  useEffect(() => {
    startTransition(() => {
      setTrailPositions(trailPositionsMemo);
    });

    if (rotateOnMove) {
      const angle = Math.atan2(
        deferredMousePosition.y - cursorY.get(),
        deferredMousePosition.x - cursorX.get()
      );
      cursorControls.start({ rotate: angle * (180 / Math.PI) });
    }
  }, [
    trailPositionsMemo,
    rotateOnMove,
    cursorControls,
    cursorX,
    cursorY,
    deferredMousePosition,
  ]);

  return (
    <>
      {trailPositionsMemo.map((position, index) => (
        <motion.div
          key={index}
          className="fixed top-0 left-0 rounded-full pointer-events-none mix-blend-difference"
          style={{
            backgroundColor: index === 0 ? color : trailColor,
            width: size,
            height: size,
            filter: `blur(${index === 0 ? blur : trailBlur}px)`,
            opacity: 1 - index / trail,
            x: position.x - size / 2,
            y: position.y - size / 2,
          }}
          animate={index === 0 ? cursorControls : undefined}
          transition={
            animationType === "spring"
              ? {
                  type: "spring",
                  stiffness: springStiffness,
                  damping: springDamping,
                }
              : { type: "tween", duration: animationDuration }
          }
        >
          {index === 0 && scaleOnTouch && (
            <motion.div
              className="w-full h-full rounded-full"
              animate={{ scale: isTouching ? 1.5 : 1 }}
              transition={{ duration: 0.2 }}
            />
          )}
        </motion.div>
      ))}
    </>
  );
}
