/*
 * Formatting is written out by hand rather than delegated to Intl, so the
 * server and the browser cannot disagree about a separator and break
 * hydration.
 */

import { MONTH_LABELS, UNIT_PERCENT } from "@/content/demo";

export { formatCount } from "@/lib/format";

export function formatPercent(value: number, signed = false): string {
  const sign = signed && value > 0 ? "+" : "";
  return `${sign}${value.toFixed(1)}${UNIT_PERCENT}`;
}

/** "2026-08-11" reads as "Aug 11". */
export function formatDate(isoDate: string): string {
  const month = Number(isoDate.slice(5, 7)) - 1;
  const day = Number(isoDate.slice(8, 10));
  return `${MONTH_LABELS[month]} ${day}`;
}
