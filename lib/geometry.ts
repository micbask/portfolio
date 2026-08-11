export type Point = [number, number];

export function linePath(points: readonly Point[]): string {
  return points
    .map(([x, y], index) => `${index === 0 ? "M" : "L"}${x.toFixed(2)},${y.toFixed(2)}`)
    .join(" ");
}

/** Evenly spaced x positions across a plot band. */
export function spread(count: number, from: number, to: number): number[] {
  if (count === 1) return [(from + to) / 2];
  const step = (to - from) / (count - 1);
  return Array.from({ length: count }, (_, index) => from + index * step);
}

export function linearScale(
  domain: readonly [number, number],
  range: readonly [number, number],
) {
  const [d0, d1] = domain;
  const [r0, r1] = range;
  return (value: number) => r0 + ((value - d0) / (d1 - d0)) * (r1 - r0);
}
