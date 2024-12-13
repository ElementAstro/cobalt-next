import { useState, useCallback, useRef } from "react";

interface Touch {
  identifier: number;
  clientX: number;
  clientY: number;
}

interface GestureState {
  startX: number;
  startY: number;
  isDragging: boolean;
  deltaX: number;
  deltaY: number;
  velocityX: number;
  velocityY: number;
  scale: number;
  rotation: number;
  lastTap: number;
  touchCount: number;
  initialDistance?: number; // Added optional properties
  initialAngle?: number; // Added optional properties
}

type GestureHandler = (state: GestureState) => void;

interface GestureHandlers {
  onSwipeLeft?: GestureHandler;
  onSwipeRight?: GestureHandler;
  onSwipeUp?: GestureHandler;
  onSwipeDown?: GestureHandler;
  onPinch?: GestureHandler;
  onRotate?: GestureHandler;
  onDoubleTap?: GestureHandler;
  onLongPress?: GestureHandler;
  onMultiTap?: (touchCount: number) => void;
  [key: string]: GestureHandler | ((touchCount: number) => void) | undefined;
}

export function useGesture(handlers: GestureHandlers, threshold = 50) {
  const [gesture, setGesture] = useState<GestureState>({
    startX: 0,
    startY: 0,
    isDragging: false,
    deltaX: 0,
    deltaY: 0,
    velocityX: 0,
    velocityY: 0,
    scale: 1,
    rotation: 0,
    lastTap: 0,
    touchCount: 0,
  });

  const lastUpdateTime = useRef(0);
  const touchesRef = useRef<Touch[]>([]);
  const longPressTimerRef = useRef<number | null>(null);

  const handleGestureStart = useCallback(
    (clientX: number, clientY: number, touchCount: number) => {
      setGesture((prev) => ({
        ...prev,
        startX: clientX,
        startY: clientY,
        isDragging: true,
        touchCount,
      }));
      lastUpdateTime.current = Date.now();

      // Start long press timer
      longPressTimerRef.current = window.setTimeout(() => {
        handlers.onLongPress?.(gesture);
      }, 500);
    },
    [handlers, gesture]
  );

  const handleGestureMove = useCallback((clientX: number, clientY: number) => {
    setGesture((prev) => {
      if (!prev.isDragging) return prev;
      const deltaX = clientX - prev.startX;
      const deltaY = clientY - prev.startY;
      const now = Date.now();
      const timeDelta = now - lastUpdateTime.current;
      const velocityX = timeDelta > 0 ? (deltaX - prev.deltaX) / timeDelta : 0;
      const velocityY = timeDelta > 0 ? (deltaY - prev.deltaY) / timeDelta : 0;
      lastUpdateTime.current = now;
      return { ...prev, deltaX, deltaY, velocityX, velocityY };
    });

    // Clear long press timer on move
    if (longPressTimerRef.current) {
      clearTimeout(longPressTimerRef.current);
      longPressTimerRef.current = null;
    }
  }, []);

  const handleGestureEnd = useCallback(() => {
    setGesture((prev) => {
      if (!prev.isDragging) return prev;

      const { deltaX, deltaY } = prev; // Removed unused velocity variables
      if (Math.abs(deltaX) > Math.abs(deltaY)) {
        if (deltaX > threshold) {
          handlers.onSwipeRight?.(prev);
        } else if (deltaX < -threshold) {
          handlers.onSwipeLeft?.(prev);
        }
      } else {
        if (deltaY > threshold) {
          handlers.onSwipeDown?.(prev);
        } else if (deltaY < -threshold) {
          handlers.onSwipeUp?.(prev);
        }
      }

      // Handle multi-tap
      const now = Date.now();
      if (now - prev.lastTap < 300) {
        if (prev.touchCount === 1) {
          handlers.onDoubleTap?.(prev);
        } else if (handlers.onMultiTap) {
          handlers.onMultiTap(prev.touchCount); // Fixed type safety
        }
      }

      return {
        ...prev,
        isDragging: false,
        deltaX: 0,
        deltaY: 0,
        velocityX: 0,
        velocityY: 0,
        lastTap: now,
      };
    });

    // Clear long press timer
    if (longPressTimerRef.current) {
      clearTimeout(longPressTimerRef.current);
      longPressTimerRef.current = null;
    }
  }, [handlers, threshold]);

  const handleTouchStart = useCallback(
    (e: React.TouchEvent) => {
      const touches = Array.from(e.touches);
      touchesRef.current = touches.map((t) => ({
        identifier: t.identifier,
        clientX: t.clientX,
        clientY: t.clientY,
      }));

      if (touches.length === 1) {
        handleGestureStart(touches[0].clientX, touches[0].clientY, 1);
      } else if (touches.length === 2) {
        // Initialize pinch and rotation
        const [touch1, touch2] = touches;
        const initialDistance = Math.hypot(
          touch1.clientX - touch2.clientX,
          touch1.clientY - touch2.clientY
        );
        const initialAngle = Math.atan2(
          touch2.clientY - touch1.clientY,
          touch2.clientX - touch1.clientX
        );
        setGesture((prev) => ({
          ...prev,
          scale: 1,
          rotation: 0,
          initialDistance,
          initialAngle,
        }));
      }
    },
    [handleGestureStart]
  );

  const handleTouchMove = useCallback(
    (e: React.TouchEvent) => {
      const touches = Array.from(e.touches);
      if (touches.length === 1) {
        handleGestureMove(touches[0].clientX, touches[0].clientY);
      } else if (touches.length === 2) {
        // Handle pinch and rotation
        const [touch1, touch2] = touches;
        const currentDistance = Math.hypot(
          touch1.clientX - touch2.clientX,
          touch1.clientY - touch2.clientY
        );
        const currentAngle = Math.atan2(
          touch2.clientY - touch1.clientY,
          touch2.clientX - touch1.clientX
        );
        setGesture((prev) => {
          const newScale = currentDistance / (prev.initialDistance || 1); // Added fallback value
          const newRotation =
            (currentAngle - (prev.initialAngle || 0)) * (180 / Math.PI); // Added fallback value
          handlers.onPinch?.({ ...prev, scale: newScale });
          handlers.onRotate?.({ ...prev, rotation: newRotation });
          return { ...prev, scale: newScale, rotation: newRotation };
        });
      }
      touchesRef.current = touches.map((t) => ({
        identifier: t.identifier,
        clientX: t.clientX,
        clientY: t.clientY,
      }));
    },
    [handleGestureMove, handlers]
  );

  const registerCustomGesture = useCallback(
    (name: string, handler: GestureHandler) => {
      handlers[name] = handler;
    },
    [handlers]
  );

  return {
    handleGestureStart,
    handleGestureMove,
    handleGestureEnd,
    handleTouchStart,
    handleTouchMove,
    gesture,
    registerCustomGesture,
  };
}
