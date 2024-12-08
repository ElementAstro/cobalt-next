import { useEffect, RefObject } from "react";

type EventType = "mousedown" | "touchstart" | "click";

export function useClickOutside(
  refs: RefObject<HTMLElement> | RefObject<HTMLElement>[],
  handler: () => void,
  events: EventType[] = ["mousedown", "touchstart"]
) {
  useEffect(() => {
    const listener = (event: MouseEvent | TouchEvent) => {
      const refArray = Array.isArray(refs) ? refs : [refs];
      if (
        refArray.some(
          (ref) => ref.current && ref.current.contains(event.target as Node)
        )
      ) {
        return;
      }
      handler();
    };

    events.forEach((event) => document.addEventListener(event, listener));

    return () => {
      events.forEach((event) => document.removeEventListener(event, listener));
    };
  }, [refs, handler, events]);
}
