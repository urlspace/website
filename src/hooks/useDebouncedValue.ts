import { useEffect, useEffectEvent, useState } from "react";

function useDebouncedValue<T>(
	value: T,
	delay: number,
	onSettled?: (value: T) => void,
): T {
	const [debounced, setDebounced] = useState(value);
	// Calls the latest onSettled without restarting the timer when it changes.
	const settle = useEffectEvent((settled: T) => {
		onSettled?.(settled);
	});

	useEffect(() => {
		const t = setTimeout(() => {
			setDebounced(value);
			settle(value);
		}, delay);
		return () => clearTimeout(t);
	}, [value, delay]);

	return debounced;
}

export default useDebouncedValue;
