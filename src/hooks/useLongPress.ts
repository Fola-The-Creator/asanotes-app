import { useRef, useCallback } from "react";

const LONG_PRESS_MS = 500;

export function useLongPress(onLongPress: () => void, onClick: () => void) {
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const didLongPress = useRef(false);

  const start = useCallback(() => {
    didLongPress.current = false;
    timerRef.current = setTimeout(() => {
      didLongPress.current = true;
      onLongPress();
    }, LONG_PRESS_MS);
  }, [onLongPress]);

  const cancel = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const handleClick = useCallback(() => {
    if (!didLongPress.current) onClick();
    didLongPress.current = false;
  }, [onClick]);

  return {
    onPointerDown: start,
    onPointerUp: cancel,
    onPointerLeave: cancel,
    onPointerCancel: cancel,
    onClick: handleClick,
  };
}
