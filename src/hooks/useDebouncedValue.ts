import { useEffect, useRef, useState } from "react";

function useDebouncedValue<T>(
  value: T,
  delay: number,
  onSettled?: (value: T) => void,
): T {
  const [debounced, setDebounced] = useState(value);
  const callbackRef = useRef(onSettled);

  useEffect(() => {
    callbackRef.current = onSettled;
  });

  useEffect(() => {
    const t = setTimeout(() => {
      setDebounced(value);
      callbackRef.current?.(value);
    }, delay);
    return () => clearTimeout(t);
  }, [value, delay]);

  return debounced;
}

export default useDebouncedValue;
