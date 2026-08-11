/** Axis helpers: round numbers on the axis, no library, no runtime surprises. */

const STEPS = [
  5, 10, 20, 25, 50, 100, 200, 250, 300, 400, 500, 1000, 2000, 2500, 5000,
];

/** Zero-based scale in five intervals, ending on a round number above `max`. */
export function volumeScale(max: number): { upper: number; ticks: number[] } {
  const step = STEPS.find((candidate) => candidate * 5 >= max) ?? STEPS[STEPS.length - 1];
  const upper = step * 5;
  return {
    upper,
    ticks: [0, 1, 2, 3, 4, 5].map((index) => index * step),
  };
}

/** Percentage scale that stops at 100 and starts just under the lowest point. */
export function percentScale(min: number): { lower: number; ticks: number[] } {
  const lower = Math.max(0, Math.floor((min - 1) / 5) * 5);
  const ticks: number[] = [];
  for (let value = lower; value <= 100; value += 5) ticks.push(value);
  return { lower, ticks };
}
