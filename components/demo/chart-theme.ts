/*
 * The chart library needs literal colours, so the tokens it uses are mirrored
 * here from app/globals.css. Keep the two in step.
 */

export const CHART = {
  ink: "#16181a",
  inkMuted: "#565d65",
  inkFaint: "#8b9198",
  rule: "#e4e1db",
  ruleSoft: "#efece7",
  surface: "#ffffff",
  accent: "#2f5d62",
  accentSoft: "#a8c3c1",
  mark: "#c3c8cc",
  warn: "#9a6a3c",
} as const;

/** Ends of the heatmap ramp: accent-wash through to accent. */
export const HEAT_LOW = [231, 239, 238] as const;
export const HEAT_HIGH = [47, 93, 98] as const;

export function heatColor(fraction: number): string {
  const clamped = Math.min(1, Math.max(0, fraction));
  const eased = clamped ** 0.8;
  const channels = HEAT_LOW.map((low, index) =>
    Math.round(low + (HEAT_HIGH[index] - low) * eased),
  );
  return `rgb(${channels[0]} ${channels[1]} ${channels[2]})`;
}
