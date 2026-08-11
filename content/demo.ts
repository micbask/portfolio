/*
 * Every visitor-facing string on /demo. The generated bundle carries numbers
 * only; each label a visitor reads is declared here, so the page can be read
 * against the build spec without opening a component.
 */

import type { SiteFilterKey } from "@/lib/demo-types";

export const DEMO_BADGE = "Demo: synthetic data.";

export const SITE_FILTERS: readonly { value: SiteFilterKey; label: string }[] = [
  { value: "all", label: "Both sites" },
  { value: "riverside", label: "Riverside General" },
  { value: "hillcrest", label: "Hillcrest Specialty" },
];

export const KPI_LABELS = {
  todayVolume: "Today's volume",
  statWithinTarget: "STAT within target",
  medianStatTurnaround: "Median STAT turnaround",
  volumeTrend: "7-day volume trend",
} as const;

export const PANEL_TITLES = {
  dailyVolume: "Daily volume",
  withinTarget: "Within target by priority",
  heatmap: "Volume by hour and day",
  topTests: "Top tests",
} as const;

export const VOLUME_SERIES = {
  daily: "Daily volume",
  movingAverage: "7-day average",
} as const;

export const PRIORITY_SERIES = {
  stat: "STAT",
  routine: "Routine",
} as const;

export const TABLE_HEADERS = {
  test: "Test",
  volume: "Volume",
  medianTurnaround: "Median turnaround",
  trend: "Trend",
} as const;

/** Row order of the table. The generator writes rows as indexes into this list. */
export const TEST_NAMES = [
  "Complete blood count",
  "Basic metabolic panel",
  "Comprehensive metabolic panel",
  "Urinalysis",
  "Lipid panel",
  "Thyroid screen",
  "Coagulation screen",
  "Blood glucose",
  "Liver panel",
  "Electrolytes",
] as const;

export const UNIT_MINUTES = "min";
export const UNIT_PERCENT = "%";

/** Heatmap row labels, matching the row order of the generated matrix. */
export const DAY_LABELS = [
  "Mon",
  "Tue",
  "Wed",
  "Thu",
  "Fri",
  "Sat",
  "Sun",
] as const;

/** Date axis ticks. */
export const MONTH_LABELS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
] as const;
