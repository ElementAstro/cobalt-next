import { create } from "zustand";

interface RotatorState {
  isMoving: boolean;
  reverse: boolean;
  mechanicalPosition: number;
  targetPosition: number;
  speed: number;
  mechanicalRange: "full" | "limited";
  minPosition: number;
  maxPosition: number;
  setIsMoving: (isMoving: boolean) => void;
  setReverse: (reverse: boolean) => void;
  setMechanicalPosition: (position: number) => void;
  setTargetPosition: (position: number) => void;
  setSpeed: (speed: number) => void;
  setMechanicalRange: (range: "full" | "limited") => void;
  move: () => void;
  stop: () => void;
}

export const useRotatorStore = create<RotatorState>((set, get) => ({
  isMoving: false,
  reverse: false,
  mechanicalPosition: 0,
  targetPosition: 0,
  speed: 50,
  mechanicalRange: "full",
  minPosition: 0,
  maxPosition: 360,
  setIsMoving: (isMoving) => set({ isMoving }),
  setReverse: (reverse) => set({ reverse }),
  setMechanicalPosition: (position) => set({ mechanicalPosition: position }),
  setTargetPosition: (position) => set({ targetPosition: position }),
  setSpeed: (speed) => set({ speed }),
  setMechanicalRange: (range) => {
    if (range === "limited") {
      set({ mechanicalRange: range, minPosition: -180, maxPosition: 180 });
    } else {
      set({ mechanicalRange: range, minPosition: 0, maxPosition: 360 });
    }
  },
  move: () => {
    const {
      isMoving,
      mechanicalPosition,
      targetPosition,
      speed,
      reverse,
      minPosition,
      maxPosition,
    } = get();
    if (isMoving) return;

    set({ isMoving: true });
    const interval = setInterval(() => {
      const {
        mechanicalPosition,
        targetPosition,
        speed,
        reverse,
        minPosition,
        maxPosition,
      } = get();
      const direction = reverse ? -1 : 1;
      const step = (speed / 10) * direction;
      let newPosition = mechanicalPosition + step;

      // Implement wrapping behavior
      if (newPosition > maxPosition) {
        newPosition = minPosition + (newPosition - maxPosition);
      } else if (newPosition < minPosition) {
        newPosition = maxPosition - (minPosition - newPosition);
      }

      if (Math.abs(newPosition - targetPosition) <= Math.abs(step)) {
        clearInterval(interval);
        set({ isMoving: false, mechanicalPosition: targetPosition });
      } else {
        set({ mechanicalPosition: newPosition });
      }
    }, 100);
  },
  stop: () => {
    set({ isMoving: false });
  },
}));
