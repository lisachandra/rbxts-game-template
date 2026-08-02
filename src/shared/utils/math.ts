export function clamp(value: number, min: number, max: number): number {
	return math.max(min, math.min(max, value));
}
