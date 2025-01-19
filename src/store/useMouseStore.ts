import { create } from "zustand";

type MouseState = {
  x: number;
  y: number;
  isTouching: boolean;
  trailPositions: { x: number; y: number }[];
  setPosition: (x: number, y: number) => void;
  setIsTouching: (isTouching: boolean) => void;
  updateTrail: (x: number, y: number) => void;
  resetTrail: () => void;
};

export const useMouseStore = create<MouseState>((set) => ({
  x: 0,
  y: 0,
  isTouching: false,
  trailPositions: [],
  setPosition: (x, y) =>
    set((state) => {
      const newTrail = [{ x, y }, ...state.trailPositions].slice(0, 20);
      return { x, y, trailPositions: newTrail };
    }),
  setIsTouching: (isTouching) => set({ isTouching }),
  updateTrail: (x, y) =>
    set((state) => ({
      trailPositions: [{ x, y }, ...state.trailPositions].slice(0, 20),
    })),
  resetTrail: () => set({ trailPositions: [] }),
}));

// Setup mouse event listeners
if (typeof window !== "undefined") {
  const store = useMouseStore.getState();

  const handleMouseMove = (e: MouseEvent) => {
    store.setPosition(e.clientX, e.clientY);
  };

  const handleTouchMove = (e: TouchEvent) => {
    const touch = e.touches[0];
    if (touch) {
      store.setPosition(touch.clientX, touch.clientY);
    }
  };

  window.addEventListener("mousemove", handleMouseMove);
  window.addEventListener("touchmove", handleTouchMove);

  window.addEventListener("mouseenter", () => {
    store.setIsTouching(false);
  });

  window.addEventListener("mouseleave", () => {
    store.resetTrail();
  });

  window.addEventListener("mousedown", () => {
    store.setIsTouching(true);
  });

  window.addEventListener("mouseup", () => {
    store.setIsTouching(false);
  });
}
